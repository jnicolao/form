import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import {
  products,
  getProductBySlug,
  getRelatedProducts,
  formatKES,
} from '@/lib/products';
import { ProductImage } from '@/components/product-image';
import { ProductCard } from '@/components/product-card';
import { ProductQuantitySelector } from '@/components/product-quantity-selector';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Since Next.js 15, route parameters arrive as a promise.
interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return { title: 'Product not found | FORM.' };
  return {
    title: `${product.name} — ${product.subtitle} | FORM.`,
    description: product.description,
    openGraph: {
      title: `${product.name} — FORM.`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();
  const related = getRelatedProducts(product.id, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary">
            <ProductImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {product.subtitle}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{product.size}</p>
            <p className="mt-6 font-display text-2xl font-semibold">
              {formatKES(product.priceKES)}
            </p>
          </div>
          <div className="mt-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
          <div className="mt-8">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide">
              Key benefits
            </h2>
            <ul className="mt-3 space-y-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <ProductQuantitySelector productId={product.id} />
          </div>
          <div className="mt-10 border-t border-border pt-8">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide">
              How to use
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.howToUse}
            </p>
          </div>
          <div className="mt-8 border-t border-border pt-8">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide">
              Ingredients
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {product.ingredients}
            </p>
            <p className="mt-3 text-xs text-muted-foreground/70">
              Illustrative ingredient list for demonstration. Not a clinically
              tested formulation.
            </p>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20 border-t border-border pt-16">
          <h2 className="mb-8 font-display text-2xl font-bold tracking-tight">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatKES(product.priceKES)}
            </p>
          </div>
          <ProductQuantitySelector productId={product.id} />
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
