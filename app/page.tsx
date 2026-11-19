import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/product-image';

const routineSteps = [
  {
    num: '01',
    title: 'Cleanse',
    description: 'Start fresh with a daily cleanser.',
    href: '/shop/daily-face-cleanser',
  },
  {
    num: '02',
    title: 'Treat',
    description: "Target your skin's needs with a focused serum.",
    href: '/shop/oil-control-serum',
  },
  {
    num: '03',
    title: 'Protect',
    description: 'Hydrate and protect your skin throughout the day.',
    href: '/shop/daily-spf-50-sunscreen',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl sm:leading-none lg:text-6xl">
              Look after yourself. No complicated routine.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-7">
              Skincare that works hard, so you don&rsquo;t have to.
              Straightforward essentials for your everyday routine.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop the essentials
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/routine">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  See the routine
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <ProductImage
                src="/assets/images/collection-hero.webp"
                alt="FORM. men's skincare collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            The essentials. Nothing unnecessary.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Five products. One simple routine.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand philosophy */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
            <ProductImage
              src="/assets/images/brightening-serum.webp"
              alt="FORM. product detail"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Good skin shouldn&rsquo;t be complicated.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-7">
              Effective ingredients. Straightforward routines. Everyday
              essentials designed to fit into your life.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="font-display text-sm font-semibold">Effective</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Science-led ingredients at meaningful concentrations.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="font-display text-sm font-semibold">Simple</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No overwhelming steps. Just what your skin needs.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="font-display text-sm font-semibold">Everyday</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Designed to fit into your morning and evening.
                </p>
              </div>
            </div>
            <Link href="/approach" className="mt-8 inline-block">
              <Button variant="outline">
                Read our approach
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Simple routine */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            A simple routine
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three steps. Morning and evening.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {routineSteps.map((step) => (
            <Link
              key={step.num}
              href={step.href}
              className="group rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-md"
            >
              <span className="font-display text-4xl font-bold text-muted-foreground/30">
                {step.num}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground transition-all group-hover:gap-2">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
