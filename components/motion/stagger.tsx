"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  /** Initial vertical offset each child rises from, in px. */
  y?: number;
  /** Seconds between each child's reveal. */
  each?: number;
  /** Delay before the cascade starts, in seconds. */
  delay?: number;
};

/**
 * Cascade reveal: fades/slides the *direct children* in sequence from a single
 * ScrollTrigger, so a grid of cards ripples in rather than each popping on its
 * own trigger. Drop it in place of a wrapping element (it renders a div) and
 * pass the grid classes through `className`. No-ops under reduced motion —
 * children stay visible. Progressive enhancement, matching <Reveal>.
 */
export function Stagger({
  children,
  className,
  y = 28,
  each = 0.09,
  delay = 0,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(el.children);
    if (items.length === 0) return;

    const animation = gsap.fromTo(
      items,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: each,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [y, each, delay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
