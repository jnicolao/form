import type { MetadataRoute } from 'next';
import { products } from '@/lib/products';
import { getSiteUrl } from '@/lib/site-url';

// The pages worth finding in a search: the shop, each product and the
// information pages. Cart, checkout and order pages are left out on purpose.
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl() ?? 'http://localhost:3000';
  const pages = [
    '',
    '/shop',
    '/approach',
    '/routine',
    '/shipping',
    '/privacy',
    '/terms',
  ];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
    ...products.map((product) => ({ url: `${siteUrl}/shop/${product.slug}` })),
  ];
}
