import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <Link
          href="/admin/login"
          className="inline-flex h-11 items-center underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Owner login
        </Link>
      </div>
    </footer>
  );
}