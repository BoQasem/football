import { getSiteSettings } from "@/lib/strapi";

export default async function Footer() {
  // Footer renders on every page, so a failed fetch must not take down the site.
  const settings = await getSiteSettings().catch(() => null);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-950 py-6 text-center text-sm text-gray-400">
      © {year} {settings?.Site_Name ?? "Football"}. All rights reserved.
    </footer>
  );
}
