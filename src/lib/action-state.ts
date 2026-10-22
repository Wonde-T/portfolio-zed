import type { ZodError } from "zod";

/**
 * Value returned by every admin Server Action.
 *
 * `fieldErrors` is keyed by form field name so the client forms can render the
 * message next to the input that produced it. Issues without a path land under
 * `form` and are shown as the banner message.
 */
export type ActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors: Record<string, string[]>;
};

export const idleState: ActionState = { status: "idle", fieldErrors: {} };

export function errorState(
  message: string,
  fieldErrors: Record<string, string[]> = {},
): ActionState {
  return { status: "error", message, fieldErrors };
}

export function successState(message: string): ActionState {
  return { status: "success", message, fieldErrors: {} };
}

/** Flattens a `ZodError` into `{ fieldName: [message, ...] }`. */
export function fieldErrorsFrom(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "form";

    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }

  return fieldErrors;
}

/** Convenience for the common "invalid input" branch of an action. */
export function invalidState(error: ZodError): ActionState {
  const fieldErrors = fieldErrorsFrom(error);
  const formError = fieldErrors.form?.join(" ");

  return errorState(
    formError ?? "Check the highlighted fields and try again.",
    fieldErrors,
  );
}