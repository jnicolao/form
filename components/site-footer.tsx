import Link from 'next/link';
import { FormLogo } from '@/components/brand-logos';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { href: '/shop', label: 'All products' },
      { href: '/shop/daily-face-cleanser', label: 'Daily Face Cleanser' },
      { href: '/shop/oil-control-serum', label: 'Oil Control Serum' },
      {
        href: '/shop/daily-hydrating-moisturizer',
        label: 'Daily Hydrating Moisturizer',
      },
      { href: '/shop/daily-spf-50-sunscreen', label: 'Daily SPF 50 Sunscreen' },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '/approach', label: 'Our Approach' },
      { href: '/routine', label: 'The Routine' },
    ],
  },
  {
    title: 'Help',
    links: [
      { href: '/shipping', label: 'Shipping & Returns' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms & Conditions' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <FormLogo className="text-2xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Better skin. Less effort. Premium men&apos;s skincare and grooming
              essentials from Nairobi, Kenya.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FORM. Men&apos;s Essentials.
          </p>
        </div>
      </div>
    </footer>
  );
}
