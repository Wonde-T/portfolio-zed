"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";
import type { PublicProjectSummary } from "@/lib/queries/public";
import { cn } from "@/lib/utils";

const overlayButton =
  "pointer-events-auto inline-flex h-11 items-center rounded-full bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white hover:text-black";

/**
 * Gallery card.
 *
 * The cover links to the case study; the repository and demo links are siblings
 * stacked above it so they stay independently clickable and keyboard reachable
 * (a link inside a link is invalid HTML).
 *
 * Desktop (hover + fine pointer): GSAP zooms the image, tilts the card in 3D and
 * slides an action overlay up from the bottom. Mobile: there is no hover, so the
 * links are always rendered under the text instead.
 */
export function ProjectCard({
  project,
  hidden,
}: {
  project: PublicProjectSummary;
  /** Filtered out: kept in the DOM (display: none) so Flip can animate it. */
  hidden: boolean;
}) {
  const root = useRef<HTMLLIElement>(null);

  const links = [
    project.githubUrl ? { label: "Code", href: project.githubUrl } : null,
    project.liveUrl ? { label: "Live demo", href: project.liveUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const card = root.current;
        const tilt = card?.querySelector<HTMLElement>("[data-tilt]");
        const image = card?.querySelector<HTMLElement>("[data-image]");
        const overlay = card?.querySelector<HTMLElement>("[data-overlay]");
        const overlayItems = gsap.utils.toArray<HTMLElement>("[data-overlay-item]", card);
        if (!card || !tilt || !image || !overlay) return;

        gsap.set(overlay, { yPercent: 100, opacity: 0 });

        const hover = gsap
          .timeline({ paused: true })
          .to(image, { scale: 1.08, duration: 0.9, ease: "power3.out" }, 0)
          .to(overlay, { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 0)
          .fromTo(
            overlayItems,
            { y: 14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.07 },
            0.12,
          );

        gsap.set(tilt, { transformPerspective: 900, transformOrigin: "center" });
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" });

        const onEnter = () => hover.play();
        const onLeave = () => {
          hover.reverse();
          rx(0);
          ry(0);
        };
        const onMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          ry(px * 7);
          rx(-py * 7);
        };
        const onFocusOut = (event: FocusEvent) => {
          if (!card.contains(event.relatedTarget as Node | null)) hover.reverse();
        };

        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        card.addEventListener("pointermove", onMove);
        card.addEventListener("focusin", onEnter);
        card.addEventListener("focusout", onFocusOut);

        return () => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("focusin", onEnter);
          card.removeEventListener("focusout", onFocusOut);
        };
      });
    },
    { scope: root },
  );

  return (
    <li
      ref={root}
      data-reveal
      data-flip-id={project.id}
      className={cn("group", hidden && "hidden")}
    >
      <div
        data-tilt
        className="spotlight flex h-full flex-col overflow-hidden rounded-card border border-border bg-card shadow-sm will-change-transform"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Link
            href={`/projects/${project.id}`}
            aria-label={`${project.title} — read the case study`}
            className="absolute inset-0 block"
          >
            <Image
              data-image
              src={project.cloudinaryImageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 22rem, (min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </Link>

          {/* Category chip */}
          <span className="glass pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            {project.category}
          </span>

          {/* Desktop hover overlay. Without GSAP / with reduced motion it falls back to a CSS fade. */}
          <div
            data-overlay
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-end gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-16 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 desktop-hover:flex"
          >
            <Link
              data-overlay-item
              href={`/projects/${project.id}`}
              className={cn(overlayButton, "bg-white text-black hover:bg-primary hover:text-primary-foreground")}
            >
              Case study →
            </Link>
            {links.map((link) => (
              <a
                key={link.href}
                data-overlay-item
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={overlayButton}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-display text-xl font-semibold tracking-tight">
            <Link
              href={`/projects/${project.id}`}
              className="transition-colors hover:text-primary"
            >
              {project.title}
            </Link>
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {/* Mobile / touch: always visible, no hover needed. */}
          <div className="mt-auto flex flex-wrap gap-2 pt-3 desktop-hover:hidden">
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex h-11 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Case study
            </Link>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-full border border-border px-4 text-sm font-semibold transition-colors hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}
