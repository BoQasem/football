import Link from "next/link";
import { getArticles, getCategories } from "@/lib/strapi";

const NO_STORE = { cache: "no-store" } as const;

export default async function Home() {
  const [categories, articles] = await Promise.all([
    getCategories({ sort: "createdAt:desc" }, NO_STORE),
    getArticles({ sort: "createdAt:desc", "pagination[limit]": "5" }, NO_STORE),
  ]);

  return (
    <main className="flex-1 bg-gray-50 text-gray-900">

      {/* Hero */}
      <section className="bg-gray-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <span className="mb-5 inline-block rounded-full border border-gray-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-300">
            Welcome
          </span>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Discover Our
            <span className="block text-gray-500">
              Latest Content
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-400">
            Explore the latest articles, browse our categories,
            and connect with our growing community.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Explore
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Categories
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.Slug}`}
              className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-5 font-semibold transition hover:-translate-y-1 hover:bg-gray-950 hover:text-white hover:shadow-lg">
              <span>{category.Name}</span>

              <span className="text-xl text-gray-400 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-24">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Blog
          </span>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Latest Articles
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {articles.map((article, index) => (
            <Link
              key={article.id}
              href={`/articles/${article.Slug}`}
              className="group grid min-h-20 grid-cols-[50px_1fr_30px] items-center border-b border-gray-200 px-5 transition last:border-b-0 hover:bg-gray-50 sm:grid-cols-[70px_1fr_40px] sm:px-7">
              <span className="text-sm font-bold text-gray-400">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="font-semibold transition group-hover:text-gray-600">
                {article.Title}
              </h3>

              <span className="justify-self-end text-xl text-gray-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gray-900">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
