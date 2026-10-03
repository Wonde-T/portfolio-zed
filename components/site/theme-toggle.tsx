"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

/** No subscription: this only reports whether the client has taken over. */
const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The resolved theme is unknown during SSR, so the button only renders once the
  // client has read it — no hydration mismatch and no icon flash. This is the
  // setState-free way to detect that.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!hydrated) {
    return <span aria-hidden="true" className="inline-block size-11" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="sr-only">Switch to {isDark ? "light" : "dark"} theme</span>
      {/* CSS cross-fade keeps the swap smooth without remounting the icon. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        className="size-5 transition-opacity duration-300"
      >
        {isDark ? (
          <g className="opacity-100">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </g>
        ) : (
          <path
            className="opacity-100"
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
          />
        )}
      </svg>
    </button>
  );
}