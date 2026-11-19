'use client';

import { useState, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { toast } from 'sonner';

export function ProductQuantitySelector({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openDrawer } = useCart();
  const addedRef = useRef(false);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 rounded-lg border border-border p-1">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => {
          if (addedRef.current) return;
          addedRef.current = true;
          addItem(productId, quantity);
          toast.success(`${quantity} added to your bag`, {
            action: { label: 'View bag', onClick: openDrawer },
          });
          setTimeout(() => {
            addedRef.current = false;
          }, 500);
        }}
        className="flex-1 rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98] sm:flex-none"
      >
        Add to cart
      </button>
    </div>
  );
}
