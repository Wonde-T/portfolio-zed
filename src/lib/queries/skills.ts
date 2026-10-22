import "server-only";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";

export type SkillRow = {
  id: string;
  name: string;
  category: string;
  isVisible: boolean;
};

export async function listSkills(): Promise<SkillRow[]> {
  await requireAdmin();

  return db.skill.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

export async function getSkill(id: string): Promise<SkillRow | null> {
  await requireAdmin();

  return db.skill.findUnique({ where: { id } });
}

/** Distinct categories, used to seed the category input's datalist. */
export async function listSkillCategories(): Promise<string[]> {
  await requireAdmin();

  const groups = await db.skill.groupBy({
    by: ["category"],
    orderBy: { category: "asc" },
  });

  return groups.map((group) => group.category);
}