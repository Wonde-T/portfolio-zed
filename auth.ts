import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.email("Enter a valid email address."),
  // Length is not enforced here: the stored hash decides. This only rejects
  // obviously empty submissions before touching the database.
  password: z.string().min(1, "Enter your password."),
});

/**
 * Compared against when the email does not exist, so that a missing account and
 * a wrong password take a comparable amount of time. Keeps the login form from
 * leaking which emails are registered.
 */
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO1s6hMvXrYq0hO7i4ZK5XvKxJUm8mQmVa";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
          select: { id: true, email: true, passwordHash: true },
        });

        if (!user) {
          await bcrypt.compare(password, DUMMY_HASH);
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],
});