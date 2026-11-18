import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { ArrowButton } from "@/components/home/arrow-button";
import { WhatsAppArrowButton } from "@/components/home/whatsapp-arrow-button";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Built-in Kitchen Appliances in Jaipur — Bosch, Siemens, Liebherr, Häfele, Blaupunkt",
  description:
    "Built-in ovens, hobs, chimneys, coffee machines, fridges and dishwashers from Bosch, Siemens, Liebherr, Häfele and Blaupunkt, at Sumanglam's Jaipur showroom. For a new kitchen, or the one you have.",
};

const points = [
  {
    title: "Chosen before the cabinets",
    copy: "Each built-in model has its own cut-out, so we pick appliances at the first drawing, not after.",
  },
  {
    title: "Placed for how you cook",
    copy: "Ovens at eye level in a tall unit, the hob where you stand, a chimney matched to the hob below it.",
  },
  {
    title: "Or just the one you need",
    copy: "Replacing a single oven or hob? Bring the size of the space and choose at the showroom.",
  },
  {
    title: "Installed with the brand's expert",
    copy: "Our team does the installation, with an expert from the brand on site to guide it.",
  },
];

type Shot = { image: string; alt: string; position?: string; credit?: string };

// Brand images (credited) come from the brands' own sites; the rest are our
// showroom photos. None of them repeat an image used on another page.
const jobs: {
  title: string;
  items: string[];
  copy: string;
  layout: "cook" | "pair" | "solo";
  shots: Shot[];
}[] = [
  {
    title: "Cooking",
    items: ["Ovens", "Microwaves", "Gas hobs", "Induction hobs"],
    copy: "Ovens stacked in tall units at a height you can reach, hobs set flush into the counter or the island.",
    layout: "cook",
    shots: [
      { image: "sumanglam/appliances/cooking-island-hob", alt: "Gas hob and grill plate set into a white island top", position: "50% 92%" },
      { image: "sumanglam/appliances/bosch-gas-hob", alt: "Gas burner lit on a black glass hob", credit: "Bosch" },
      { image: "sumanglam/appliances/cooking-double-oven", alt: "Two built-in ovens stacked in a sage green tall unit", position: "75% 50%" },
    ],
  },
  {
    title: "Chimneys & hoods",
    items: ["Wall chimneys", "Island hoods"],
    copy: "Sized to the hob below it, on the wall or hung over an island.",
    layout: "pair",
    shots: [
      { image: "sumanglam/appliances/siemens-downdraft-hood", alt: "Glass downdraft hood rising behind an induction hob on a stone island", credit: "Siemens" },
      { image: "sumanglam/appliances/hood-island", alt: "Hood above an island hob, seen from the end of the island", position: "50% 35%" },
    ],
  },
  {
    title: "Coffee",
    items: ["Built-in coffee machines"],
    copy: "Fitted into the tall units at the same line as the ovens, so the wall reads as one.",
    layout: "solo",
    shots: [
      { image: "sumanglam/appliances/siemens-coffee", alt: "Built-in coffee machine above a warming drawer in a dark tall unit", credit: "Siemens" },
    ],
  },
  {
    title: "Cooling",
    items: ["Refrigerators", "Wine coolers"],
    copy: "Integrated fridges and wine storage behind cabinet doors, or on show.",
    layout: "solo",
    shots: [
      { image: "sumanglam/appliances/siemens-fridge", alt: "Built-in fridge open in a column of tall units beside built-in ovens", position: "50% 40%", credit: "Siemens" },
    ],
  },
  {
    title: "Cleaning",
    items: ["Dishwashers"],
    copy: "Fully or semi-integrated, built in under the counter beside the sink or the hob.",
    layout: "pair",
    shots: [
      { image: "sumanglam/appliances/dishwasher-integrated", alt: "Semi-integrated dishwasher under an oak worktop, gas hob above", position: "50% 70%" },
      { image: "sumanglam/appliances/dishwasher-panel", alt: "Dishwasher control panel set into a taupe base unit", position: "50% 60%" },
    ],
  },
];

const showroom: Shot[] = [
  { image: "sumanglam/appliances/showroom-coffee-oven", alt: "Built-in coffee machine and oven in dark fluted tall units on our showroom floor", position: "70% 50%" },
  { image: "sumanglam/appliances/showroom-ovens", alt: "Built-in ovens in a dark kitchen on our showroom floor", position: "60% 50%" },
];

const brands = [
  { name: "Bosch", slug: "bosch", line: "Ovens, hobs, dishwashers and built-in solutions." },
  { name: "Siemens", slug: "siemens", line: "Built-in appliances with a refined, modern design." },
  { name: "Liebherr", slug: "liebherr", line: "Refrigeration and wine storage." },
  { name: "Häfele", slug: "hafele", line: "Appliances alongside the fittings it's known for." },
  { name: "Blaupunkt", slug: "blaupunkt", line: "Built-in kitchen appliances with German design heritage." },
];

const h2 = "text-[clamp(36px,5.6vw,88px)] font-medium leading-[0.98] tracking-[-0.04em]";

// Per-layout shot frames: index 0 is the lead shot.
const shotFrame: Record<(typeof jobs)[number]["layout"], (index: number) => string> = {
  cook: (index) =>
    index === 0
      ? "aspect-[3/4] lg:row-span-2 lg:aspect-auto"
      : "aspect-[4/3] lg:aspect-[3/2]",
  pair: () => "aspect-[4/3] lg:aspect-auto lg:h-[520px]",
  solo: () => "col-span-2 aspect-[4/3] lg:aspect-[16/9]",
};

const shotGrid: Record<(typeof jobs)[number]["layout"], string> = {
  cook: "lg:grid-cols-[1fr_1.25fr] lg:grid-rows-2",
  pair: "lg:grid-cols-[1.5fr_1fr]",
  solo: "",
};

function Credit({ brand }: { brand: string }) {
  return (
    <span className="absolute bottom-3 left-3 rounded-md bg-charcoal/70 px-[9px] py-[5px] text-xs text-ivory">
      Image: {brand}
    </span>
  );
}

export default function AppliancesPage() {
  return (
    <div className="font-tight">
      <PageViewTracker event="inspiration_viewed" sourceType="appliances" />

      {/* Header: same pattern as Kitchens */}
      <section className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10 lg:pt-[136px]">
        <div className="mb-9 grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <h1 className="animate-fade-up text-[clamp(64px,13vw,210px)] font-semibold leading-[0.82] tracking-[-0.035em]">
            Appliances
          </h1>
          <div className="grid justify-items-start gap-[22px] animate-fade-up [animation-delay:120ms] lg:max-w-[400px] lg:pb-3.5">
            <p className="text-[17px] leading-normal text-fg/60">
              Built-in ovens, hobs, chimneys, coffee machines, fridges and dishwashers from Bosch,
              Siemens, Liebherr, Häfele and Blaupunkt. For a new kitchen, or the one you have.
            </p>
            <ArrowButton href="/book-consultation" size="lg">
              Book a consultation
            </ArrowButton>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card sm:aspect-[16/8.2] lg:rounded-[20px]">
          <Image
            src={resolveImage("sumanglam/appliances/siemens-oven-wall", { width: 2400 })}
            alt="Dark kitchen with a wall of built-in ovens and a coffee machine behind an island"
            fill
            priority
            sizes="(min-width: 1480px) 1400px, 100vw"
            className="object-cover object-[50%_45%]"
          />
          <Credit brand="Siemens" />
        </div>
      </section>

      {/* Planned in, not added on */}
      <section
        aria-labelledby="planned-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10"
      >
        <div className="grid gap-[22px] lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
          <h2 id="planned-heading" className={h2}>
            Planned in, not added on.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            A built-in appliance is part of the cabinetry. Choose it early and everything around it
            fits.
          </p>
        </div>
        <ol className="mt-14 grid border-t border-fg/15 lg:grid-cols-4 lg:border-b">
          {points.map((point, index) => (
            <li
              key={point.title}
              className="grid content-start gap-2 border-b border-fg/15 py-6 lg:border-b-0 lg:pb-2 lg:pr-8 lg:pt-7 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-8"
            >
              <span className="text-sm font-medium text-accent-fg">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[clamp(22px,2vw,28px)] font-semibold leading-tight tracking-[-0.035em]">
                {point.title}
              </h3>
              <p className="max-w-[40ch] text-base leading-[1.45] text-fg/60">{point.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* What goes in: by job */}
      <section
        aria-labelledby="jobs-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
      >
        <div className="mb-12 grid gap-[18px] lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <h2 id="jobs-heading" className={h2}>
            What goes in.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            We have displays across every group, with something from each brand we carry.
          </p>
        </div>
        {jobs.map((job, index) => {
          const flip = index % 2 === 1;
          return (
            <article
              key={job.title}
              className={cn(
                "grid gap-5 border-t border-fg/15 pb-14 pt-7 lg:gap-16 lg:pb-[72px] lg:pt-8",
                flip ? "lg:grid-cols-[1.9fr_1fr]" : "lg:grid-cols-[1fr_1.9fr]",
              )}
            >
              <div className={cn("grid content-start gap-4 lg:sticky lg:top-28 lg:self-start", flip && "lg:order-2")}>
                <span className="text-sm font-medium text-accent-fg">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[clamp(32px,3.6vw,56px)] font-semibold leading-none tracking-[-0.04em]">
                  {job.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {job.items.map((item) => (
                    <li key={item} className="rounded-lg bg-card px-[13px] py-[9px] text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="max-w-[40ch] text-base leading-[1.45] text-fg/60">{job.copy}</p>
              </div>
              <div className={cn("grid grid-cols-2 gap-3.5", shotGrid[job.layout])}>
                {job.shots.map((shot, shotIndex) => (
                  <div
                    key={shot.image}
                    className={cn(
                      "relative overflow-hidden rounded-2xl bg-card lg:rounded-[20px]",
                      shotFrame[job.layout](shotIndex),
                    )}
                  >
                    <FadeInImage
                      src={resolveImage(shot.image, { width: 1600 })}
                      alt={shot.alt}
                      fill
                      sizes={job.layout === "solo" ? "(min-width: 1024px) 62vw, 100vw" : "(min-width: 1024px) 36vw, 50vw"}
                      className="object-cover"
                      style={shot.position ? { objectPosition: shot.position } : undefined}
                    />
                    {shot.credit ? <Credit brand={shot.credit} /> : null}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      {/* See them in our kitchens: the dark break. Showroom photos only. */}
      <section
        aria-labelledby="showroom-heading"
        className="mt-[100px] bg-charcoal pb-14 pt-24 text-ivory lg:pb-16"
      >
        <div className="mx-auto max-w-[1480px] px-[22px] lg:px-10">
          <div className="mb-12 grid gap-[22px] lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
            <h2 id="showroom-heading" className={h2}>
              See them in our kitchens.
            </h2>
            <div className="grid justify-items-start gap-[22px]">
              <p className="max-w-[46ch] text-[17px] leading-normal text-ivory/65">
                They&apos;re fitted into the kitchens on our showroom floor, and some are connected
                and working, so you can try them before you choose.
              </p>
              <ArrowButton href="/showroom" tone="light" size="lg">
                Visit the showroom
              </ArrowButton>
            </div>
          </div>
          <div className="grid gap-3.5 sm:grid-cols-[1.4fr_1fr]">
            {showroom.map((shot) => (
              <div
                key={shot.image}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#2e2820] lg:rounded-[20px]"
              >
                <FadeInImage
                  src={resolveImage(shot.image, { width: 1600 })}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  style={shot.position ? { objectPosition: shot.position } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section
        aria-labelledby="brands-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
      >
        <div className="mb-7 grid gap-[22px] lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
          <h2 id="brands-heading" className={h2}>
            Five brands.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Each has its own page with what we carry from it.
          </p>
        </div>
        <ul>
          {brands.map((brand) => (
            <li key={brand.slug} className="-mb-px border-y border-fg/15">
              <Link href={`/brands/${brand.slug}`} className="group grid gap-1 py-5">
                <span className="flex items-center justify-between text-[clamp(28px,3.2vw,46px)] font-medium tracking-[-0.035em]">
                  {brand.name}
                  <span
                    aria-hidden
                    className="text-[0.6em] text-accent-fg transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </span>
                <span className="text-[15px] text-fg/60">{brand.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing statement */}
      <section
        aria-labelledby="choose-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-40 lg:px-10"
      >
        <h2
          id="choose-heading"
          className="max-w-[12ch] text-[clamp(44px,8vw,132px)] font-medium leading-[0.92] tracking-[-0.05em]"
        >
          Choose them in person.
        </h2>
        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Planning a kitchen or replacing one appliance, start at the showroom with them in front
            of you.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ArrowButton href="/book-consultation" size="lg">
              Book a consultation
            </ArrowButton>
            <WhatsAppArrowButton
              sourceType="brand"
              subject="built-in appliances"
              tone="outline"
              size="lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
