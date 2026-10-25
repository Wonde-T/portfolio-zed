import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <div className="animate-fade-in">
      {/* Hero skeleton */}
      <section className="scroll-mt-24 py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="order-2 lg:order-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-12 w-3/4 sm:h-14 lg:h-16" />
            <Skeleton className="mt-3 h-6 w-1/2" />
            <Skeleton className="mt-6 h-4 w-full max-w-prose" />
            <Skeleton className="mt-2 h-4 w-5/6 max-w-prose" />
            <Skeleton className="mt-2 h-4 w-4/6 max-w-prose" />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-32 rounded-lg" />
              <Skeleton className="h-11 w-28 rounded-lg" />
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative aspect-square w-52 sm:w-64 lg:w-72">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects skeleton */}
      <section className="scroll-mt-24 border-t border-border py-20 sm:py-24">
        <Skeleton className="h-8 w-48 sm:h-9" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills skeleton */}
      <section className="scroll-mt-24 border-t border-border py-20 sm:py-24">
        <Skeleton className="h-8 w-40 sm:h-9" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-6"
            >
              <Skeleton className="h-6 w-32" />
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-7 w-20 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About skeleton */}
      <section className="scroll-mt-24 border-t border-border py-20 sm:py-24">
        <Skeleton className="h-8 w-32 sm:h-9" />
        <div className="mt-6 max-w-3xl space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </section>

      {/* Contact skeleton */}
      <section className="scroll-mt-24 border-t border-border py-20 sm:py-24">
        <Skeleton className="h-8 w-40 sm:h-9" />
        <Skeleton className="mt-6 h-4 w-72" />
        <Skeleton className="mt-8 h-11 w-36 rounded-lg" />
      </section>
    </div>
  );
}
