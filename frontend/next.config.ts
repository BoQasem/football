import type { NextConfig } from "next";

/**
 * Strapi's origin as configured for this app. The fallback mirrors the one the
 * runtime uses in `lib/strapi.ts`, so the config and the app never disagree.
 */
function getStrapiOrigin(): URL | null {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

/**
 * Hosts that resolve to a private address.
 *
 * Next's image optimizer refuses to fetch from one: it resolves the hostname,
 * finds a private IP, and answers `400` as SSRF protection. The page still
 * renders — only the image is broken, which is a confusing failure to debug.
 *
 * Strapi is served from localhost in development, so the guard has to be
 * lifted for loopback hosts. It stays on for any public host.
 */
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

const strapiOrigin = getStrapiOrigin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: strapiOrigin
      ? [
          {
            protocol: strapiOrigin.protocol.replace(":", "") as
              | "http"
              | "https",
            hostname: strapiOrigin.hostname,
            port: strapiOrigin.port || undefined,
            pathname: "/uploads/**",
          },
        ]
      : [],
    dangerouslyAllowLocalIP: strapiOrigin
      ? LOOPBACK_HOSTS.has(strapiOrigin.hostname)
      : false,
  },
};

export default nextConfig;
