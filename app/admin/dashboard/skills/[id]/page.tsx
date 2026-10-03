import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateSkillAction } from "@/app/admin/dashboard/actions";
import { SkillForm } from "@/components/admin/skill-form";
import { getSkill, listSkillCategories } from "@/lib/queries/skills";

export const metadata: Metadata = {
  title: "Edit skill",
};

export default async function EditSkillPage(
  props: PageProps<"/admin/dashboard/skills/[id]">,
) {
  const { id } = await props.params;

  const [skill, categories] = await Promise.all([
    getSkill(id),
    listSkillCategories(),
  ]);

  if (!skill) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{skill.name}</h1>
        <p className="text-sm text-muted-foreground">
          Renaming or recategorising a skill revalidates the public site.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <SkillForm
          action={updateSkillAction}
          categories={categories}
          submitLabel="Save skill"
          skill={{
            id: skill.id,
            name: skill.name,
            category: skill.category,
            isVisible: skill.isVisible,
          }}
        />
      </div>

      <Link
        href="/admin/dashboard/skills"
        className="inline-flex h-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to skills
      </Link>
    </div>
  );
}