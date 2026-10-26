"use client";

import { useRef, useState } from "react";

import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Flip, MOTION_REDUCED, gsap, useGSAP } from "@/lib/gsap";
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
  const root = useRef<HTMLElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [category, setCategory] = useState(ALL);

  const categories = [
    ALL,
    ...Array.from(new Set(projects.map((project) => project.category))).sort(),
  ];

  const countOf = (option: string) =>
    option === ALL
      ? projects.length
      : projects.filter((project) => project.category === option).length;

  const select = (option: string) => {
    if (option === category) return;

    // Snapshot the layout *before* React re-renders with the new filter.
    if (!window.matchMedia(MOTION_REDUCED).matches) {
      flipState.current = Flip.getState(
        gsap.utils.toArray<HTMLElement>("[data-flip-id]", root.current),
      );
    }
    setCategory(option);
  };

  // Runs after the filtered render: animate every card from its old position.
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;

      Flip.from(state, {
        duration: 0.8,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.05,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.85, y: 24 },
            { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.25, stagger: 0.06, ease: "power3.out" },
          ),
        onLeave: (elements) =>
          gsap.to(elements, { opacity: 0, scale: 0.85, duration: 0.4, ease: "power2.in" }),
      });
    },
    { scope: root, dependencies: [category] },
  );

  return (
    <section
      ref={root}
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <SectionHeading
        id="projects-heading"
        eyebrow="Selected work"
        title={title}
        description="A few things I've designed and built recently."
      >
        {categories.length > 2 ? (
          <div
            role="group"
            aria-label="Filter projects by category"
            className="glass flex flex-wrap gap-1 rounded-full p-1"
          >
            {categories.map((option) => {
              const selected = option === category;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => select(option)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-[color,background-color,box-shadow] duration-300",
                    selected
                      ? "bg-brand-gradient text-primary-foreground shadow-lg shadow-primary/30"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs",
                      selected ? "bg-primary-foreground/20" : "bg-muted",
                    )}
                  >
                    {countOf(option)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </SectionHeading>

      <Reveal
        as="ul"
        stagger={0.12}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            hidden={category !== ALL && project.category !== category}
          />
        ))}
      </Reveal>
    </section>
  );
}
