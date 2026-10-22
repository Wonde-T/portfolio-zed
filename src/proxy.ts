import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

/**
 * Optimistic, cookie-only gate for the admin area. The authoritative check is
 * `verifySession()` in `lib/dal.ts`, which every admin data read must call.
 */
export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};