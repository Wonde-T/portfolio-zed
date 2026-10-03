import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProjectAction } from "@/app/admin/dashboard/actions";
import { ProjectForm } from "@/components/admin/project-form";
import { getProject, listProjectCategories } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Edit project",
};

export default async function EditProjectPage(
  props: PageProps<"/admin/dashboard/projects/[id]">,
) {
  const { id } = await props.params;

  // Both queries authorise on their own; the session check is memoised, so this
  // is still a single Auth.js round trip.
  const [project, categories] = await Promise.all([
    getProject(id),
    listProjectCategories(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{project.title}</h1>
        <p className="text-sm text-muted-foreground">
          Saving revalidates the gallery and this project&apos;s case study.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <ProjectForm
          action={updateProjectAction}
          categories={categories}
          submitLabel="Save project"
          project={{
            id: project.id,
            title: project.title,
            category: project.category,
            description: project.description,
            contentMarkdown: project.contentMarkdown,
            cloudinaryImageUrl: project.cloudinaryImageUrl,
            githubUrl: project.githubUrl ?? "",
            liveUrl: project.liveUrl ?? "",
            isVisible: project.isVisible,
          }}
        />
      </div>

      <Link
        href="/admin/dashboard/projects"
        className="inline-flex h-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Back to projects
      </Link>
    </div>
  );
}