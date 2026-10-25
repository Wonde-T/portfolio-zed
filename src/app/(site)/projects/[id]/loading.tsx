import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailLoading() {
  return (
    <div className="py-12 sm:py-16 animate-fade-in">
      <Skeleton className="h-9 w-32 sm:h-10" />
      <Skeleton className="mt-6 h-10 w-3/4 sm:h-12 lg:h-14" />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
      <Skeleton className="mt-8 aspect-video w-full rounded-xl" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <Skeleton className="h-5 w-28" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-18 rounded-full" />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Skeleton className="h-5 w-24" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
