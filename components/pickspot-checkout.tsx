'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  PackageCheck,
  Loader2,
  ArrowLeft,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Smartphone,
  MapPin,
  Wallet,
  RotateCcw,
} from 'lucide-react';
import { useCart, storeOrder } from '@/lib/cart-context';
import { formatKES } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormLogo, PickSpotLogo } from '@/components/brand-logos';
import { ResendOrderRequest } from '@/components/resend-order-request';
import { getPhoneError } from '@/lib/phone';
import type { PublicOrder } from '@/lib/public-order';
import type { PickspotOrderStatus } from '@/lib/types';
import { ORDER_STATUS_LABELS } from '@/lib/types';
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
  const [showHowItWorks, setShowHowItWorks] = useState(false);
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
    storeOrder({
      orderId: data.order.orderId,
      reference: data.reference,
      kind: data.order.kind,
      status: data.order.status,
      items: orderItems,
      recipientPhone: phone,
      parcelCode: data.order.parcelCode,
      claimUrl: data.claimUrl ?? null,
    });
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
        <ArrowLeft className="mr-1 inline h-4 w-4" />
        Choose another checkout method
      </Link>
      <div className="mt-6 flex items-center justify-center gap-4 border-b border-border pb-6">
        <FormLogo className="text-xl" />
        <div className="h-px w-8 bg-border" />
        <PickSpotLogo />
      </div>
      <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
        Powered by PickSpot
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
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
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Checkout made simple.
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Enter your WhatsApp number to receive your order request.
              </p>
              <div className="mt-8">
                <Label htmlFor="phone" className="text-base font-semibold">
                  Your WhatsApp number
                </Label>
                <div className="mt-1.5 flex items-stretch overflow-hidden rounded-lg border border-input focus-within:ring-2 focus-within:ring-ring">
                  <span className="flex items-center gap-1.5 border-r border-input bg-secondary px-3 text-sm font-medium text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
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
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ll send your order here.
                </p>
              </div>
              <Button
                size="lg"
                className="mt-6 w-full"
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
              <div className="mt-8 border-t border-border pt-6">
                <p className="flex items-center gap-2 font-display text-base font-semibold">
                  <ShieldCheck className="h-5 w-5 text-foreground" />
                  Your purchase is protected with PickSpot
                </p>
                <ul className="mt-4 space-y-4">
                  {[
                    {
                      icon: Wallet,
                      title: 'You control when the seller gets paid',
                      desc: 'Your seller only gets paid after you confirm delivery with your secret code.',
                    },
                    {
                      icon: PackageCheck,
                      title: 'Check it before you accept it',
                      desc: 'Check your order at the door before sharing your secret code.',
                    },
                    {
                      icon: RotateCcw,
                      title: 'Returns available on every order',
                      desc: "If something's wrong, request a return before sharing your secret code and get your product payment refunded.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  Delivery fees are non-refundable when an order is declined at
                  the door.
                </p>
              </div>
            </div>
          )}
          <div className="mt-6 rounded-xl border border-border bg-secondary/20">
            <button
              type="button"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              aria-expanded={showHowItWorks}
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-secondary/30 rounded-xl"
            >
              <h3 className="font-display text-base font-semibold">
                How it works
              </h3>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground transition-transform duration-200',
                  showHowItWorks && 'rotate-180',
                )}
              />
            </button>
            {showHowItWorks && (
              <div className="space-y-5 px-6 pb-6 animate-fade-up">
                {[
                  {
                    title: 'Open your order',
                    desc: 'Tap the order request sent to WhatsApp.',
                  },
                  {
                    title: 'Review & pay',
                    desc: 'Review your order and pay securely in PickSpot.',
                  },
                  {
                    title: 'Check it before you accept it',
                    desc: 'Check your order at the door before sharing your secret code. Happy with it? Confirm delivery and the seller gets paid. Something wrong? Request a return and get your product payment refunded.',
                  },
                ].map((step, i) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold text-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
                <p className="border-t border-border pt-4 text-xs text-muted-foreground">
                  Delivery fees are non-refundable when an order is declined at
                  the door.
                </p>
              </div>
            )}
          </div>
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
              {summaryExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground lg:hidden" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground lg:hidden" />
              )}
            </button>
            <div
              className={cn(
                'mt-4 space-y-4 overflow-hidden transition-all',
                summaryExpanded ? 'max-h-none' : 'max-h-0 lg:max-h-none',
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
    <div className="mx-auto max-w-2xl py-8">
      <div className="flex justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-foreground animate-scale-in">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
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
      </div>
      <h1 className="mt-8 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
        Your order request has been sent!
      </h1>
      <p className="mt-4 text-center text-base font-medium text-foreground sm:text-lg">
        Open WhatsApp to review and pay for your order in PickSpot.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm text-muted-foreground">Order number</p>
            <p className="font-display text-base font-semibold">{reference}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Store</p>
            <p className="text-base font-semibold">
              FORM. Men&apos;s Essentials
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="mt-0.5 flex items-center gap-2 text-base font-medium">
              <span className="flex h-2 w-2 rounded-full bg-foreground animate-pulse" />
              {ORDER_STATUS_LABELS[order.status as PickspotOrderStatus] ||
                order.status}
            </p>
          </div>
          {order.parcelCode && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">PickSpot code</p>
              <p className="font-display text-base font-semibold">
                {order.parcelCode}
              </p>
            </div>
          )}
        </div>
        {order.kind === 'CLAIM' && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            Check WhatsApp for your request
          </div>
        )}
        {items.length > 0 && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-3">Your items</p>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <span className="flex-1 truncate">{item.name}</span>
                  <span className="text-muted-foreground">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {order.pricing && (
          <div className="mt-5 border-t border-border pt-4 space-y-2">
            {order.pricing.itemValue != null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span>{formatKES(order.pricing.itemValue)}</span>
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
      </div>
      {order.kind === 'CLAIM' && (
        <ResendOrderRequest
          phone={phone}
          reference={reference}
          onResend={onResend}
        />
      )}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href={`/order/${encodeURIComponent(reference)}`}
          className="block"
        >
          <Button variant="outline" className="w-full">
            Track your order
          </Button>
        </Link>
        <Link href="/shop" className="block">
          <Button variant="outline" className="w-full">
            Back to shop
          </Button>
        </Link>
      </div>
      <div className="mt-10 rounded-xl border border-border bg-secondary/20 p-6">
        <h3 className="font-display text-base font-semibold">Next steps</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: MessageCircle,
              title: '01 — Open your order',
              desc: 'Tap your order request on WhatsApp.',
            },
            {
              icon: Smartphone,
              title: '02 — Review & pay',
              desc: 'Check your order and pay securely.',
            },
            {
              icon: MapPin,
              title: '03 — Check it before you accept it',
              desc: 'Check your order at the door before sharing your secret code. Happy with it? Confirm delivery and the seller gets paid. Something wrong? Request a return and get your product payment refunded.',
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-lg border border-border bg-card p-4"
            >
              <step.icon className="h-5 w-5 text-foreground" />
              <p className="mt-3 text-sm font-semibold">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
