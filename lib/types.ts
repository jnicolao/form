export type { ParcelClass } from './products';
import type { ParcelClass } from './products';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  subtitle: string;
  size: string;
  priceKES: number;
  image: string;
  parcelClass: ParcelClass;
  quantity: number;
}

export interface PickspotOrderItem {
  description: string;
  quantity: number;
  unitValue: number;
  currency: 'KES';
  parcelClass: ParcelClass;
  sku?: string;
  imageKeys?: string[];
}

export interface PickspotCreateOrderRequest {
  reference: string;
  recipient: {
    handle?: string;
    phone?: string;
    forceClaim?: boolean;
  };
  items: PickspotOrderItem[];
  declaredItemCostKes?: number;
  autoDispatch?: boolean;
  approvalExpiryMinutes?: number;
  metadata?: {
    platform?: 'WOOCOMMERCE' | 'SHOPIFY' | 'CUSTOM';
    storeUrl?: string;
    orderUrl?: string;
  };
}

export type PickspotOrderStatus =
  | 'AWAITING_RECIPIENT'
  | 'AWAITING_APPROVAL'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_FAILED'
  | 'PAID'
  | 'SCHEDULED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'UNKNOWN';

export interface PickspotOrder {
  orderId: string;
  kind: 'PARCEL' | 'CLAIM';
  reference?: string | null;
  status: PickspotOrderStatus;
  rawStatus?: string;
  parcelCode?: string | null;
  claimId?: string | null;
  recipient?: {
    handle?: string | null;
    phone?: string | null;
    displayName?: string | null;
  };
  claim?: {
    claimUrl?: string;
    branchUrl?: string | null;
    expiresAt?: string | null;
    whatsapp?: 'pending' | 'sent' | 'failed';
  } | null;
  pricing?: {
    currency: string;
    itemValue?: number | null;
    deliveryFee?: number | null;
    platformFee?: number | null;
    total?: number | null;
  } | null;
  dispatch?: {
    scheduledFor?: string | null;
    scheduleReason?: string | null;
    status?: string | null;
    trackingUrl?: string | null;
    courier?: {
      name?: string | null;
      phone?: string | null;
    } | null;
  } | null;
  autoDispatch?: boolean;
  integration?: {
    platform?: string;
    storeUrl?: string | null;
    orderUrl?: string | null;
  } | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PickspotOrderResponse {
  order: PickspotOrder;
}

export const ORDER_STATUS_LABELS: Record<PickspotOrderStatus, string> = {
  AWAITING_RECIPIENT: 'Request sent',
  AWAITING_APPROVAL: 'Awaiting your approval',
  AWAITING_PAYMENT: 'Payment pending',
  PAYMENT_FAILED: 'Payment failed',
  PAID: 'Paid — rider being requested',
  SCHEDULED: 'Rider scheduled',
  DISPATCHED: 'Rider dispatched',
  IN_TRANSIT: 'On the way',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  UNKNOWN: 'Unknown',
};

export const ORDER_STATUS_STEPS: PickspotOrderStatus[] = [
  'AWAITING_RECIPIENT',
  'AWAITING_APPROVAL',
  'AWAITING_PAYMENT',
  'PAID',
  'SCHEDULED',
  'DISPATCHED',
  'IN_TRANSIT',
  'DELIVERED',
];

export interface StoredOrder {
  orderId: string;
  reference: string;
  kind: 'PARCEL' | 'CLAIM';
  status: PickspotOrderStatus;
  items: CartItem[];
  recipientPhone?: string;
  recipientHandle?: string;
  createdAt: string;
  parcelCode?: string | null;
  claimUrl?: string | null;
}
