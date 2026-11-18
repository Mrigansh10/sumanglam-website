/** One-line intros for hardware category tiles and pages. Add one per new category. */
export const CATEGORY_COPY: Record<string, string> = {
  "digital-locks": "Smart locks that open with a fingerprint, PIN, card, app or your face.",
  "wardrobe-locks": "Fingerprint, PIN and key locks for wardrobes, drawers and cabinets.",
  "smart-home": "Video doorbells, cameras, video door phones and add-ons for Yale smart locks.",
  safes: "Home, office and laptop safes that open with a fingerprint, PIN, key or app.",
  handles: "Lever handles on a rose or backplate, in brass, stainless steel and PVD finishes.",
  "door-controls": "Surface-mounted and concealed door closers, sized to the door's width and weight.",
  "locks-and-security": "Mortise and rim locks, cylinders, locksets and padlocks for every kind of door.",
  hinges: "Ball-bearing door hinges and soft-close cabinet hinges.",
  "furniture-fittings": "Drawer runners and the fittings that make cabinets move smoothly.",
  "architectural-hardware": "Door stoppers, door viewers and the small fittings that finish a door.",
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
