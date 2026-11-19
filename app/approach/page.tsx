import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/product-image';
import { ShieldCheck, FlaskConical, Leaf, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Approach - Our Philosophy | FORM.',
  description:
    'Everything we make is formulated for straightforward, effective daily skincare.',
};

export default function ApproachPage() {
  return (
    <div>
      <section className="overflow-hidden bg-secondary/30">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="mx-auto max-w-xl text-left lg:mx-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Our approach
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Essentials done right.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We believe skincare doesn&apos;t need to be complicated. It needs
              to work. Every product we make is formulated to a single standard:
              dermatologically effective, simple to use, and made for men who
              don&apos;t want a ten-step routine.
            </p>
          </div>
          <div className="relative mx-auto h-[26rem] w-full max-w-md sm:h-[34rem] sm:max-w-lg lg:h-[38rem] lg:max-w-none">
            <div
              aria-hidden
              className="absolute left-0 top-[10%] h-[66%] w-[70%] border border-foreground/30"
            />
            <div className="absolute left-[7%] top-0 z-10 h-[66%] w-[70%] overflow-hidden bg-secondary">
              <ProductImage
                src="/assets/images/post-shave-balm.webp"
                alt="Soothing post-shave balm"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-3 z-20 w-[44%] rotate-6 bg-background p-1.5 shadow-xl ring-1 ring-border sm:bottom-0 sm:right-0 sm:w-[48%]">
              <div className="relative aspect-4/5 overflow-hidden bg-secondary">
                <ProductImage
                  src="/assets/images/beard-oil.webp"
                  alt="Conditioning beard oil"
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute right-[10%] top-[4%] z-30 size-24 overflow-hidden rounded-full border-4 border-background bg-secondary shadow-lg sm:size-32">
              <ProductImage
                src="/assets/images/exfoliating-face-scrub.webp"
                alt="Exfoliating face scrub"
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <p className="absolute left-3 top-[58%] z-30 -rotate-3 bg-foreground px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-foreground sm:left-[1%]">
              8 products
            </p>
          </div>
        </div>
      </section>
      <section className="border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
            {[
              {
                icon: Leaf,
                title: 'Effective ingredients',
                desc: 'We use ingredients with clinical backing at meaningful concentrations. No token additions for marketing.',
              },
              {
                icon: ShieldCheck,
                title: 'Dermatologically tested',
                desc: 'Every formula is tested for safety and tolerability on men\u2019s skin.',
              },
              {
                icon: FlaskConical,
                title: 'Made in small batches',
                desc: 'We manufacture in small batches to ensure freshness and quality control.',
              },
              {
                icon: Clock,
                title: 'Built for daily use',
                desc: 'Straightforward routines that take less than five minutes, morning and night.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 border-b border-border pb-8 last:border-0 last:pb-0 md:block md:border-0 md:pb-0"
              >
                <item.icon className="h-6 w-6 shrink-0 text-foreground md:h-8 md:w-8" />
                <div>
                  <h3 className="font-display text-base font-semibold md:mt-4">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:mt-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative mx-auto h-[24rem] w-full max-w-md sm:h-[28rem] lg:order-1 lg:h-[32rem] lg:max-w-none">
            <div
              aria-hidden
              className="absolute right-2 top-[12%] h-[62%] w-[66%] border border-foreground/30 sm:right-0 sm:top-[8%] sm:h-[70%] sm:w-[72%]"
            />
            <div className="absolute right-[8%] top-0 z-10 h-[70%] w-[72%] overflow-hidden bg-secondary">
              <ProductImage
                src="/assets/images/hydrating-moisturizer.webp"
                alt="Daily hydrating moisturizer"
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-2 left-3 z-20 w-[44%] -rotate-6 bg-background p-1.5 shadow-xl ring-1 ring-border sm:bottom-0 sm:left-0 sm:w-[46%]">
              <div className="relative aspect-4/5 overflow-hidden bg-secondary">
                <ProductImage
                  src="/assets/images/spf50-sunscreen.webp"
                  alt="Daily SPF 50 sunscreen"
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            </div>
            <p className="absolute right-[12%] top-[48%] z-30 rotate-3 bg-foreground px-3 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-foreground sm:right-[2%] sm:top-[62%]">
              5 min
            </p>
          </div>
          <div className="order-first mx-auto max-w-xl lg:order-2 lg:mx-0">
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Why eight products?
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Most men&apos;s skincare ranges are built around volume -
                cleansers, toners, serums, moisturizers, eye creams, masks,
                treatments. We looked at what actually matters for daily skin
                health and arrived at eight products that cover the essentials:
                cleanse, shave, moisturize, protect, and treat.
              </p>
              <p>
                Each one is formulated to do its job well, with ingredients
                chosen for efficacy rather than novelty. We don&apos;t release a
                new product until we&apos;re confident it earns its place in the
                line.
              </p>
              <p>
                The product descriptions, ingredients and claims shown here are
                indicative and not a clinically tested formulation.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Ready to build your routine?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Eight products. Less than five minutes a day.
          </p>
          <Link href="/shop" className="mt-8 inline-block">
            <Button size="lg">Shop the collection</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
