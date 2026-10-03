"use client";

import { motion } from "framer-motion";

type HeroProps = {
  greeting: string;
  name: string;
  role: string;
  bio: string;
  availability: string;
  location: string;
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

export function Hero({
  greeting,
  name,
  role,
  bio,
  availability,
  location,
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
      <motion.p
        variants={item}
        className="text-sm font-medium text-primary"
      >
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
        className="mt-6 max-w-prose text-base text-foreground/80 sm:text-lg"
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
        <span className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
          {location}
        </span>
      </motion.div>

      {hasProjects || hasContact ? (
        <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
          {hasProjects ? (
            <a
              href="#projects"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View selected work
            </a>
          ) : null}
          {hasContact ? (
            <a
              href={`mailto:${email}`}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Get in touch
            </a>
          ) : null}
        </motion.div>
      ) : null}
    </motion.section>
  );
}