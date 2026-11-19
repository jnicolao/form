'use client';

import Link from 'next/link';
import type { Product } from '@/lib/products';
import { formatKES } from '@/lib/products';
import { ProductImage } from '@/components/product-image';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { cn } from '@/lib/utils';

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-md',
        className,
      )}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-secondary"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-display text-base font-semibold leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{product.subtitle}</p>
        <p className="mt-1 text-xs text-muted-foreground/80">{product.size}</p>
        <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-base font-semibold">
            {formatKES(product.priceKES)}
          </span>
          <AddToCartButton
            productId={product.id}
            size="sm"
            label="Add"
            className="h-9 w-full px-4 sm:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
