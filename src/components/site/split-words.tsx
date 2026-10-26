import { cn } from "@/lib/utils";

/**
 * Renders text as individually maskable words. Each word sits in an
 * `overflow-hidden` wrapper and carries `data-word`, so GSAP can slide the words
 * up out of the mask. Rendered as plain markup (no DOM mutation), which keeps it
 * hydration-safe; the full string stays available to screen readers.
 */
export function SplitWords({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden className={className}>
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom"
          >
            <span data-word className={cn("inline-block will-change-transform", wordClassName)}>
              {word}
            </span>
            {index < words.length - 1 ? "\u00a0" : null}
          </span>
        ))}
      </span>
    </>
  );
}
