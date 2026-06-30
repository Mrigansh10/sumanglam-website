import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { ProductCard } from "@/components/shared/product-card";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getProductTaxonomy, listProducts } from "@/server/products";
import { safeQuery } from "@/server/safe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hardware",
  description:
    "Discover premium furniture hardware by category — hinges, locks, sliding systems, handles, and kitchen accessories from Häfele, Hettich, Blum, and more.",
};

export default async function HardwareAppliancesPage() {
  const [taxonomy, featured] = await Promise.all([
    safeQuery(getProductTaxonomy, []),
    safeQuery(() => listProducts({ type: "hardware", limit: 8 }), {
      items: [],
      pagination: { page: 1, limit: 8, total: 0, totalPages: 1 },
    }),
  ]);

  const hardware = taxonomy.find((type) => type.slug === "hardware");

  return (
    <>
      <PageViewTracker event="product_viewed" sourceType="hardware" />
      <PageHero
        eyebrow="Hardware"
        title="The details that decide how a home feels"
        description="Browse by category, meet the brands behind each one, and start a conversation about the right fit — research first, never a checkout."
        image="sumanglam/hardware/hardware-hero-drawer"
      >
        <Button href="/products?type=hardware" variant="accent">
          Browse Hardware
        </Button>
        <WhatsAppButton sourceType="general" variant="outline-light" />
      </PageHero>

      {/* Hardware categories */}
      {hardware && hardware.categories.length > 0 ? (
        <Section>
          <Container size="wide">
            <Reveal>
              <Heading
                eyebrow="Hardware"
                title="Fittings, fixtures & security"
                description="From soft-close hinges to digital locks — hardware from Häfele, Hettich, Blum, Godrej, Yale, and more."
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {hardware.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?type=hardware&category=${category.slug}`}
                  className="group flex items-center justify-between gap-2 border border-line bg-surface px-5 py-4 transition-colors hover:border-accent"
                >
                  <span className="text-sm font-medium text-ink sm:text-base">
                    {category.name}
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-accent-deep"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Featured products */}
      {featured.items.length > 0 ? (
        <Section>
          <Container size="wide">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <Heading eyebrow="Featured" title="Worth a closer look" />
                <Button href="/products?type=hardware" variant="outline" size="sm">
                  All Hardware
                  <ArrowRight aria-hidden />
                </Button>
              </div>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {featured.items.map((product) => (
                <ProductCard
                  key={product.id}
                  href={`/products/${product.slug}`}
                  name={product.name}
                  brandName={product.brand?.name}
                  priceRange={product.priceRange}
                  primaryImage={product.primaryImage}
                  availabilityStatus={product.availabilityStatus}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Conversation CTA */}
      <Section tone="ink" spacing="compact">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Heading
            title="Not sure what fits your project?"
            description="Tell us what you're building — we'll shortlist the right hardware for the job."
            tone="light"
          />
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href="/book-consultation" variant="accent" size="lg">
              Book Consultation
            </Button>
            <WhatsAppButton sourceType="general" variant="outline-light" size="lg" />
          </div>
        </Container>
      </Section>
    </>
  );
}
