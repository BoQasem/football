import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ARTICLE_POPULATE,
  strapiFetchPaginated,
  mediaUrl,
  type Article,
} from "@/lib/strapi";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Articles",
  description: "Every article published on Football.",
};

const PAGE_SIZE = 9;

type ArticlesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

function fetchPage(page: number) {
  return strapiFetchPaginated<Article>("/articles", {
    ...ARTICLE_POPULATE,
    "pagination[page]": String(page),
    "pagination[pageSize]": String(PAGE_SIZE),
  });
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { page: requestedParam } = await searchParams;

  // `Number.parseInt` on garbage yields NaN, and NaN is falsy, so both a
  // missing and an invalid `?page=` land on 1.
  const requested = Math.max(1, Number.parseInt(requestedParam ?? "", 10) || 1);

  let { data: articles, pagination } = await fetchPage(requested);

  // `?page=999` returns an empty list but still reports the real page count, so
  // re-request the last page instead of rendering a blank listing.
  if (articles.length === 0 && requested > 1 && pagination.pageCount > 0) {
    ({ data: articles, pagination } = await fetchPage(pagination.pageCount));
  }

  const page = Math.min(requested, Math.max(1, pagination.pageCount));

  return (
    <main className="flex-1 bg-gray-50 text-gray-900">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Articles</h1>

          <p className="mt-2 text-gray-600">Explore all our articles.</p>
        </div>

        {articles.length === 0 ? (
          <p className="text-gray-600">No articles have been published yet.</p>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => {
              const cover = mediaUrl(article.Cover);

              return (
                <Link
                  key={article.documentId}
                  href={`/articles/${article.Slug}`}
                  className="block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex flex-col sm:flex-row">
                    {cover ? (
                      <div className="relative h-48 w-full shrink-0 bg-gray-200 sm:h-auto sm:min-h-48 sm:w-56">
                        <Image
                          src={cover}
                          alt={article.Cover?.alternativeText ?? article.Title}
                          fill
                          sizes="(max-width: 640px) 100vw, 224px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="flex-1 p-6">
                      <p className="mb-2 text-sm font-semibold text-gray-500">
                        {article.category?.Name}
                      </p>

                      <h2 className="text-2xl font-bold text-gray-900">
                        {article.Title}
                      </h2>

                      <p className="mt-2 text-gray-600">
                        {article.Description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Pagination
          page={page}
          pageCount={pagination.pageCount}
          basePath="/articles"
        />
      </div>
    </main>
  );
}
