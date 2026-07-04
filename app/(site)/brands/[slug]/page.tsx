import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { VisualCard } from "@/components/shared/visual-card";
import { ProductCard } from "@/components/shared/product-card";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getBrandBySlug } from "@/server/brands";
import { safeQuery } from "@/server/safe";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await safeQuery(() => getBrandBySlug(slug), null);
  if (!data) return { title: "Brand" };
  return {
    title: data.brand.name,
    description: data.brand.description ?? undefined,
  };
}

export default async function BrandDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  // Solution brands have dedicated storytelling pages.
  if (slug === "nolte") redirect("/nolte");
  if (slug === "mrida") redirect("/mrida");

  const data = await safeQuery(() => getBrandBySlug(slug), null);
  if (!data) notFound();

  const { brand, inspirations, products } = data;

  return (
    <>
      <PageViewTracker event="brand_viewed" sourceType="brand" sourceId={brand.slug} />
      <PageHero
        eyebrow={
          brand.parentBrand
            ? `Product Brand · Part of the ${brand.parentBrand.name} family`
            : "Product Brand"
        }
        title={brand.name}
        description={brand.description ?? undefined}
        image={brand.heroImage}
      >
        <WhatsAppButton
          sourceType="brand"
          sourceId={brand.slug}
          subject={brand.name}
          variant="accent"
        />
        <Button href="/book-consultation" variant="outline-light">
          Book Consultation
        </Button>
      </PageHero>

      {/* Parent / child trust context */}
      {(brand.parentBrand || brand.childBrands.length > 0) ? (
        <Section spacing="compact">
          <Container>
            <div className="border border-line bg-clay px-6 py-5 text-sm leading-relaxed text-ink-soft">
              {brand.parentBrand ? (
                <p>
                  {brand.name} is part of the{" "}
                  <Link
                    href={`/brands/${brand.parentBrand.slug}`}
                    className="font-medium text-accent-deep hover:underline"
                  >
                    {brand.parentBrand.name}
                  </Link>{" "}
                  family — the same engineering standards, applied to its own
                  independent product line.
                </p>
              ) : null}
              {brand.childBrands.length > 0 ? (
                <p>
                  The {brand.name} family also includes{" "}
                  {brand.childBrands.map((child, index) => (
                    <span key={child.id}>
                      {index > 0 ? ", " : ""}
                      <Link
                        href={`/brands/${child.slug}`}
                        className="font-medium text-accent-deep hover:underline"
                      >
                        {child.name}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </div>
          </Container>
        </Section>
      ) : null}

      {brand.story ? (
        <Section spacing="compact">
          <Container size="narrow">
            <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              {brand.story}
            </p>
          </Container>
        </Section>
      ) : null}

      {/* Products — whole section hides while the catalog is unpublished
          (marketing-first launch; flip products back to published to restore) */}
      {products.length > 0 ? (
        <Section tone="clay">
          <Container size="wide">
            <Heading eyebrow="Catalog" title={`${brand.name} products`} />
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  href={`/products/${product.slug}`}
                  name={product.name}
                  brandName={brand.name}
                  priceRange={product.priceRange}
                  primaryImage={product.primaryImage}
                  availabilityStatus={product.availabilityStatus}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Inspirations */}
      {inspirations.length > 0 ? (
        <Section>
          <Container size="wide">
            <Heading
              eyebrow="In Context"
              title={`Spaces featuring ${brand.name}`}
              description="Brands matter most where they're used — inside finished designs."
            />
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {inspirations.slice(0, 3).map((inspiration) => (
                <VisualCard
                  key={inspiration.id}
                  href={`/inspiration/${inspiration.slug}`}
                  image={inspiration.primaryImage}
                  eyebrow={inspiration.space?.title}
                  title={inspiration.title}
                  description={inspiration.shortDescription}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
