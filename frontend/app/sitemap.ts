import type { MetadataRoute } from "next";
import { strapiFetchAll, type Article, type Category } from "@/lib/strapi";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/articles`, changeFrequency: "daily", priority: 0.8 },
    {
      url: `${SITE_URL}/categories`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Next resolves this route at build time, when Strapi is not necessarily
  // running. Losing the content routes is better than losing the build, so fall
  // back to the static ones instead of propagating the error.
  try {
    const [articles, categories] = await Promise.all([
      strapiFetchAll<Article>("/articles"),
      strapiFetchAll<Category>("/categories"),
    ]);

    return [
      ...staticRoutes,
      ...articles.map((article) => ({
        url: `${SITE_URL}/articles/${article.Slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...categories.map((category) => ({
        url: `${SITE_URL}/category/${category.Slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
