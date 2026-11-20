'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatKES } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { PickSpotLogo } from '@/components/brand-logos';
import { cn } from '@/lib/utils';

// What each checkout asks of the shopper, in order. Shown side by side, the two
// lists are the comparison. "M\u2011Pesa" uses a hyphen that a line cannot break at.
function Steps({ steps, dark }: { steps: string[]; dark?: boolean }) {
  return (
    <ol className="mb-8 mt-7 space-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex items-start gap-3 text-sm">
          <span
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
              dark
                ? 'border-background/25 text-background/70'
                : 'border-border text-muted-foreground',
            )}
          >
            {i + 1}
          </span>
          <span className="pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function CheckoutMethodSelection() {
  const { items, itemCount, subtotal } = useCart();

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

  return (
    <div>
      <Link
        href="/cart"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        &larr; Back to cart
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        How would you like to check out?
      </h1>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        <span className="font-medium text-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'},{' '}
          {formatKES(subtotal)}.
        </span>{' '}
        The delivery fee is shown before you pay.
      </p>

      {/* The button's link is stretched over its card, so one click anywhere
          on a card opens that checkout. */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="group relative flex flex-col rounded-2xl border border-foreground bg-foreground p-7 text-background transition-shadow duration-200 hover:shadow-xl sm:p-8">
          <div className="flex h-7 items-center justify-between gap-4">
            <PickSpotLogo dark className="h-6" />
            <span className="rounded-full bg-[#475663] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]">
              Recommended
            </span>
          </div>
          <h2 className="mt-8 font-display text-2xl font-bold tracking-tight">
            <span className="inline-block">Pay safely.</span>{' '}
            <span className="inline-block">Confirm on delivery.</span>
          </h2>
          <p className="mt-2 text-sm text-background/70 md:min-h-10">
            FORM is paid only after you check your order and confirm it with
            your code.
          </p>
          <Steps
            dark
            steps={[
              'Enter your WhatsApp number',
              'Review your order and pay with M\u2011Pesa in PickSpot',
              'Check it at the door, then confirm',
            ]}
          />
          <Button
            asChild
            size="lg"
            className="mt-auto h-12 w-full gap-2 bg-background px-4 text-foreground after:absolute after:inset-0 hover:bg-background/90 focus-visible:ring-background focus-visible:ring-offset-foreground"
          >
            <Link href="/checkout/pickspot">
              Continue with
              <PickSpotLogo className="h-[18px]" />
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </section>

        <section className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 transition-colors duration-200 hover:border-foreground/40 sm:p-8">
          <div className="flex h-7 items-center">
            <p className="font-display text-lg font-bold">Standard checkout</p>
          </div>
          <h2 className="mt-8 font-display text-2xl font-bold tracking-tight">
            <span className="inline-block">Fill in your details.</span>{' '}
            <span className="inline-block">Pay here.</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:min-h-10">
            Your address and payment, entered on this site.
          </p>
          <Steps
            steps={[
              'Enter your contact details',
              'Enter your delivery address',
              'Pay with M\u2011Pesa or card',
            ]}
          />
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-auto h-12 w-full gap-2 border-foreground px-4 bg-card after:absolute after:inset-0 hover:bg-foreground hover:text-background"
          >
            <Link href="/checkout/standard">
              Use standard checkout
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
