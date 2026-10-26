"use client";

import { Menu } from "lucide-react";
import { OPEN_SITE_MENU_EVENT } from "@/components/layout/site-header";

/**
 * Phone-only menu trigger inside the homepage hero. The hero hides the global
 * floating header, so this opens that header's existing mobile menu instead
 * of duplicating it.
 */
export function HeroMenuButton() {
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => window.dispatchEvent(new Event(OPEN_SITE_MENU_EVENT))}
      className="grid size-[38px] place-items-center rounded-lg bg-ivory/15 text-ivory backdrop-blur-sm transition-colors hover:bg-ivory/25 lg:hidden"
    >
      <Menu className="size-5" aria-hidden />
    </button>
  );
}
