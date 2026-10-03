import type { Metadata } from "next";
import Link from "next/link";

import {
  createSkillAction,
  deleteSkillAction,
  toggleSkillAction,
} from "@/app/admin/dashboard/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { SkillForm } from "@/components/admin/skill-form";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { listSkills, listSkillCategories } from "@/lib/queries/skills";

export const metadata: Metadata = {
  title: "Skills",
};

export default async function SkillsPage() {
  const [skills, categories] = await Promise.all([
    listSkills(),
    listSkillCategories(),
  ]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
        <p className="text-sm text-muted-foreground">
          {skills.length} in the database,{" "}
          {skills.filter((skill) => skill.isVisible).length} visible. Names are
          unique per category.
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-tight">Add a skill</h2>
        <SkillForm
          action={createSkillAction}
          categories={categories}
          submitLabel="Add skill"
        />
      </section>

      <section className="rounded-xl border border-border bg-card px-5">
        <ul>
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{skill.name}</p>
                <p className="text-xs text-muted-foreground">
                  {skill.category}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <VisibilityToggle
                  checked={skill.isVisible}
                  label={skill.name}
                  action={toggleSkillAction.bind(null, skill.id)}
                />

                <Link
                  href={`/admin/dashboard/skills/${skill.id}`}
                  className="inline-flex h-11 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Edit
                </Link>

                <DeleteButton
                  label="Delete"
                  confirmation={`Delete "${skill.name}"?`}
                  action={deleteSkillAction.bind(null, skill.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}