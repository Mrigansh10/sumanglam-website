"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Page transition: a calm enter-only fade/rise on every route change.
 * template.tsx remounts per navigation (unlike layout), which is what makes
 * the animation replay. Enter-only is deliberate — true exit animations on
 * the App Router need the fragile "frozen router" hack and break scroll
 * restoration, so we don't. searchParams-only changes (filters, pagination)
 * don't remount the template, so browsing products doesn't replay the fade.
 *
 * The header, footer, and floating WhatsApp button live in layout.tsx outside
 * this wrapper — keep it that way: an ancestor transform would re-anchor
 * their `position: fixed`.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
