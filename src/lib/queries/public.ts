import "server-only";

import { cache } from "react";

import { db } from "@/lib/db";
import {
  SECTION_LABELS,
  SECTION_NAMES,
  type SectionName,
} from "@/lib/sections";

/**
 * Public reads for the landing page and the case studies.
 *
 * Every query filters `is_visible` in SQL rather than in JavaScript: a hidden
 * project must never be read, never be serialised into the RSC payload and never
 * reach the browser. That is the server-side gatekeeping the spec asks for.
 *
 * None of these call `requireAdmin` — they are the anonymous surface.
 */

export type PublicSection = {
  sectionName: SectionName;
  /** Heading override from the dashboard, falling back to the built-in label. */
  title: string;
};

/** Visible sections in landing-page order, with their resolved headings. */
export const listPublicSections = cache(async (): Promise<PublicSection[]> => {
  const rows = await db.sectionConfig.findMany({
    where: { isVisible: true },
    select: { sectionName: true, title: true },
  });

  const byName = new Map(rows.map((row) => [row.sectionName, row.title]));

  return SECTION_NAMES.flatMap((sectionName) =>
    byName.has(sectionName)
      ? [
          {
            sectionName,
            title: byName.get(sectionName) ?? SECTION_LABELS[sectionName],
          },
        ]
      : [],
  );
});

export type PublicProject = {
  id: string;
  title: string;
  description: string;
  contentMarkdown: string;
  cloudinaryImageUrl: string;
  githubUrl: string | null;
  liveUrl: string | null;
  category: string;
  orderIndex: number;
};

/** Gallery card fields only — the case study body stays on the detail page. */
export type PublicProjectSummary = Omit<PublicProject, "contentMarkdown">;

const SUMMARY_SELECT = {
  id: true,
  title: true,
  description: true,
  cloudinaryImageUrl: true,
  githubUrl: true,
  liveUrl: true,
  category: true,
  orderIndex: true,
} as const;

/** Manual ordering first, title as a stable tiebreaker for equal indexes. */
const ORDER_BY = [{ orderIndex: "asc" }, { title: "asc" }] as const;

export const listPublicProjects = cache(
  async (): Promise<PublicProjectSummary[]> =>
    db.project.findMany({
      where: { isVisible: true },
      orderBy: [...ORDER_BY],
      select: { ...SUMMARY_SELECT },
    }),
);

/** `null` for unknown *and* hidden ids, so a hidden project 404s like a missing one. */
export const getPublicProject = cache(
  async (id: string): Promise<PublicProject | null> =>
    db.project.findFirst({
      where: { id, isVisible: true },
    }),
);

export type PublicSkill = {
  id: string;
  name: string;
  category: string;
};

export const listPublicSkills = cache(async (): Promise<PublicSkill[]> =>
  db.skill.findMany({
    where: { isVisible: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    select: { id: true, name: true, category: true },
  }),
);