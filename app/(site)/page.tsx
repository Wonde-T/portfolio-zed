import { ContactSection } from "@/components/site/contact-section";
import { Hero } from "@/components/site/hero";
import { ProjectsSection } from "@/components/site/projects-section";
import { SkillsSection } from "@/components/site/skills-section";
import {
  listPublicProjects,
  listPublicSections,
  listPublicSkills,
} from "@/lib/queries/public";
import { siteConfig } from "@/lib/site-config";
import type { SkillGroup } from "@/components/site/skills-section";

/**
 * Public landing page.
 *
 * Each block renders only when its section is enabled in the dashboard, and the
 * projects/skills queries already exclude hidden rows, so a disabled feature is
 * absent from the HTML rather than merely hidden with CSS.
 */
export default async function HomePage() {
  const [sections, projects, skills] = await Promise.all([
    listPublicSections(),
    listPublicProjects(),
    listPublicSkills(),
  ]);

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
  ).map(
    ([category, names]): SkillGroup => ({ category, skills: names }),
  );

  return (
    <>
      {visible.has("hero") ? (
        <Hero
          greeting={siteConfig.greeting}
          name={siteConfig.name}
          role={siteConfig.role}
          bio={siteConfig.bio}
          availability={siteConfig.availability}
          location={siteConfig.location}
          hasProjects={visible.has("projects")}
          hasContact={visible.has("contact")}
          email={siteConfig.email}
        />
      ) : null}

      {visible.has("skills") && groups.length > 0 ? (
        <SkillsSection title={titleOf("skills")} groups={groups} />
      ) : null}

      {visible.has("projects") && projects.length > 0 ? (
        <ProjectsSection title={titleOf("projects")} projects={projects} />
      ) : null}

      {visible.has("contact") ? (
        <ContactSection
          title={titleOf("contact")}
          email={siteConfig.email}
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