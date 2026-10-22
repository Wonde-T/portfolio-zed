"use server";

import {
  invalidState,
  successState,
  type ActionState,
} from "@/lib/action-state";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/dal";
import { revalidatePublicSite } from "@/lib/revalidate";
import { homeInput, homeSchema } from "@/lib/validations-home";

export async function saveHomeContentAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = homeSchema.safeParse(homeInput(formData));

  if (!parsed.success) {
    return invalidState(parsed.error);
  }

  const data = parsed.data;
  const payload = {
    ...data,
    photoUrl: data.photoUrl === "" ? null : data.photoUrl,
  };

  const existing = await db.homeContent.findFirst({
    select: { id: true },
  });

  if (existing) {
    await db.homeContent.update({
      where: { id: existing.id },
      data: payload,
    });
  } else {
    await db.homeContent.create({ data: payload });
  }

  revalidatePublicSite();

  return successState("Home content saved.");
}
