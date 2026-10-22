"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin/dashboard", label: "Sections" },
  { href: "/admin/dashboard/projects", label: "Projects" },
  { href: "/admin/dashboard/skills", label: "Skills" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {ITEMS.map((item) => {
          const active = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center whitespace-nowrap border-b-2 px-4 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}