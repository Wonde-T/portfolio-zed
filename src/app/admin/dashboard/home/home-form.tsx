"use client";

import { useActionState } from "react";

import { saveHomeContentAction } from "./actions";
import { FormMessage } from "@/components/admin/form-message";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { idleState } from "@/lib/action-state";
import type { HomeData } from "@/lib/queries/home";

export function HomeForm({
  initial,
  cloudinaryConfigured,
}: {
  initial: HomeData;
  cloudinaryConfigured: boolean;
}) {
  const [state, formAction] = useActionState(saveHomeContentAction, idleState);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <ImageUploadField
        name="photoUrl"
        label="Profile photo"
        shape="circle"
        defaultValue={initial.photoUrl ?? undefined}
        errors={errors?.photoUrl}
        configured={cloudinaryConfigured}
        hint="Shown as a circular portrait in the hero. Uploaded to Cloudinary; only the URL is stored."
      />

      <div className="space-y-2">
        <label htmlFor="greeting" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Greeting
        </label>
        <input
          id="greeting"
          name="greeting"
          defaultValue={initial.greeting}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
        />
        {errors?.greeting ? <FormMessage status="error" message={errors.greeting[0]} /> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={initial.name}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
        />
        {errors?.name ? <FormMessage status="error" message={errors.name[0]} /> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Role
        </label>
        <input
          id="role"
          name="role"
          defaultValue={initial.role}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
        />
        {errors?.role ? <FormMessage status="error" message={errors.role[0]} /> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={initial.bio}
          rows={6}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
        {errors?.bio ? <FormMessage status="error" message={errors.bio[0]} /> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="availability" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Availability
        </label>
        <input
          id="availability"
          name="availability"
          defaultValue={initial.availability}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
        />
        {errors?.availability ? <FormMessage status="error" message={errors.availability[0]} /> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="location" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={initial.location}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
        />
        {errors?.location ? <FormMessage status="error" message={errors.location[0]} /> : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          defaultValue={initial.email}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
        />
        {errors?.email ? <FormMessage status="error" message={errors.email[0]} /> : null}
      </div>

      <SubmitButton>Save</SubmitButton>
      {state.message ? <FormMessage status={state.status} message={state.message} /> : null}
    </form>
  );
}
