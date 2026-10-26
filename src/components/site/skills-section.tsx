"use client";

import { useRef } from "react";

import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

export type SkillGroup = {
  category: string;
  skills: string[];
};

/** Infinite, scroll-velocity-aware marquee of every skill. */
function SkillMarquee({ skills }: { skills: string[] }) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const el = track.current;
        if (!el) return;

        const tween = gsap.to(el, {
          xPercent: -50,
          duration: Math.max(20, skills.length * 3),
          ease: "none",
          repeat: -1,
        });

        const onEnter = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6 });
        const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);

        return () => {
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: track, dependencies: [skills.length] },
  );

  // Two identical halves so shifting by -50% loops seamlessly.
  const half = [...skills, ...skills];

  return (
    <div
      aria-hidden
      className="relative mb-14 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
    >
      <div ref={track} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-4 pr-4">
            {half.map((skill, index) => (
              <span
                key={`${copy}-${skill}-${index}`}
                className="glass inline-flex items-center gap-3 rounded-full px-6 py-3 font-display text-lg font-medium"
              >
                <span className="bg-brand-gradient size-1.5 rounded-full" />
                {skill}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection({
  title,
  groups,
}: {
  title: string;
  groups: SkillGroup[];
}) {
  const allSkills = groups.flatMap((group) => group.skills);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <SectionHeading
        id="skills-heading"
        eyebrow="Toolkit"
        title={title}
        description="The languages, frameworks and tools I reach for every day."
      />

      <SkillMarquee skills={allSkills} />

      <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
        {groups.map((group) => (
          <div
            key={group.category}
            data-reveal
            className="spotlight rounded-card border border-border bg-card/70 p-6 backdrop-blur transition-transform duration-500 hover:-translate-y-1"
          >
            <h3 className="flex items-center gap-2.5 font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="bg-brand-gradient size-2 rounded-full" />
              {group.category}
            </h3>
            <ul className="mt-5 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-sm font-medium transition-[color,border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
