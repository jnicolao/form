import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, FlaskConical, Leaf, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Approach — Our Philosophy | FORM.',
  description:
    'Everything we make is formulated for straightforward, effective daily skincare.',
};

export default function ApproachPage() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Our approach
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Essentials done right.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            We believe skincare doesn&apos;t need to be complicated. It needs to
            work. Every product we make is formulated to a single standard:
            dermatologically effective, simple to use, and made for men who
            don&apos;t want a ten-step routine.
          </p>
        </div>
      </section>
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
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
              <div key={item.title}>
                <item.icon className="h-8 w-8 text-foreground" />
                <h3 className="mt-4 font-display text-base font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Why five products?
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Most men&apos;s skincare ranges are built around volume —
              cleansers, toners, serums, moisturizers, eye creams, masks,
              treatments. We looked at what actually matters for daily skin
              health and arrived at five products that cover the essentials:
              cleanse, shave, moisturize, protect, and treat.
            </p>
            <p>
              Each one is formulated to do its job well, with ingredients chosen
              for efficacy rather than novelty. We don&apos;t release a new
              product until we&apos;re confident it earns its place in the line.
            </p>
            <p>
              This is a demonstration store. The product descriptions,
              ingredients and claims shown here are illustrative and not a
              clinically tested formulation.
            </p>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Ready to build your routine?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Five products. Less than five minutes a day.
          </p>
          <Link href="/shop" className="mt-8 inline-block">
            <Button size="lg">Shop the collection</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
