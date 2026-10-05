import { cache } from "react";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export interface RichTextBlock {
  children?: { text?: string }[];
}

export interface StrapiMedia {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface Article {
  id: number;
  documentId: string;
  Title: string;
  Slug: string;
  Description?: string | null;
  Author?: string | null;
  Content?: RichTextBlock[] | null;
  Cover?: StrapiMedia | null;
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

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

const EMPTY_PAGINATION: StrapiPagination = {
  page: 1,
  pageSize: 0,
  pageCount: 0,
  total: 0,
};

/**
 * Perform a Strapi request and return the parsed body, or throw.
 *
 * Throwing on a non-2xx response matters: Strapi answers errors with
 * `{ data: null, error: {...} }`, which would otherwise deserialize into
 * something that looks like a successful empty result.
 */
async function request(
  path: string,
  params?: Record<string, string>,
  init?: RequestInit
) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not set");
  }

  const query = params ? `?${new URLSearchParams(params)}` : "";
  const response = await fetch(`${API_URL}/api${path}${query}`, init);

  if (!response.ok) {
    throw new Error(`Strapi request failed (${response.status}) for ${path}`);
  }

  return response.json();
}

/**
 * Call the Strapi REST API and return the payload with its envelope stripped.
 *
 * Collection types answer with `{ data, meta }` and single types with
 * `{ data }`, but users-permissions answers with a bare array. Callers get the
 * payload either way, so no page has to know which shape it is talking to.
 */
export async function strapiFetch<T>(
  path: string,
  params?: Record<string, string>,
  init?: RequestInit
): Promise<T> {
  const payload = await request(path, params, init);

  // `"data" in payload` rather than `payload?.data ?? payload`, so a
  // deliberately null single type stays null instead of falling back to the
  // envelope itself.
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

/** Like `strapiFetch`, but keeps Strapi's `meta.pagination` alongside the rows. */
export async function strapiFetchPaginated<T>(
  path: string,
  params?: Record<string, string>,
  init?: RequestInit
): Promise<{ data: T[]; pagination: StrapiPagination }> {
  const payload = await request(path, params, init);

  return {
    data: Array.isArray(payload?.data) ? (payload.data as T[]) : [],
    pagination: payload?.meta?.pagination ?? EMPTY_PAGINATION,
  };
}

/** Strapi's maximum `pageSize`. */
const PAGE_SIZE = 100;

/**
 * Fetch every row of a collection, following Strapi's pagination to the end.
 *
 * Use for jobs that must see the whole collection (a sitemap, a build-time
 * export). Not for anything a user waits on — see `strapiFetchPaginated`.
 */
export async function strapiFetchAll<T>(
  path: string,
  params?: Record<string, string>,
  init?: RequestInit
): Promise<T[]> {
  const atPage = (page: number) => ({
    ...params,
    "pagination[pageSize]": String(PAGE_SIZE),
    "pagination[page]": String(page),
  });

  const first = await strapiFetchPaginated<T>(path, atPage(1), init);
  const rows = [...first.data];

  for (let page = 2; page <= first.pagination.pageCount; page++) {
    const next = await strapiFetchPaginated<T>(path, atPage(page), init);
    rows.push(...next.data);
  }

  return rows;
}

/** Prefix a relative Strapi media path with the API origin. */
export function mediaUrl(media?: StrapiMedia | null) {
  if (!media?.url) {
    return null;
  }
  if (/^https?:\/\//.test(media.url)) {
    return media.url;
  }
  return `${API_URL}${media.url}`;
}

/**
 * Populate params for every article query, in Strapi's bracket syntax.
 *
 * Not `populate=category,cover`: Strapi validates populate keys against the
 * content-type schema and rejects unknown ones with a 400. Two things make the
 * flat form fail here — the media attribute is `Cover`, capital C, and the
 * comma-separated shorthand is not reliably split. Bracket syntax names each
 * attribute explicitly, so there is nothing to mis-parse.
 */
export const ARTICLE_POPULATE = {
  "populate[category]": "true",
  "populate[Cover]": "true",
};

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

/**
 * Wrapped in React's `cache` so that `generateMetadata` and the page component
 * can both ask for the same article without issuing two requests.
 */
export const getArticleBySlug = cache(async (slug: string) => {
  const articles = await strapiFetch<Article[]>("/articles", {
    "filters[Slug][$eq]": slug,
    ...ARTICLE_POPULATE,
  });
  return articles[0] ?? null;
});

export function getCategories(
  params?: Record<string, string>,
  init?: RequestInit
) {
  return strapiFetch<Category[]>("/categories", params, init);
}

/** Cached for the same reason as `getArticleBySlug` above. */
export const getCategoryBySlug = cache(async (slug: string) => {
  const categories = await strapiFetch<Category[]>("/categories", {
    "filters[Slug][$eq]": slug,
    populate: "articles",
  });
  return categories[0] ?? null;
});
