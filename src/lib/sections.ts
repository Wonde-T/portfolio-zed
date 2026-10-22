/**
 * Landing-page sections, in render order.
 *
 * `id` is the `SectionConfig.sectionName` value stored in DB and is also
 * the DOM id used by the nav for scrollspy.
 */
export const SECTION_NAMES = [
  "hero",
  "services",
  "projects",
  "skills",
  "about",
  "contact",
] as const;

export type SectionName = (typeof SECTION_NAMES)[number];

export const SECTION_LABELS: Record<SectionName, string> = {
  hero: "Home",
  services: "My Services",
  projects: "Projects",
  skills: "Skills",
  about: "About",
  contact: "Contact",
};

export function isSectionName(value: string): value is SectionName {
  return (SECTION_NAMES as readonly string[]).includes(value);
}
