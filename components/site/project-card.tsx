"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { PublicProjectSummary } from "@/lib/queries/public";

/**
 * Gallery card.
 *
 * The cover links to the case study; the repository and demo links are siblings
 * stacked above it so they stay independently clickable and keyboard reachable
 * (a link inside a link is invalid HTML). On desktop they fade in on hover, on
 * mobile they are always rendered under the image.
 */
export function ProjectCard({
  project,
}: {
  project: PublicProjectSummary;
}) {
  const links = [
    project.githubUrl ? { label: "Code", href: project.githubUrl } : null,
    project.liveUrl ? { label: "Live demo", href: project.liveUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-card"
    >
      <Link
        href={`/projects/${project.id}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={project.cloudinaryImageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 22rem, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {links.length > 0 ? (
        <div
          className="absolute inset-x-0 top-0 flex justify-end gap-2 p-3 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-lg bg-background/90 px-3 text-sm font-medium backdrop-blur transition-colors hover:bg-background"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {project.category}
        </p>
        <h3 className="text-lg font-semibold tracking-tight">
          <Link
            href={`/projects/${project.id}`}
            className="transition-colors hover:text-primary"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{project.description}</p>
      </div>
    </motion.li>
  );
}