import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  deleteProjectAction,
  moveProjectAction,
  toggleProjectAction,
} from "@/app/admin/dashboard/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { listProjects } from "@/lib/queries/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projects.length} in the database,{" "}
            {projects.filter((project) => project.isVisible).length} visible.
            Hidden projects are never queried by the public gallery.
          </p>
        </div>

        <Link
          href="/admin/dashboard/projects/new"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          New project
        </Link>
      </header>

      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
          No projects yet. Create one to fill the gallery.
        </p>
      ) : (
        <ul className="rounded-xl border border-border bg-card px-5">
          {projects.map((project, index) => (
            <li
              key={project.id}
              className="grid gap-4 border-b border-border py-5 last:border-b-0 md:grid-cols-[7rem_1fr_auto] md:items-center"
            >
              <div className="flex items-center gap-3 md:block">
                <Image
                  src={project.cloudinaryImageUrl}
                  alt=""
                  width={112}
                  height={80}
                  className="h-20 w-28 shrink-0 rounded-lg border border-border object-cover"
                />
                <p className="text-xs text-muted-foreground md:mt-2">
                  #{index + 1}
                </p>
              </div>

              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium">
                  {project.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {project.category}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1 md:justify-end">
                <form action={moveProjectAction.bind(null, project.id, "up")}>
                  <SubmitButton
                    variant="ghost"
                    pendingLabel="…"
                    className="h-11 w-11 px-0"
                  >
                    <span aria-hidden="true">↑</span>
                    <span className="sr-only">
                      Move {project.title} up
                    </span>
                  </SubmitButton>
                </form>

                <form action={moveProjectAction.bind(null, project.id, "down")}>
                  <SubmitButton
                    variant="ghost"
                    pendingLabel="…"
                    className="h-11 w-11 px-0"
                  >
                    <span aria-hidden="true">↓</span>
                    <span className="sr-only">
                      Move {project.title} down
                    </span>
                  </SubmitButton>
                </form>

                <VisibilityToggle
                  checked={project.isVisible}
                  label={project.title}
                  action={toggleProjectAction.bind(null, project.id)}
                />

                <Link
                  href={`/admin/dashboard/projects/${project.id}`}
                  className="inline-flex h-11 items-center justify-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Edit
                </Link>

                <DeleteButton
                  label="Delete"
                  confirmation={`Delete "${project.title}"? This cannot be undone.`}
                  action={deleteProjectAction.bind(null, project.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}