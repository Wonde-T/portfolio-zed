import type { ReactNode } from "react";

import { FieldErrors } from "@/components/admin/form-message";
import { cn } from "@/lib/utils";

const CONTROL =
  "w-full rounded-lg border border-border bg-background px-3 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-ring disabled:opacity-60";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  errors: string[] | undefined;
  children: ReactNode;
  /** Rendered next to the label, e.g. an "optional" marker. */
  trailing?: ReactNode;
};

function FieldShell({
  id,
  label,
  hint,
  errors,
  children,
  trailing,
}: FieldShellProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {trailing}
      </div>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      <div id={`${id}-error`}>
        <FieldErrors errors={errors} />
      </div>
    </div>
  );
}

type TextFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  errors?: string[] | undefined;
  required?: boolean;
  list?: string;
  inputMode?: "text" | "url" | "numeric";
  autoComplete?: string;
  trailing?: ReactNode;
};

export function TextField({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  errors,
  required = false,
  list,
  inputMode = "text",
  autoComplete,
  trailing,
}: TextFieldProps) {
  const id = name;

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      errors={errors}
      trailing={trailing}
    >
      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        list={list}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={errors && errors.length > 0 ? `${id}-error` : undefined}
        className={cn(CONTROL, "h-11")}
      />
    </FieldShell>
  );
}

type TextAreaFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  errors?: string[] | undefined;
  required?: boolean;
  rows?: number;
  mono?: boolean;
  trailing?: ReactNode;
};

export function TextAreaField({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  errors,
  required = false,
  rows = 5,
  mono = false,
  trailing,
}: TextAreaFieldProps) {
  const id = name;

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      errors={errors}
      trailing={trailing}
    >
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        aria-invalid={errors && errors.length > 0 ? true : undefined}
        aria-describedby={errors && errors.length > 0 ? `${id}-error` : undefined}
        className={cn(CONTROL, "resize-y py-2 leading-relaxed", mono && "font-mono text-sm")}
      />
    </FieldShell>
  );
}

type CheckboxFieldProps = {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
};

export function CheckboxField({
  name,
  label,
  description,
  defaultChecked = true,
}: CheckboxFieldProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 shrink-0 accent-primary"
      />
      <span className="space-y-1">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description ? (
          <span className="block text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}