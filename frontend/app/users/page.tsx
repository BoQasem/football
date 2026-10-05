import { notFound } from "next/navigation";

/**
 * Retired route.
 *
 * The homepage no longer lists members, and the public role cannot read
 * `/api/users` — when it could, the page published every user's email address.
 *
 * Left as an explicit 404 so any existing inbound link lands on the 404 page
 * rather than a stale user list. Safe to delete the whole `app/users/`
 * directory along with this file.
 */
export default function UsersPage() {
  // `return` rather than a bare call so the inferred return type is `never`,
  // which is assignable to a component's return type where `void` is not.
  return notFound();
}
