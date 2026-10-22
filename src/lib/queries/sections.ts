import "server-only";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { isSectionName, SECTION_NAMES, type SectionName } from "@/lib/sections";

export type SectionRow = {
  id: string;
  sectionName: SectionName;
  isVisible: boolean;
  title: string | null;
};

export async function listSections(): Promise<SectionRow[]> {
  await requireAdmin();

  const rows = await db.sectionConfig.findMany();
  const byName = new Map(rows.map((row) => [row.sectionName, row]));

  const results: SectionRow[] = [];

  for (const sectionName of SECTION_NAMES) {
    if (!isSectionName(sectionName)) {
      continue;
    }

    const existing = byName.get(sectionName);

    if (existing) {
      results.push({
        id: existing.id,
        sectionName: existing.sectionName as SectionName,
        isVisible: existing.isVisible,
        title: existing.title,
      });
    } else {
      const created = await db.sectionConfig.upsert({
        where: { sectionName },
        update: {},
        create: {
          sectionName,
          isVisible: true,
          title: null,
        },
        select: {
          id: true,
          sectionName: true,
          isVisible: true,
          title: true,
        },
      });

      results.push({
        id: created.id,
        sectionName: created.sectionName as SectionName,
        isVisible: created.isVisible,
        title: created.title,
      });
    }
  }

  return results;
}
