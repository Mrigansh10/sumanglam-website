import Link from "next/link";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { resolveImage } from "@/lib/images";
import type { HomepageImageSlots } from "@/server/site-settings";

const businesses = [
  {
    slot: "kitchens",
    title: "Kitchens",
    line: "Modular kitchens, designed and fitted",
    href: "/kitchens",
    position: "50% 55%",
  },
  {
    slot: "wardrobes",
    title: "Wardrobes",
    line: "Walk-in, sliding and modular",
    href: "/wardrobes",
    position: "50% 40%",
  },
  {
    slot: "hardware",
    title: "Hardware",
    line: "Hettich, Blum, Häfele, Yale and more",
    href: "/hardware-appliances",
    position: "30% 62%",
  },
] as const;

/**
 * The three businesses, given equal weight right under the hero: word,
 * description, photo — one row each. The first column is exactly as wide as
 * "Wardrobes" (the longest word) so the three photos line up.
 */
export function BusinessRows({ images }: { images: HomepageImageSlots }) {
  return (
    <section
      aria-label="What we do"
      className="px-[22px] pt-6 font-tight [--word:clamp(44px,5.6vw,92px)] lg:px-10 lg:pt-10"
    >
      {businesses.map((item) => (
        <Link
          key={item.slot}
          href={item.href}
          className="group grid gap-3.5 border-t border-fg/15 py-5 last:border-b lg:grid-cols-[calc(var(--word)*4.62)_1fr_40%] lg:items-center lg:gap-8 lg:py-[18px]"
        >
          <h2 className="text-[length:var(--word)] font-semibold leading-[0.9] tracking-[-0.05em] transition-colors duration-300 group-hover:text-accent-fg">
            {item.title}
          </h2>
          <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-start lg:justify-center lg:gap-[18px]">
            <p className="text-[15px] text-fg/60 lg:max-w-[24ch] lg:text-[17px] lg:leading-[1.4] lg:text-fg">
              {item.line}
            </p>
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-[17px] text-background transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </div>
          <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-card lg:aspect-[2.4/1]">
            <FadeInImage
              src={resolveImage(images[item.slot], { width: 1400, enhance: "render" })}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
              style={{ objectPosition: item.position }}
            />
          </div>
        </Link>
      ))}
    </section>
  );
}
