import { NextRequest, NextResponse } from 'next/server';
import { applyPickspotOrder } from '@/lib/order-persistence';
import { verifySignature } from '@/lib/signature';
import { parseWebhookEvent } from '@/lib/webhook';

// PickSpot's order updates. What PickSpot does with each answer:
//   401  not signed by PickSpot (or no secret configured here): not retried
//   400  signed, but not an update: not retried
//   200  handled: applied, a repeat, older than what is saved, or an unknown order
//   500  could not be saved: PickSpot retries
export async function POST(req: NextRequest) {
  // The signature covers the body exactly as it arrived, so read it as text.
  const rawBody = await req.text();
  const check = verifySignature(
    rawBody,
    req.headers.get('x-pickspot-signature'),
    process.env.PICKSPOT_WEBHOOK_SECRET,
  );
  if (!check.valid) {
    console.warn(`[pickspot webhook] rejected: ${check.reason}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = parseWebhookEvent(rawBody);
  if (!event) {
    return NextResponse.json(
      { error: 'Not a PickSpot event' },
      { status: 400 },
    );
  }

  try {
    const outcome = await applyPickspotOrder(event.order, event.eventAt, {
      id: event.deliveryId,
      event: event.event,
    });
    return NextResponse.json({ received: true, outcome });
  } catch (err) {
    console.error(
      `[pickspot webhook] ${event.event} ${event.deliveryId} was not saved:`,
      err,
    );
    return NextResponse.json(
      { error: 'Could not save the update' },
      { status: 500 },
    );
  }
}
