/**
 * Idempotent seed: admin account, the four section toggles, and demo content.
 *
 * Run with `npm run db:seed`. Safe to run repeatedly (also used by the Docker
 * `migrate` service on every `docker compose up`).
 */
import "dotenv/config";

import bcrypt from "bcryptjs";

import { PrismaClient } from "../lib/generated/prisma/client";
import { createPrismaAdapter } from "../lib/prisma-adapter";
import { SECTION_NAMES } from "../lib/sections";

const prisma = new PrismaClient({ adapter: createPrismaAdapter(1) });

const SECTION_TITLES: Record<string, string | null> = {
  hero: null,
  skills: "Tech stack",
  projects: "Selected work",
  contact: "Get in touch",
};

const SKILLS: Array<{ name: string; category: string }> = [
  { name: "TypeScript", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "SQL", category: "Languages" },
  { name: "HTML & CSS", category: "Languages" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Framer Motion", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "MySQL", category: "Backend" },
  { name: "Prisma", category: "Backend" },
  { name: "Auth.js", category: "Backend" },
  { name: "Docker", category: "Tools" },
  { name: "Git & GitHub", category: "Tools" },
  { name: "Figma", category: "Tools" },
];

// Placeholder covers served from Cloudinary's public demo cloud. Replace with
// real uploads from the admin dashboard.
const DEMO_IMAGE_BASE =
  "https://res.cloudinary.com/demo/image/upload/samples";

const PROJECTS: Array<{
  title: string;
  description: string;
  contentMarkdown: string;
  cloudinaryImageUrl: string;
  githubUrl: string | null;
  liveUrl: string | null;
  category: string;
  isVisible: boolean;
}> = [
  {
    title: "Portfolio CMS",
    description:
      "This site. A feature-flagged portfolio with a server-rendered admin dashboard, MySQL persistence and Cloudinary media.",
    contentMarkdown: `## Why build a CMS for a portfolio?

A portfolio is content, and content rots. This project treats the portfolio as
a small content-management system instead of a hard-coded page.

### Visibility is a server concern

Every section, project and skill carries an \`is_visible\` flag. The flag is
evaluated while rendering on the server, so hidden items are never serialised
into the HTML payload that reaches the browser — you cannot inspect the page
source to find a draft project.

### No Redis

Admin writes call \`revalidatePath()\`, which expires the affected route in the
Next.js cache. The public site reflects the change on the next request without
any external cache dependency.

### Media stays stateless

Covers and avatars are uploaded to Cloudinary; the database only stores the
resulting URL. \`next/image\` then handles WebP conversion, lazy loading and
responsive sizing on top of it.`,
    cloudinaryImageUrl: `${DEMO_IMAGE_BASE}/landscapes/architecture-signs.jpg`,
    githubUrl: "https://github.com/your-username/portfolio-zed",
    liveUrl: null,
    category: "Full-Stack",
    isVisible: true,
  },
  {
    title: "Realtime Dashboard",
    description:
      "A live analytics dashboard streaming updates over Server-Sent Events with optimistic UI.",
    contentMarkdown: `## Streaming without websockets

Server-Sent Events are enough for one-way data, and they survive proxies that
break websocket upgrades.

- Aggregations run in MySQL with covering indexes
- The UI updates optimistically and reconciles on each event
- Reconnection uses exponential backoff with jitter`,
    cloudinaryImageUrl: `${DEMO_IMAGE_BASE}/landscapes/beach-boat.jpg`,
    githubUrl: "https://github.com/your-username/realtime-dashboard",
    liveUrl: "https://example.com",
    category: "Full-Stack",
    isVisible: true,
  },
  {
    title: "Design System",
    description:
      "An accessible component library: tokens, primitives and documentation built for dark mode.",
    contentMarkdown: `## Tokens first

Colour, spacing and radii are defined as CSS custom properties and exposed to
Tailwind through \`@theme inline\`. Components never hard-code a hex value.

## Accessibility budget

- Every interactive target is at least 44x44px
- Focus rings are visible and never removed
- Motion respects \`prefers-reduced-motion\``,
    cloudinaryImageUrl: `${DEMO_IMAGE_BASE}/ecommerce/shoes.png`,
    githubUrl: "https://github.com/your-username/design-system",
    liveUrl: "https://example.com",
    category: "Frontend",
    isVisible: true,
  },
  {
    title: "Image Pipeline",
    description:
      "A Cloudinary-backed upload service with signed parameters, eager transformations and automatic WebP delivery.",
    contentMarkdown: `## Signed uploads

The browser never sees the API secret. A server action signs the upload
parameters, the browser posts the file directly to Cloudinary, and only the
resulting public ID is written to the database.

## Delivery

\`next/image\` requests exactly the sizes the layout needs, and Cloudinary
serves WebP or AVIF depending on the \`Accept\` header.`,
    cloudinaryImageUrl: `${DEMO_IMAGE_BASE}/food/spices.jpg`,
    githubUrl: "https://github.com/your-username/image-pipeline",
    liveUrl: null,
    category: "Backend",
    isVisible: true,
  },
  {
    title: "Work in progress",
    description:
      "An unreleased experiment. Kept here to demonstrate that hidden projects never reach the public page.",
    contentMarkdown: `## Draft

This project is seeded with \`is_visible = false\`. It is still in the database
and still visible in the admin dashboard, but the public gallery never queries
or renders it.`,
    cloudinaryImageUrl: `${DEMO_IMAGE_BASE}/animals/three-dogs.jpg`,
    githubUrl: null,
    liveUrl: null,
    category: "Full-Stack",
    isVisible: false,
  },
];

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set - skipping admin user.",
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  console.log(`[seed] admin user ready: ${email}`);
}

async function seedSections() {
  for (const sectionName of SECTION_NAMES) {
    await prisma.sectionConfig.upsert({
      where: { sectionName },
      update: {},
      create: { sectionName, title: SECTION_TITLES[sectionName] ?? null },
    });
  }

  console.log(`[seed] ${SECTION_NAMES.length} section configs ready`);
}

async function seedSkills() {
  for (const skill of SKILLS) {
    await prisma.skill.upsert({
      where: { name_category: skill },
      update: {},
      create: skill,
    });
  }

  console.log(`[seed] ${SKILLS.length} skills ready`);
}

async function seedProjects() {
  for (const [index, project] of PROJECTS.entries()) {
    const existing = await prisma.project.findFirst({
      where: { title: project.title },
      select: { id: true },
    });

    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: { ...project, orderIndex: index },
      });
    } else {
      await prisma.project.create({
        data: { ...project, orderIndex: index },
      });
    }
  }

  console.log(`[seed] ${PROJECTS.length} projects ready`);
}

async function main() {
  await seedAdmin();
  await seedSections();
  await seedSkills();
  await seedProjects();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });