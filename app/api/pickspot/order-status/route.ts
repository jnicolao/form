import { NextRequest, NextResponse } from 'next/server';
import { applyPickspotOrder } from '@/lib/order-persistence';
import {
  getOrder,
  isPickspotConfigured,
  PickspotApiError,
} from '@/lib/pickspot-server';
import { toPublicOrder } from '@/lib/public-order';

export const dynamic = 'force-dynamic';

// PickSpot's orderId, a parcel code, a claim id or the shop's order number.
const ID_FORMAT = /^[A-Za-z0-9._@:-]{1,100}$/;

const fail = (status: number, code: string, error: string) =>
  NextResponse.json(
    { error, code },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') ?? '';
  if (!ID_FORMAT.test(id))
    return fail(
      400,
      'INVALID_REQUEST',
      'That does not look like an order number.',
    );
  if (!isPickspotConfigured())
    return fail(
      503,
      'NOT_CONFIGURED',
      'Order tracking is not available right now.',
    );

  try {
    const order = await getOrder(id);

    // Keep the shop's own record in step with what PickSpot just said. The
    // page does not depend on it, so a failure here is logged and nothing more.
    const eventAt =
      order.updatedAt && !Number.isNaN(Date.parse(order.updatedAt))
        ? order.updatedAt
        : new Date().toISOString();
    await applyPickspotOrder(order, eventAt).catch((err) =>
      console.error('[order-status] the saved order was not updated:', err),
    );

    // Only what the order page shows: no phone number, name or private link.
    return NextResponse.json(
      { order: toPublicOrder(order) },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    if (err instanceof PickspotApiError && err.status === 404)
      return fail(404, 'NOT_FOUND', 'We could not find that order.');
    console.error(
      '[order-status] lookup failed:',
      err instanceof PickspotApiError ? `${err.status} ${err.message}` : err,
    );
    return fail(
      502,
      'PICKSPOT_ERROR',
      'We could not check your order right now. Please try again.',
    );
  }
}
