import Link from "next/link";
import { getArticleBySlug } from "@/lib/strapi";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article) {
    return <h1>Article Not Found</h1>;
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/articles"
          className="text-sm font-semibold text-slate-400 hover:text-white">
          ← Back to Articles
        </Link>
      </div>

      <article>
        <p className="mb-3 text-sm font-semibold text-slate-400">
          {article.category?.Name}
        </p>

        <h1 className="text-5xl font-bold text-white">
          {article.Title}
        </h1>

        <p className="mt-4 text-lg text-slate-400">
          {article.Description}
        </p>

        <div className="mt-10 text-lg leading-8 text-slate-200">
          {article.Content?.map((block, index) => (
            <p key={index} className="mb-4">
              {block.children?.map((child, childIndex) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
