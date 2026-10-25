import { ReactNode } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { listPublicSections } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const sections = await listPublicSections();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[120px] dark:bg-primary/10" />
        <div className="absolute -right-60 top-1/4 h-[32rem] w-[32rem] rounded-full bg-accent/40 blur-[140px] dark:bg-accent/20" />
        <div className="absolute bottom-[-20rem] left-1/3 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-[160px] dark:bg-primary/8" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12),transparent_60%)]" />
      </div>
      <SiteHeader
        items={sections.map((section) => ({
          id: section.sectionName,
          label: section.title,
        }))}
      />

      <main id="top" className="relative mx-auto w-full max-w-6xl flex-1 px-4 pt-16 sm:px-6 sm:pt-20">
        {children}
      </main>

      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
