"use client";

import { useEffect, useRef } from "react";

import { DESKTOP, MOTION_OK, ScrollTrigger, gsap, useGSAP } from "@/lib/gsap";

/**
 * Page-wide decoration and behaviour, mounted once in the site layout:
 *  - animated ambient background (grid, drifting gradient orbs, film grain)
 *  - a cursor-following glow (desktop only)
 *  - a scroll progress bar
 *  - delegated pointer tracking that feeds the `.spotlight` card effect
 *  - ScrollTrigger refreshes when streamed sections change the page height
 */
export function SiteEffects() {
  const root = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-orb]").forEach((orb, index) => {
          gsap.to(orb, {
            x: gsap.utils.random(-80, 80),
            y: gsap.utils.random(-60, 60),
            scale: gsap.utils.random(0.9, 1.2),
            duration: gsap.utils.random(9, 14),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * -2,
          });
        });

        // Orbs also drift at different speeds as the page scrolls.
        gsap.utils.toArray<HTMLElement>("[data-orb-scroll]").forEach((orb) => {
          gsap.to(orb, {
            yPercent: Number(orb.dataset.orbScroll),
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          });
        });
      });

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          progress.current,
          { scaleX: 0 },
          {
            scaleX: 1,
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

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const el = glow.current;
        if (!el) return;

        gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
        const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          xTo(event.clientX);
          yTo(event.clientY);
          gsap.to(el, { autoAlpha: 1, duration: 0.6, overwrite: "auto" });
        };
        const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.6 });

        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);

        return () => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
        };
      });
    },
    { scope: root },
  );

  // Feed `--mx` / `--my` to whichever `.spotlight` element is under the pointer.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(".spotlight");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      target.style.setProperty("--my", `${event.clientY - rect.top}px`);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  // Sections stream in via Suspense, which shifts trigger positions.
  useEffect(() => {
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={root}>
      <div
        ref={progress}
        aria-hidden
        className="bg-brand-gradient fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0"
      />

      <div aria-hidden className="noise pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-grid absolute inset-x-0 top-0 h-[44rem]" />

        <div
          data-orb-scroll="-30"
          className="absolute -left-40 -top-40 h-[30rem] w-[30rem]"
        >
          <div
            data-orb
            className="size-full rounded-full bg-primary/25 blur-[120px] dark:bg-primary/20"
          />
        </div>
        <div
          data-orb-scroll="-60"
          className="absolute -right-52 top-[18%] h-[34rem] w-[34rem]"
        >
          <div
            data-orb
            className="size-full rounded-full bg-brand-2/20 blur-[140px] dark:bg-brand-2/15"
          />
        </div>
        <div
          data-orb-scroll="-90"
          className="absolute left-1/4 top-[55%] h-[36rem] w-[36rem]"
        >
          <div
            data-orb
            className="size-full rounded-full bg-brand-3/15 blur-[160px] dark:bg-brand-3/10"
          />
        </div>
      </div>

      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-0 size-[32rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_65%)] opacity-0"
      />
    </div>
  );
}
