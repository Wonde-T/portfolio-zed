import type { Metadata } from "next";
import Link from "next/link";

import { createProjectAction } from "@/app/admin/dashboard/actions";
import { ProjectForm } from "@/components/admin/project-form";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { listProjectCategories } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "New project",
};

export default async function NewProjectPage() {
  const categories = await listProjectCategories();

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          New projects are appended to the end of the gallery; use the arrow
          buttons on the projects list to reposition them.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <ProjectForm
          action={createProjectAction}
          categories={categories}
          submitLabel="Create project"
          cloudinaryConfigured={isCloudinaryConfigured()}
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