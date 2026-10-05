import Link from "next/link";

async function getArticle(slug: string) {
  const params = new URLSearchParams({
    "filters[Slug][$eq]": slug,
    populate: "category",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?${params}`
  );
  if (!response.ok) {
    throw new Error("Failed to Fetch Article");
  }
  const data = await response.json();
  return data.data[0];
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticle(slug);

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
          {article.Content?.map((block: any, index: number) => (
            <p key={index} className="mb-4">
              {block.children?.map((child: any, childIndex: number) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}