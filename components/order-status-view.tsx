'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Truck,
  PackageCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormLogo } from '@/components/brand-logos';
import type { PublicOrder } from '@/lib/public-order';
import type { PickspotOrderStatus } from '@/lib/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from '@/lib/types';
import { getStoredOrder } from '@/lib/cart-context';
import { formatKES } from '@/lib/products';
import { cn } from '@/lib/utils';

interface ApiResponse {
  order?: PublicOrder;
  error?: string;
  code?: string;
}

// Nothing changes after these, so the page stops asking.
const FINAL_STATUSES: PickspotOrderStatus[] = [
  'DELIVERED',
  'RETURNED',
  'CANCELLED',
  'REJECTED',
  'EXPIRED',
];
const POLL_MS = 15000;

export function OrderStatusView({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storedItems, setStoredItems] = useState<
    Array<{ name: string; quantity: number; image: string }>
  >([]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const fetchOrder = async () => {
      let finished = false;
      try {
        const res = await fetch(
          `/api/pickspot/order-status?id=${encodeURIComponent(orderId)}`,
        );
        const data: ApiResponse = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Could not retrieve order.');
          finished = res.status === 400 || res.status === 404;
        } else if (data.order) {
          setOrder(data.order);
          setStoredItems(getStoredOrder(orderId)?.items ?? []);
          setError('');
          finished = FINAL_STATUSES.includes(data.order.status);
        }
      } catch {
        if (!cancelled) setError('Network error. Please try again.');
      } finally {
        if (!cancelled) {
          setLoading(false);
          if (!finished) timer = setTimeout(fetchOrder, POLL_MS);
        }
      }
    };
    fetchOrder();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your order…
        </p>
      </div>
    );
  if (error && !order)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
        <h1 className="mt-6 font-display text-xl font-bold">
          Couldn&apos;t load your order
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <Link href="/shop" className="mt-8">
          <Button variant="outline">Back to shop</Button>
        </Link>
      </div>
    );
  if (!order) return null;

  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(
    order.status as PickspotOrderStatus,
  );
  const statusIcons: Partial<Record<PickspotOrderStatus, typeof Clock>> = {
    AWAITING_RECIPIENT: Clock,
    AWAITING_APPROVAL: Clock,
    AWAITING_PAYMENT: Clock,
    PAID: CheckCircle2,
    SCHEDULED: Clock,
    DISPATCHED: Truck,
    IN_TRANSIT: Truck,
    DELIVERED: PackageCheck,
  };
  const StatusIcon = statusIcons[order.status as PickspotOrderStatus] || Clock;

  return (
    <div>
      <Link
        href="/shop"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-1 inline h-4 w-4" />
        Back to shop
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <FormLogo className="text-lg" />
        <span className="text-muted-foreground">|</span>
        <span className="text-sm text-muted-foreground">Order tracking</span>
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        {ORDER_STATUS_LABELS[order.status as PickspotOrderStatus] ||
          order.status}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order reference:{' '}
        <span className="font-medium text-foreground">
          {order.reference || orderId}
        </span>
      </p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
            <StatusIcon className="h-6 w-6 text-background" />
          </div>
          <div>
            <p className="font-display text-base font-semibold">
              {ORDER_STATUS_LABELS[order.status as PickspotOrderStatus] ||
                order.status}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.kind === 'CLAIM'
                ? 'Waiting for you to claim the order request on WhatsApp'
                : 'Your order is being processed'}
            </p>
          </div>
        </div>
        {currentStepIndex >= 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {ORDER_STATUS_STEPS.slice(0, 8).map((status, i) => (
                <div key={status} className="flex flex-1 flex-col items-center">
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
                      i <= currentStepIndex
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-card text-muted-foreground',
                    )}
                  >
                    {i < currentStepIndex ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              {ORDER_STATUS_STEPS.slice(0, 8).map((s) => (
                <span key={s} className="flex-1 text-center">
                  {ORDER_STATUS_LABELS[s].split(' ').slice(0, 2).join(' ')}
                </span>
              ))}
            </div>
          </div>
        )}
        {order.kind === 'CLAIM' && order.claim && (
          <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
            <p className="text-sm font-medium">
              Order request sent on WhatsApp
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              WhatsApp status: {order.claim.whatsapp || 'pending'}
            </p>
            {order.claim.expiresAt && (
              <p className="mt-1 text-xs text-muted-foreground">
                Expires: {new Date(order.claim.expiresAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
        {order.dispatch &&
          (order.dispatch.courierName || order.dispatch.scheduledFor) && (
            <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
              {order.dispatch.courierName && (
                <p className="text-xs text-muted-foreground">
                  Courier: {order.dispatch.courierName}
                </p>
              )}
              {order.dispatch.scheduledFor && (
                <p className="text-xs text-muted-foreground">
                  Scheduled for:{' '}
                  {new Date(order.dispatch.scheduledFor).toLocaleString()}
                </p>
              )}
            </div>
          )}
        {order.pricing && (
          <div className="mt-4 border-t border-border pt-4 space-y-1.5">
            {order.pricing.itemValue != null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{formatKES(order.pricing.itemValue)}</span>
              </div>
            )}
            {order.pricing.deliveryFee != null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>{formatKES(order.pricing.deliveryFee)}</span>
              </div>
            )}
            {order.pricing.total != null && (
              <div className="flex justify-between text-base font-semibold border-t border-border pt-1.5">
                <span>Total</span>
                <span className="font-display">
                  {formatKES(order.pricing.total)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {storedItems.length > 0 && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-sm font-semibold">Items</h2>
          <div className="mt-3 space-y-2">
            {storedItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span>{item.name}</span>
                <span className="text-muted-foreground">×{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Status updates automatically. Last checked:{' '}
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
