import type { Metadata } from 'next';
import { CartView } from '@/components/cart-view';
export const metadata: Metadata = {
  title: 'Your Cart | FORM.',
  description: 'Review your selected FORM. products before checkout.',
  robots: { index: false, follow: false },
};
export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <CartView />
    </div>
  );
}
