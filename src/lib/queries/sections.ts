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

/**
 * All four section toggles in landing-page order, for the admin sections table.
 *
 * Admin-only on purpose: this returns hidden rows too, which is exactly what the
 * public renderer must never do.
 */
export async function listSections(): Promise<SectionRow[]> {
  await requireAdmin();

  const rows = await db.sectionConfig.findMany();
  const byName = new Map(rows.map((row) => [row.sectionName, row]));

  return SECTION_NAMES.flatMap((sectionName) => {
    const row = byName.get(sectionName);

    if (!row || !isSectionName(row.sectionName)) {
      return [];
    }

    return [
      {
        id: row.id,
        sectionName: row.sectionName,
        isVisible: row.isVisible,
        title: row.title,
      },
    ];
  });
}