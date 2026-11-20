'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Loader2,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatKES } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PickSpotLogo } from '@/components/brand-logos';
import { ResendOrderRequest } from '@/components/resend-order-request';
import { getPhoneError } from '@/lib/phone';
import type { PublicOrder } from '@/lib/public-order';
import { cn } from '@/lib/utils';

type Phase = 'input' | 'loading' | 'success' | 'error';

export function PickspotCheckout() {
  const { items, subtotal, clearCart } = useCart();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phase, setPhase] = useState<Phase>('input');
  const [apiError, setApiError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [orderRef, setOrderRef] = useState('');
  const [orderedItems, setOrderedItems] = useState<typeof items>([]);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const submittingRef = useRef(false);
  // One random id per visit to this page, sent with every try. The server
  // derives the order number from it, so a retry returns the same order
  // instead of placing a second one.
  const attemptIdRef = useRef('');
  const getAttemptId = () => {
    if (!attemptIdRef.current) {
      attemptIdRef.current = Array.from(
        crypto.getRandomValues(new Uint8Array(16)),
        (b) => b.toString(16).padStart(2, '0'),
      ).join('');
    }
    return attemptIdRef.current;
  };

  const validatePhone = (value: string): boolean => {
    const error = getPhoneError(value);
    setPhoneError(error);
    return !error;
  };

  const requestOrder = async (
    orderItems: typeof items,
    phone: string,
  ): Promise<{ ok: true } | { ok: false; error: string; code: string }> => {
    const response = await fetch('/api/pickspot/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        phone,
        attemptId: getAttemptId(),
      }),
    });
    const data = await response.json();
    if (!response.ok || !data.order || !data.reference)
      return {
        ok: false,
        error: data.error || 'Something went wrong. Please try again.',
        code: data.code || '',
      };
    setOrder(data.order);
    setOrderRef(data.reference);
    return { ok: true };
  };

  const handleSubmit = async () => {
    if (submittingRef.current) return;
    if (!validatePhone(phone)) return;
    submittingRef.current = true;
    setPhase('loading');
    setApiError('');
    setErrorCode('');
    try {
      const result = await requestOrder(items, phone);
      if (!result.ok) {
        setApiError(result.error);
        setErrorCode(result.code);
        setPhase('error');
        return;
      }
      setOrderedItems(items);
      clearCart();
      setPhase('success');
    } catch {
      setApiError('Network error. Check your connection and try again.');
      setPhase('error');
    } finally {
      submittingRef.current = false;
    }
  };

  const handleResend = async (targetPhone: string): Promise<string | null> => {
    // A resend is a new order request on purpose (that is what sends a new
    // WhatsApp message), so it gets its own attempt id.
    attemptIdRef.current = '';
    try {
      const result = await requestOrder(orderedItems, targetPhone);
      if (!result.ok) return result.error;
      setPhone(targetPhone);
      return null;
    } catch {
      return 'Network error. Check your connection and try again.';
    }
  };

  if (phase === 'success' && order)
    return (
      <PickspotSuccess
        order={order}
        reference={orderRef}
        items={orderedItems}
        phone={phone}
        onResend={handleResend}
      />
    );
  if (items.length === 0 && phase !== 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Your bag is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add products before proceeding to checkout.
        </p>
        <Link href="/shop" className="mt-8">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/checkout"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Choose another checkout method
      </Link>
      <p className="mt-6 flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Checkout with
        <PickSpotLogo className="h-4" />
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        Where should we send your order request?
      </h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        Enter your WhatsApp number. You review the order and pay in PickSpot.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {phase === 'error' ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{apiError}</p>
              {errorCode === 'NOT_CONFIGURED' && (
                <p className="mt-4 rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
                  The shop&apos;s checkout isn&apos;t fully set up yet. This is
                  a configuration issue, not a problem with your order.
                </p>
              )}
              <Button
                className="mt-6"
                onClick={() => {
                  setPhase('input');
                  setApiError('');
                }}
              >
                Try again
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
              <div>
                <Label htmlFor="phone" className="text-base font-semibold">
                  WhatsApp number
                </Label>
                <div className="mt-1.5 flex items-stretch overflow-hidden rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring">
                  <span className="flex items-center gap-1.5 border-r border-input bg-secondary px-3 text-sm font-medium text-muted-foreground">
                    <svg
                      viewBox="0 0 90 60"
                      aria-hidden="true"
                      className="h-4 w-6 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-foreground/15"
                    >
                      <rect width="90" height="60" fill="#fff" />
                      <rect width="90" height="18" fill="#000" />
                      <rect y="21" width="90" height="18" fill="#bb0000" />
                      <rect y="42" width="90" height="18" fill="#006600" />
                      <path
                        d="M32 10 L58 50 M58 10 L32 50"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M45 14c8 0 13 6 13 14 0 6-3 9-3 15 0 7-4 11-10 11s-10-4-10-11c0-6-3-9-3-15 0-8 5-14 13-14z"
                        fill="#000"
                      />
                      <rect x="37" y="26" width="16" height="4" fill="#fff" />
                      <rect
                        x="37"
                        y="31"
                        width="16"
                        height="4"
                        fill="#bb0000"
                      />
                    </svg>
                    +254
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="7XX XXX XXX"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) validatePhone(e.target.value);
                    }}
                    className="flex-1 bg-transparent px-3 py-3 text-base outline-hidden placeholder:text-muted-foreground/50"
                    disabled={phase === 'loading'}
                  />
                </div>
                {phoneError && (
                  <p className="mt-1.5 text-sm text-destructive">
                    {phoneError}
                  </p>
                )}
              </div>
              <Button
                size="lg"
                className="mt-6 h-12 w-full"
                disabled={phase === 'loading'}
                onClick={() => handleSubmit()}
              >
                {phase === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending your order request…
                  </>
                ) : (
                  'Send order request'
                )}
              </Button>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                No payment yet. You see the full total in PickSpot before you
                pay.
              </p>
            </div>
          )}
          <section className="mt-10">
            <WhatHappensNext />
          </section>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <button
              className="flex w-full items-center justify-between lg:cursor-default"
              onClick={() => setSummaryExpanded(!summaryExpanded)}
            >
              <h2 className="font-display text-base font-semibold">
                Your order
              </h2>
              <span className="flex items-center gap-2 lg:hidden">
                <span className="text-sm font-semibold">
                  {formatKES(subtotal)}
                </span>
                {summaryExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </span>
            </button>
            <div
              className={cn(
                'space-y-4 overflow-hidden transition-all',
                summaryExpanded
                  ? 'mt-4 max-h-none'
                  : 'max-h-0 lg:mt-4 lg:max-h-none',
              )}
            >
              <div className="max-h-64 space-y-4 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="self-center text-sm font-medium whitespace-nowrap">
                      {formatKES(item.priceKES * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Product subtotal
                  </span>
                  <span className="font-semibold">{formatKES(subtotal)}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Delivery fees are shown before payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// The same three steps before and after the request is sent. Tracking is
// done in the PickSpot app, so the steps say so and this site offers none.
function WhatHappensNext() {
  return (
    <>
      <h2 className="font-display text-base font-semibold">
        What happens next
      </h2>
      <ol className="mt-5 space-y-5">
        {[
          {
            title: 'Open the request on WhatsApp',
            desc: 'Tap the order request to open it in PickSpot.',
          },
          {
            title: 'Review and pay with M\u2011Pesa',
            desc: 'You see the full total, including delivery, before you pay.',
          },
          {
            title: 'Track it, then check it at the door',
            desc: 'Follow your delivery in PickSpot. Happy with your order? Share your secret code to confirm. Only then is FORM paid.',
          },
        ].map((step, i) => (
          <li key={step.title} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 flex items-start gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
        <span>
          Something wrong? Request a return before you share your secret code
          and your product payment is refunded. Delivery fees are not refunded
          when an order is declined at the door.
        </span>
      </p>
    </>
  );
}

function PickspotSuccess({
  order,
  reference,
  items,
  phone,
  onResend,
}: {
  order: PublicOrder;
  reference: string;
  items: ReturnType<typeof useCart>['items'];
  phone: string;
  onResend: (phone: string) => Promise<string | null>;
}) {
  return (
    <div className="pt-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground animate-scale-in">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-checkmark"
            style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
          />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        Check WhatsApp to finish your order
      </h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        We sent you an order request. Open it to review and pay in PickSpot.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <WhatHappensNext />
          </section>
          {order.kind === 'CLAIM' && (
            <ResendOrderRequest
              phone={phone}
              reference={reference}
              onResend={onResend}
            />
          )}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="mt-6 h-12 w-full sm:w-auto"
          >
            <Link href="/shop">Back to shop</Link>
          </Button>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-base font-semibold">Your order</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground">Order number</dt>
                <dd className="break-all font-display text-sm font-semibold">
                  {reference}
                </dd>
              </div>
              {order.parcelCode && (
                <div>
                  <dt className="text-sm text-muted-foreground">
                    PickSpot code
                  </dt>
                  <dd className="font-display text-sm font-semibold">
                    {order.parcelCode}
                  </dd>
                </div>
              )}
            </dl>
            {items.length > 0 && (
              <div className="mt-4 space-y-4 border-t border-border pt-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <p className="truncate text-sm font-medium leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="self-center whitespace-nowrap text-sm font-medium">
                      {formatKES(item.priceKES * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {order.pricing && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                {order.pricing.itemValue != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Product subtotal
                    </span>
                    <span className="font-semibold">
                      {formatKES(order.pricing.itemValue)}
                    </span>
                  </div>
                )}
                {order.pricing.deliveryFee != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery fee</span>
                    <span>{formatKES(order.pricing.deliveryFee)}</span>
                  </div>
                )}
                {order.pricing.platformFee != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>{formatKES(order.pricing.platformFee)}</span>
                  </div>
                )}
                {order.pricing.total != null && (
                  <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                    <span>Total</span>
                    <span className="font-display">
                      {formatKES(order.pricing.total)}
                    </span>
                  </div>
                )}
              </div>
            )}
            {order.pricing?.deliveryFee == null && (
              <p className="mt-2 text-sm text-muted-foreground">
                Delivery fees are shown before payment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
