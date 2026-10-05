import type { Metadata } from "next";
import Link from "next/link";
import { strapiFetchPaginated, type Category } from "@/lib/strapi";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore Football articles by category.",
};

const PAGE_SIZE = 9;

type CategoriesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

function fetchPage(page: number) {
  return strapiFetchPaginated<Category>("/categories", {
    populate: "articles",
    "pagination[page]": String(page),
    "pagination[pageSize]": String(PAGE_SIZE),
  });
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const { page: requestedParam } = await searchParams;

  const requested = Math.max(1, Number.parseInt(requestedParam ?? "", 10) || 1);

  let { data: categories, pagination } = await fetchPage(requested);

  // See the note in app/articles/page.tsx: an out-of-range page comes back
  // empty but still tells us how many pages there really are.
  if (categories.length === 0 && requested > 1 && pagination.pageCount > 0) {
    ({ data: categories, pagination } = await fetchPage(pagination.pageCount));
  }

  const page = Math.min(requested, Math.max(1, pagination.pageCount));

  return (
    <main className="flex-1 bg-gray-50 text-gray-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Categories</h1>

          <p className="mt-2 text-gray-600">
            Explore our articles by category.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-600">No categories have been published yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.documentId}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  {category.Name}
                </h2>

                <p className="mt-2 text-gray-600">
                  {category.articles?.length || 0} Articles
                </p>

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <Link
                    href={`/category/${category.Slug}`}
                    className="text-sm font-semibold text-gray-900 transition hover:text-gray-600">
                    View Category →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageCount={pagination.pageCount}
          basePath="/categories"
        />
      </div>
    </main>
  );
}
