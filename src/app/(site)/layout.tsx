import { ReactNode } from "react";

import { SiteEffects } from "@/components/site/site-effects";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { listPublicSections } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const sections = await listPublicSections();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden">
      <SiteEffects />
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
