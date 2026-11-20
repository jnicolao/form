import type { Metadata } from 'next';
import { CheckoutMethodSelection } from '@/components/checkout-method-selection';
export const metadata: Metadata = {
  title: 'Checkout | FORM.',
  description: 'Choose your checkout method.',
  robots: { index: false, follow: false },
};
export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-4 pb-16 sm:px-6 lg:px-8">
      <CheckoutMethodSelection />
    </div>
  );
}
