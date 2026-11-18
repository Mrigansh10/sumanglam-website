/**
 * Turns a product's raw spec map (`technical_specs_json`, transcribed from the
 * brand's price list) into what the public pages show.
 *
 * Prices are never shown on the site (customers ask on WhatsApp), so any value
 * carrying a ₹ amount is dropped, and per-variant price rows become a plain
 * list of variant names.
 */

export type ProductFacts = {
  /** "Key Features" split into items, warranty pulled out. */
  features: string[];
  /** Variant names, without prices. */
  variants: string[];
  /** Remaining spec rows, safe to show. */
  specs: [string, string][];
};

const VARIANT_PREFIX = "Variant – ";

export function productFacts(raw: unknown): ProductFacts {
  const input =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : ({} as Record<string, unknown>);
  const features: string[] = [];
  const variants: string[] = [];
  const specs: [string, string][] = [];
  let warranty: string | null = null;

  for (const [key, rawValue] of Object.entries(input)) {
    const value = String(rawValue ?? "").trim();
    if (!value) continue;

    if (key === "Key Features") {
      for (const item of value.split(",").map((part) => part.trim()).filter(Boolean)) {
        if (/warranty/i.test(item)) warranty = item.charAt(0).toUpperCase() + item.slice(1);
        else features.push(item);
      }
      continue;
    }
    if (key.startsWith(VARIANT_PREFIX)) {
      // "Variant – Yzuri/AB (Antique Bronze)" → "Antique Bronze"; "Variant – Gold" → "Gold"
      const name = key.slice(VARIANT_PREFIX.length);
      variants.push(name.match(/\(([^)]+)\)\s*$/)?.[1] ?? name);
      continue;
    }
    if (key === "Variants") {
      variants.push(...value.split(",").map((part) => part.trim()).filter(Boolean));
      continue;
    }

    const clean = value.replace(/\s*\(MRP[^)]*\)/gi, "").trim();
    if (clean.includes("₹")) continue;
    specs.push([key, clean]);
  }

  if (warranty) specs.push(["Warranty", warranty]);
  return { features, variants, specs };
}

/**
 * Category-specific quick filters, matched against a product's features and
 * description. Categories without an entry just get search.
 */
export const CATEGORY_FACETS: Record<
  string,
  { label: string; options: { value: string; keywords: string[] }[] }
> = {
  "digital-locks": {
    label: "Opens with",
    options: [
      { value: "Face", keywords: ["face"] },
      { value: "Fingerprint", keywords: ["biometric", "fingerprint"] },
      { value: "PIN", keywords: ["pin"] },
      { value: "Card", keywords: ["rfid"] },
      { value: "App", keywords: ["bluetooth", "ble"] },
    ],
  },
  "wardrobe-locks": {
    label: "Opens with",
    options: [
      { value: "Fingerprint", keywords: ["biometric", "fingerprint"] },
      { value: "PIN", keywords: ["pin code", "pincode"] },
    ],
  },
  safes: {
    label: "Opens with",
    options: [
      { value: "Fingerprint", keywords: ["biometric", "fingerprint"] },
      { value: "PIN", keywords: ["pin code"] },
      { value: "Key", keywords: ["mechanical key"] },
      { value: "App", keywords: ["yale home app"] },
    ],
  },
};

export function facetValues(
  categorySlug: string | undefined,
  facts: ProductFacts,
  description?: string | null,
): string[] {
  const facet = categorySlug ? CATEGORY_FACETS[categorySlug] : undefined;
  if (!facet) return [];
  const haystack = `${facts.features.join(" ")} ${description ?? ""}`.toLowerCase();
  return facet.options
    .filter((option) => option.keywords.some((keyword) => new RegExp(`\\b${keyword}`).test(haystack)))
    .map((option) => option.value);
}
