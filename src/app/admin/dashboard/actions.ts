"use server";

import { redirect } from "next/navigation";

import {
  errorState,
  invalidState,
  successState,
  type ActionState,
} from "@/lib/action-state";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { Prisma } from "@/lib/generated/prisma/client";
import { nextProjectOrderIndex } from "@/lib/queries/projects";
import { revalidatePublicSite } from "@/lib/revalidate";
import { isSectionName } from "@/lib/sections";
import {
  projectInput,
  projectSchema,
  sectionSchema,
  skillInput,
  skillSchema,
  text,
  toOptionalUrl,
} from "@/lib/validations";

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

// --- Sections --------------------------------------------------------------

export async function saveSectionAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = sectionSchema.safeParse({
    sectionName: text(formData, "sectionName"),
    title: text(formData, "title"),
  });

  if (!parsed.success) {
    return invalidState(parsed.error);
  }

  const { sectionName, title } = parsed.data;

  if (!isSectionName(sectionName)) {
    return errorState("Unknown section.");
  }

  await db.sectionConfig.update({
    where: { sectionName },
    data: { title: title === "" ? null : title },
  });

  revalidatePublicSite();

  return successState("Heading saved.");
}

/** Flips the flag server-side so a stale button can never write a stale value. */
export async function toggleSectionAction(
  sectionName: string,
): Promise<void> {
  await requireAdmin();

  if (!isSectionName(sectionName)) {
    return;
  }

  const section = await db.sectionConfig.findUnique({
    where: { sectionName },
    select: { isVisible: true },
  });

  if (!section) {
    return;
  }

  await db.sectionConfig.update({
    where: { sectionName },
    data: { isVisible: !section.isVisible },
  });

  revalidatePublicSite();
}

// --- Projects --------------------------------------------------------------

export async function createProjectAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = projectSchema.safeParse(projectInput(formData));

  if (!parsed.success) {
    return invalidState(parsed.error);
  }

  const project = parsed.data;

  await db.project.create({
    data: {
      title: project.title,
      category: project.category,
      description: project.description,
      contentMarkdown: project.contentMarkdown,
      cloudinaryImageUrl: project.cloudinaryImageUrl,
      githubUrl: toOptionalUrl(project.githubUrl),
      liveUrl: toOptionalUrl(project.liveUrl),
      isVisible: project.isVisible,
      // New projects always land at the end of the gallery; the reorder buttons
      // are the only way to place them, which keeps indexes unique.
      orderIndex: await nextProjectOrderIndex(),
    },
  });

  revalidatePublicSite();
  redirect("/admin/dashboard/projects");
}

export async function updateProjectAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const parsed = projectSchema.safeParse(projectInput(formData));

  if (!parsed.success) {
    return invalidState(parsed.error);
  }

  const existing = await db.project.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return errorState("That project no longer exists.");
  }

  const project = parsed.data;

  await db.project.update({
    where: { id },
    data: {
      title: project.title,
      category: project.category,
      description: project.description,
      contentMarkdown: project.contentMarkdown,
      cloudinaryImageUrl: project.cloudinaryImageUrl,
      githubUrl: toOptionalUrl(project.githubUrl),
      liveUrl: toOptionalUrl(project.liveUrl),
      isVisible: project.isVisible,
    },
  });

  revalidatePublicSite(existing.id);

  return successState("Project saved.");
}

export async function deleteProjectAction(projectId: string): Promise<void> {
  await requireAdmin();

  // `deleteMany` instead of `delete` so a double submit cannot throw.
  await db.project.deleteMany({ where: { id: projectId } });

  revalidatePublicSite(projectId);
  redirect("/admin/dashboard/projects");
}

export async function toggleProjectAction(projectId: string): Promise<void> {
  await requireAdmin();

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { isVisible: true },
  });

  if (!project) {
    return;
  }

  await db.project.update({
    where: { id: projectId },
    data: { isVisible: !project.isVisible },
  });

  revalidatePublicSite(projectId);
}

/**
 * Swaps `order_index` with the neighbouring project. Indexes are not renumbered,
 * so positions stay stable as items are added and removed.
 */
export async function moveProjectAction(
  projectId: string,
  direction: "up" | "down",
): Promise<void> {
  await requireAdmin();

  const projects = await db.project.findMany({
    orderBy: [{ orderIndex: "asc" }, { title: "asc" }],
    select: { id: true, orderIndex: true },
  });

  const index = projects.findIndex((project) => project.id === projectId);
  const target = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || target < 0 || target >= projects.length) {
    return;
  }

  const current = projects[index];
  const neighbour = projects[target];

  await db.$transaction([
    db.project.update({
      where: { id: current.id },
      data: { orderIndex: neighbour.orderIndex },
    }),
    db.project.update({
      where: { id: neighbour.id },
      data: { orderIndex: current.orderIndex },
    }),
  ]);

  revalidatePublicSite();
}

// --- Skills ----------------------------------------------------------------

export async function createSkillAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = skillSchema.safeParse(skillInput(formData));

  if (!parsed.success) {
    return invalidState(parsed.error);
  }

  const skill = parsed.data;

  try {
    await db.skill.create({
      data: {
        name: skill.name,
        category: skill.category,
        isVisible: skill.isVisible,
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return errorState(`${skill.name} is already listed under ${skill.category}.`, {
        name: ["This skill already exists in that category."],
      });
    }

    throw error;
  }

  revalidatePublicSite();

  return successState(`${skill.name} added.`);
}

export async function updateSkillAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = text(formData, "id");
  const parsed = skillSchema.safeParse(skillInput(formData));

  if (!parsed.success) {
    return invalidState(parsed.error);
  }

  const existing = await db.skill.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return errorState("That skill no longer exists.");
  }

  const skill = parsed.data;

  try {
    await db.skill.update({
      where: { id },
      data: {
        name: skill.name,
        category: skill.category,
        isVisible: skill.isVisible,
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return errorState(`${skill.name} is already listed under ${skill.category}.`, {
        name: ["This skill already exists in that category."],
      });
    }

    throw error;
  }

  revalidatePublicSite();

  return successState("Skill saved.");
}

export async function deleteSkillAction(skillId: string): Promise<void> {
  await requireAdmin();

  await db.skill.deleteMany({ where: { id: skillId } });

  revalidatePublicSite();
  redirect("/admin/dashboard/skills");
}

export async function toggleSkillAction(skillId: string): Promise<void> {
  await requireAdmin();

  const skill = await db.skill.findUnique({
    where: { id: skillId },
    select: { isVisible: true },
  });

  if (!skill) {
    return;
  }

  await db.skill.update({
    where: { id: skillId },
    data: { isVisible: !skill.isVisible },
  });

  revalidatePublicSite();
}