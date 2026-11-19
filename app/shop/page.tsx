import type { Metadata } from 'next';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';

export const metadata: Metadata = {
  title: 'Shop — All Products | FORM.',
  description: 'Browse the full FORM. men\u2019s skincare collection.',
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          All products
        </h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Five essentials. Nothing unnecessary. Designed for straightforward
          daily skincare.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
