async function getSiteSettings() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/site-setting`
  );
  // Footer renders on every page, so a failed fetch must not throw.
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.data;
}

export default async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-950 py-6 text-center text-sm text-gray-400">
      © {year} {settings?.Site_Name ?? "Football"}. All rights reserved.
    </footer>
  );
}
