"use client";

import { motion } from "framer-motion";

export type SkillGroup = {
  category: string;
  skills: string[];
};

const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function SkillsSection({
  title,
  groups,
}: {
  title: string;
  groups: SkillGroup[];
}) {
  return (
    <motion.section
      id="skills"
      aria-labelledby="skills-heading"
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="scroll-mt-24 border-t border-border py-20 sm:py-24"
    >
      <h2
        id="skills-heading"
        className="text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </h2>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.category} className="space-y-3">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border px-3 py-1.5 text-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.section>
  );
}