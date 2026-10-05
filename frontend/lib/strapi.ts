const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export interface RichTextBlock {
  children?: { text?: string }[];
}

export interface Article {
  id: number;
  documentId: string;
  Title: string;
  Slug: string;
  Description?: string | null;
  Content?: RichTextBlock[] | null;
  category?: Category | null;
}

export interface Category {
  id: number;
  documentId: string;
  Name: string;
  Slug: string;
  Description?: string | null;
  articles?: Article[];
}

export interface NavigationItem {
  id: number;
  Name: string;
  URL: string;
}

export interface SiteSettings {
  Site_Name?: string | null;
  Copyright?: string | null;
}

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
}

/**
 * Call the Strapi REST API and return the payload with its envelope stripped.
 *
 * Collection types answer with `{ data, meta }` and single types with
 * `{ data }`, but users-permissions answers with a bare array. Callers get the
 * payload either way, so no page has to know which shape it is talking to.
 *
 * Throws on a non-2xx response instead of returning Strapi's error envelope,
 * which would otherwise deserialize into something that looks like a
 * successful empty result.
 */
export async function strapiFetch<T>(
  path: string,
  params?: Record<string, string>,
  init?: RequestInit
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not set");
  }

  const query = params ? `?${new URLSearchParams(params)}` : "";
  const response = await fetch(`${API_URL}/api${path}${query}`, init);

  if (!response.ok) {
    throw new Error(`Strapi request failed (${response.status}) for ${path}`);
  }

  const payload = await response.json();

  // `"data" in payload` rather than `payload?.data ?? payload`, so that a
  // deliberately null single type stays null instead of falling back to the
  // envelope itself.
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export function getSiteSettings(init?: RequestInit) {
  return strapiFetch<SiteSettings | null>("/site-setting", undefined, init);
}

export function getNavigationItems(init?: RequestInit) {
  return strapiFetch<NavigationItem[]>(
    "/navigation-items",
    { sort: "Order:asc" },
    init
  );
}

export function getArticles(
  params?: Record<string, string>,
  init?: RequestInit
) {
  return strapiFetch<Article[]>("/articles", params, init);
}

export async function getArticleBySlug(slug: string, init?: RequestInit) {
  const articles = await strapiFetch<Article[]>(
    "/articles",
    { "filters[Slug][$eq]": slug, populate: "category" },
    init
  );
  return articles[0] ?? null;
}

export function getCategories(
  params?: Record<string, string>,
  init?: RequestInit
) {
  return strapiFetch<Category[]>("/categories", params, init);
}

export async function getCategoryBySlug(slug: string, init?: RequestInit) {
  const categories = await strapiFetch<Category[]>(
    "/categories",
    { "filters[Slug][$eq]": slug, populate: "articles" },
    init
  );
  return categories[0] ?? null;
}

export function getUsers(params?: Record<string, string>, init?: RequestInit) {
  return strapiFetch<StrapiUser[]>("/users", params, init);
}
