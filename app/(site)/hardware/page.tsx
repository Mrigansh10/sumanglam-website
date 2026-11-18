import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { ArrowButton, ArrowLink } from "@/components/home/arrow-button";
import { WhatsAppArrowButton } from "@/components/home/whatsapp-arrow-button";
import { HardwareProductCard } from "@/components/hardware/product-card";
import { getFeaturedHardware, getHardwareCategories } from "@/server/hardware";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";
import { facetValues, productFacts } from "@/lib/product-specs";
import { CATEGORY_COPY, displayName, sentenceCase } from "@/lib/hardware";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hardware in Jaipur — Locks, Hinges, Handles & Fittings",
  description:
    "Hinges, drawer systems, handles, digital locks and fittings from Häfele, Hettich, Blum, Yale and more at Sumanglam, Jaipur. Look up a product, then ask us for price and stock.",
};

const brands = [
  { name: "Häfele", slug: "hafele", line: "Furniture fittings, architectural hardware and kitchen storage." },
  { name: "Hettich", slug: "hettich", line: "Hinges, drawer systems and sliding fittings." },
  { name: "Blum", slug: "blum", line: "Hinges, lift systems and drawer runners." },
  { name: "Yale", slug: "yale", line: "Locks, digital locks and home security." },
  { name: "Godrej", slug: "godrej", line: "Locks, digital security and safes." },
  { name: "Dorset", slug: "dorset", line: "Architectural hardware, handles and door controls." },
  { name: "Spitze", slug: "spitze", line: "Kitchen accessories and storage systems." },
  { name: "Everyday", slug: "everyday", line: "Wire baskets and kitchen storage." },
  { name: "Brass Barony", slug: "brass-barony", line: "Handcrafted brass accessories and hardware." },
];

const steps = [
  { title: "Send the code or a photo", copy: "Every product here shows its code. Copy it in one tap." },
  { title: "We confirm price and stock", copy: "Prices change with the brands' lists, so we confirm them for your order." },
  { title: "See it at the showroom", copy: "Check the finish and the feel before you buy." },
];

const h2 = "text-[clamp(36px,5.6vw,88px)] font-medium leading-[0.98] tracking-[-0.04em]";

export default async function HardwarePage() {
  const [categories, featured] = await Promise.all([
    safeQuery(getHardwareCategories, []),
    safeQuery(() => getFeaturedHardware(4), []),
  ]);

  return (
    <div className="font-tight">
      <PageViewTracker event="product_viewed" sourceType="hardware" />

      {/* Header: same pattern as Kitchens */}
      <section className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10 lg:pt-[136px]">
        <div className="mb-9 grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <h1 className="animate-fade-up text-[clamp(64px,13vw,210px)] font-semibold leading-[0.82] tracking-[-0.035em]">
            Hardware
          </h1>
          <div className="grid justify-items-start gap-[22px] animate-fade-up [animation-delay:120ms] lg:max-w-[420px] lg:pb-3.5">
            <p className="text-[17px] leading-normal text-fg/60">
              Hinges, drawer systems, handles, locks and fittings from Häfele, Hettich, Blum, Yale and
              more. Look them up here, then ask us for price and stock.
            </p>
            <ArrowButton href="/book-consultation" size="lg">
              Book a consultation
            </ArrowButton>
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card sm:aspect-[16/8.2] lg:rounded-[20px]">
          <Image
            src={resolveImage("sumanglam/hardware/hardware-hero-drawer", { width: 2400 })}
            alt="Drawer pulled open on soft-close runners"
            fill
            priority
            sizes="(min-width: 1480px) 1400px, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Browse by category: only categories with products */}
      {categories.length > 0 ? (
        <section
          aria-labelledby="categories-heading"
          className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
        >
          <div className="mb-10 grid gap-[22px] lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
            <h2 id="categories-heading" className={h2}>
              Browse by category.
            </h2>
            <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
              Each category lists what we carry, with the product code and the specs that matter.
            </p>
          </div>
          <div className="grid gap-3.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/hardware/${category.slug}`}
                className="group grid overflow-hidden rounded-[20px] bg-card/55 lg:grid-cols-[1fr_1.5fr]"
              >
                <div className="grid content-end gap-2.5 p-7 lg:p-10">
                  <span className="text-sm text-fg/60">
                    {category.count} {category.count === 1 ? "product" : "products"}
                  </span>
                  <h3 className="text-[clamp(32px,3.6vw,56px)] font-semibold leading-none tracking-[-0.04em]">
                    {sentenceCase(category.name)}
                  </h3>
                  {CATEGORY_COPY[category.slug] ? (
                    <p className="max-w-[36ch] text-fg/60">{CATEGORY_COPY[category.slug]}</p>
                  ) : null}
                  <span className="mt-2.5 inline-flex items-center gap-2 justify-self-start border-b border-fg/30 pb-[3px] text-[15px] font-medium">
                    See all
                    <span aria-hidden className="text-accent-fg transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 px-[18px] pb-[18px] lg:gap-3.5 lg:p-[22px]">
                  {category.previews.map((image) => (
                    <div key={image} className="relative aspect-[3/4] rounded-xl bg-page">
                      <div className="absolute inset-[10%]">
                        <FadeInImage
                          src={resolveImage(image, { width: 600 })}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 16vw, 28vw"
                          className="object-contain transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Worth a closer look */}
      {featured.length > 0 ? (
        <section
          aria-labelledby="featured-heading"
          className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <h2 id="featured-heading" className={h2}>
              Worth a closer look.
            </h2>
            {categories[0] ? (
              <ArrowLink href={`/hardware/${categories[0].slug}`}>
                All {sentenceCase(categories[0].name).toLowerCase()}
              </ArrowLink>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
            {featured.map((product) => {
              const facts = productFacts(product.technicalSpecsJson);
              return (
                <HardwareProductCard
                  key={product.id}
                  product={{
                    slug: product.slug,
                    name: displayName(product.name, product.brand?.name),
                    brand: product.brand?.name ?? "",
                    image: resolveImage(product.primaryImage, { width: 700 }),
                    meta: facetValues(categories[0]?.slug, facts, product.shortDescription).join(" · "),
                  }}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      {/* For the trade: the dark break. Fixed charcoal/ivory in both modes. */}
      <section
        aria-labelledby="trade-heading"
        className="mt-[140px] bg-charcoal py-24 text-ivory"
      >
        <div className="mx-auto max-w-[1480px] px-[22px] lg:px-10">
          <div className="grid gap-[22px] lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
            <h2 id="trade-heading" className={h2}>
              Know the code? Send it to us.
            </h2>
            <div className="grid justify-items-start gap-[22px]">
              <p className="max-w-[46ch] text-[17px] leading-normal text-ivory/65">
                For carpenters, contractors and designers. Send a product code, a list, or a photo of
                what you need on WhatsApp.
              </p>
              <WhatsAppArrowButton sourceType="hardware" tone="light" size="lg" label="Chat on WhatsApp" />
            </div>
          </div>
          <ol className="mt-14 grid border-t border-ivory/15 lg:grid-cols-3 lg:border-b">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="grid content-start gap-1.5 border-b border-ivory/15 py-[22px] lg:border-b-0 lg:pb-1.5 lg:pr-8 lg:pt-[26px] lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-8"
              >
                <span className="text-sm font-medium text-accent-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.035em]">
                  {step.title}
                </h3>
                <p className="max-w-[40ch] text-ivory/60">{step.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Brands */}
      <section
        aria-labelledby="brands-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-[140px] lg:px-10"
      >
        <div className="mb-7 grid gap-[22px] lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
          <h2 id="brands-heading" className={h2}>
            Brands we carry.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Each has its own page with what we stock from it.
          </p>
        </div>
        <ul className="grid lg:grid-cols-2 lg:gap-x-10">
          {brands.map((brand) => (
            <li key={brand.slug} className="-mb-px border-y border-fg/15">
              <Link href={`/brands/${brand.slug}`} className="group grid gap-1 py-[18px]">
                <span className="flex items-center justify-between text-[clamp(26px,2.8vw,40px)] font-medium tracking-[-0.035em]">
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
        aria-labelledby="fit-heading"
        className="mx-auto max-w-[1480px] px-[22px] pt-40 lg:px-10"
      >
        <h2
          id="fit-heading"
          className="max-w-[12ch] text-[clamp(44px,8vw,132px)] font-medium leading-[0.92] tracking-[-0.05em]"
        >
          Not sure what fits?
        </h2>
        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
            Tell us what you&apos;re building and we&apos;ll shortlist the right hardware for it.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ArrowButton href="/book-consultation" size="lg">
              Book a consultation
            </ArrowButton>
            <WhatsAppArrowButton sourceType="hardware" tone="outline" size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
