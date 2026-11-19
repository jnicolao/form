import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Terms & Conditions | FORM.',
  description: 'Terms and conditions for FORM. Men\u2019s Essentials.',
};
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Terms & Conditions
      </h1>
      <div className="mt-10 space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Orders
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              When you place an order, you make an offer to purchase. We accept
              your offer when we dispatch your order. Until then, we may decline
              or cancel an order at our discretion.
            </p>
            <p>
              All prices are in Kenyan Shillings (KES) and include applicable
              taxes.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            PickSpot checkout
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              Orders placed through PickSpot checkout are processed by PickSpot
              under its own terms. PickSpot handles payment, delivery
              arrangement and buyer protection. We are responsible for the
              products we ship.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Returns and refunds
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              You can request a return on any order at the door, before sharing
              your secret code, and get your product payment refunded. Delivery
              fees are non-refundable when an order is declined at the door. See
              our Shipping &amp; Returns page for details.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Product information
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              Product descriptions and ingredient lists are illustrative for
              this demonstration store and do not represent clinically tested
              formulations.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Contact
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              For questions about these terms, contact us at hello@form.example.
            </p>
          </div>
        </section>
        <p className="border-t border-border pt-6 text-xs text-muted-foreground/70">
          This is a demonstration store. These terms are provided for
          illustration only.
        </p>
      </div>
    </div>
  );
}
