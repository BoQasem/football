# Football

A blog with two apps in one repo.

- `backend/` Strapi 5 CMS, uses SQLite
- `frontend/` Next.js 16 site

## Requirements

Node.js 20 or newer.

## Install

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

## Environment

`backend/.env` is created by Strapi the first time you run it. It needs these:

```
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
```

Copy `frontend/.env.example` to `frontend/.env.local`:

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Run

```bash
npm run dev
```

Admin panel: http://localhost:1337/admin
Site: http://localhost:3000

To run the two servers in separate terminals instead:

```bash
npm run dev:backend
npm run dev:frontend
```

## Seed

Fills a fresh database with sample categories, articles, nav items and site settings. Safe to run more than once.

```bash
npm run seed
```

## Other commands

```bash
npm run build
npm run typecheck
npm run lint
```

## Layout

```
backend/
  config/
  src/api/          content types
  scripts/seed.js
  .tmp/data.db      SQLite database, gitignored
frontend/
  app/              routes
  components/
  lib/strapi.ts     all API calls go here
```

## Notes

Content types that use draftAndPublish (articles, categories, nav items, site settings) must be published, not just saved. The API returns nothing for a draft.
