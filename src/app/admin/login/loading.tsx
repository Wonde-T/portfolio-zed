import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Skeleton className="mx-auto h-8 w-32" />
          <Skeleton className="mx-auto mt-2 h-4 w-48" />
        </div>
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-12" />
              <Skeleton className="mt-2 h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-2 h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="mt-6 h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
