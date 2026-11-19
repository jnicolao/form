// The shop's public address, without a trailing slash: SITE_URL when set,
// otherwise the production address Vercel gives the project. Null when neither
// is a usable http(s) address. It is never taken from the incoming request,
// whose Host header a caller controls.
export function getSiteUrl(): string | null {
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL; // a bare domain, no https://
  const raw =
    process.env.SITE_URL || (vercelDomain ? `https://${vercelDomain}` : '');
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.origin
      : null;
  } catch {
    return null;
  }
}
