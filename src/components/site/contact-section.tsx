"use client";

import { useRef } from "react";

import { Magnetic } from "@/components/site/magnetic";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import type { SocialLink } from "@/lib/site-config";

export function ContactSection({
  title,
  email,
  socials,
}: {
  title: string;
  email: string;
  socials: SocialLink[];
}) {
  const root = useRef<HTMLElement>(null);

  // The card's glow slowly orbits, drawing the eye to the call to action.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.to("[data-contact-orb]", {
          rotation: 360,
          duration: 24,
          ease: "none",
          repeat: -1,
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <SectionHeading id="contact-heading" eyebrow="Get in touch" title={title} />

      <Reveal y={48}>
        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-card/70 px-6 py-14 text-center backdrop-blur sm:px-12 sm:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          >
            <div
              data-contact-orb
              className="size-[44rem] max-w-none rounded-full bg-[conic-gradient(from_0deg,var(--primary),var(--brand-2),var(--brand-3),var(--primary))] opacity-20 blur-[100px]"
            />
          </div>

          <p className="mx-auto max-w-xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            Have a project in mind, or just want to talk about the stack?
          </p>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            The fastest way to reach me is email.
          </p>

          <div className="mt-10">
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${email}`}
                className="bg-brand-gradient group inline-flex min-h-14 items-center gap-3 rounded-full px-8 py-3 font-display text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-shadow hover:shadow-2xl hover:shadow-primary/40 sm:text-lg"
              >
                {email}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </a>
            </Magnetic>
          </div>

          {socials.length > 0 ? (
            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="glass inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold text-muted-foreground transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
