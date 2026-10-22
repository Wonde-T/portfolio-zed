import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import { listPublicSections } from "@/lib/queries/public";

/**
 * Every public page reads the content tables, and `docker build` runs without a
 * MySQL container next to it — so the site must render per request instead of
 * being prerendered at build time. The admin actions still call `revalidatePath`
 * for the paths they touch; it is simply a no-op safety net on an always-fresh
 * render rather than the only way the data updates.
 */
export const dynamic = "force-dynamic";

/**
 * Chrome shared by the landing page and the case studies.
 *
 * The navigation is built from the *visible* sections only, so a hidden section
 * also disappears from the menu — the link would otherwise point at an anchor
 * that no longer exists.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
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