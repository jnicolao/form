'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatKES } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const {
    items,
    subtotal,
    itemCount,
    isDrawerOpen,
    closeDrawer,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-60 bg-black/40 transition-opacity duration-300',
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeDrawer}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-70 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-base font-semibold">
              Your bag{itemCount > 0 && ` (${itemCount})`}
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              Your bag is empty.
            </p>
            <Link href="/shop" onClick={closeDrawer}>
              <Button variant="outline" className="mt-6">
                Browse products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-5">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeDrawer}
                      className="shrink-0"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-secondary">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={closeDrawer}
                            className="text-sm font-medium hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.subtitle} · {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="flex shrink-0 items-center gap-1 text-xs text-red-700 transition-colors hover:text-foreground"
                        >
                          <Trash2 className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrementItem(item.productId)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementItem(item.productId)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatKES(item.priceKES * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-base font-semibold">
                  {formatKES(subtotal)}
                </span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                Delivery fees shown at checkout.
              </p>
              <Link href="/checkout" onClick={closeDrawer} className="block">
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="mt-3 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View bag
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
