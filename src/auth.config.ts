import type { NextAuthConfig } from "next-auth";

/**
 * Provider-free Auth.js configuration.
 *
 * Kept separate from `src/auth.ts` so `src/proxy.ts` can verify the session cookie
 * without importing Prisma or the bcrypt-backed credentials provider. Proxy
 * runs on every matched request, so it stays as light as possible and only
 * performs optimistic cookie checks.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    // The owner stays logged in for a day; the token refreshes hourly while in
    // use. Lower these if you prefer the dashboard to lock itself sooner.
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60,
  },
  callbacks: {
    /**
     * Optimistic gate. Runs in `proxy` from the JWT cookie only — never from
     * the database. Real authorization happens in `verifySession()`.
     */
    authorized({ auth, request }) {
      const isProtected = request.nextUrl.pathname.startsWith(
        "/admin/dashboard",
      );

      if (isProtected) {
        return Boolean(auth?.user);
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId;
      }

      if (token.email) {
        session.user.email = token.email;
      }

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;