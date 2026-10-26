"use client";

import { useRef } from "react";

import { MOTION_OK, MOTION_REDUCED, ScrollTrigger, gsap, scrollToTarget, useGSAP } from "@/lib/gsap";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Appears once the hero has scrolled away; the ring shows page scroll progress. */
export function ScrollToTop() {
  const button = useRef<HTMLButtonElement>(null);
  const ring = useRef<SVGCircleElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    const toggle = (visible: boolean, animate: boolean) =>
      gsap.to(button.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : 16,
        scale: visible ? 1 : 0.8,
        duration: animate ? 0.4 : 0,
        ease: visible ? "back.out(1.8)" : "power2.in",
        overwrite: "auto",
      });

    mm.add(MOTION_OK, () => {
      ScrollTrigger.create({
        start: 400,
        end: "max",
        onToggle: (self) => toggle(self.isActive, true),
      });

      gsap.fromTo(
        ring.current,
        { strokeDashoffset: CIRCUMFERENCE },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        },
      );
    });

    mm.add(MOTION_REDUCED, () => {
      ScrollTrigger.create({
        start: 400,
        end: "max",
        onToggle: (self) => toggle(self.isActive, false),
      });
    });
  });

  return (
    <button
      ref={button}
      type="button"
      onClick={() => scrollToTarget(0)}
      className="glass invisible fixed bottom-6 right-6 z-40 inline-flex size-12 items-center justify-center rounded-full shadow-xl transition-colors hover:text-primary"
    >
      <span className="sr-only">Back to top</span>
      <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle
          ref={ring}
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
