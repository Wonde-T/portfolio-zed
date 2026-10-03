"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });

    // Unreachable: `signIn` throws a redirect on success.
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Incorrect email or password." };
        case "CallbackRouteError":
          return { error: "Unable to sign in right now. Please try again." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }

    // Re-throws the redirect thrown by a successful `signIn`.
    throw error;
  }
}