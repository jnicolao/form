import { NextRequest, NextResponse } from 'next/server';
import { cartSubtotal, orderReference, parseCartItems } from '@/lib/checkout';
import { getItemImageKeys } from '@/lib/item-images';
import {
  recentOrderTimesForPhone,
  saveOrderToDatabase,
} from '@/lib/order-persistence';
import { normalizeKePhone } from '@/lib/phone';
import {
  createCheckoutOrder,
  isPickspotConfigured,
  PickspotApiError,
} from '@/lib/pickspot-server';
import { claimLinkOf, toPublicOrder } from '@/lib/public-order';
import { getSiteUrl } from '@/lib/site-url';
import { isSupabaseConfigured } from '@/lib/supabase-server';
import type { PickspotCreateOrderRequest, PickspotOrder } from '@/lib/types';

// How often one phone number may be sent an order request. Each request is a
// WhatsApp message in the shop's name, so a stranger's number must not be
// flooded. Retrying the same order does not count (it is the same request).
// The wait is a little under the 30 seconds the page's Resend button counts
// down, so a customer who presses it the moment it unlocks is not refused.
const COOLDOWN_SECONDS = 25;
const MAX_REQUESTS_PER_HOUR = 5;

const fail = (status: number, code: string, error: string) =>
  NextResponse.json({ error, code }, { status });
const CLOSED =
  'Sorry, we cannot take orders right now. Please try again later.';
const NOT_PLACED =
  'Something went wrong and your order was not placed. Please try again.';

// What the shopper is told when PickSpot says no. PickSpot's own words go to
// the server log, never to the page.
function refusal(err: unknown, reference: string) {
  if (!(err instanceof PickspotApiError)) {
    console.error(`[create-order] ${reference} failed:`, err);
    return fail(500, 'INTERNAL_ERROR', NOT_PLACED);
  }
  console.error(
    `[create-order] ${reference} was not placed: ${err.status} ${err.message}`,
  );
  if (err.status === 400 || err.status === 404 || err.status === 422) {
    return fail(
      400,
      'ORDER_REJECTED',
      'We could not place your order. Check your WhatsApp number and try again.',
    );
  }
  if (err.status === 401 || err.status === 403)
    return fail(503, 'UNAVAILABLE', CLOSED);
  if (err.status === 429)
    return fail(
      429,
      'BUSY',
      'We are getting a lot of orders right now. Please try again in a moment.',
    );
  return fail(502, 'PICKSPOT_ERROR', NOT_PLACED);
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    items?: unknown;
    phone?: unknown;
    attemptId?: unknown;
  } | null;

  // Nothing is taken from the browser as it is: the cart is rebuilt from the
  // catalogue, the number is normalised, the order number is derived here.
  const items = parseCartItems(body?.items);
  if (!items)
    return fail(
      400,
      'INVALID_REQUEST',
      'Something is wrong with this order. Refresh the page and try again.',
    );
  const phone =
    typeof body?.phone === 'string' ? normalizeKePhone(body.phone) : null;
  if (!phone)
    return fail(
      400,
      'INVALID_PHONE',
      'Enter a valid Kenyan mobile number, like 0712 345 678.',
    );
  const reference = orderReference(body?.attemptId, phone, items);
  if (!reference)
    return fail(
      400,
      'INVALID_REQUEST',
      'Something is wrong with this order. Refresh the page and try again.',
    );

  if (!isPickspotConfigured() || !isSupabaseConfigured())
    return fail(503, 'NOT_CONFIGURED', CLOSED);

  try {
    const recent = await recentOrderTimesForPhone(phone, reference, 3600);
    const tooSoon =
      recent.length > 0 && Date.now() - recent[0] < COOLDOWN_SECONDS * 1000;
    if (tooSoon || recent.length >= MAX_REQUESTS_PER_HOUR) {
      return fail(
        429,
        'TOO_MANY_REQUESTS',
        'We just sent an order request to this number. Please wait a little before asking for another.',
      );
    }
  } catch (err) {
    // A database hiccup must not close the shop: the order goes ahead unchecked.
    console.error(
      '[create-order] the request limit could not be checked:',
      err,
    );
  }

  const siteUrl = getSiteUrl();
  const imageKeys = await getItemImageKeys(
    items.map((item) => item.image),
    siteUrl,
  );

  const request: PickspotCreateOrderRequest = {
    reference,
    // forceClaim: PickSpot sends the WhatsApp link even when the number already
    // has a PickSpot account, instead of answering 409 with whose account it
    // is. Anyone can type anyone's number, so the shop never asks for that.
    recipient: { phone, forceClaim: true },
    items: items.map((item) => {
      const imageKey = imageKeys.get(item.image);
      return {
        description: item.name,
        quantity: item.quantity,
        unitValue: item.priceKES,
        currency: 'KES' as const,
        sku: item.productId,
        parcelClass: item.parcelClass,
        ...(imageKey ? { imageKeys: [imageKey] } : {}),
      };
    }),
    declaredItemCostKes: cartSubtotal(items),
    metadata: {
      platform: 'CUSTOM',
      ...(siteUrl
        ? { storeUrl: siteUrl, orderUrl: `${siteUrl}/order/${reference}` }
        : {}),
    },
  };

  let order: PickspotOrder;
  try {
    ({ order } = await createCheckoutOrder(request));
  } catch (err) {
    return refusal(err, reference);
  }

  // The customer's order stands even if the shop's own record could not be
  // written; saveOrderToDatabase logs that itself.
  await saveOrderToDatabase({
    reference,
    checkoutMethod: 'pickspot',
    status: order.status,
    kind: order.kind,
    recipientPhone: phone,
    subtotalKes: cartSubtotal(items),
    deliveryFeeKes: order.pricing?.deliveryFee,
    serviceFeeKes: order.pricing?.platformFee,
    totalKes: order.pricing?.total,
    claimUrl: claimLinkOf(order),
    pickspotOrderId: order.orderId,
    pickspotParcelCode: order.parcelCode,
    pickspotResponse: order,
    pickspotUpdatedAt:
      order.updatedAt && !Number.isNaN(Date.parse(order.updatedAt))
        ? order.updatedAt
        : null,
    items,
  });

  return NextResponse.json({
    order: toPublicOrder(order),
    reference,
    claimUrl: claimLinkOf(order),
  });
}
