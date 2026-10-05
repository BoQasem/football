import Link from "next/link";
import { getCategoryBySlug } from "@/lib/strapi";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

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
        {category.articles?.map((article) => (
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
