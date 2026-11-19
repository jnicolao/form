import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Privacy Policy | FORM.',
  description: 'Privacy policy for FORM. Men\u2019s Essentials.',
};
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <div className="mt-10 space-y-8 text-muted-foreground">
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Information we collect
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              When you place an order, we collect your name, contact details and
              delivery address. If you use PickSpot checkout, your phone number
              is shared with PickSpot to process your order request.
            </p>
            <p>
              We do not store payment card details. Payments are processed by
              our payment provider or by PickSpot.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            How we use your information
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              We use your information to process and deliver your orders,
              communicate with you about your orders, and improve our products
              and services.
            </p>
            <p>We do not sell your personal information to third parties.</p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Data retention
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              Order records are retained for as long as needed to provide our
              services and comply with legal obligations.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Your rights
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>
              You can request access to, correction of, or deletion of your
              personal data by contacting us.
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold text-foreground">
            Contact
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed">
            <p>For privacy questions, contact us at hello@form.example.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
