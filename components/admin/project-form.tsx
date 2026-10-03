"use client";

import { useActionState } from "react";

import {
  CheckboxField,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import { FormMessage } from "@/components/admin/form-message";
import { SubmitButton } from "@/components/admin/submit-button";
import { idleState, type ActionState } from "@/lib/action-state";

export type ProjectFormValues = {
  id: string;
  title: string;
  category: string;
  description: string;
  contentMarkdown: string;
  cloudinaryImageUrl: string;
  githubUrl: string;
  liveUrl: string;
  isVisible: boolean;
};

const CATEGORY_OPTIONS_ID = "project-category-options";

type ProjectFormProps = {
  /** `createProjectAction` or `updateProjectAction`. */
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  /** Absent when creating. */
  project?: ProjectFormValues | undefined;
  categories: string[];
  submitLabel: string;
};

export function ProjectForm({
  action,
  project,
  categories,
  submitLabel,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, idleState);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-6">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <datalist id={CATEGORY_OPTIONS_ID}>
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="title"
          label="Title"
          required
          defaultValue={project?.title}
          placeholder="Portfolio CMS"
          errors={errors.title}
        />
        <TextField
          name="category"
          label="Category"
          required
          list={CATEGORY_OPTIONS_ID}
          defaultValue={project?.category}
          placeholder="Full-Stack"
          errors={errors.category}
          hint={
            categories.length > 0
              ? `Existing: ${categories.join(", ")}`
              : "Groups the card in the gallery filter."
          }
        />
      </div>

      <TextAreaField
        name="description"
        label="Summary"
        required
        rows={3}
        defaultValue={project?.description}
        placeholder="One or two sentences shown on the project card."
        errors={errors.description}
      />

      <TextField
        name="cloudinaryImageUrl"
        label="Cover image URL"
        required
        inputMode="url"
        autoComplete="off"
        defaultValue={project?.cloudinaryImageUrl}
        placeholder="https://res.cloudinary.com/<cloud>/image/upload/<id>"
        errors={errors.cloudinaryImageUrl}
        hint="Uploaded to Cloudinary; only the resulting URL is stored."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="githubUrl"
          label="Repository URL"
          inputMode="url"
          autoComplete="off"
          defaultValue={project?.githubUrl}
          placeholder="https://github.com/you/project"
          errors={errors.githubUrl}
          trailing={
            <span className="text-xs text-muted-foreground">Optional</span>
          }
        />
        <TextField
          name="liveUrl"
          label="Live demo URL"
          inputMode="url"
          autoComplete="off"
          defaultValue={project?.liveUrl}
          placeholder="https://example.com"
          errors={errors.liveUrl}
          trailing={
            <span className="text-xs text-muted-foreground">Optional</span>
          }
        />
      </div>

      <TextAreaField
        name="contentMarkdown"
        label="Case study (Markdown)"
        required
        rows={16}
        mono
        defaultValue={project?.contentMarkdown}
        placeholder={"## What it does\n\nDescribe the problem, the approach and the outcome."}
        errors={errors.contentMarkdown}
        hint="Rendered on the project's own page."
      />

      <CheckboxField
        name="isVisible"
        label="Visible on the public site"
        description="Hidden projects stay in the database and in this dashboard, but never reach the public gallery."
        defaultChecked={project?.isVisible ?? true}
      />

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <SubmitButton>{submitLabel}</SubmitButton>
        <FormMessage status={state.status} message={state.message} />
      </div>
    </form>
  );
}