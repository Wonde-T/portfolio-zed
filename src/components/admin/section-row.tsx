"use client";

import { useActionState } from "react";

import { saveSectionAction } from "@/app/admin/dashboard/actions";
import { FormMessage } from "@/components/admin/form-message";
import { SubmitButton } from "@/components/admin/submit-button";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { idleState } from "@/lib/action-state";
import type { SectionName } from "@/lib/sections";

const DEFAULT_TITLES: Record<SectionName, string> = {
  hero: "Home",
  services: "My Services",
  projects: "Projects",
  skills: "Skills",
  about: "About",
  contact: "Contact",
};

type SectionRowProps = {
  sectionName: SectionName;
  title: string | null;
  isVisible: boolean;
  toggleAction: () => Promise<void>;
};

export function SectionRow({
  sectionName,
  title,
  isVisible,
  toggleAction,
}: SectionRowProps) {
  const [state, formAction] = useActionState(saveSectionAction, idleState);
  const errors = state.fieldErrors;

  return (
    <li className="grid gap-4 border-b border-border py-5 last:border-b-0 md:grid-cols-[auto_1fr] md:items-start md:gap-6">
      <div className="flex items-center gap-3 md:w-40 md:flex-col md:items-start">
        <VisibilityToggle
          checked={isVisible}
          label={`the ${DEFAULT_TITLES[sectionName]} section`}
          action={toggleAction}
        />
        <p className="text-sm font-medium capitalize">{sectionName}</p>
      </div>

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="sectionName" value={sectionName} />

        <div className="space-y-2">
          <label
            htmlFor={`title-${sectionName}`}
            className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            Section heading
          </label>
          <input
            id={`title-${sectionName}`}
            name="title"
            defaultValue={title ?? ""}
            placeholder={DEFAULT_TITLES[sectionName]}
            className="h-11 w-full max-w-sm rounded-lg border border-input bg-background px-3 text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to use the default heading.
          </p>
          {errors?.title ? <FormMessage status="error" message={errors.title[0]} /> : null}
        </div>

        <SubmitButton>Save</SubmitButton>
        {state.message ? <FormMessage status={state.status} message={state.message} /> : null}
      </form>
    </li>
  );
}
