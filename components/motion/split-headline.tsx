"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

type SplitHeadlineProps = {
  children: string;
  className?: string;
  /** Delay before the reveal starts (seconds). */
  delay?: number;
  /** Split granularity. "words" reads calmer; "chars" is showier. */
  by?: "words" | "chars";
  as?: "h1" | "h2" | "h3";
};

/**
 * Premium masked reveal for hero headlines (GSAP SplitText, free since 3.13).
 * Each word/char slides up from behind its own line (mask), staggered. The
 * text is present in the DOM for SEO and shows immediately without JS or under
 * reduced motion — motion is progressive enhancement, matching <Reveal>.
 */
export function SplitHeadline({
  children,
  className,
  delay = 0,
  by = "words",
  as: Tag = "h1",
}: SplitHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(el, { type: by, mask: by });
      // The mask boxes clip to the line box, which is shorter than the glyphs
      // at tight leading — descenders (g, y) get cut off. Extend each mask's
      // clip window with padding cancelled by negative margin (no layout shift).
      for (const mask of split.masks) {
        gsap.set(mask, { padding: "0.2em 0", margin: "-0.2em 0" });
      }
      const units = by === "words" ? split.words : split.chars;
      gsap.from(units, {
        yPercent: 150,
        duration: 0.95,
        ease: "power4.out",
        stagger: 0.07,
        delay,
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, by]);

  return (
    <Tag ref={ref} className={cn("split-headline", className)}>
      {children}
    </Tag>
  );
}
