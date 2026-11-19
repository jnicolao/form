import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import { CartProvider } from '@/lib/cart-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CartDrawer } from '@/components/cart-drawer';
import { Toaster } from '@/components/ui/sonner';
import { getSiteUrl } from '@/lib/site-url';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const siteUrl = getSiteUrl();

// A 1200x630 JPEG: the size and format every link preview (WhatsApp included) accepts.
const previewImage = {
  url: '/assets/images/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'FORM. men\u2019s skincare essentials',
};

export const metadata: Metadata = {
  // Social preview images need the site's real address; without one Next.js falls back to localhost.
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: 'FORM. \u2014 Men\u2019s Essentials | Better skin. Less effort.',
  description:
    'Skincare that works hard, so you don\u2019t have to. Straightforward essentials for your everyday routine. Premium men\u2019s grooming from Nairobi, Kenya.',
  applicationName: 'FORM.',
  // Each page names its own address as the one to index.
  alternates: { canonical: './' },
  openGraph: {
    title: 'FORM. \u2014 Men\u2019s Essentials',
    description:
      'Better skin. Less effort. Premium men\u2019s skincare and grooming essentials.',
    type: 'website',
    siteName: 'FORM.',
    locale: 'en_KE',
    images: [previewImage],
  },
  twitter: {
    card: 'summary_large_image',
    images: [previewImage],
  },
};

// The colour phones give the browser bar: the page's own background.
export const viewport: Viewport = {
  themeColor: '#f9f8f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <CartDrawer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#171717',
                color: '#fff',
                borderRadius: '12px',
                border: 'none',
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
