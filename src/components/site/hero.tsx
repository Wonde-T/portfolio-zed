"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type HeroProps = {
  greeting: string;
  name: string;
  role: string;
  bio: string;
  availability: string;
  /** Cloudinary portrait URL, or `null` to fall back to the initials monogram. */
  photoUrl: string | null;
  /** Only rendered when the matching section is enabled in the dashboard. */
  hasProjects: boolean;
  hasContact: boolean;
  email: string;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/** Up to two letters derived from the name, e.g. "Ada Lovelace" -> "AL". */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function Hero({
  greeting,
  name,
  role,
  bio,
  availability,
  photoUrl,
  hasProjects,
  hasContact,
  email,
}: HeroProps) {
  return (
    <motion.section
      id="hero"
      aria-labelledby="hero-heading"
      variants={container}
      initial="hidden"
      animate="show"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,32rem)_auto] lg:justify-center lg:gap-12">
        <div className="order-2 lg:order-1">
          <motion.p variants={item} className="text-sm font-medium text-primary">
            {greeting}
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={item}
            className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            {name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-3 text-lg text-muted-foreground sm:text-xl"
          >
            {role}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-base text-foreground/80 sm:text-lg"
          >
            {bio}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              {availability}
            </span>
          </motion.div>

          {hasProjects || hasContact ? (
            <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
              {hasProjects ? (
                <a
                  href="#projects"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View Projects
                </a>
              ) : null}
              {hasContact ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Contact Me
                </a>
              ) : null}
            </motion.div>
          ) : null}
        </div>

        <motion.div
          variants={item}
          className="order-1 flex justify-center lg:order-2"
        >
          <div className="relative aspect-square w-52 sm:w-64 lg:w-72">
            {/* Soft accent halo behind the portrait. */}
            <div
              aria-hidden
              className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary/20 via-accent/40 to-transparent blur-2xl"
            />

            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-border bg-muted shadow-xl">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 18rem, (min-width: 640px) 16rem, 13rem"
                  className="object-cover"
                />
              ) : (
                <span className="bg-gradient-to-br from-primary/15 to-accent bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
                  {getInitials(name)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
