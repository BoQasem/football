import Link from "next/link";

type PaginationProps = {
  page: number;
  pageCount: number;
  /** Path of the listing, e.g. `/articles`. Page 1 links to it bare. */
  basePath: string;
};

const IDLE =
  "rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:text-gray-900";
const ACTIVE = "rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-semibold text-white";
const DISABLED =
  "rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-semibold text-gray-300";

/**
 * The page numbers to render, with `null` standing in for a gap. Always shows
 * the first page, the last page, and a window around the current one.
 */
function pageWindow(page: number, pageCount: number): (number | null)[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const wanted = new Set([1, pageCount, page, page - 1, page + 1]);
  const visible = [...wanted]
    .filter((candidate) => candidate >= 1 && candidate <= pageCount)
    .sort((a, b) => a - b);

  const window: (number | null)[] = [];
  let previous = 0;

  for (const candidate of visible) {
    if (previous && candidate - previous > 1) {
      window.push(null);
    }
    window.push(candidate);
    previous = candidate;
  }

  return window;
}

export default function Pagination({
  page,
  pageCount,
  basePath,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  // Page 1 has no `?page=1` so the canonical URL stays clean.
  const href = (target: number) =>
    target === 1 ? basePath : `${basePath}?page=${target}`;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={IDLE}>
          ← Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={DISABLED}>
          ← Previous
        </span>
      )}

      {pageWindow(page, pageCount).map((candidate, index) =>
        candidate === null ? (
          <span
            // The gaps have no identity of their own; position is the key.
            key={`gap-${index}`}
            className="px-2 text-gray-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Link
            key={candidate}
            href={href(candidate)}
            aria-current={candidate === page ? "page" : undefined}
            className={candidate === page ? ACTIVE : IDLE}
          >
            {candidate}
          </Link>
        )
      )}

      {page < pageCount ? (
        <Link href={href(page + 1)} rel="next" className={IDLE}>
          Next →
        </Link>
      ) : (
        <span aria-disabled="true" className={DISABLED}>
          Next →
        </span>
      )}
    </nav>
  );
}
