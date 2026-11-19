'use client';

import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  label?: string;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  variant = 'default',
  size = 'default',
  label = 'Add to cart',
}: AddToCartButtonProps) {
  const { addItem, openDrawer } = useCart();
  return (
    <Button
      onClick={() => {
        addItem(productId, quantity);
        toast.success('Added to your bag', {
          action: { label: 'View bag', onClick: openDrawer },
        });
      }}
      variant={variant}
      size={size}
      className={cn(className)}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
