import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Shipping & Returns | FORM.',
  description: 'Shipping and returns policy for FORM. Men\u2019s Essentials.',
};
export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Shipping & Returns
      </h1>
      <div className="mt-10 space-y-10 text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Shipping
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed">
            <p>
              We deliver across Kenya. Orders within Nairobi are delivered
              within 2–3 business days. Orders outside Nairobi may take 3–5
              business days.
            </p>
            <p>
              Delivery fees are calculated at checkout based on your location.
              For PickSpot checkout orders, delivery is arranged through
              PickSpot and the fee is shown in your order request before you
              pay.
            </p>
            <p>
              Orders are dispatched Monday to Friday. Orders placed on weekends
              or public holidays are dispatched the next business day.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Returns
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed">
            <p>
              Check your order at the door before sharing your secret code with
              the rider. Happy with it? Confirm delivery and the seller gets
              paid.
            </p>
            <p>
              Something wrong? Request a return at the door before sharing your
              secret code, and your product payment will be refunded. Returns
              are available on every order.
            </p>
            <p>
              Delivery fees are non-refundable when an order is declined at the
              door.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            PickSpot orders
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed">
            <p>
              Orders placed through PickSpot checkout are subject to
              PickSpot&apos;s delivery and buyer protection terms. You can track
              your order from the order status page or within PickSpot.
            </p>
            <p>
              If you have an issue with a PickSpot order, contact us first and
              we&apos;ll coordinate with PickSpot support.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
