"use client";

import { usePathname } from "next/navigation";

/**
 * Renders its children everywhere except the V2 homepage, which carries its
 * own replacements (hero nav, visit card, slim footer). Lets server
 * components like SiteFooter stay server-rendered on every other route.
 */
export function HideOnHome({ children }: { children: React.ReactNode }) {
  return usePathname() === "/" ? null : <>{children}</>;
}
