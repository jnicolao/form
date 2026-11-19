import type { Metadata } from 'next';
import { OrderStatusView } from '@/components/order-status-view';
export const metadata: Metadata = {
  title: 'Order Status | FORM.',
  description: 'Track your PickSpot order in real time.',
  robots: { index: false, follow: false },
};
// Since Next.js 15, route parameters arrive as a promise.
interface PageProps {
  params: Promise<{ orderId: string }>;
}
export default async function OrderStatusPage({ params }: PageProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <OrderStatusView orderId={(await params).orderId} />
    </div>
  );
}
