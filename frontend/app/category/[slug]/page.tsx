import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/strapi";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: category.Name,
    description: category.Description ?? undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="flex-1 bg-gray-50 text-gray-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            {category.Name}
          </h1>

          <p className="mt-2 text-gray-600">{category.Description}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.articles?.map((article) => (
            <article
              key={article.documentId}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                {article.Title}
              </h2>

              <p className="mt-3 text-gray-600">{article.Description}</p>

              <div className="mt-6">
                <Link
                  href={`/articles/${article.Slug}`}
                  className="font-semibold text-gray-900 hover:text-gray-600">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
