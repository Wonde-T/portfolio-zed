import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Reveal } from "@/components/site/reveal";
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
      <Reveal start="top 100%" y={20}>
        <Link
          data-reveal
          href="/#projects"
          className="group inline-flex h-11 items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Back to work
        </Link>
      </Reveal>

      <Reveal as="header" start="top 100%" stagger={0.12} className="mt-6 space-y-5">
        <p
          data-reveal
          className="text-sm font-semibold uppercase tracking-[0.22em] text-primary"
        >
          {project.category}
        </p>
        <h1
          data-reveal
          className="text-gradient animate-gradient-pan font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {project.title}
        </h1>
        <p data-reveal className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {links.length > 0 ? (
          <div data-reveal className="flex flex-wrap gap-3">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={
                  index === 0
                    ? "bg-brand-gradient inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
                    : "glass inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </Reveal>

      <Reveal start="top 95%" y={48} className="mt-10">
        <div
          data-reveal
          className="relative aspect-[16/9] w-full overflow-hidden rounded-card border border-border shadow-2xl shadow-primary/10"
        >
          <Image
            src={project.cloudinaryImageUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      <Reveal start="top 90%" y={32} className="mt-12">
        <div
          data-reveal
          className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary"
        >
          <Markdown remarkPlugins={[remarkGfm]}>{project.contentMarkdown}</Markdown>
        </div>
      </Reveal>

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