"use client";

import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP. Every animated component imports from
 * here so plugins are registered exactly once, on the client only.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, Flip);
}

/** Media queries shared by `gsap.matchMedia()` consumers. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";
export const DESKTOP = "(min-width: 1024px) and (hover: hover)";

/** Smoothly scrolls to a section id (e.g. "projects") or the top of the page. */
export function scrollToTarget(target: string | number, offset = 88) {
  const reduced = window.matchMedia(MOTION_REDUCED).matches;

  if (reduced) {
    if (typeof target === "number") {
      window.scrollTo(0, target);
    } else {
      document.querySelector(target)?.scrollIntoView();
    }
    return;
  }

  gsap.to(window, {
    duration: 1.1,
    ease: "power3.inOut",
    scrollTo: typeof target === "number" ? target : { y: target, offsetY: offset },
    overwrite: "auto",
  });
}

export { gsap, ScrollTrigger, Flip, useGSAP };
