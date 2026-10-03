import Link from "next/link";

import { signOutAction } from "@/app/admin/actions";
import { DashboardNav } from "@/components/admin/dashboard-nav";
import { SubmitButton } from "@/components/admin/submit-button";
import { requireAdmin } from "@/lib/dal";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/admin/dashboard">) {
  // The layout renders the admin chrome for every dashboard route, so this is
  // the single place that guarantees no unauthenticated user sees the shell.
  const user = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 pt-5">
          <div>
            <p className="text-sm font-semibold tracking-tight">Dashboard</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              View site
            </Link>
            <form action={signOutAction}>
              <SubmitButton variant="secondary">Sign out</SubmitButton>
            </form>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4">
          <DashboardNav />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}