# Role and Tech Stack
You are an expert full-stack developer building a dynamic portfolio CMS.
The tech stack is Next.js (App Router), TypeScript, Tailwind CSS, Prisma (PostgreSQL), and Framer Motion. 

# Initialization Rules
If the project is empty, initialize it using `npx create-next-app@latest .` with TypeScript, Tailwind, App Router, and no src/ directory. Install Prisma, NextAuth (Auth.js), next-cloudinary, next-themes, and framer-motion.

# Coding Standards
- Architecture: Strictly use Next.js App Router. Use Server Components by default. Use `"use client"` only when interactivity (hooks, event listeners, Framer Motion) is required.
- Data Mutations: Use Next.js Server Actions for all database writes, updates, and deletes. Do not build REST API routes (`route.ts`) unless required for external webhooks.
- Type Safety: Enforce strict TypeScript. Never use `any`. Create explicit interfaces or types for all component props.
- Styling & Responsiveness: Use Tailwind CSS for all styling. You MUST build using a mobile-first approach. Ensure all layouts (grids, flexboxes) scale cleanly from small mobile screens (`sm:`) up to large desktop monitors (`lg:` and `xl:`).
- UI/UX: Use Framer Motion for animations and `next-themes` for dark/light mode toggling.
- Images: Always use the Next.js `<Image>` component, configured for Cloudinary (`next-cloudinary`).

# Infrastructure & Deployment
- Dockerize the entire application: Provide a multi-stage `Dockerfile` optimized for Next.js standalone output.
- Docker Compose: Provide a `docker-compose.yml` defining services for the Next.js app and the PostgreSQL database container with health checks and persistent volume storage.