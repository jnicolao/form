import type { PickspotOrder } from './types';

export interface WebhookEvent {
  deliveryId: string; // unique to this delivery; a repeat carries the same one
  event: string; // e.g. "order.paid"
  reference: string | null; // the shop's own order number
  eventAt: string; // PickSpot's time for the order, used to tell new from old
  order: PickspotOrder; // the whole order as PickSpot sees it now
}

const text = (value: unknown) =>
  typeof value === 'string' && value !== '' ? value : undefined;
const time = (value: unknown) => {
  const iso = text(value);
  return iso && !Number.isNaN(Date.parse(iso)) ? iso : undefined;
};

// Reads PickSpot's envelope: { id, event, createdAt, data: <order> }. Null when
// the body is not one. Call it only after the signature has been verified.
export function parseWebhookEvent(
  rawBody: string,
  receivedAt: Date = new Date(),
): WebhookEvent | null {
  let envelope: unknown;
  try {
    envelope = JSON.parse(rawBody);
  } catch {
    return null;
  }
  if (typeof envelope !== 'object' || envelope === null) return null;
  const { id, event, createdAt, data } = envelope as Record<string, unknown>;
  if (typeof data !== 'object' || data === null) return null;
  const order = data as Record<string, unknown>;

  const deliveryId = text(id);
  const eventName = text(event);
  if (!deliveryId || !eventName || !text(order.status)) return null;

  return {
    deliveryId,
    event: eventName,
    reference: text(order.reference) ?? null,
    eventAt:
      time(order.updatedAt) ?? time(createdAt) ?? receivedAt.toISOString(),
    order: data as PickspotOrder,
  };
}
