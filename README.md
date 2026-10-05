# Football

A blog built as two apps in one repository:

| | |
|---|---|
| `backend/` | Strapi 5 CMS (SQLite) — content types, media, admin panel |
| `frontend/` | Next.js 16 App Router — the public site |

## Requirements

- **Node.js 20 or newer**
- npm

## Setup

Install both halves:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

Then create the environment files. Both are gitignored; the `.example` files are
the templates.

**`backend/.env`** — Strapi generates this on first run. If you need to create it
by hand, it needs at least:

```
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
```

**`frontend/.env.local`** — copy `frontend/.env.example`:

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # optional; used for sitemap/robots
```

## Running

Both servers, one command:

```bash
npm run dev
```

- Strapi admin — http://localhost:1337/admin
- Site — http://localhost:3000

Or run them separately in two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

## Seeding

Populates a fresh database with sample categories, articles, navigation items,
and the Site Settings entry. Safe to re-run — it only creates what's missing.

```bash
npm run seed
```

## Other commands

```bash
npm run build      # build both apps
npm run typecheck  # tsc --noEmit across the frontend
npm run lint       # eslint on the frontend
```

## Project layout

```
backend/
  config/            # database, server, plugins, middlewares
  src/api/           # content types: article, category, navigation-item, site-setting
  scripts/seed.js    # seed script (npm run seed)
  .tmp/data.db       # SQLite database (gitignored)
frontend/
  app/               # routes, layouts, error/loading/not-found pages
  components/        # Navbar, Footer, Pagination
  lib/strapi.ts      # typed Strapi client — all API access goes through here
```

## Notes

- **All frontend API access goes through `frontend/lib/strapi.ts`.** Add new
  endpoints there rather than calling `fetch` directly, so error handling and
  Strapi's response-envelope quirks stay in one place.
- **`frontend/AGENTS.md`** warns that this Next.js release differs from older
  conventions. Read `frontend/node_modules/next/dist/docs/` before writing
  unfamiliar APIs — for example, error boundaries take a `retry` prop here, not
  `reset`.
- Strapi content types with `draftAndPublish: true` (articles, categories,
  navigation items, site settings) must be **published**, not just saved, before
  the public API returns them.
