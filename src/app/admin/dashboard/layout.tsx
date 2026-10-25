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
    <div className="min-h-dvh">
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:pl-72">
        <div className="md:hidden">
          <p className="text-sm font-semibold tracking-tight">Dashboard</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View site
          </Link>
          <form action={signOutAction}>
            <SubmitButton
              variant="secondary"
              className="inline-flex h-9 items-center gap-2 px-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </SubmitButton>
          </form>
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-14 items-center px-4">
          <div>
            <p className="text-sm font-semibold tracking-tight">Dashboard</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <DashboardNav />
        </div>
      </aside>

      <main className="pt-14 md:pl-64">
        <div className="px-4 py-8 md:px-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </div>
      </main>
    </div>
  );
}