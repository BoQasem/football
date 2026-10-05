import Link from "next/link";
import { getCategories } from "@/lib/strapi";

export default async function CategoriesPage() {
  const categories = await getCategories({ populate: "articles" });

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">Categories</h1>
        <p className="mt-2 text-slate-400">
          Explore our articles by category.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div
            key={category.documentId}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">
              {category.Name}
            </h2>
            <p className="mt-2 text-slate-500">
              {category.articles?.length || 0} Articles
            </p>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <Link
                href={`/category/${category.Slug}`}
                className="text-sm font-semibold text-slate-900 transition hover:text-slate-600">
                View Category →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
