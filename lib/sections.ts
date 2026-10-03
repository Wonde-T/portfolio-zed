/**
 * The four landing-page sections, in render order.
 *
 * `id` is the `SectionConfig.sectionName` value stored in MySQL and is also
 * the DOM id used by the nav for scrollspy.
 */
export const SECTION_NAMES = ["hero", "skills", "projects", "contact"] as const;

export type SectionName = (typeof SECTION_NAMES)[number];

export function isSectionName(value: string): value is SectionName {
  return (SECTION_NAMES as readonly string[]).includes(value);
}