/**
 * Static identity and SEO configuration.
 *
 * The database owns toggleable *content* (projects, skills, section visibility);
 * this file owns the things that never change per-deploy: who you are, how to
 * reach you, and the canonical URLs used for metadata.
 *
 * PLACEHOLDER VALUES — replace with your real details.
 */

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  role: string;
  description: string;
  url: string;
  greeting: string;
  bio: string;
  location: string;
  availability: string;
  email: string;
  socials: SocialLink[];
};

export const siteConfig: SiteConfig = {
  name: "Your Name",
  role: "Full-Stack Developer",
  description:
    "Full-stack developer building fast, accessible web applications with Next.js, TypeScript and PostgreSQL.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  greeting: "Hi there, I'm",
  bio: "I design and build full-stack products end to end — from relational data models and server APIs to polished, animated interfaces. I care about performance, accessibility and code that the next person can maintain.",
  location: "Remote — CET",
  availability: "Available for freelance work",
  email: "hello@example.com",
  socials: [
    { label: "GitHub", href: "https://github.com/your-username" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-username/" },
    { label: "X", href: "https://x.com/your-username" },
  ],
};