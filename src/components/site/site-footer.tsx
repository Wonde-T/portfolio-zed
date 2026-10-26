import Link from "next/link";

import { Reveal } from "@/components/site/reveal";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="relative mt-10 pb-10 pt-6">
      <div
        aria-hidden
        className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <Reveal
        start="top 98%"
        stagger={0.1}
        y={20}
        className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <p data-reveal className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="bg-brand-gradient inline-flex size-6 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground"
          >
            P
          </span>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <Link
          data-reveal
          href="/admin/login"
          className="inline-flex h-11 items-center underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Owner login
        </Link>
      </Reveal>
    </footer>
  );
}
