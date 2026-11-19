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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PickspotCheckout />
    </div>
  );
}
