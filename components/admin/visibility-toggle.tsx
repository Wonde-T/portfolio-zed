"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

type VisibilityToggleProps = {
  /** Current value, re-rendered with the action response. */
  checked: boolean;
  /** What is being toggled, used for the accessible name. */
  label: string;
  /** A Server Action with the entity already bound to it. */
  action: () => Promise<void>;
};

function ToggleButton({ checked, label }: Omit<VisibilityToggleProps, "action">) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      role="switch"
      aria-checked={checked}
      aria-label={`${checked ? "Hide" : "Show"} ${label}`}
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors disabled:opacity-60",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "size-4 rounded-full bg-card shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

/**
 * Inline `is_visible` switch. The new value is decided in the Server Action
 * rather than posted from the button, so two rapid clicks can never write the
 * same stale value twice.
 */
export function VisibilityToggle({
  checked,
  label,
  action,
}: VisibilityToggleProps) {
  return (
    <form action={action}>
      <ToggleButton checked={checked} label={label} />
    </form>
  );
}