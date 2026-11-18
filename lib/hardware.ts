/** One-line intros for hardware category tiles and pages. Add one per new category. */
export const CATEGORY_COPY: Record<string, string> = {
  "digital-locks": "Smart locks that open with a fingerprint, PIN, card, app or your face.",
  "wardrobe-locks": "Fingerprint and PIN locks for wardrobes, drawers and cabinets.",
  "smart-home": "Video doorbells, cameras, video door phones and add-ons for Yale smart locks.",
  safes: "Home, office and laptop safes that open with a fingerprint, PIN, key or app.",
};

/** "Digital Locks" → "Digital locks", to match the site's sentence-case headings. */
export function sentenceCase(name: string) {
  return name.charAt(0) + name.slice(1).toLowerCase();
}

/** Drops a leading brand name ("Yale Luna Pro" → "Luna Pro"); the brand shows above it. */
export function displayName(name: string, brand?: string | null) {
  if (!brand) return name;
  const prefix = `${brand} `;
  return name.toLowerCase().startsWith(prefix.toLowerCase()) ? name.slice(prefix.length) : name;
}
