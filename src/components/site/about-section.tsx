"use client";

import { useRef } from "react";

import { SectionHeading } from "@/components/site/section-heading";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

/** Statement paragraph whose words light up as it scrolls through the viewport. */
export function AboutSection({ title, text }: { title: string; text: string }) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-about-word]",
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: {
              trigger: "[data-about-text]",
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <SectionHeading id="about-heading" eyebrow="About me" title={title} />

      <p
        data-about-text
        className="max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-4xl"
      >
        <span className="sr-only">{text}</span>
        <span aria-hidden>
          {words.map((word, index) => (
            <span key={`${word}-${index}`} data-about-word>
              {word}
              {index < words.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      </p>
    </section>
  );
}
