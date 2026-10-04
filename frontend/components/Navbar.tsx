import Link from "next/link";

async function getNavigationItems() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/navigation-items?sort=Order:asc`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch navigation items");
  }
  const data = await response.json();
  return data.data;
}

async function getSiteSettings() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/site-setting`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Site Settings");
  }
  const data = await response.json();
  return data.data;
}

export default async function Navbar() {
  const navigationItems = await getNavigationItems();
  const settings = await getSiteSettings();

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold">
            {settings.Site_Name}
        </Link>
        
        <div className="flex items-center gap-6">
          {navigationItems.map((item: any) => (
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