import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { ArrowButton, ArrowLink } from "@/components/home/arrow-button";
import { WhatsAppArrowButton } from "@/components/home/whatsapp-arrow-button";
import { getSpaceBySlug } from "@/server/spaces";
import { getBrandBySlug } from "@/server/brands";
import { getProductTaxonomy } from "@/server/products";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Modular Kitchens in Jaipur",
  description:
    "Premium modular kitchens in Jaipur by Nolte and Mrida — German precision, luxury acrylic and lacquer finishes, and personalized Indian design under one roof.",
};

/** Dark fluted Nolte kitchen on the showroom floor (K2-2, professional shoot). */
const NOLTE_IMAGE = "sumanglam/kitchens/showroom-k2-fluted";
/** Black oak kitchen: oven in the tall unit, island hob in front (K4-2). */
const APPLIANCES_IMAGE = "sumanglam/kitchens/showroom-k4-oven-wall";

const drawers = [
  {
    image: "sumanglam/kitchens/drawer-cutlery-oak",
    alt: "Oak cutlery insert seen from above",
    className: "lg:aspect-[4/3]",
    position: "50% 50%",
  },
  {
    image: "sumanglam/kitchens/drawer-crockery-oak",
    alt: "Open drawers holding bowls and cups in oak dividers",
    className: "lg:mt-16 lg:aspect-[3/4]",
    position: "55% 50%",
  },
  {
    image: "sumanglam/kitchens/drawer-spice-tins",
    alt: "Charcoal drawer with round spice tins",
    className: "lg:aspect-square",
    position: "35% 50%",
  },
];

// Staggered 12-column grid for the six ideas: wide/narrow, narrow/wide, half/half.
const ideaLayout = [
  "lg:col-span-7 lg:[&_[data-shot]]:aspect-[7/5.6]",
  "lg:col-span-5 lg:[&_[data-shot]]:aspect-[1/1.05]",
  "lg:col-span-5 lg:[&_[data-shot]]:aspect-[1/1.05]",
  "lg:col-span-7 lg:[&_[data-shot]]:aspect-[7/5.6]",
  "lg:col-span-6",
  "lg:col-span-6",
];

// Order the ideas grid was approved in; anything else follows in database order.
const IDEA_ORDER = [
  "taupe-charcoal-evening-kitchen",
  "ivory-open-plan-kitchen",
  "pearl-gold-classic-kitchen",
  "greige-floating-shelf-kitchen",
  "sage-green-classic-kitchen",
  "dove-grey-walnut-kitchen",
];

const h2 = "text-[clamp(36px,5.6vw,88px)] font-medium leading-[0.98] tracking-[-0.04em]";

/** "Warm Contemporary Kitchens" → "Warm contemporary". */
function styleLabel(title: string) {
  const name = title.replace(/\s+Kitchens$/i, "");
  return name.charAt(0) + name.slice(1).toLowerCase();
}

function rank(slug: string) {
  const index = IDEA_ORDER.indexOf(slug);
  return index === -1 ? IDEA_ORDER.length : index;
}

export default async function KitchensPage() {
  const [kitchenSpace, mrida, taxonomy] = await Promise.all([
    safeQuery(() => getSpaceBySlug("kitchen"), null),
    safeQuery(() => getBrandBySlug("mrida"), null),
    safeQuery(getProductTaxonomy, []),
  ]);

  const heroImage = kitchenSpace?.space.heroImage ?? "/images/placeholders/kitchen-1.svg";
  // Never repeat the header render in the ideas grid.
  const ideas = (kitchenSpace?.featuredInspirations ?? [])
    .filter((idea) => idea.primaryImage && idea.primaryImage !== heroImage)
    .sort((a, b) => rank(a.slug) - rank(b.slug))
    .slice(0, 6);
  const collections = kitchenSpace?.collections ?? [];
  const appliances =
    taxonomy
      .find((type) => type.slug === "appliance")
      ?.categories.filter((category) => !/built-in/i.test(category.name)) ?? [];

  const ways = [
    {
      title: "Nolte",
      line: "German kitchen systems. Several are set up on our showroom floor to open and try.",
      href: "/nolte",
      image: NOLTE_IMAGE,
      alt: "Dark fluted kitchen with lit glass cabinets on the showroom floor",
    },
    {
      title: "Mrida",
      line: "Our own modular kitchens, measured and made for Indian homes and the way they cook.",
      href: "/mrida",
      image: mrida?.brand.heroImage ?? "/images/placeholders/kitchen-2.svg",
      alt: "Grey modular kitchen with a lit display island",
    },
  ];

  return (
    <div className="font-tight">
      <PageViewTracker event="inspiration_viewed" sourceType="kitchens" />

      {/* Header: the word on the page, the render underneath */}
      <section className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10 lg:pt-[136px]">
        <div className="mb-9 grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <h1 className="animate-fade-up text-[clamp(64px,13vw,210px)] font-semibold leading-[0.82] tracking-[-0.035em]">
            Kitchens
          </h1>
          <div className="grid justify-items-start gap-[22px] animate-fade-up [animation-delay:120ms] lg:max-w-[380px] lg:pb-3.5">
            <p className="text-[17px] leading-normal text-fg/60">
              Planned around how you cook, then around how it looks. German systems from Nolte, or
              made to measure by Mrida.
            </p>
            <ArrowButton href="/book-consultation" size="lg">
              Book a kitchen consultation
            </ArrowButton>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card sm:aspect-[16/8.2] lg:rounded-[20px]">
          <Image
            src={resolveImage(heroImage, { width: 2400, enhance: "render" })}
            // Admin-managed (Admin → Spaces), so the alt stays generic.
            alt="A kitchen designed by Sumanglam"
            fill
            priority
            sizes="(min-width: 1480px) 1400px, 100vw"
            className="object-cover object-[50%_55%]"
          />
        </div>
      </section>

      {/* Two ways to a kitchen */}
      <section
        aria-labelledby="ways-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-16 lg:px-10 lg:pt-20"
      >
        <div className="mb-11 grid gap-[22px] lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
          <h2 id="ways-heading" className={h2}>
            Two ways to a kitchen.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Both start with the same conversation about how your family cooks. Then you choose the
            system that fits.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-5">
          {ways.map((way) => (
            <Link key={way.title} href={way.href} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card lg:rounded-[20px]">
                <FadeInImage
                  src={resolveImage(way.image, { width: 1400, enhance: "render" })}
                  alt={way.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="grid grid-cols-[1fr_auto] items-start gap-x-5 gap-y-2 pt-[22px]">
                <h3 className="text-[clamp(30px,3vw,44px)] font-semibold leading-none tracking-[-0.045em]">
                  {way.title}
                </h3>
                <span
                  aria-hidden
                  className="col-start-2 row-span-2 row-start-1 grid size-11 place-items-center rounded-lg bg-accent text-lg text-background transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
                <p className="col-start-1 max-w-[40ch] text-base leading-[1.45] text-fg/60">
                  {way.line}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Open any drawer: the dark break. Fixed charcoal/ivory in both modes. */}
      <section
        aria-labelledby="drawers-heading"
        className="mt-[140px] bg-charcoal pb-10 pt-24 text-ivory lg:pb-12 lg:pt-32"
      >
        <div className="mx-auto max-w-[1480px] px-[22px] lg:px-10">
          <div className="mb-14 grid gap-[22px] lg:grid-cols-2 lg:items-end">
            <h2 id="drawers-heading" className={h2}>
              Open any drawer.
            </h2>
            <p className="max-w-[46ch] text-[17px] leading-normal text-ivory/65">
              What&apos;s inside matters as much as the front. The kitchens on our floor are fitted
              out inside, so you can pull, open and close everything before deciding.
            </p>
          </div>
          <div className="grid gap-3.5 lg:grid-cols-[1.25fr_1fr_1fr] lg:items-start lg:gap-4">
            {drawers.map((drawer) => (
              <div
                key={drawer.image}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#2e2820] lg:rounded-[20px]",
                  drawer.className,
                )}
              >
                <FadeInImage
                  src={resolveImage(drawer.image, { width: 1400 })}
                  alt={drawer.alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: drawer.position }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kitchen ideas */}
      {ideas.length > 0 ? (
        <section
          aria-labelledby="ideas-heading"
          className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
        >
          <div className="mb-11 flex flex-wrap items-end justify-between gap-[22px]">
            <h2 id="ideas-heading" className={h2}>
              Kitchen ideas.
            </h2>
            <ArrowLink href="/inspiration?space=kitchen">All inspiration</ArrowLink>
          </div>
          <div className="grid gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-12">
            {ideas.map((idea, index) => (
              <Link
                key={idea.id}
                href="/inspiration?space=kitchen"
                className={cn("group", ideaLayout[index])}
              >
                <div
                  data-shot
                  className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-card lg:rounded-[20px]"
                >
                  <FadeInImage
                    src={resolveImage(idea.primaryImage!, { width: 1400, enhance: "render" })}
                    alt={idea.title}
                    fill
                    sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-3 text-[15px] font-medium">{idea.title}</p>
                {idea.shortDescription ? (
                  <p className="mt-0.5 max-w-[60ch] text-[15px] text-fg/60">{idea.shortDescription}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Appliances, built in */}
      <section
        aria-labelledby="appliances-heading"
        className="mx-auto grid max-w-[1480px] items-center gap-8 px-[22px] pt-[140px] lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-10"
      >
        <div className="grid justify-items-start gap-[22px]">
          <h2
            id="appliances-heading"
            className="text-[clamp(36px,4.6vw,76px)] font-medium leading-[0.98] tracking-[-0.04em] lg:whitespace-nowrap"
          >
            Appliances, built in.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Cooking, cooling and cleaning, planned into the cabinetry from the first drawing.
          </p>
          {appliances.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {appliances.map((category) => (
                <li key={category.id} className="rounded-lg bg-card px-[13px] py-[9px] text-sm">
                  {category.name.charAt(0) + category.name.slice(1).toLowerCase()}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-[15px] text-fg/60">
            From <span className="font-medium text-fg">Bosch, Siemens, Liebherr, Häfele</span> and{" "}
            <span className="font-medium text-fg">Blaupunkt</span>.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card lg:rounded-[20px]">
          <FadeInImage
            src={resolveImage(APPLIANCES_IMAGE, { width: 1600 })}
            alt="Black oak tall units with a built-in oven and open shelves, island hob in front"
            fill
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover object-[50%_60%]"
          />
        </div>
      </section>

      {/* Browse by style */}
      {collections.length > 0 ? (
        <section
          aria-labelledby="styles-heading"
          className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
        >
          <h2 id="styles-heading" className={cn(h2, "mb-7")}>
            Browse by style.
          </h2>
          <div
            className="grid lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(var(--rows),auto)] lg:gap-x-10"
            style={{ ["--rows" as string]: Math.ceil(collections.length / 2) }}
          >
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group -mb-px flex items-center justify-between gap-4 border-y border-fg/15 py-[18px] text-[clamp(24px,2.6vw,38px)] font-medium tracking-[-0.035em] transition-colors duration-300 hover:text-accent-fg"
              >
                {styleLabel(collection.title)}
                <span
                  aria-hidden
                  className="text-xl text-accent-fg transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Closing statement */}
      <section
        aria-labelledby="twice-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-40 lg:px-10"
      >
        <h2
          id="twice-heading"
          className="max-w-[11ch] text-[clamp(44px,8vw,132px)] font-medium leading-[0.92] tracking-[-0.05em]"
        >
          A kitchen is planned twice.
        </h2>
        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Once around how you cook: the rhythm, the reach, the routine. Then around how it looks.
            Get the first right and the second follows.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ArrowButton href="/book-consultation" size="lg">
              Book a kitchen consultation
            </ArrowButton>
            <WhatsAppArrowButton sourceType="kitchens" tone="outline" size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
