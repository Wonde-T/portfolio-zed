"use client";

import { useActionState } from "react";

import { CheckboxField, TextField } from "@/components/admin/fields";
import { FormMessage } from "@/components/admin/form-message";
import { SubmitButton } from "@/components/admin/submit-button";
import { idleState, type ActionState } from "@/lib/action-state";

export type SkillFormValues = {
  id: string;
  name: string;
  category: string;
  isVisible: boolean;
};

const CATEGORY_OPTIONS_ID = "skill-category-options";

type SkillFormProps = {
  /** `createSkillAction` or `updateSkillAction`. */
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  /** Absent when creating. */
  skill?: SkillFormValues | undefined;
  categories: string[];
  submitLabel: string;
};

export function SkillForm({
  action,
  skill,
  categories,
  submitLabel,
}: SkillFormProps) {
  const [state, formAction] = useActionState(action, idleState);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-5">
      {skill ? <input type="hidden" name="id" value={skill.id} /> : null}

      <datalist id={CATEGORY_OPTIONS_ID}>
        {categories.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="name"
          label="Skill"
          required
          defaultValue={skill?.name}
          placeholder="TypeScript"
          errors={errors.name}
        />
        <TextField
          name="category"
          label="Category"
          required
          list={CATEGORY_OPTIONS_ID}
          defaultValue={skill?.category}
          placeholder="Frontend"
          errors={errors.category}
          hint={
            categories.length > 0
              ? `Existing: ${categories.join(", ")}`
              : "Skills are grouped by category on the public page."
          }
        />
      </div>

      <CheckboxField
        name="isVisible"
        label="Visible on the public site"
        defaultChecked={skill?.isVisible ?? true}
      />

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-5">
        <SubmitButton>{submitLabel}</SubmitButton>
        <FormMessage status={state.status} message={state.message} />
      </div>
    </form>
  );
}