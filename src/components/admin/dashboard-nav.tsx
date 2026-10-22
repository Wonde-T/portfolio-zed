"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin/dashboard" as Route, label: "Sections" },
  { href: "/admin/dashboard/home" as Route, label: "Home" },
  { href: "/admin/dashboard/projects" as Route, label: "Projects" },
  { href: "/admin/dashboard/skills" as Route, label: "Skills" },
] as const;

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard">
      <ul className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const active =
            item.href === "/admin/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
