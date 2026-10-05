import Link from "next/link";
import { getNavigationItems, getSiteSettings } from "@/lib/strapi";

/**
 * Routes this app has retired but that may still exist as navigation items in
 * Strapi. Rendering a link that 404s is worse than not rendering it at all.
 *
 * Delete an entry once the matching row is removed in the admin
 * (Content Manager → Navigation Items), after which this list can go entirely.
 */
const RETIRED_ROUTES = new Set(["/users"]);

export default async function Navbar() {
  const [navigationItems, settings] = await Promise.all([
    getNavigationItems(),
    getSiteSettings(),
  ]);

  const links = navigationItems.filter((item) => !RETIRED_ROUTES.has(item.URL));

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
            {settings?.Site_Name ?? "Football"}
        </Link>

        <div className="flex items-center gap-6">
          {links.map((item) => (
            <Link
              key={item.id}
              href={item.URL}
              className="text-slate-300 transition hover:text-white">
              {item.Name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
