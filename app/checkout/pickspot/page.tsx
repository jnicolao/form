import type { Metadata } from 'next';
import { PickspotCheckout } from '@/components/pickspot-checkout';
export const metadata: Metadata = {
  title: 'PickSpot Checkout | FORM.',
  description:
    'Enter your WhatsApp number and we\u2019ll send you an order request.',
  robots: { index: false, follow: false },
};
export default function PickspotCheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-4 pb-16 sm:px-6 lg:px-8">
      <PickspotCheckout />
    </div>
  );
}
