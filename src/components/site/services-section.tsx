"use client";

import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

const SERVICES = [
  {
    title: "Web Development",
    description:
      "Responsive, accessible, and performant web apps built with Next.js and TypeScript.",
    features: ["Frontend & Backend", "REST/GraphQL APIs", "Database Design"],
    icon: (
      <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" />
    ),
  },
  {
    title: "UI/UX Implementation",
    description:
      "Pixel-perfect interfaces with smooth animations and thoughtful user experiences.",
    features: ["Component Systems", "Tailwind CSS", "GSAP Animation"],
    icon: (
      <>
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
        <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z" />
      </>
    ),
  },
  {
    title: "Technical Consulting",
    description:
      "Architecture reviews, performance optimization, and best practices guidance.",
    features: ["Code Reviews", "Scalable Architecture", "DevOps Basics"],
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </>
    ),
  },
];

export function ServicesSection({ title }: { title: string }) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <SectionHeading
        id="services-heading"
        eyebrow="What I do"
        title={title}
        description="End-to-end help turning ideas into polished, production-ready products."
      />

      <Reveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.15}>
        {SERVICES.map((service, index) => (
          <div
            key={service.title}
            data-reveal
            className="spotlight group relative flex flex-col overflow-hidden rounded-card border border-border bg-card/70 p-7 backdrop-blur transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="flex items-start justify-between">
              <span className="bg-brand-gradient inline-flex size-12 items-center justify-center rounded-2xl text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-6"
                >
                  {service.icon}
                </svg>
              </span>
              <span className="font-display text-sm font-semibold text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
              {service.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {service.description}
            </p>

            <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-sm">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 shrink-0 text-primary"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
