import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sun, Droplets, Moon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Routine | FORM.',
  description:
    'A simple three-step routine for daily skincare: morning, moisturize, evening.',
};

export default function RoutinePage() {
  const steps = [
    {
      icon: Sun,
      name: 'Step 01',
      title: 'Cleanse',
      time: 'Morning',
      desc: 'Start by washing away overnight oil and impurities. Use a gentle cleanser with warm water. Pat dry \u2014 don\u2019t rub.',
      product: 'Daily Face Cleanser',
      slug: 'daily-face-cleanser',
    },
    {
      icon: Droplets,
      name: 'Step 02',
      title: 'Moisturize',
      time: 'Morning & Night',
      desc: 'Apply a pea-sized amount of moisturizer to lock in hydration. Use upward strokes. Takes ten seconds.',
      product: 'Daily Hydrating Moisturizer',
      slug: 'daily-hydrating-moisturizer',
    },
    {
      icon: Moon,
      name: 'Step 03',
      title: 'Restore',
      time: 'Evening',
      desc: 'Before bed, apply a small amount of targeted serum to clean, dry skin. Let it absorb before sleeping.',
      product: 'Brightening Face Serum',
      slug: 'brightening-face-serum',
    },
  ];
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            The routine
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Three steps. Less than five minutes.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            You don&apos;t need a complicated routine. Cleanse, moisturize,
            restore. That&apos;s it. Here&apos;s how.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.title}
              className="grid grid-cols-1 gap-8 rounded-2xl border border-border bg-card p-8 md:grid-cols-3"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <step.icon className="h-8 w-8 text-foreground" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.time}</p>
                  </div>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold">
                  {step.title}
                </h2>
              </div>
              <div className="md:col-span-2">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
                <Link
                  href={`/shop/${step.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4"
                >
                  {step.product} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-bold">
            Consistency beats complexity.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Do this every day for two weeks. That&apos;s it.
          </p>
          <Link href="/shop" className="mt-6 inline-block">
            <Button>Get the essentials</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
