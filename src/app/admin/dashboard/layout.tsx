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
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b border-border bg-card p-4 md:w-64 md:border-b-0 md:border-r">
        <div>
          <p className="text-sm font-semibold tracking-tight">Dashboard</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

        <DashboardNav />

        <div className="flex flex-wrap items-center gap-2 md:mt-auto md:flex-col md:items-stretch">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            View site
          </Link>
          <form action={signOutAction}>
            <SubmitButton variant="secondary" className="w-full">
              Sign out
            </SubmitButton>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}