import { Hero } from "@/components/site/hero";
import { ProjectsSection } from "@/components/site/projects-section";
import { SkillsSection } from "@/components/site/skills-section";
import { ContactSection } from "@/components/site/contact-section";
import {
  listPublicProjects,
  listPublicSections,
  listPublicSkills,
} from "@/lib/queries/public";
import { getHomeContent } from "@/lib/queries/home";
import { siteConfig } from "@/lib/site-config";
import type { SkillGroup } from "@/components/site/skills-section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, projects, skills, home] = await Promise.all([
    listPublicSections(),
    listPublicProjects(),
    listPublicSkills(),
    getHomeContent(),
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
          greeting={home.greeting}
          name={home.name}
          role={home.role}
          bio={home.bio}
          availability={home.availability}
          location={home.location}
          photoUrl={home.photoUrl}
          hasProjects={visible.has("projects")}
          hasContact={visible.has("contact")}
          email={home.email}
        />
      ) : null}

      {visible.has("services") ? (
        <section
          id="services"
          aria-labelledby="services-heading"
          className="scroll-mt-24 border-t border-border py-20 sm:py-24"
        >
          <h2
            id="services-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {titleOf("services")}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Web Development",
                description:
                  "Responsive, accessible, and performant web apps built with Next.js and TypeScript.",
                features: ["Frontend & Backend", "REST/GraphQL APIs", "Database Design"],
              },
              {
                title: "UI/UX Implementation",
                description:
                  "Pixel-perfect interfaces with smooth animations and thoughtful user experiences.",
                features: ["Component Systems", "Tailwind CSS", "Framer Motion"],
              },
              {
                title: "Technical Consulting",
                description:
                  "Architecture reviews, performance optimization, and best practices guidance.",
                features: ["Code Reviews", "Scalable Architecture", "DevOps Basics"],
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {visible.has("projects") && projects.length > 0 ? (
        <ProjectsSection title={titleOf("projects")} projects={projects} />
      ) : null}

      {visible.has("skills") && groups.length > 0 ? (
        <SkillsSection title={titleOf("skills")} groups={groups} />
      ) : null}

      {visible.has("about") ? (
        <section
          id="about"
          aria-labelledby="about-heading"
          className="scroll-mt-24 border-t border-border py-20 sm:py-24"
        >
          <h2
            id="about-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {titleOf("about")}
          </h2>
          <div className="mt-6 max-w-3xl space-y-4 text-muted-foreground sm:text-lg">
            <p>
              I design and build clean, accessible, and performant web applications. With a focus on
              modern tooling and solid engineering practices, I turn ideas into reliable digital
              experiences.
            </p>
            <p>
              Passionate about creating maintainable codebases, thoughtful UI, and scalable
              solutions. Always learning and improving.
            </p>
          </div>
        </section>
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
