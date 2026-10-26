"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/**
 * Scroll-triggered staggered reveal. Descendants marked `data-reveal` fade and
 * slide up in sequence when the wrapper enters the viewport; if none are marked,
 * the wrapper itself animates.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  stagger = 0.12,
  y = 36,
  start = "top 82%",
  ...rest
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  start?: string;
  id?: string;
  "aria-labelledby"?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const find = () => {
        const marked = gsap.utils.toArray<HTMLElement>("[data-reveal]", root.current);
        return marked.length > 0 ? marked : [root.current as HTMLElement];
      };

      mm.add(MOTION_OK, () => {
        const targets = find();
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger,
            scrollTrigger: { trigger: root.current, start, once: true },
          },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(find(), { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={className} {...rest}>
      {children}
    </Tag>
  );
}
