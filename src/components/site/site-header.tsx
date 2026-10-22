"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";

export type NavItem = {
  id: string;
  label: string;
};

const GLASS_THRESHOLD = 50;

export function SiteHeader({ items }: { items: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const linkClass = (id: string) =>
    cn(
      "inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
      active === id
        ? "text-foreground bg-muted"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors",
        scrolled && "bg-background/70 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="inline-flex h-11 items-center text-sm font-semibold tracking-tight"
        >
          Portfolio
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={linkClass(item.id)}
              aria-current={active === item.id ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
            <span aria-hidden="true" className="text-lg leading-none">
              {menuOpen ? "\xd7" : "\u2630"}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Sections"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[3.75rem] bottom-0 z-50 flex flex-col gap-2 bg-background px-4 pt-6 md:hidden"
          >
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-14 items-center border-b border-border text-lg font-medium"
              >
                {item.label}
              </a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
