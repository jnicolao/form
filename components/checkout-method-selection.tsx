'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  PackageCheck,
  RotateCcw,
  CreditCard,
  ArrowRight,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatKES } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { PickSpotLogo } from '@/components/brand-logos';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type Method = 'pickspot' | 'standard';

export function CheckoutMethodSelection() {
  const [selected, setSelected] = useState<Method>('pickspot');
  const [showComparison, setShowComparison] = useState(false);
  const { items, subtotal } = useCart();
  const router = useRouter();

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

  const handleContinue = () =>
    router.push(
      selected === 'pickspot' ? '/checkout/pickspot' : '/checkout/standard',
    );

  return (
    <div>
      <div className="mb-2">
        <Link
          href="/cart"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to cart
        </Link>
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Choose how to checkout
      </h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Choose how you&apos;d like to complete your order.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div
          onClick={() => setSelected('pickspot')}
          className={cn(
            'group relative cursor-pointer rounded-2xl border-2 p-7 transition-all duration-300',
            selected === 'pickspot'
              ? 'border-foreground bg-card shadow-md'
              : 'border-border bg-card hover:border-foreground/30',
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground">
                <ShieldCheck className="h-6 w-6 text-background" />
              </div>
              <div className="space-y-1">
                <PickSpotLogo />
                <p className="text-sm text-muted-foreground">
                  The easier way to checkout
                </p>
              </div>
            </div>
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                selected === 'pickspot'
                  ? 'border-foreground bg-foreground'
                  : 'border-border',
              )}
            >
              {selected === 'pickspot' && (
                <Check className="h-3.5 w-3.5 text-background" />
              )}
            </div>
          </div>
          <h2 className="mt-6 font-display text-xl font-bold">
            Checkout with PickSpot
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pay securely. Get delivery updates. Shop with confidence.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              {
                icon: BadgeCheck,
                text: 'Your seller only gets paid after you confirm with your secret code.',
              },
              { icon: Truck, text: 'Track your order' },
              { icon: PackageCheck, text: 'Check it before you accept it.' },
              { icon: RotateCcw, text: 'Returns available on every order' },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0 text-foreground" />
                <span className="text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
          {selected === 'pickspot' && (
            <div className="mt-6 animate-fade-up">
              <Button
                size="lg"
                className="group/btn w-full gap-2"
                onClick={handleContinue}
                aria-label="Continue with PickSpot"
              >
                <span>Continue with</span>
                <PickSpotLogo dark className="h-[18px]" />
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Button>
            </div>
          )}
        </div>
        <div
          onClick={() => setSelected('standard')}
          className={cn(
            'group relative cursor-pointer rounded-2xl border-2 p-7 transition-all duration-300',
            selected === 'standard'
              ? 'border-foreground bg-card shadow-md'
              : 'border-border bg-card hover:border-foreground/30',
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary border border-border">
                <CreditCard className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="font-display text-lg font-bold">Standard</p>
                <p className="text-sm text-muted-foreground">
                  Checkout on this website
                </p>
              </div>
            </div>
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                selected === 'standard'
                  ? 'border-foreground bg-foreground'
                  : 'border-border',
              )}
            >
              {selected === 'standard' && (
                <Check className="h-3.5 w-3.5 text-background" />
              )}
            </div>
          </div>
          <h2 className="mt-6 font-display text-xl font-bold">
            Standard checkout
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your details and pay here.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Enter your delivery address',
              'Choose delivery',
              'Pay with M-Pesa or card',
            ].map((text) => (
              <li key={text} className="flex items-center gap-3">
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
          {selected === 'standard' && (
            <div className="mt-6 animate-fade-up">
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleContinue}
              >
                Continue to checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between rounded-xl border border-border bg-card px-6 py-4">
        <div>
          <p className="text-xs text-muted-foreground">Cart subtotal</p>
          <p className="font-display text-lg font-semibold">
            {formatKES(subtotal)}
          </p>
        </div>
        <button
          onClick={() => setShowComparison(true)}
          className="text-sm text-muted-foreground underline transition-colors hover:text-foreground"
        >
          Compare checkout methods
        </button>
      </div>
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              Checkout methods compared
            </DialogTitle>
            <DialogDescription>
              See exactly what each option asks of you.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-display text-sm font-bold">
                  Standard checkout
                </h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {[
                  'Contact information (email, phone)',
                  'Full delivery address',
                  'Delivery instructions',
                  'Payment details',
                  'Order confirmation',
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border-2 border-foreground p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-foreground" />
                <h3 className="font-display text-sm font-bold">
                  PickSpot checkout
                </h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  'Enter your WhatsApp number',
                  'Receive an order request on WhatsApp',
                  'Review and pay through PickSpot',
                  'Track delivery in PickSpot',
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                No address to type. No payment details to enter on the store.
                PickSpot handles it.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
