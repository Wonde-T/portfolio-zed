import { HomeForm } from "./home-form";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { getHomeContentAdmin } from "@/lib/queries/home";

export default async function HomeContentPage() {
  const home = await getHomeContentAdmin();

  return (
    <div className="space-y-10">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Home Content</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          Edit your hero section content.
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <HomeForm
          initial={home}
          cloudinaryConfigured={isCloudinaryConfigured()}
        />
      </section>
    </div>
  );
}
