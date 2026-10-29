import type { Metadata } from "next";
import Image from "next/image";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { ArrowButton } from "@/components/home/arrow-button";
import { WhatsAppArrowButton } from "@/components/home/whatsapp-arrow-button";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nolte Kitchens in Jaipur",
  description:
    "German kitchens by Nolte at Sumanglam, Jaipur. Five complete Nolte kitchens on our showroom floor, fitted out inside so you can open every drawer before you choose.",
};

// Nolte is kitchens only, so the storage wall (folder K5) stays off this page.
// Range, finish and colour names confirmed by the showroom (2026-10-29).
const kitchens = [
  {
    name: "Lugano Lack",
    range: "Nolte Kitchens · Black",
    line: "Framed black lacquer fronts, a white island with a lit oak breakfast bar, and an oak shelf tower set into the tall units.",
    image: "sumanglam/nolte/lugano-lack-black",
    alt: "Black Lugano Lack kitchen with a white island and oak breakfast bar",
    details: [
      { image: "sumanglam/nolte/lugano-lack-detail-1", alt: "Pull-out larder with spice racks in a black tall unit", position: "50% 40%" },
      { image: "sumanglam/nolte/lugano-lack-detail-2", alt: "Oven and pull-out drawer in the black tall units, beside a lit oak shelf", position: "60% 50%" },
    ],
  },
  {
    name: "NeoLodge",
    range: "Nolte Neo · Black",
    line: "Fluted fronts in black, a slate-look worktop, and glass-fronted tall units lit from inside.",
    image: "sumanglam/nolte/neolodge-black",
    alt: "Black fluted NeoLodge kitchen with lit glass tall units",
    details: [
      { image: "sumanglam/nolte/neolodge-detail-1", alt: "Fluted black tall units around a lit glass cabinet", position: "30% 50%" },
      { image: "sumanglam/nolte/neolodge-detail-2", alt: "Fluted black run with built-in ovens and a lit glass cabinet", position: "70% 50%" },
    ],
  },
  {
    name: "Velluto",
    range: "Nolte Kitchens · Lava",
    line: "Soft matt fronts in Lava, an oak island with a breakfast bar, and a lit oak shelf running floor to ceiling.",
    image: "sumanglam/nolte/velluto-lava",
    alt: "Velluto kitchen in Lava with an oak island",
    details: [
      { image: "sumanglam/nolte/velluto-detail-1", alt: "Lava tall units with a lit oak shelf and wine rack", position: "70% 50%" },
      { image: "sumanglam/nolte/velluto-detail-2", alt: "Oak island with a hob and breakfast bar", position: "40% 60%" },
    ],
  },
  {
    name: "Lux",
    range: "Nolte Kitchens · White",
    line: "A long, handleless white gloss run with light lines along every drawer, an oak back panel and open oak shelving.",
    image: "sumanglam/nolte/lux-white",
    alt: "Handleless white gloss Lux kitchen with an oak back panel",
    details: [
      { image: "sumanglam/nolte/lux-detail-1", alt: "White gloss run with a lit oak shelf unit", position: "75% 50%" },
      { image: "sumanglam/nolte/lux-detail-2", alt: "White gloss drawer edge against an oak back panel", position: "40% 50%" },
    ],
  },
  {
    name: "Clean",
    range: "Express Kitchens · Black green",
    line: "Fronts in black green with oak open boxes, a stacked oven tower, and a sink run along the window.",
    image: "sumanglam/nolte/express-clean-black-green",
    alt: "Black green Express Clean kitchen with oak open boxes",
    details: [
      { image: "sumanglam/nolte/express-clean-detail-1", alt: "Black green fronts with oak open boxes", position: "70% 50%" },
      { image: "sumanglam/nolte/express-clean-detail-2", alt: "Black green run with the sink and hob", position: "30% 50%" },
    ],
  },
];

const inside = [
  { image: "sumanglam/nolte/inside-1", alt: "Drawers pulled open under a black island", position: "40% 50%" },
  { image: "sumanglam/nolte/inside-2", alt: "Inner drawers in a white tall unit", position: "50% 50%" },
  { image: "sumanglam/nolte/inside-3", alt: "Oak cutlery insert in an island drawer", position: "62% 50%" },
  { image: "sumanglam/nolte/inside-4", alt: "Lit oak shelving beside an oak breakfast table", position: "20% 50%" },
];

const h2 = "text-[clamp(36px,5.6vw,88px)] font-medium leading-[0.98] tracking-[-0.04em]";

export default function NoltePage() {
  return (
    <div className="font-tight">
      <PageViewTracker event="brand_viewed" sourceType="brand" sourceId="nolte" />

      {/* Header: same pattern as Kitchens */}
      <section className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10 lg:pt-[136px]">
        <div className="mb-9 grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <h1 className="animate-fade-up text-[clamp(64px,13vw,210px)] font-semibold leading-[0.82] tracking-[-0.035em]">
            Nolte
          </h1>
          <div className="grid justify-items-start gap-[22px] animate-fade-up [animation-delay:120ms] lg:max-w-[400px] lg:pb-3.5">
            <p className="text-[17px] leading-normal text-fg/60">
              German kitchens by Nolte. Five are set up on our showroom floor, fitted out inside, so
              you can open every drawer before you choose.
            </p>
            <ArrowButton href="/book-consultation" size="lg">
              Book a kitchen consultation
            </ArrowButton>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card sm:aspect-[16/8.2] lg:rounded-[20px]">
          <Image
            src={resolveImage("sumanglam/nolte/showroom-floor", { width: 2400 })}
            alt="Nolte kitchens on the Sumanglam showroom floor"
            fill
            priority
            sizes="(min-width: 1480px) 1400px, 100vw"
            className="object-cover object-[45%_55%]"
          />
        </div>
      </section>

      {/* Five kitchens on the floor, alternating sides on desktop */}
      <section
        aria-labelledby="floor-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-16 lg:px-10 lg:pt-20"
      >
        <div className="mb-16 grid gap-[22px] lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <h2 id="floor-heading" className={h2}>
            Five kitchens on our floor.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Each one is a complete kitchen, not a sample door. Walk around them and open everything.
          </p>
        </div>
        {kitchens.map((kitchen, index) => {
          const flip = index % 2 === 1;
          return (
            <article
              key={kitchen.name}
              className={cn(
                "mb-24 grid gap-3.5 border-t border-fg/15 pt-7 lg:gap-x-5 lg:gap-y-4",
                flip
                  ? "lg:grid-cols-[1fr_1.55fr] lg:[grid-template-areas:'meta_meta'_'smalls_big']"
                  : "lg:grid-cols-[1.55fr_1fr] lg:[grid-template-areas:'meta_meta'_'big_smalls']",
              )}
            >
              <div className="mb-3.5 grid gap-2 lg:mb-2.5 lg:grid-cols-2 lg:items-end lg:gap-10 lg:[grid-area:meta]">
                <div>
                  <p className="mb-2.5 text-[15px] font-medium text-accent-fg">{kitchen.range}</p>
                  <h3 className="text-[clamp(30px,3.4vw,52px)] font-semibold leading-none tracking-[-0.045em]">
                    {kitchen.name}
                  </h3>
                </div>
                <p className="max-w-[52ch] text-base leading-[1.45] text-fg/60">{kitchen.line}</p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card lg:aspect-[16/11] lg:rounded-[20px] lg:[grid-area:big]">
                <FadeInImage
                  src={resolveImage(kitchen.image, { width: 1800 })}
                  alt={kitchen.alt}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-1 lg:grid-rows-2 lg:gap-4 lg:[grid-area:smalls]">
                {kitchen.details.map((detail) => (
                  <div
                    key={detail.image}
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card lg:aspect-auto lg:rounded-[20px]"
                  >
                    <FadeInImage
                      src={resolveImage(detail.image, { width: 1000 })}
                      alt={detail.alt}
                      fill
                      sizes="(min-width: 1024px) 38vw, 50vw"
                      className="object-cover"
                      style={{ objectPosition: detail.position }}
                    />
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      {/* Built to be opened: the dark break. Fixed charcoal/ivory in both modes. */}
      <section
        aria-labelledby="opened-heading"
        className="mt-11 bg-charcoal pb-12 pt-24 text-ivory lg:pt-32"
      >
        <div className="mx-auto max-w-[1480px] px-[22px] lg:px-10">
          <div className="mb-14 grid gap-[22px] lg:grid-cols-2 lg:items-end">
            <h2 id="opened-heading" className={h2}>
              Built to be opened.
            </h2>
            <p className="max-w-[46ch] text-[17px] leading-normal text-ivory/65">
              Every kitchen on our floor is fitted out inside: drawers, larders, ovens. Some of the
              appliances are connected, so you can see them working.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-4">
            {inside.map((shot) => (
              <div
                key={shot.image}
                className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#2e2820] lg:rounded-[20px] lg:even:mt-14"
              >
                <FadeInImage
                  src={resolveImage(shot.image, { width: 900 })}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: shot.position }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section
        aria-labelledby="plan-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-40 lg:px-10"
      >
        <h2
          id="plan-heading"
          className="max-w-[12ch] text-[clamp(44px,8vw,132px)] font-medium leading-[0.92] tracking-[-0.05em]"
        >
          Plan your Nolte kitchen.
        </h2>
        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Start at the showroom with the kitchens in front of you, then sit down with us to plan
            yours around how you cook.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ArrowButton href="/book-consultation" size="lg">
              Book a kitchen consultation
            </ArrowButton>
            <WhatsAppArrowButton sourceType="brand" subject="Nolte kitchens" tone="outline" size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
