"use client";

import { SubmitButton } from "@/components/admin/submit-button";

type DeleteButtonProps = {
  label: string;
  /** Shown in the browser confirm dialog; also the screen-reader description. */
  confirmation: string;
  action: () => Promise<void>;
};

/**
 * Destructive submit with a confirmation step. Without JavaScript the form still
 * posts (progressive enhancement) — the confirm dialog is only the guard rail
 * for the common case, and the action itself is authorised server-side.
 */
export function DeleteButton({
  label,
  confirmation,
  action,
}: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmation)) {
          event.preventDefault();
        }
      }}
    >
      <SubmitButton variant="ghost" pendingLabel="Deleting…" className="h-11 px-3">
        {label}
      </SubmitButton>
    </form>
  );
}