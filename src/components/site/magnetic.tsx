"use client";

import { useRef, type ReactNode } from "react";

import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Makes its child gently follow the pointer while it hovers nearby, then spring
 * back on leave. Only active for fine pointers and when motion is allowed.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const area = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MOTION_OK} and (hover: hover)`, () => {
        const hit = area.current;
        const target = inner.current;
        if (!hit || !target) return;

        const xTo = gsap.quickTo(target, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
        const yTo = gsap.quickTo(target, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });

        const onMove = (event: PointerEvent) => {
          const rect = hit.getBoundingClientRect();
          xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        hit.addEventListener("pointermove", onMove);
        hit.addEventListener("pointerleave", onLeave);

        return () => {
          hit.removeEventListener("pointermove", onMove);
          hit.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: area },
  );

  return (
    <span ref={area} className={cn("inline-block", className)}>
      <span ref={inner} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}
