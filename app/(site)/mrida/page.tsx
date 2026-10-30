import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { ArrowButton, ArrowLink } from "@/components/home/arrow-button";
import { WhatsAppArrowButton } from "@/components/home/whatsapp-arrow-button";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mrida — Kitchens, Wardrobes & Interiors in Jaipur",
  description:
    "Mrida is Sumanglam's own brand of kitchens, wardrobes and interiors in Jaipur, designed around how your family lives, measured to your walls and installed by our team.",
};

const points = [
  {
    title: "Measured to your walls",
    copy: "Every unit is sized to your room, so the kitchen or wardrobe fits the space instead of the other way round.",
  },
  {
    title: "Planned around your routine",
    copy: "Where the masala goes, how tall the larder is, which side the wardrobe opens. Decided before anything is drawn.",
  },
  {
    title: "Fitted with brands we carry",
    copy: "Hardware from Häfele and appliances from Bosch, Siemens and Liebherr, chosen at our showroom.",
  },
  {
    title: "Installed by our team",
    copy: "We fit it ourselves, start to finish, so one team answers for the result.",
  },
];

// Every kitchen render on the site is a Mrida design (confirmed 2026-10-26).
// Angles are picked per design so no image repeats the header.
const kitchens = [
  {
    image: "sumanglam/inspirations/greige-floating-shelf-kitchen-1",
    title: "Greige Kitchen with Floating Shelves",
    line: "Suspended black-steel shelving over a display island.",
    className: "lg:col-span-8 lg:[&_[data-shot]]:aspect-[8/5.4]",
  },
  {
    image: "sumanglam/inspirations/ivory-open-plan-kitchen-2",
    title: "Warm Ivory Open-Plan Kitchen",
    line: "Light oak, quiet greys and a breakfast corner.",
    className: "lg:col-span-4 lg:[&_[data-shot]]:aspect-[4/5.4]",
    position: "40% 50%",
  },
  {
    image: "sumanglam/inspirations/grey-walnut-island-kitchen-1",
    title: "Grey & Walnut Luxe Island Kitchen",
    line: "Book-matched marble, fluted walnut and a sculpted island.",
    className: "lg:col-span-4",
  },
  {
    image: "sumanglam/inspirations/dove-grey-walnut-kitchen-1",
    title: "Dove Grey & Walnut Kitchen",
    line: "Soft grey frames, mullioned glass and walnut drawers.",
    className: "lg:col-span-4",
  },
  {
    image: "sumanglam/inspirations/taupe-charcoal-evening-kitchen-3",
    title: "Taupe & Charcoal Evening Kitchen",
    line: "Two-tone gloss under warm cove light.",
    className: "lg:col-span-4",
  },
  {
    image: "sumanglam/inspirations/pearl-gold-classic-kitchen-1",
    title: "Pearl & Gold Classic Kitchen",
    line: "A classical white kitchen with a canopy island.",
    className: "lg:col-span-6",
  },
  {
    image: "sumanglam/inspirations/sage-green-classic-kitchen-1",
    title: "Sage Green Classic Kitchen",
    line: "Arched vitrines, brass hardware and marble on one wall.",
    className: "lg:col-span-6",
  },
];

const wardrobes = [
  {
    title: "Bronze Glass Walk-In",
    line: "Smoked-glass doors in bronze frames, lit from within.",
    image: "sumanglam/inspirations/bronze-glass-walk-in-1",
    angles: ["sumanglam/inspirations/bronze-glass-walk-in-2", "sumanglam/inspirations/bronze-glass-walk-in-3"],
  },
  {
    title: "Ivory Jali Walk-In",
    line: "Fluted panels, arched jali doors and a lit vanity island.",
    image: "sumanglam/inspirations/ivory-jali-walk-in-1",
    angles: ["sumanglam/inspirations/ivory-jali-walk-in-3", "sumanglam/inspirations/ivory-jali-walk-in-4"],
  },
];

const rest = ["TV units", "Vanities", "Study corners", "Storage walls"];

const h2 = "text-[clamp(36px,5.6vw,88px)] font-medium leading-[0.98] tracking-[-0.04em]";

export default function MridaPage() {
  return (
    <div className="font-tight">
      <PageViewTracker event="brand_viewed" sourceType="brand" sourceId="mrida" />

      {/* Header: same pattern as Kitchens */}
      <section className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10 lg:pt-[136px]">
        <div className="mb-9 grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <h1 className="animate-fade-up text-[clamp(64px,13vw,210px)] font-semibold leading-[0.82] tracking-[-0.035em]">
            Mrida
          </h1>
          <div className="grid justify-items-start gap-[22px] animate-fade-up [animation-delay:120ms] lg:max-w-[400px] lg:pb-3.5">
            <p className="text-[17px] leading-normal text-fg/60">
              Our own brand of kitchens and wardrobes, designed for your home and measured to your
              walls.
            </p>
            <ArrowButton href="/book-consultation" size="lg">
              Book a consultation
            </ArrowButton>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card sm:aspect-[16/8.2] lg:rounded-[20px]">
          <Image
            src={resolveImage("sumanglam/inspirations/taupe-charcoal-evening-kitchen-1", {
              width: 2400,
              enhance: "render",
            })}
            alt="Taupe and charcoal Mrida kitchen with a lit island shelf"
            fill
            priority
            sizes="(min-width: 1480px) 1400px, 100vw"
            className="object-cover object-[50%_55%]"
          />
        </div>
      </section>

      {/* Designed for the home you have */}
      <section
        aria-labelledby="home-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10"
      >
        <div className="grid gap-[22px] lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <h2 id="home-heading" className={h2}>
            Designed for the home you have.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Mrida doesn&apos;t start from a catalogue page. It starts from your floor plan and how
            your family cooks, dresses and stores things.
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

      {/* Kitchens by Mrida */}
      <section
        aria-labelledby="kitchens-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
      >
        <div className="mb-11 flex flex-wrap items-end justify-between gap-[22px]">
          <div>
            <h2 id="kitchens-heading" className={h2}>
              Kitchens by Mrida.
            </h2>
            <p className="mt-[18px] max-w-[46ch] text-[17px] leading-normal text-fg/60">
              Every kitchen design on this site is a Mrida design.
            </p>
          </div>
          <ArrowLink href="/inspiration?space=kitchen">All kitchen ideas</ArrowLink>
        </div>
        <div className="grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-12">
          {kitchens.map((kitchen) => (
            <Link
              key={kitchen.image}
              href="/inspiration?space=kitchen"
              className={cn("group", kitchen.className)}
            >
              <div
                data-shot
                className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-card lg:rounded-[20px]"
              >
                <FadeInImage
                  src={resolveImage(kitchen.image, { width: 1400, enhance: "render" })}
                  alt={kitchen.title}
                  fill
                  sizes="(min-width: 1024px) 66vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
                  style={kitchen.position ? { objectPosition: kitchen.position } : undefined}
                />
              </div>
              <p className="mt-3 text-[15px] font-medium">{kitchen.title}</p>
              <p className="mt-0.5 max-w-[60ch] text-[15px] text-fg/60">{kitchen.line}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Wardrobes: the dark break. Fixed charcoal/ivory in both modes. */}
      <section
        aria-labelledby="wardrobes-heading"
        className="mt-[140px] bg-charcoal pb-14 pt-24 text-ivory lg:pb-16 lg:pt-32"
      >
        <div className="mx-auto max-w-[1480px] px-[22px] lg:px-10">
          <div className="mb-14 grid gap-[22px] lg:grid-cols-2 lg:items-end">
            <h2 id="wardrobes-heading" className={h2}>
              Wardrobes, only by Mrida.
            </h2>
            <div className="grid justify-items-start gap-[22px]">
              <p className="max-w-[46ch] text-[17px] leading-normal text-ivory/65">
                Walk-ins, sliding systems and full storage walls, planned around what you actually
                own.
              </p>
              <ArrowButton href="/wardrobes" tone="light" size="lg">
                See wardrobes
              </ArrowButton>
            </div>
          </div>
          {wardrobes.map((wardrobe, index) => (
            <article
              key={wardrobe.title}
              className={cn(
                "mb-12 grid gap-3.5 last:mb-0 lg:gap-4",
                index % 2 === 1
                  ? "lg:grid-cols-[1fr_1.5fr] lg:[grid-template-areas:'smalls_big'_'cap_cap']"
                  : "lg:grid-cols-[1.5fr_1fr] lg:[grid-template-areas:'big_smalls'_'cap_cap']",
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#2e2820] lg:rounded-[20px] lg:[grid-area:big]">
                <FadeInImage
                  src={resolveImage(wardrobe.image, { width: 1400, enhance: "render" })}
                  alt={wardrobe.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5 lg:gap-4 lg:[grid-area:smalls]">
                {wardrobe.angles.map((angle) => (
                  <div
                    key={angle}
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#2e2820] lg:aspect-auto lg:rounded-[20px]"
                  >
                    <FadeInImage
                      src={resolveImage(angle, { width: 1400, enhance: "render" })}
                      alt={`${wardrobe.title}, another angle`}
                      fill
                      sizes="(min-width: 1024px) 20vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap justify-between gap-x-5 gap-y-1.5 pt-1.5 lg:[grid-area:cap]">
                <h3 className="text-[clamp(24px,2.4vw,34px)] font-semibold tracking-[-0.04em]">
                  {wardrobe.title}
                </h3>
                <p className="max-w-[48ch] text-[15px] text-ivory/60">{wardrobe.line}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* And the rest of the home */}
      <section
        aria-labelledby="rest-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
      >
        <div className="mb-7 grid gap-[22px] lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <h2 id="rest-heading" className={h2}>
            And the rest of the home.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Mrida designs the furniture around your kitchen and wardrobes too, in the same finishes,
            so the house reads as one.
          </p>
        </div>
        <ul className="grid lg:grid-cols-2 lg:gap-x-10">
          {rest.map((item) => (
            <li
              key={item}
              className="-mb-px border-y border-fg/15 py-[18px] text-[clamp(24px,2.6vw,38px)] font-medium tracking-[-0.035em]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Closing statement */}
      <section
        aria-labelledby="start-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-40 lg:px-10"
      >
        <h2
          id="start-heading"
          className="max-w-[12ch] text-[clamp(44px,8vw,132px)] font-medium leading-[0.92] tracking-[-0.05em]"
        >
          Start with your floor plan.
        </h2>
        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Bring it to the showroom, or just your room sizes. We&apos;ll design from how you live
            and install it when it&apos;s ready.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ArrowButton href="/book-consultation" size="lg">
              Book a consultation
            </ArrowButton>
            <WhatsAppArrowButton sourceType="brand" subject="Mrida" tone="outline" size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
