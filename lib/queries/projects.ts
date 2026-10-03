import "server-only";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  contentMarkdown: string;
  cloudinaryImageUrl: string;
  githubUrl: string | null;
  liveUrl: string | null;
  category: string;
  isVisible: boolean;
  orderIndex: number;
};

/** Manual ordering first, title as a stable tiebreaker for equal indexes. */
const ORDER_BY = [{ orderIndex: "asc" }, { title: "asc" }] as const;

export async function listProjects(): Promise<ProjectRow[]> {
  await requireAdmin();

  return db.project.findMany({ orderBy: [...ORDER_BY] });
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  await requireAdmin();

  return db.project.findUnique({ where: { id } });
}

/** Distinct categories, used to seed the category input's datalist. */
export async function listProjectCategories(): Promise<string[]> {
  await requireAdmin();

  const groups = await db.project.groupBy({
    by: ["category"],
    orderBy: { category: "asc" },
  });

  return groups.map((group) => group.category);
}

/** Index used when appending a project to the end of the gallery. */
export async function nextProjectOrderIndex(): Promise<number> {
  await requireAdmin();

  const last = await db.project.findFirst({
    orderBy: { orderIndex: "desc" },
    select: { orderIndex: true },
  });

  return (last?.orderIndex ?? -1) + 1;
}