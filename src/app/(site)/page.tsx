import { Suspense } from "react";
import { Hero } from "@/components/site/hero";
import { ProjectsSection } from "@/components/site/projects-section";
import { SkillsSection } from "@/components/site/skills-section";
import { ContactSection } from "@/components/site/contact-section";
import { ServicesSection as ServicesSectionView } from "@/components/site/services-section";
import { AboutSection } from "@/components/site/about-section";
import {
  listPublicProjects,
  listPublicSections,
  listPublicSkills,
} from "@/lib/queries/public";
import { getHomeContent } from "@/lib/queries/home";
import { siteConfig } from "@/lib/site-config";
import type { SkillGroup } from "@/components/site/skills-section";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

function HeroSkeleton() {
  return (
    <section className="scroll-mt-24 py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,32rem)_auto] lg:justify-center lg:gap-12">
        <div className="order-2 lg:order-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-12 w-3/4 sm:h-14 lg:h-16" />
          <Skeleton className="mt-3 h-6 w-1/2" />
          <Skeleton className="mt-6 h-4 w-full max-w-prose" />
          <Skeleton className="mt-2 h-4 w-5/6 max-w-prose" />
          <Skeleton className="mt-2 h-4 w-4/6 max-w-prose" />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Skeleton className="h-11 w-32 rounded-lg" />
            <Skeleton className="h-11 w-28 rounded-lg" />
          </div>
        </div>
        <div className="order-1 flex justify-center lg:order-2">
          <div className="relative aspect-square w-52 sm:w-64 lg:w-72">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSkeleton() {
  return (
    <section className="scroll-mt-24 py-20 sm:py-24">
      <Skeleton className="h-8 w-48 sm:h-9" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSkeleton() {
  return (
    <section className="scroll-mt-24 py-20 sm:py-24">
      <Skeleton className="h-8 w-40 sm:h-9" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <Skeleton className="h-6 w-32" />
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

async function HeroSection() {
  const [sections, home] = await Promise.all([listPublicSections(), getHomeContent()]);
  const visible = new Set(sections.map((section) => section.sectionName));
  if (!visible.has("hero")) return null;

  return (
    <Hero
      greeting={home.greeting}
      name={home.name}
      role={home.role}
      bio={home.bio}
      availability={home.availability}
      photoUrl={home.photoUrl}
      hasProjects={visible.has("projects")}
      hasContact={visible.has("contact")}
      email={home.email}
    />
  );
}

async function ServicesSection() {
  const [sections] = await Promise.all([listPublicSections()]);
  const visible = new Set(sections.map((section) => section.sectionName));
  const titleOf = (name: (typeof sections)[number]["sectionName"]) =>
    sections.find((section) => section.sectionName === name)?.title ?? "";

  if (!visible.has("services")) return null;

  return <ServicesSectionView title={titleOf("services")} />;
}

async function ProjectsSectionAsync() {
  const [sections, projects] = await Promise.all([listPublicSections(), listPublicProjects()]);
  const visible = new Set(sections.map((section) => section.sectionName));
  const titleOf = (name: (typeof sections)[number]["sectionName"]) =>
    sections.find((section) => section.sectionName === name)?.title ?? "";

  if (!visible.has("projects") || projects.length === 0) return null;
  return <ProjectsSection title={titleOf("projects")} projects={projects} />;
}

async function SkillsSectionAsync() {
  const [sections, skills] = await Promise.all([listPublicSections(), listPublicSkills()]);
  const visible = new Set(sections.map((section) => section.sectionName));
  const titleOf = (name: (typeof sections)[number]["sectionName"]) =>
    sections.find((section) => section.sectionName === name)?.title ?? "";

  const groups = Array.from(
    skills.reduce((byCategory, skill) => {
      const group = byCategory.get(skill.category) ?? [];
      group.push(skill.name);
      byCategory.set(skill.category, group);
      return byCategory;
    }, new Map<string, string[]>()),
  ).map(([category, names]): SkillGroup => ({ category, skills: names }));

  if (!visible.has("skills") || groups.length === 0) return null;
  return <SkillsSection title={titleOf("skills")} groups={groups} />;
}

async function OtherSections() {
  const [sections, home] = await Promise.all([listPublicSections(), getHomeContent()]);
  const visible = new Set(sections.map((section) => section.sectionName));
  const titleOf = (name: (typeof sections)[number]["sectionName"]) =>
    sections.find((section) => section.sectionName === name)?.title ?? "";

  return (
    <>
      {visible.has("about") ? (
        <AboutSection
          title={titleOf("about")}
          text="I design and build full-stack products end to end — from relational data models and server APIs to polished, animated interfaces. I care about performance, accessibility and code that the next person can maintain."
        />
      ) : null}

      {visible.has("contact") ? (
        <ContactSection
          title={titleOf("contact")}
          email={home.email}
          socials={siteConfig.socials}
        />
      ) : null}

      {sections.length === 0 ? (
        <p className="py-24 text-center text-sm text-muted-foreground">
          Every section is currently hidden in the dashboard.
        </p>
      ) : null}
    </>
  );
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSectionAsync />
      </Suspense>

      <Suspense fallback={<SkillsSkeleton />}>
        <SkillsSectionAsync />
      </Suspense>

      <Suspense fallback={null}>
        <OtherSections />
      </Suspense>
    </>
  );
}
