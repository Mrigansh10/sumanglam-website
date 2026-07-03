"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Short accent rule that draws itself in (scaleX 0 → 1) when scrolled into
 * view. Purely decorative — visible at full width without JS or under
 * reduced motion. Progressive enhancement, matching <Reveal>.
 */
export function DrawRule({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn("inline-block h-px w-7 origin-left bg-accent", className)}
    />
  );
}
