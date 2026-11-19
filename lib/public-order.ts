import type { PickspotOrder, PickspotOrderStatus } from './types';

// The part of a PickSpot order that is safe to send to a browser. Built field
// by field so nothing else can slip through: no recipient (phone, PickSpot
// address, name), no claim or tracking links, no courier phone number.
export interface PublicOrder {
  orderId: string;
  kind: 'PARCEL' | 'CLAIM';
  reference: string | null;
  status: PickspotOrderStatus;
  parcelCode: string | null;
  claim: {
    whatsapp: 'pending' | 'sent' | 'failed' | null;
    expiresAt: string | null;
  } | null;
  pricing: {
    itemValue: number | null;
    deliveryFee: number | null;
    platformFee: number | null;
    total: number | null;
  } | null;
  dispatch: { scheduledFor: string | null; courierName: string | null } | null;
}

const text = (value: unknown) => (typeof value === 'string' ? value : null);
const amount = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

export function toPublicOrder(order: PickspotOrder): PublicOrder {
  const whatsapp = order.claim?.whatsapp;
  return {
    orderId: String(order.orderId),
    kind: order.kind === 'PARCEL' ? 'PARCEL' : 'CLAIM',
    reference: text(order.reference),
    status: (text(order.status) ?? 'UNKNOWN') as PickspotOrderStatus,
    parcelCode: text(order.parcelCode),
    claim: order.claim
      ? {
          whatsapp:
            whatsapp === 'pending' ||
            whatsapp === 'sent' ||
            whatsapp === 'failed'
              ? whatsapp
              : null,
          expiresAt: text(order.claim.expiresAt),
        }
      : null,
    pricing: order.pricing
      ? {
          itemValue: amount(order.pricing.itemValue),
          deliveryFee: amount(order.pricing.deliveryFee),
          platformFee: amount(order.pricing.platformFee),
          total: amount(order.pricing.total),
        }
      : null,
    dispatch: order.dispatch
      ? {
          scheduledFor: text(order.dispatch.scheduledFor),
          courierName: text(order.dispatch.courier?.name),
        }
      : null,
  };
}

// The customer's own link to the order in PickSpot. Given only in the answer
// to the request that placed the order, never by the order lookup.
export function claimLinkOf(order: PickspotOrder): string | null {
  const link = text(order.claim?.claimUrl) ?? text(order.claim?.branchUrl);
  return link && /^https:\/\//.test(link) ? link : null;
}
