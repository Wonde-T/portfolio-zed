"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/** Banner for the non-field part of an action result (see `ActionState`). */
export function FormMessage({
  status,
  message,
}: {
  status: "idle" | "error" | "success";
  message?: string | undefined;
}) {
  if (!message || status === "idle") {
    return null;
  }

  return (
    <motion.p
      role={status === "error" ? "alert" : "status"}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "text-sm",
        status === "error" ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {message}
    </motion.p>
  );
}

export function FieldErrors({ errors }: { errors: string[] | undefined }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-0.5 text-sm text-destructive">
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}