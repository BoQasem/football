import Link from "next/link";

async function getArticles() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=category`
  );
  if (!response.ok) {
    throw new Error("Failed to Fetch Articles");
  }
  const data = await response.json();
  return data.data;
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">Articles</h1>

        <p className="mt-2 text-slate-400">
          Explore all our articles.
        </p>
      </div>

      <div className="space-y-6">
        {articles.map((article: any) => (
          <Link
            key={article.documentId}
            href={`/articles/${article.Slug}`}
            className="block rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <p className="mb-2 text-sm font-semibold text-slate-500">
              {article.category?.Name}
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              {article.Title}
            </h2>

            <p className="mt-2 text-slate-500">
              {article.Description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}