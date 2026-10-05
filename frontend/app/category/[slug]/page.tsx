import Link from "next/link";

async function getCategory(slug: string) {
  const params = new URLSearchParams({
    "filters[Slug][$eq]": slug,
    populate: "articles",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch Category");
  }

  const data = await response.json();

  return data.data[0];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    return <h1>Category Not Found</h1>;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">
          {category.Name}
        </h1>

        <p className="mt-2 text-slate-400">
          {category.Description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.articles?.map((article: any) => (
          <article
            key={article.documentId}
            className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              {article.Title}
            </h2>

            <p className="mt-3 text-slate-500">
              {article.Description}
            </p>

            <div className="mt-6">
              <Link
                href={`/articles/${article.Slug}`}
                className="font-semibold text-slate-900 hover:text-slate-600">
                Read Article →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}