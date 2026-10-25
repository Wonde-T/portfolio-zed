import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getPublicProject } from "@/lib/queries/public";
import { siteConfig } from "@/lib/site-config";

/** Visibility is re-read per request; see `app/(site)/layout.tsx`. */
export async function generateMetadata(
  props: PageProps<"/projects/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const project = await getPublicProject(id);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      type: "article",
      title: project.title,
      description: project.description,
      images: [{ url: project.cloudinaryImageUrl }],
    },
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  const project = await getPublicProject(id);

  // Hidden projects 404 exactly like unknown ones, so a private case study never
  // becomes reachable by guessing its URL.
  if (!project) {
    notFound();
  }

  const links = [
    project.githubUrl ? { label: "View source", href: project.githubUrl } : null,
    project.liveUrl ? { label: "Live demo", href: project.liveUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <article className="py-14 sm:py-20">
      <Link
        href="/#projects"
        className="inline-flex h-11 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to work
      </Link>

      <header className="mt-6 space-y-4">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          {project.category}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          {project.description}
        </p>

        {links.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-card border border-border">
        <Image
          src={project.cloudinaryImageUrl}
          alt=""
          fill
          priority
          sizes="(min-width: 1152px) 72rem, 100vw"
          className="object-cover"
        />
      </div>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <Markdown remarkPlugins={[remarkGfm]}>{project.contentMarkdown}</Markdown>
      </div>

      <footer className="mt-12 pt-6 text-sm text-muted-foreground">
        <Link
          href="/"
          className="inline-flex h-11 items-center underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {siteConfig.name} — back to {siteConfig.role.toLowerCase()} site
        </Link>
      </footer>
    </article>
  );
}