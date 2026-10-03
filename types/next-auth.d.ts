import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }
}

/**
 * `next-auth/jwt` only re-exports `JWT`, so the interface has to be augmented
 * at its declaration site in `@auth/core/jwt` — augmenting the re-export
 * silently does nothing and leaves custom claims typed as `unknown`.
 */
declare module "@auth/core/jwt" {
  interface JWT {
    userId?: string;
  }
}