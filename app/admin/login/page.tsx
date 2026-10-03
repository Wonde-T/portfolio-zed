import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/admin/login/login-form";
import { auth } from "@/auth";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {siteConfig.name}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage projects, skills and section visibility.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}