import { z } from "zod";

import { SECTION_NAMES } from "@/lib/sections";

/**
 * FormData readers.
 *
 * Every input in the dashboard is text, number or checkbox, so anything else
 * (a `File`, an absent field) is normalised here instead of at every call site.
 */
export function text(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

/** Unchecked checkboxes are absent from `FormData` entirely. */
export function checkbox(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

const optionalUrl = z.union([
  z.literal(""),
  z.url("Enter a full URL starting with https://, or leave this empty."),
]);

/**
 * Covers always come from Cloudinary, and `next.config.ts` only allows that host
 * in `images.remotePatterns` — rejecting anything else here turns a broken
 * `<Image>` render into a field error the owner can actually fix.
 */
const cloudinaryImageUrl = z
  .url("Enter the Cloudinary URL of the cover image.")
  .max(1024)
  .refine(
    (value) => new URL(value).hostname === "res.cloudinary.com",
    "Cover images must be hosted on Cloudinary (res.cloudinary.com).",
  );

/**
 * `is_visible` can only be false if its parent section is visible too, but the
 * database has no such constraint — the public page simply hides the whole
 * block, so a hidden project inside a hidden section is harmless.
 */
export const sectionSchema = z.object({
  sectionName: z.enum(SECTION_NAMES),
  // Empty means "keep the built-in heading".
  title: z.string().trim().max(191, "Keep the heading under 191 characters."),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "A title is required.").max(191),
  category: z.string().trim().min(1, "A category is required.").max(64),
  description: z
    .string()
    .trim()
    .min(1, "A one-line summary is required.")
    .max(280, "Keep the summary under 280 characters."),
  contentMarkdown: z
    .string()
    .trim()
    .min(1, "The case study body cannot be empty."),
  cloudinaryImageUrl,
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  isVisible: z.boolean(),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1, "A name is required.").max(191),
  category: z.string().trim().min(1, "A category is required.").max(64),
  isVisible: z.boolean(),
});

export function projectInput(formData: FormData) {
  return {
    title: text(formData, "title"),
    category: text(formData, "category"),
    description: text(formData, "description"),
    contentMarkdown: text(formData, "contentMarkdown"),
    cloudinaryImageUrl: text(formData, "cloudinaryImageUrl"),
    githubUrl: text(formData, "githubUrl").trim(),
    liveUrl: text(formData, "liveUrl").trim(),
    isVisible: checkbox(formData, "isVisible"),
  };
}

export function skillInput(formData: FormData) {
  return {
    name: text(formData, "name"),
    category: text(formData, "category"),
    isVisible: checkbox(formData, "isVisible"),
  };
}

/** `""` from an empty optional input is stored as SQL NULL, not "". */
export function toOptionalUrl(value: string): string | null {
  return value === "" ? null : value;
}