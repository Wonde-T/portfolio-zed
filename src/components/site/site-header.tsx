"use client";

import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/site/theme-toggle";
import { MOTION_OK, gsap, scrollToTarget, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type NavItem = {
  id: string;
  label: string;
};

const GLASS_THRESHOLD = 50;
const MENU_CLOSED = "circle(0% at calc(100% - 2.75rem) 2.25rem)";
const MENU_OPEN = "circle(150% at calc(100% - 2.75rem) 2.25rem)";

export function SiteHeader({ items }: { items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTimeline = useRef<gsap.core.Timeline | null>(null);
  const firstIndicatorRender = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > GLASS_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (targets.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-33% 0px -60% 0px", threshold: 0 },
    );

    for (const target of targets) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Entrance, plus the mobile menu timeline (built once, played/reversed on toggle).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          header.current,
          { yPercent: -120, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 1, ease: "expo.out", delay: 0.2 },
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(header.current, { autoAlpha: 1 });
      });

      // The menu timeline always exists; reduced-motion users get it near-instantly.
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        menu.current,
        { autoAlpha: 0, clipPath: MENU_CLOSED },
        { autoAlpha: 1, clipPath: MENU_OPEN, duration: 0.8, ease: "power4.inOut" },
      )
        .fromTo(
          "[data-menu-link]",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.07 },
          "-=0.35",
        )
        .fromTo(
          "[data-menu-extra]",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.5",
        );
      menuTimeline.current = tl;

      return () => {
        menuTimeline.current = null;
      };
    },
    { scope: root },
  );

  useEffect(() => {
    const tl = menuTimeline.current;
    if (!tl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (menuOpen) tl.timeScale(reduced ? 50 : 1).play();
    else tl.timeScale(reduced ? 50 : 1.4).reverse();
  }, [menuOpen]);

  // Slide the pill indicator under the active desktop link.
  useGSAP(
    () => {
      const container = nav.current;
      const pill = indicator.current;
      if (!container || !pill) return;

      const link = active
        ? container.querySelector<HTMLElement>(`[data-nav="${active}"]`)
        : null;

      if (!link) {
        gsap.to(pill, { autoAlpha: 0, duration: 0.3 });
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const state = { x: link.offsetLeft, width: link.offsetWidth, autoAlpha: 1 };

      if (firstIndicatorRender.current || reduced) {
        gsap.set(pill, state);
        firstIndicatorRender.current = false;
      } else {
        gsap.to(pill, { ...state, duration: 0.55, ease: "power3.out" });
      }
    },
    { scope: nav, dependencies: [active, items] },
  );

  const closeAndGo = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => scrollToTarget(`#${id}`), 120);
  };

  const goTo = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    scrollToTarget(`#${id}`);
  };

  return (
    <div ref={root} className="contents">
    <header
      ref={header}
      data-anim
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-transparent px-3 py-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 sm:px-4",
          scrolled &&
            "glass border-glass-border shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md",
        )}
      >
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            scrollToTarget(0);
          }}
          className="group inline-flex h-11 items-center gap-2.5 rounded-full pl-1 pr-3 font-display text-base font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="bg-brand-gradient relative inline-flex size-8 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:rotate-[360deg]"
          >
            P
          </span>
          Portfolio
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          <div ref={nav} className="relative flex items-center">
            <span
              ref={indicator}
              aria-hidden
              className="absolute inset-y-1 left-0 rounded-full bg-primary/12 ring-1 ring-primary/25 invisible"
            />
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-nav={item.id}
                onClick={(event) => goTo(event, item.id)}
                className={cn(
                  "relative inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-300",
                  active === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active === item.id ? "true" : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="relative inline-flex size-11 flex-col items-center justify-center gap-[5px] rounded-full border border-border bg-background/60 backdrop-blur"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span
              aria-hidden
              className={cn(
                "h-0.5 w-5 rounded bg-foreground transition-transform duration-300",
                menuOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "h-0.5 w-5 rounded bg-foreground transition-opacity duration-200",
                menuOpen && "opacity-0",
              )}
            />
            <span
              aria-hidden
              className={cn(
                "h-0.5 w-5 rounded bg-foreground transition-transform duration-300",
                menuOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </button>
        </div>
      </div>
    </header>

      {/* Sibling of the header: the header carries a GSAP transform, which would otherwise become the containing block for this fixed overlay. */}
      <div
        ref={menu}
        id="mobile-menu"
        className="invisible fixed inset-0 z-40 flex flex-col justify-center bg-background/95 px-8 backdrop-blur-xl md:hidden"
      >
        <nav aria-label="Sections" className="flex flex-col">
          {items.map((item, index) => (
            <div key={item.id} className="overflow-hidden border-b border-border">
              <a
                href={`#${item.id}`}
                data-menu-link
                onClick={(event) => closeAndGo(event, item.id)}
                className="flex items-baseline gap-4 py-4 font-display text-4xl font-semibold tracking-tight"
              >
                <span className="text-sm font-medium text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={cn(active === item.id && "text-gradient")}>{item.label}</span>
              </a>
            </div>
          ))}
        </nav>
        <p data-menu-extra className="mt-10 text-sm text-muted-foreground">
          Let&apos;s build something great together.
        </p>
      </div>
    </div>
  );
}
