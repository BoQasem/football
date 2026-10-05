import Link from "next/link";
import { getNavigationItems, getSiteSettings } from "@/lib/strapi";

export default async function Navbar() {
  const [navigationItems, settings] = await Promise.all([
    getNavigationItems(),
    getSiteSettings(),
  ]);

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
            {settings?.Site_Name ?? "Football"}
        </Link>

        <div className="flex items-center gap-6">
          {navigationItems.map((item) => (
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
