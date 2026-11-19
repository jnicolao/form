'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { FormLogo } from '@/components/brand-logos';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/approach', label: 'Our Approach' },
  { href: '/routine', label: 'The Routine' },
];

export function SiteHeader() {
  const { itemCount, openDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // The page the mobile menu was opened on. Navigating away closes it.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const mobileOpen = menuOpenOn === pathname;
  const setMobileOpen = (open: boolean) =>
    setMenuOpenOn(open ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled
          ? 'border-border bg-background/95 backdrop-blur-md'
          : 'border-transparent bg-background',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="FORM. home">
            <FormLogo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openDrawer}
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
            aria-label={`Shopping bag with ${itemCount} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-semibold text-background animate-scale-in">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block py-3 text-base font-medium transition-colors hover:text-foreground',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
