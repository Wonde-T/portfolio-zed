import type { Metadata } from "next";

import { toggleSectionAction } from "@/app/admin/dashboard/actions";
import { SectionRow } from "@/components/admin/section-row";
import { listSections } from "@/lib/queries/sections";

export const metadata: Metadata = {
  title: "Sections",
};

export default async function SectionsPage() {
  const sections = await listSections();

  return (
    <div className="space-y-10">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sections</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          Visibility is resolved on the server before the page is rendered, so a
          hidden section is never serialised into the HTML the browser
          receives. Every change here revalidates the public site immediately.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card px-5">
        <ul>
          {sections.map((section) => (
            <SectionRow
              key={section.id}
              sectionName={section.sectionName}
              title={section.title}
              isVisible={section.isVisible}
              toggleAction={toggleSectionAction.bind(
                null,
                section.sectionName,
              )}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}