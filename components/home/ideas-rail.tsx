"use client";

import { useRef } from "react";
import Link from "next/link";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { ArrowLink } from "@/components/home/arrow-button";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { HomepageIdea } from "@/server/homepage";

/**
 * Kitchen inspirations as a horizontal rail: wide and narrow cards alternate.
 * It moves only on the arrows or a swipe — never by itself. `data-lenis-prevent`
 * keeps the site's smooth scroll from swallowing horizontal trackpad gestures.
 */
export function IdeasRail({ ideas }: { ideas: HomepageIdea[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  function step(direction: 1 | -1) {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>("[data-card]");
    if (!rail || !card) return;
    rail.scrollBy({ left: direction * (card.offsetWidth + 20), behavior: "smooth" });
  }

  return (
    <section aria-labelledby="ideas-heading" className="pb-2 pt-[120px] font-tight lg:pb-4 lg:pt-40">
      <div className="mx-auto mb-11 grid max-w-[1480px] gap-6 px-[22px] lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16 lg:px-10">
        <h2
          id="ideas-heading"
          className="max-w-[12ch] text-[clamp(36px,5.6vw,88px)] font-medium leading-[0.98] tracking-[-0.04em]"
        >
          Ideas, drawn for Indian homes.
        </h2>
        <div className="grid justify-items-start gap-6 lg:justify-items-end lg:text-right">
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Kitchens we&apos;ve designed. Browse them for the finishes, layouts and storage you&apos;d
            want in your own.
          </p>
          <div className="flex gap-2">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => step(direction)}
                aria-label={direction === 1 ? "Next ideas" : "Previous ideas"}
                className="size-12 rounded-lg border border-fg/20 text-lg font-medium transition-colors duration-300 hover:bg-fg hover:text-page"
              >
                {direction === 1 ? "→" : "←"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        data-lenis-prevent
        className="flex snap-x snap-mandatory scroll-px-[22px] gap-4 overflow-x-auto px-[22px] pb-2 [scrollbar-width:none] lg:scroll-px-10 lg:items-start lg:gap-5 lg:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {ideas.map((idea, index) => {
          const wide = index % 2 === 0;
          return (
            <Link
              key={idea.id}
              href="/inspiration?space=kitchen"
              data-card
              className={cn(
                "group shrink-0 snap-start",
                wide ? "w-[86vw] lg:w-[46vw] lg:max-w-[720px]" : "w-[66vw] lg:w-[25vw] lg:max-w-[400px]",
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl bg-card lg:rounded-[20px]",
                  wide ? "aspect-[3/2]" : "aspect-[4/5]",
                )}
              >
                <FadeInImage
                  src={resolveImage(idea.primaryImage, { width: 1400, enhance: "render" })}
                  alt={idea.title}
                  fill
                  sizes={wide ? "(min-width: 1024px) 46vw, 86vw" : "(min-width: 1024px) 25vw, 66vw"}
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <p className="mt-3 text-sm font-medium">{idea.title}</p>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-12 flex max-w-[1480px] justify-end px-[22px] lg:px-10">
        <ArrowLink href="/inspiration">All inspirations</ArrowLink>
      </div>
    </section>
  );
}
