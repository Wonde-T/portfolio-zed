"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { ProjectCard } from "@/components/site/project-card";
import { cn } from "@/lib/utils";
import type { PublicProjectSummary } from "@/lib/queries/public";

const ALL = "All";

export function ProjectsSection({
  title,
  projects,
}: {
  title: string;
  projects: PublicProjectSummary[];
}) {
  const categories = [
    ALL,
    ...Array.from(new Set(projects.map((project) => project.category))).sort(),
  ];
  const [category, setCategory] = useState(ALL);

  const visible =
    category === ALL
      ? projects
      : projects.filter((project) => project.category === category);

  return (
    <motion.section
      id="projects"
      aria-labelledby="projects-heading"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="scroll-mt-24 py-20 sm:py-24"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="projects-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          {title}
        </h2>

        {categories.length > 2 ? (
          <div
            role="group"
            aria-label="Filter projects by category"
            className="flex flex-wrap gap-2"
          >
            {categories.map((option) => {
              const selected = option === category;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </ul>
    </motion.section>
  );
}