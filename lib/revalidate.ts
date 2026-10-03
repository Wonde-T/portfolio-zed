import "server-only";

import { revalidatePath } from "next/cache";

/**
 * Every admin mutation funnels through here.
 *
 * The public landing page and the project case studies are the only routes that
 * read content tables, so invalidating those two paths is enough to make an
 * edit visible immediately — no Redis, no webhook, no tag bookkeeping.
 *
 * `projectId` is passed by create/update/delete so the case study of a single
 * project is re-rendered too; toggling a project changes whether its detail
 * page is allowed to render at all.
 */
export function revalidatePublicSite(projectId?: string): void {
  revalidatePath("/");

  if (projectId !== undefined) {
    revalidatePath(`/projects/${projectId}`);
  }
}