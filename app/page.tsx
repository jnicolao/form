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
    description: 'Wash once. Start the day clean.',
    link: 'Daily cleanser',
    href: '/shop/daily-face-cleanser',
  },
  {
    num: '02',
    title: 'Treat',
    description: 'One serum, for the thing you want to change.',
    link: 'Oil control serum',
    href: '/shop/oil-control-serum',
  },
  {
    num: '03',
    title: 'Protect',
    description: 'Sunscreen. Every morning, without thinking.',
    link: 'SPF 50',
    href: '/shop/daily-spf-50-sunscreen',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full overflow-hidden bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="font-display text-4xl font-bold leading-[1.3] tracking-tight text-balance sm:text-5xl sm:leading-[1.2] lg:text-6xl">
              Look after yourself. <br /> No complicated routine.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-7">
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
            <div className="relative mx-auto h-[30rem] w-full max-w-md sm:h-[34rem] sm:max-w-lg lg:h-[38rem] lg:max-w-none">
              <div
                aria-hidden
                className="absolute right-0 top-[10%] h-[66%] w-[70%] border border-foreground/30"
              />
              <div className="absolute right-[7%] top-0 z-10 h-[66%] w-[70%] overflow-hidden bg-secondary">
                <ProductImage
                  src="/assets/images/collection-hero.webp"
                  alt="FORM. men's skincare collection"
                  fill
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  priority
                  className="object-cover object-[center_30%]"
                />
              </div>
              <div className="absolute bottom-0 left-0 z-20 w-[48%] -rotate-6 bg-background p-1.5 shadow-xl">
                <div className="relative aspect-4/5 overflow-hidden bg-secondary">
                  <ProductImage
                    src="/assets/images/oil-control-serum.webp"
                    alt="Oil control serum"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute left-[10%] top-[4%] z-30 size-24 overflow-hidden rounded-full border-4 border-background bg-secondary shadow-lg sm:size-32">
                <ProductImage
                  src="/assets/images/daily-face-cleanser.webp"
                  alt="Daily face cleanser"
                  fill
                  sizes="128px"
                  className="object-cover object-[center_60%]"
                />
              </div>
              <p className="absolute right-[1%] top-[60%] z-30 rotate-3 bg-foreground px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-foreground">
                3 steps
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            The essentials. Nothing unnecessary.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Eight products. One simple routine.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

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

      <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            A simple routine
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three steps. Morning and evening.
          </p>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3">
          {routineSteps.map((step) => (
            <li
              key={step.num}
              className="py-6 md:px-6 md:first:pl-0 md:last:pr-0"
            >
              <Link href={step.href} className="group flex h-full flex-col">
                <span className="font-display text-5xl font-bold leading-none tracking-tighter sm:text-6xl">
                  {step.num}
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  {step.link}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
