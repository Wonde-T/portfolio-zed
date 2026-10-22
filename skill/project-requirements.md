# Project Overview
A dynamic, full-stack developer portfolio and CMS. The application serves two purposes: a public-facing portfolio and a secure admin dashboard where the owner can toggle features and edit content. 

# Core Mechanics
1. Visibility Toggles: The system relies on feature flagging. Every content entity (projects, skills, experience) and main section has an `is_visible` boolean in the database.
2. Server-Side Gatekeeping: The Next.js server fetches configuration before rendering. Hidden elements are never sent to the client browser.
3. Cache Invalidation: Admin actions (Create, Update, Delete, Toggle) must trigger Next.js `revalidatePath()` to instantly update the public UI without needing Redis.

# Required Routes
- `/`: Public portfolio landing page (Hero, Skills, Projects, Contact).
- `/admin/login`: Secure login for the owner.
- `/admin/dashboard`: CMS panel with CRUD tables for Projects, Skills, and Sections.

# Image Management
All uploaded images (project covers, avatars) must be sent to Cloudinary. The database will only store the Cloudinary public URL or ID.

# Infrastructure & Containerization
- Next.js Container: Multi-stage build leveraging `output: 'standalone'` in `next.config.js` to keep the image lightweight.
- Database Container: Official `postgres:17-alpine` image with persistent named volumes for data persistence.
- Orchestration: A `docker-compose.yml` file to spin up both the Next.js app and PostgreSQL database with a single `docker compose up --build` command.