import { supabase } from "@/lib/supabase";

/**
 * Singleton site configuration backed by the `site_settings` key/value table
 * (project-vault/10_Database/Database - site_settings.md). Currently the
 * homepage image slots that were previously hardcoded in `app/(site)/page.tsx`.
 */

export type HomepageImageSlots = {
  hero: string;
  kitchens: string;
  wardrobes: string;
  hardware: string;
};

// Built-in fallbacks — used when a slot has no row/value yet. These mirror the
// historical hardcoded defaults so unset slots render exactly as before.
export const HOMEPAGE_IMAGE_DEFAULTS: HomepageImageSlots = {
  hero: "https://www.nolte-kuechen.com/.imaging/focalpoint/4x3/2400/dam/jcr:39342db0-6073-4b2a-b656-b8864dce07d3/23277_Nolte_Frame%20Lack-Magnolia_Tavola-Eiche%20Pinot_001.jpg",
  kitchens: "/images/placeholders/kitchen-2.svg",
  wardrobes: "/images/placeholders/wardrobe-1.svg",
  hardware: "/images/placeholders/hardware-1.svg",
};

// Maps each public slot name to its `site_settings` row key.
export const HOMEPAGE_SLOT_KEYS: Record<keyof HomepageImageSlots, string> = {
  hero: "home_hero",
  kitchens: "home_kitchens",
  wardrobes: "home_wardrobes",
  hardware: "home_hardware",
};

export async function getHomepageImages(): Promise<HomepageImageSlots> {
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", Object.values(HOMEPAGE_SLOT_KEYS));

  const byKey = new Map(
    (data ?? []).map((row) => [row.key as string, row.value as string | null]),
  );

  const resolve = (slot: keyof HomepageImageSlots) => {
    const value = byKey.get(HOMEPAGE_SLOT_KEYS[slot]);
    return value && value.trim() ? value : HOMEPAGE_IMAGE_DEFAULTS[slot];
  };

  return {
    hero: resolve("hero"),
    kitchens: resolve("kitchens"),
    wardrobes: resolve("wardrobes"),
    hardware: resolve("hardware"),
  };
}
