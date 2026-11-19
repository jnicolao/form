'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatKES } from '@/lib/products';
import { Button } from '@/components/ui/button';

export function CartView() {
  const {
    items,
    subtotal,
    itemCount,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart();
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-display text-2xl font-bold">
          Your bag is empty
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add some essentials to get started.
        </p>
        <Link href="/shop" className="mt-8">
          <Button>
            Browse products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Your bag
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 p-5">
                <Link
                  href={`/shop/${item.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-display text-sm font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.subtitle} · {item.size}
                      </p>
                    </div>
                    <p className="font-display text-sm font-semibold">
                      {formatKES(item.priceKES * item.quantity)}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementItem(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementItem(item.productId)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-base font-semibold">
              Order summary
            </h2>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatKES(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-muted-foreground">Shown at checkout</span>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-display font-semibold">
                  {formatKES(subtotal)}
                </span>
              </div>
            </div>
            <Link href="/checkout" className="mt-6 block">
              <Button className="w-full" size="lg">
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
