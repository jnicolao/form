import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

// Search engines may read every page; the routes under /api are for the shop's
// own pages only. Cart, checkout and order pages opt out of search results
// themselves, with a noindex tag.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
