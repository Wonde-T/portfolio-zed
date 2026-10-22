Dynamic Developer Portfolio CMS

Full Project Documentation

1. Project Overview
This document details the architecture, features, and requirements for a modern, CMS-driven
developer portfolio.
The application serves as both a public-facing portfolio and a secure administrative dashboard. The
core philosophy relies on dynamic presentation through feature flagging: the owner can toggle entire
sections or individual projects on and off, and the Next.js server securely fetches this configuration
before rendering the client UI.
2. Technology Stack
- Framework: Next.js (App Router, Server Components, Server Actions).
- Language: TypeScript (strict typing).
- Styling: Tailwind CSS (Mobile-first approach).
- Animations: Framer Motion.
- Database: PostgreSQL.
- ORM: Prisma ORM.
- Authentication: NextAuth.js (Auth.js) for JWT-based admin login.
- Media Storage: Cloudinary (via next-cloudinary).
- Infrastructure: Docker and Docker Compose.
3. Architecture & Containerization
- Server-Side Gatekeeping: Data visibility configurations (is_visible flags) are checked server-side
before the HTML is rendered to the client.
- Cache Invalidation: Admin mutations (Create, Update, Delete) trigger Next.js revalidatePath() to
update the public UI instantly without Redis.
- Next.js Container: Built using a multi-stage Dockerfile leveraging Next.js 'standalone' output for a
lightweight production image.
- PostgreSQL Container: Uses the official postgres:17-alpine image with persistent volume mounts to prevent data
loss.

- Orchestration: Managed via docker-compose.yml to spin up the web app and database
simultaneously.
4. Database Schema (Prisma Models)
The relational data model consists of four core tables:
- User (Admin): id (UUID), email, password_hash, created_at.
- SectionConfig: Manages global section toggles (id, section_name, is_visible, title).
- Project: Portfolio items (id, title, description, content_markdown, cloudinary_image_url, github_url,
live_url, category, is_visible, order_index).
- Skill: Technical proficiencies (id, name, category, is_visible).
5. UI/UX & Responsive Design
The UI follows a strict mobile-first approach, scaling cleanly from mobile screens up to desktop
monitors.
- Global Navigation: Sticky header with a glass-morphism (backdrop-blur) effect, scrollspy active states,
and a sliding full-screen hamburger menu on mobile.
- Theme Management: Smooth fade transitions between light and dark modes using next-themes.
- Hero Section: Staggered entrance animations fading in the greeting, title, and buttons sequentially.
- Project Gallery: Responsive grid (1 column mobile, 3 desktop) with Framer Motion layout animations
for smooth category filtering. Desktop includes scale-up hover states with sliding link overlays.
- Touch Targets: All interactive elements are at least 44x44px for mobile accessibility.
- Scroll Behaviors: Elements slide up and fade in via Framer Motion 'whileInView'. Includes a floating
scroll-to-top arrow button.
6. Media & Asset Management
- Cloudinary Integration: All media assets (avatars, project covers) are offloaded to Cloudinary,
ensuring the backend containers remain stateless.
- Next.js Image Optimization: The next/image component automatically handles WebP conversion, lazy
loading, and responsive sizing based on Cloudinary's dynamic transformations.