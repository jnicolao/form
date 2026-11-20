'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Loader2, Info, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import {
  formatKES,
  STANDARD_DELIVERY_FEE_KES as DELIVERY_FEE,
  STANDARD_PROCESSING_FEE_KES as PROCESSING_FEE,
} from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const checkoutSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  firstName: z.string().min(1, 'Required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Required'),
  county: z.string().min(1, 'Required'),
  constituency: z.string().min(1, 'Required'),
  streetAddress: z.string().min(1, 'Required'),
  building: z.string().optional(),
  landmark: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(['mpesa', 'card']),
});
type CheckoutForm = z.infer<typeof checkoutSchema>;

function StepHeading({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-base font-semibold">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground">
        {n}
      </span>
      {children}
    </h2>
  );
}

export function StandardCheckout() {
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [counties, setCounties] = useState<string[]>([]);
  const [countiesError, setCountiesError] = useState(false);
  const [countyAttempt, setCountyAttempt] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'mpesa', county: '' },
  });
  const paymentMethod = useWatch({ control, name: 'paymentMethod' });
  const total = subtotal + DELIVERY_FEE + PROCESSING_FEE;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/counties', { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error('counties');
        const data = (await res.json()) as { counties?: string[] };
        if (!data.counties?.length) throw new Error('counties');
        setCounties(data.counties);
        setCountiesError(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setCountiesError(true);
      });
    return () => controller.abort();
  }, [countyAttempt]);

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <ShieldCheck className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Order received</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This is a demo checkout. No payment has been processed and no order
          has been placed. To accept real payments, connect a payment provider
          such as Stripe or a Paystack/M-Pesa integration.
        </p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }
  if (items.length === 0) {
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

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    await fetch('/api/checkout/standard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }),
    }).catch(() => null);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    clearCart();
    setOrderComplete(true);
    toast.info('Demo order received. No payment was processed.');
  };

  return (
    <div>
      <Link
        href="/checkout"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Choose another checkout method
      </Link>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Standard checkout
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        Fill in your details
      </h1>
      <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Demo checkout - no payments will be processed.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2"
      >
        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-card p-6">
            <StepHeading n={1}>Contact details</StepHeading>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="mt-1.5"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="mt-1.5"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </section>
          <section className="rounded-xl border border-border bg-card p-6">
            <StepHeading n={2}>Delivery address</StepHeading>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  className="mt-1.5"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="middleName">Middle name</Label>
                <Input
                  id="middleName"
                  {...register('middleName')}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className="mt-1.5"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="county">County</Label>
                <div className="relative mt-1.5">
                  <select
                    id="county"
                    {...register('county')}
                    disabled={counties.length === 0}
                    className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      {counties.length === 0
                        ? countiesError
                          ? 'Counties unavailable'
                          : 'Loading counties…'
                        : 'Select a county'}
                    </option>
                    {counties.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {countiesError && (
                  <button
                    type="button"
                    onClick={() => setCountyAttempt((n) => n + 1)}
                    className="mt-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Couldn&apos;t load counties. Try again.
                  </button>
                )}
                {errors.county && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.county.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="constituency">Constituency</Label>
                <Input
                  id="constituency"
                  {...register('constituency')}
                  className="mt-1.5"
                  placeholder="e.g. Westlands"
                />
                {errors.constituency && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.constituency.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="streetAddress">Street address</Label>
                <Input
                  id="streetAddress"
                  {...register('streetAddress')}
                  className="mt-1.5"
                />
                {errors.streetAddress && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.streetAddress.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="building">Building, apartment or house</Label>
                <Input
                  id="building"
                  {...register('building')}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="landmark">Nearby landmark</Label>
                <Input
                  id="landmark"
                  {...register('landmark')}
                  className="mt-1.5"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="deliveryInstructions">
                  Anything the rider should know?
                </Label>
                <Textarea
                  id="deliveryInstructions"
                  {...register('deliveryInstructions')}
                  className="mt-1.5"
                  rows={2}
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
              <div>
                <p className="text-sm font-medium">Standard delivery</p>
                <p className="text-xs text-muted-foreground">
                  2–3 business days within Nairobi
                </p>
              </div>
              <p className="text-sm font-semibold">{formatKES(DELIVERY_FEE)}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Estimated delivery fee
            </p>
          </section>
          <section className="rounded-xl border border-border bg-card p-6">
            <StepHeading n={3}>Payment</StepHeading>
            <RadioGroup
              defaultValue="mpesa"
              className="mt-4 flex flex-row gap-3"
              {...register('paymentMethod')}
            >
              <label
                className={cn(
                  'flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                  paymentMethod === 'mpesa'
                    ? 'border-foreground bg-secondary/30'
                    : 'border-border',
                )}
              >
                <RadioGroupItem value="mpesa" />
                <div className="flex-1">
                  <p className="text-sm font-medium">M-Pesa</p>
                  <p className="text-xs text-muted-foreground">
                    Pay securely on your phone
                  </p>
                </div>
              </label>
              <label
                className={cn(
                  'flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                  paymentMethod === 'card'
                    ? 'border-foreground bg-secondary/30'
                    : 'border-border',
                )}
              >
                <RadioGroupItem value="card" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Debit or credit card</p>
                  <p className="text-xs text-muted-foreground">
                    Pay with debit or credit card
                  </p>
                </div>
              </label>
            </RadioGroup>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo only - payments are disabled.
            </p>
          </section>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-base font-semibold">Your order</h2>
            <div className="mt-4 space-y-4 max-h-64 overflow-y-auto">
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
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="text-sm font-medium leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="self-center text-sm font-medium">
                    {formatKES(item.priceKES * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatKES(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>{formatKES(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing fee</span>
                <span>{formatKES(PROCESSING_FEE)}</span>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span className="font-display">{formatKES(total)}</span>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="mt-6 h-12 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                'Complete checkout'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
