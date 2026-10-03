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
| Database | MySQL 8 via Prisma 7 (`@prisma/adapter-mariadb` driver adapter) |
| Auth | Auth.js / NextAuth v5, credentials provider, JWT sessions |
| Media | Cloudinary |
| Infra | Docker + Docker Compose |

## Requirements

- Node.js 20.9+
- Docker (for MySQL)

## Getting started

1. Copy the environment template and fill in the secrets:

   ```bash
   cp .env.example .env
   npx auth secret   # generates AUTH_SECRET
   ```

2. Start MySQL:

   ```bash
   docker compose up -d db
   ```

3. Create the schema and seed the admin user:

   ```bash
   npm run db:deploy
   npm run db:seed
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   The site is at <http://localhost:3000>, the dashboard at <http://localhost:3000/admin/login>.

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
app/                    Routes (App Router)
  admin/                Login + dashboard
  projects/[id]/        Public project case study
components/             UI components (providers, sections, admin widgets)
lib/                    Site config, db client, queries, validations
prisma/                 Schema, migrations, seed
```

## Configuration

Personal details that never change per-deploy live in `lib/site-config.ts`.
Everything else — projects, skills, section titles and visibility — lives in the database and is
edited from `/admin/dashboard`.