import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectFormLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-8">
        <Skeleton className="h-8 w-40 sm:h-9" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="rounded-xl border border-border bg-card">
        <div className="space-y-6 p-6">
          <div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-2 h-10 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-24 w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-32 w-full rounded-lg" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-10 w-full rounded-lg" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 aspect-video w-full rounded-lg" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border p-6">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
