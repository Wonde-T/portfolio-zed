# Dynamic Developer Portfolio CMS

A full-stack developer portfolio with a public site and a feature-flagged admin dashboard.
Every section, project and skill has an `is_visible` flag that is evaluated **on the server**,
so hidden content is never shipped to the browser. Admin mutations call `revalidatePath()` so the
public site updates immediately without Redis.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | PostgreSQL 17 via Prisma 7 (`@prisma/adapter-pg` driver adapter) |
| Auth | Auth.js / NextAuth v5, credentials provider, JWT sessions |
| Media | Cloudinary |
| Infra | Docker + Docker Compose |

## Requirements

- Node.js 20.9+
- Docker (for PostgreSQL)

## Getting started

1. Copy the environment template and fill in the secrets:

   ```bash
   cp .env.example .env
   npx auth secret   # generates AUTH_SECRET
   ```

2. Choose where the app and database listen. If the host already uses 5432 or
   3000, set `POSTGRES_PORT` / `APP_PORT` in `.env` and update `DATABASE_URL` and
   `NEXT_PUBLIC_SITE_URL` to match.

3. Start everything:

   ```bash
   docker compose up --build
   ```

   Compose starts PostgreSQL, waits for it to pass its healthcheck, runs
   `prisma migrate deploy` plus the seed in a throwaway `migrate` service, and
   only then starts the app.

### Running the app without Docker

```bash
docker compose up -d db          # PostgreSQL only
npm run db:deploy                # apply migrations
npm run db:seed                  # admin user + demo content
npm run dev
```

The dashboard lives at `/admin/login`. Seeded credentials come from
`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Turbopack dev server |
| `npm run build` | Production build (`output: "standalone"`) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:deploy` | Apply pending migrations (production) |
| `npm run db:seed` | Seed the admin user and default sections |
| `npm run db:studio` | Open Prisma Studio |

## Project layout

```
src/
  app/                  Routes (App Router)
    (site)/             Public pages: landing page + project/[id] case studies
    admin/              Login + dashboard
    api/auth/           Auth.js route handlers
    api/cloudinary/sign/ Upload signature endpoint (admin only)
  components/
    site/               Public UI: header, hero, gallery, contact
    admin/              Dashboard UI: forms, tables, upload widget
  lib/                  Site config, db client, queries, validations
  auth.ts               Auth.js instance (credentials provider)
  auth.config.ts        Provider-free auth config, shared with the proxy
  proxy.ts              Optimistic session gate for /admin/dashboard
prisma/                 Schema, migrations, seed
```

## Configuration

Personal details that never change per-deploy live in `src/lib/site-config.ts`.
Everything else — projects, skills, section titles and visibility — lives in the database and is
edited from `/admin/dashboard`.

## Media

Project covers are uploaded from the dashboard straight to Cloudinary:

- The browser asks `/api/cloudinary/sign` for a signature, then posts the file to Cloudinary
  itself, so the app container never handles image bytes and only the resulting delivery URL is
  stored. `CLOUDINARY_API_SECRET` is read on the server and never reaches the client.
- Cover URLs are validated against `res.cloudinary.com`, which is also the only host allowed in
  `next.config.ts` `images.remotePatterns`.
- `NEXT_PUBLIC_CLOUDINARY_*` values are inlined into the bundles by `next build`, so they must be
  present **at build time**. Compose passes them from `.env` as build args; with no credentials at
  all the dashboard falls back to a plain URL input instead of a widget that cannot sign anything.

## Database notes

- Columns are `snake_case`; the Prisma models expose `camelCase` via `@map`.
- Prisma 7 needs a driver adapter, so `src/lib/prisma-adapter.ts` builds the connection from
  `DATABASE_URL` and passes it to `@prisma/adapter-pg`.
- Use `127.0.0.1` rather than `localhost` in `DATABASE_URL`; on Windows `localhost` can resolve to
  IPv6, which Docker does not publish. If a native PostgreSQL install already owns port 5432, set
  `POSTGRES_PORT` (and the port in `DATABASE_URL`) to a free port such as 5433.
- The Compose database is a standard `postgres:17-alpine` container; the superuser it creates can
  create the shadow database used by `prisma migrate dev`.

## Docker layout

| Stage | Purpose |
| --- | --- |
| `deps` | `npm ci` from the lockfile |
| `builder` | `prisma generate` + `next build` |
| `runner` | production image, `output: "standalone"`, runs as a non-root user |
| `migrate` | `prisma migrate deploy` + seed, then exits |