"use client";

import Image from "next/image";
import { useRef } from "react";

import { Magnetic } from "@/components/site/magnetic";
import { SplitWords } from "@/components/site/split-words";
import { DESKTOP, MOTION_OK, gsap, scrollToTarget, useGSAP } from "@/lib/gsap";

type HeroProps = {
  greeting: string;
  name: string;
  role: string;
  bio: string;
  availability: string;
  /** Cloudinary portrait URL, or `null` to fall back to the initials monogram. */
  photoUrl: string | null;
  /** Only rendered when the matching section is enabled in the dashboard. */
  hasProjects: boolean;
  hasContact: boolean;
  email: string;
};

/** Up to two letters derived from the name, e.g. "Ada Lovelace" -> "AL". */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function Hero({
  greeting,
  name,
  role,
  bio,
  availability,
  photoUrl,
  hasProjects,
  hasContact,
  email,
}: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // Each `[data-anim]` element reveals itself through its own tween below;
        // the heading only animates its words, so it is revealed explicitly.
        tl.set(q("#hero-heading"), { autoAlpha: 1 }, 0.35)
          .fromTo(
            q("[data-hero-badge]"),
            { autoAlpha: 0, y: 20, scale: 0.9 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
            0.35,
          )
          .fromTo(
            q("[data-hero-greeting]"),
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            "<0.1",
          )
          .fromTo(
            q("[data-word]"),
            { yPercent: 120, rotate: 6 },
            { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.1 },
            "<0.1",
          )
          .fromTo(
            q("[data-hero-fade]"),
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 },
            "-=0.8",
          )
          .fromTo(
            q("[data-hero-portrait]"),
            { autoAlpha: 0, scale: 0.8, rotate: -8 },
            { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.6, ease: "expo.out" },
            0.3,
          )
          .fromTo(
            q("[data-hero-chip]"),
            { autoAlpha: 0, scale: 0.4 },
            { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(2.2)", stagger: 0.15 },
            "-=0.9",
          )
          .fromTo(
            q("[data-hero-scroll]"),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 1 },
            "-=0.4",
          );

        // Ambient loops start once the entrance is underway.
        gsap.to(q("[data-hero-ring]"), {
          rotation: 360,
          duration: 14,
          ease: "none",
          repeat: -1,
        });

        q("[data-hero-chip]").forEach((chip, index) => {
          gsap.to(chip, {
            y: index % 2 === 0 ? -14 : 14,
            duration: 2.6 + index * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });

        gsap.fromTo(
          q("[data-hero-scroll-dot]"),
          { y: 0, autoAlpha: 1 },
          { y: 14, autoAlpha: 0, duration: 1.4, ease: "power2.inOut", repeat: -1 },
        );

        // Scrolling away from the hero gently lifts and fades the content.
        gsap.to(q("[data-hero-content]"), {
          yPercent: -12,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const q = gsap.utils.selector(root);
        const stage = q("[data-hero-stage]")[0];
        const layers = q("[data-depth]");
        if (!stage || layers.length === 0) return;

        const movers = layers.map((layer) => ({
          x: gsap.quickTo(layer, "x", { duration: 1, ease: "power3.out" }),
          y: gsap.quickTo(layer, "y", { duration: 1, ease: "power3.out" }),
          depth: Number((layer as HTMLElement).dataset.depth),
        }));

        const onMove = (event: PointerEvent) => {
          const px = event.clientX / window.innerWidth - 0.5;
          const py = event.clientY / window.innerHeight - 0.5;
          for (const mover of movers) {
            mover.x(px * mover.depth);
            mover.y(py * mover.depth);
          }
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(gsap.utils.selector(root)("[data-anim]"), { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100svh-4rem)] scroll-mt-24 flex-col justify-center py-16 sm:py-24"
    >
      <div
        data-hero-content
        className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10"
      >
        <div className="order-2 lg:order-1">
          <div
            data-anim
            data-hero-badge
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium"
          >
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-primary" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
            {availability}
          </div>

          <p
            data-anim
            data-hero-greeting
            className="mt-8 font-display text-lg font-medium text-muted-foreground sm:text-xl"
          >
            {greeting}
          </p>

          <h1
            data-anim
            id="hero-heading"
            className="mt-2 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            <SplitWords
              text={name}
              wordClassName="text-gradient animate-gradient-pan pr-[0.06em]"
            />
          </h1>

          <p
            data-anim
            data-hero-fade
            className="mt-5 flex items-center gap-3 font-display text-xl font-medium sm:text-2xl"
          >
            <span aria-hidden className="bg-brand-gradient h-px w-10 sm:w-14" />
            {role}
          </p>

          <p
            data-anim
            data-hero-fade
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {bio}
          </p>

          {hasProjects || hasContact ? (
            <div data-anim data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
              {hasProjects ? (
                <Magnetic>
                  <a
                    href="#projects"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToTarget("#projects");
                    }}
                    className="bg-brand-gradient group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-shadow hover:shadow-xl hover:shadow-primary/40"
                  >
                    View Projects
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </Magnetic>
              ) : null}
              {hasContact ? (
                <Magnetic>
                  <a
                    href={`mailto:${email}`}
                    className="glass inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    Contact Me
                  </a>
                </Magnetic>
              ) : null}
            </div>
          ) : null}
        </div>

        <div data-hero-stage className="order-1 flex justify-center lg:order-2">
          <div
            data-anim
            data-hero-portrait
            className="relative aspect-square w-60 sm:w-72 lg:w-full lg:max-w-[26rem]"
          >
            <div data-depth="-18" className="absolute inset-0">
              {/* Soft halo behind the portrait. */}
              <div
                aria-hidden
                className="bg-brand-gradient absolute -inset-6 rounded-full opacity-40 blur-3xl"
              />
              {/* Rotating gradient ring. */}
              <div
                data-hero-ring
                aria-hidden
                className="absolute -inset-1.5 rounded-full bg-[conic-gradient(from_0deg,var(--primary),var(--brand-2),var(--brand-3),var(--primary))]"
              />
              <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-2xl">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 26rem, (min-width: 640px) 18rem, 15rem"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-gradient font-display text-7xl font-bold tracking-tight sm:text-8xl">
                    {getInitials(name)}
                  </span>
                )}
              </div>
            </div>

            <div
              data-depth="28"
              className="absolute -left-4 bottom-8 sm:-left-10"
            >
              <div
                data-anim
                data-hero-chip
                className="glass flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl"
              >
                <span
                  aria-hidden
                  className="bg-brand-gradient inline-flex size-8 items-center justify-center rounded-lg text-xs font-bold text-primary-foreground"
                >
                  {"</>"}
                </span>
                {role}
              </div>
            </div>

            <div data-depth="40" className="absolute -right-2 top-6 sm:-right-8">
              <div
                data-anim
                data-hero-chip
                aria-hidden
                className="glass flex size-14 items-center justify-center rounded-2xl text-2xl shadow-xl"
              >
                <span className="text-gradient font-display font-bold">{"{ }"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        data-anim
        data-hero-scroll
        aria-hidden
        className="absolute inset-x-0 bottom-4 hidden justify-center sm:flex"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-muted-foreground/40 pt-2">
          <span
            data-hero-scroll-dot
            className="h-2 w-1 rounded-full bg-muted-foreground"
          />
        </div>
      </div>
    </section>
  );
}
