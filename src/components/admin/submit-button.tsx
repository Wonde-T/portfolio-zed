"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60",
  secondary:
    "border border-border text-foreground hover:bg-muted disabled:opacity-60",
  danger:
    "border border-destructive/40 text-destructive hover:bg-destructive/10 disabled:opacity-60",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className?: string,
): string {
  return cn(
    // 44px min target on every interactive control (ui-animations.md).
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed",
    VARIANTS[variant],
    className,
  );
}

type SubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
  variant?: ButtonVariant;
  className?: string;
};

/**
 * Submit control for a Server Action form. Must be rendered inside the `<form>`
 * it submits, because `useFormStatus` reads the enclosing form's context.
 */
export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={buttonClassName(variant, className)}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}