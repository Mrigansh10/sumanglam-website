import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { VisualCard } from "@/components/shared/visual-card";
import { ProductCard } from "@/components/shared/product-card";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getInspirationBySlug } from "@/server/inspirations";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await safeQuery(() => getInspirationBySlug(slug), null);
  if (!data) return { title: "Inspiration" };
  return {
    title: data.inspiration.title,
    description: data.inspiration.shortDescription ?? undefined,
    openGraph: data.inspiration.primaryImage
      ? { images: [resolveImage(data.inspiration.primaryImage, { width: 1200 })] }
      : undefined,
  };
}

export default async function InspirationDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await safeQuery(() => getInspirationBySlug(slug), null);
  if (!data) notFound();

  const { inspiration, collections, products, brands, relatedInspirations } = data;

  return (
    <>
      <PageViewTracker
        event="inspiration_viewed"
        sourceType="inspiration"
        sourceId={inspiration.slug}
      />
      <PageHero
        eyebrow={inspiration.space?.title}
        title={inspiration.title}
        description={inspiration.shortDescription ?? undefined}
        image={inspiration.primaryImage}
        size="tall"
      >
        <Button href="/book-consultation" variant="accent">
          Book Consultation
        </Button>
        <WhatsAppButton
          sourceType="inspiration"
          sourceId={inspiration.slug}
          subject={inspiration.title}
          variant="outline-light"
        />
      </PageHero>

      <Section spacing="compact">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`}>
                <Badge variant="outline" className="hover:border-accent">
                  {collection.title}
                </Badge>
              </Link>
            ))}
          </div>
          {inspiration.longDescription ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {inspiration.longDescription}
            </p>
          ) : null}
        </Container>
      </Section>

      {/* Gallery */}
      {inspiration.galleryImages.length > 1 ? (
        <Section spacing="compact">
          <Container size="wide">
            <div className="grid gap-4 sm:grid-cols-2">
              {inspiration.galleryImages.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-[3/2] overflow-hidden bg-sand">
                  <Image
                    src={resolveImage(image, { width: 1200, enhance: "render" })}
                    alt={`${inspiration.title} — view ${index + 2}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Products used */}
      {products.length > 0 ? (
        <Section tone="clay">
          <Container size="wide">
            <Heading
              eyebrow="The Details"
              title="Products in this space"
              description="The hardware and appliances that make this design work."
            />
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {products.map((product) => (
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

      {/* Related brands */}
      {brands.length > 0 ? (
        <Section spacing="compact">
          <Container size="wide">
            <Heading eyebrow="Behind the Design" title="Brands in this space" />
            <div className="mt-8 flex flex-wrap gap-3">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={
                    brand.slug === "nolte"
                      ? "/nolte"
                      : brand.slug === "mrida"
                        ? "/mrida"
                        : `/brands/${brand.slug}`
                  }
                  className="border border-line bg-surface px-5 py-3 font-display text-lg text-ink transition-colors hover:border-accent hover:text-accent-deep"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Related inspirations */}
      {relatedInspirations.length > 0 ? (
        <Section>
          <Container size="wide">
            <Heading eyebrow="Keep Exploring" title="Related inspirations" />
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedInspirations.map((related) => (
                <VisualCard
                  key={related.id}
                  href={`/inspiration/${related.slug}`}
                  image={related.primaryImage}
                  eyebrow={related.space?.title}
                  title={related.title}
                  description={related.shortDescription}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Consultation CTA */}
      <Section tone="ink" spacing="compact">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Heading
            title="Imagine this in your home"
            description="Bring this idea to a consultation — we'll adapt it to your space."
            tone="light"
          />
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href="/book-consultation" variant="accent" size="lg">
              Book Consultation
            </Button>
            <Button href="/showroom" variant="outline-light" size="lg">
              Visit Showroom
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
