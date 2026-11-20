import type { Metadata } from 'next';
import { StandardCheckout } from '@/components/standard-checkout';
export const metadata: Metadata = {
  title: 'Standard Checkout | FORM.',
  description: 'Enter your delivery details and pay online.',
  robots: { index: false, follow: false },
};
export default function StandardCheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
      <StandardCheckout />
    </div>
  );
}
