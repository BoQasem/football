import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, mediaUrl } from "@/lib/strapi";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

// `getArticleBySlug` is wrapped in React's `cache`, so this and the page
// component below share a single request per render.
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  return {
    title: article.Title,
    description: article.Description ?? undefined,
    openGraph: {
      type: "article",
      title: article.Title,
      description: article.Description ?? undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const cover = mediaUrl(article.Cover);

  return (
    <main className="flex-1 bg-gray-50 text-gray-900">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/articles"
            className="text-sm font-semibold text-gray-500 transition hover:text-gray-900">
            ← Back to Articles
          </Link>
        </div>

        <article>
          {cover ? (
            <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-200">
              <Image
                src={cover}
                alt={article.Cover?.alternativeText ?? article.Title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          ) : null}

          <p className="mb-3 flex flex-wrap items-center gap-x-2 text-sm font-semibold text-gray-500">
            {article.category ? <span>{article.category.Name}</span> : null}

            {article.category && article.Author ? (
              <span aria-hidden="true">·</span>
            ) : null}

            {article.Author ? <span>{article.Author}</span> : null}
          </p>

          <h1 className="text-5xl font-bold text-gray-900">
            {article.Title}
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            {article.Description}
          </p>

          <div className="mt-10 text-lg leading-8 text-gray-900">
            {article.Content?.map((block, index) => (
              <p key={index} className="mb-4">
                {block.children?.map((child, childIndex) => (
                  <span key={childIndex}>{child.text}</span>
                ))}
              </p>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
