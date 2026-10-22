import { ReactNode } from "react";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { listPublicSections } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const sections = await listPublicSections();

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        items={sections.map((section) => ({
          id: section.sectionName,
          label: section.title,
        }))}
      />

      <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        {children}
      </main>

      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
