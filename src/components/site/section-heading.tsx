"use client";

import { useRef } from "react";

import { SplitWords } from "@/components/site/split-words";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Eyebrow + masked-word title that plays when scrolled into view.
 * The wrapper is `data-anim` (hidden until revealed) so there is no flash.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  /** Rendered on the right on wide screens (e.g. filter tabs). */
  children?: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
        });

        // Children are pre-hidden by the fromTo tweens below, so showing the wrapper is safe.
        gsap.set(root.current, { autoAlpha: 1 });

        tl.fromTo("[data-eyebrow]", { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.7 })
          .fromTo(
            "[data-eyebrow-line]",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.9, transformOrigin: "left center" },
            "<",
          )
          .fromTo(
            "[data-word]",
            { yPercent: 115, rotate: 4 },
            { yPercent: 0, rotate: 0, duration: 1, stagger: 0.07 },
            "<0.1",
          )
          .fromTo(
            "[data-desc]",
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            "-=0.6",
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root.current, { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      data-anim
      className={cn("mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-14", className)}
    >
      <div className="max-w-2xl">
        <p
          data-eyebrow
          className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
        >
          <span data-eyebrow-line aria-hidden className="bg-brand-gradient h-px w-10" />
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl"
        >
          <SplitWords text={title} />
        </h2>
        {description ? (
          <p data-desc className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
