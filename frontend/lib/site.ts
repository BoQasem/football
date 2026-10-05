/**
 * Public origin of the site. Used for `metadataBase`, the sitemap, and robots.
 * Set `NEXT_PUBLIC_SITE_URL` in production; the fallback is the dev server.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");
