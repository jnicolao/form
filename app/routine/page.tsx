import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/product-image';

export const metadata: Metadata = {
  title: 'The Routine | FORM.',
  description: 'Cleanse, moisturize, restore. Five minutes, twice a day.',
};

const steps = [
  {
    num: '01',
    title: 'Cleanse',
    time: 'Morning',
    desc: 'Warm water. A gentle cleanser. Pat dry - don’t rub.',
    product: 'Daily Face Cleanser',
    slug: 'daily-face-cleanser',
    dark: true,
  },
  {
    num: '02',
    title: 'Moisturize',
    time: 'Morning & night',
    desc: 'A pea-sized amount. Upward strokes. Ten seconds.',
    product: 'Daily Hydrating Moisturizer',
    slug: 'daily-hydrating-moisturizer',
    dark: false,
  },
  {
    num: '03',
    title: 'Restore',
    time: 'Evening',
    desc: 'A few drops on dry skin, before bed. Then leave it.',
    product: 'Brightening Face Serum',
    slug: 'brightening-face-serum',
    dark: true,
  },
];

export default function RoutinePage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-16 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center lg:gap-x-16 lg:px-8 lg:pt-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground lg:col-start-1">
          The routine
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[1.2] tracking-tighter text-balance sm:text-7xl lg:col-start-1 lg:mt-6 lg:text-8xl">
          Five minutes. Twice a day.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground lg:col-start-1">
          Cleanse, moisturize, restore. That&apos;s the whole day.
        </p>
        <div className="relative mx-auto my-8 overflow-hidden rounded-2xl lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mx-0 lg:my-0 size-80">
          <ProductImage
            src="/assets/images/brightening-serum.webp"
            alt="Brightening face serum"
            fill
            sizes="320px"
            priority
            className="object-cover"
          />
        </div>
        <ul className="flex items-center gap-3 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#7a6248] sm:flex-row sm:gap-10 lg:col-start-1 lg:mb-12">
          <li>01 Cleanse</li>
          <li>02 Moisturize</li>
          <li>03 Restore</li>
        </ul>
      </section>

      {steps.map((step) => (
        <Link
          key={step.num}
          href={`/shop/${step.slug}`}
          className={
            step.dark
              ? 'block bg-foreground text-background'
              : 'block border-t border-foreground text-foreground'
          }
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 sm:px-6 md:grid-cols-12 md:items-end md:py-16 lg:px-8">
            <div className="md:col-span-5">
              <p
                className={
                  step.dark
                    ? 'text-[11px] font-semibold uppercase tracking-[0.22em] text-background/60'
                    : 'text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground'
                }
              >
                {step.time}
              </p>
              <span className="mt-2 block font-display text-8xl font-bold leading-[0.85] tracking-tighter sm:text-9xl">
                {step.num}
              </span>
            </div>
            <div className="md:col-span-6 md:col-start-7 md:pb-2">
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {step.title}
              </h2>
              <p
                className={
                  step.dark
                    ? 'mt-4 max-w-md text-base leading-relaxed text-background/70'
                    : 'mt-4 max-w-md text-base leading-relaxed text-muted-foreground'
                }
              >
                {step.desc}
              </p>
              <span className="mt-8 inline-block border-b border-current pb-0.5 text-[11px] font-semibold uppercase tracking-[0.2em]">
                {step.product}
              </span>
            </div>
          </div>
        </Link>
      ))}

      <section className="border-t border-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div>
            <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-tighter sm:text-6xl">
              Two weeks.
              <br />
              Every day.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Consistency beats complexity.
            </p>
          </div>
          <Link href="/shop">
            <Button size="lg">Get the essentials</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
