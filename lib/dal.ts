import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

/**
 * Authoritative session check. `proxy.ts` only reads the cookie, so any server
 * component, server action, or data read touching admin data must call this
 * (directly or via `requireAdmin`) instead of trusting the route gate.
 *
 * Memoized per request, so repeated calls in one render pass hit Auth.js once.
 */
export const verifySession = cache(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  return session;
});

export const requireAdmin = cache(async () => {
  const session = await verifySession();

  return session.user;
});