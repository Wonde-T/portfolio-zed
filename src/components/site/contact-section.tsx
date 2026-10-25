"use client";

import { motion } from "framer-motion";

import type { SocialLink } from "@/lib/site-config";

export function ContactSection({
  title,
  email,
  socials,
}: {
  title: string;
  email: string;
  socials: SocialLink[];
}) {
  return (
    <motion.section
      id="contact"
      aria-labelledby="contact-heading"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="scroll-mt-24 py-20 sm:py-24"
    >
      <h2
        id="contact-heading"
        className="text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </h2>

      <p className="mt-4 max-w-prose text-base text-muted-foreground sm:text-lg">
        Have a project in mind, or just want to talk about the stack? The fastest
        way to reach me is email.
      </p>

      <a
        href={`mailto:${email}`}
        className="mt-8 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {email}
      </a>

      {socials.length > 0 ? (
        <ul className="mt-8 flex flex-wrap gap-4">
          {socials.map((social) => (
            <li key={social.href}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center text-sm font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.section>
  );
}