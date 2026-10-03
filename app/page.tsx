import { siteConfig } from "@/lib/site-config";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24">
      <p className="text-sm font-medium text-primary">Phase 1 scaffold</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {siteConfig.name}
      </h1>
      <p className="text-lg text-muted-foreground">{siteConfig.role}</p>
      <p className="max-w-prose text-foreground/80">{siteConfig.bio}</p>
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          {siteConfig.availability}
        </span>
        <span className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
          {siteConfig.location}
        </span>
      </div>
    </main>
  );
}