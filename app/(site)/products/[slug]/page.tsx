import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { VisualCard } from "@/components/shared/visual-card";
import { ProductCard } from "@/components/shared/product-card";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { SplitHeadline } from "@/components/motion/split-headline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getProductBySlug } from "@/server/products";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

// Keys are the lowercase Supabase enum representation.
const availabilityCopy: Record<string, { label: string; variant: "success" | "warning" | "error" | "default" }> = {
  available: { label: "Available at showroom", variant: "success" },
  limited: { label: "Limited availability", variant: "warning" },
  discontinued: { label: "Discontinued", variant: "error" },
  coming_soon: { label: "Coming soon", variant: "default" },
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await safeQuery(() => getProductBySlug(slug), null);
  if (!data) return { title: "Product" };
  return {
    title: data.brand ? `${data.product.name} — ${data.brand.name}` : data.product.name,
    description: data.product.shortDescription ?? undefined,
    openGraph: data.product.primaryImage
      ? { images: [resolveImage(data.product.primaryImage, { width: 1200 })] }
      : undefined,
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await safeQuery(() => getProductBySlug(slug), null);
  if (!data) notFound();

  const { product, brand, categories, inspirations, relatedProducts } = data;
  // brand_id / product_type_id are non-null columns, so the joins always
  // resolve; the optional types only reflect supabase-js's uncertainty.
  if (!brand || !product.productType) notFound();
  const productType = product.productType;
  const specs =
    product.technicalSpecs && typeof product.technicalSpecs === "object"
      ? Object.entries(product.technicalSpecs as Record<string, string>)
      : [];
  const availability = availabilityCopy[product.availabilityStatus?.toLowerCase()];

  return (
    <>
      <PageViewTracker event="product_viewed" sourceType="product" sourceId={product.slug} />

      <Section spacing="compact" className="pt-28 sm:pt-32">
        <Container size="wide">
          <nav aria-label="Breadcrumb" className="text-xs text-ink-faint animate-fade-up">
            <Link href="/hardware-appliances" className="hover:text-ink">
              Hardware & Appliances
            </Link>
            {categories[0] ? (
              <>
                {" / "}
                <Link
                  href={`/products?type=${productType.slug}&category=${categories[0].slug}`}
                  className="hover:text-ink"
                >
                  {categories[0].name}
                </Link>
              </>
            ) : null}
            {" / "}
            <span className="text-ink-soft">{product.name}</span>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            {/* Gallery */}
            <div className="space-y-4 animate-fade-up [animation-delay:80ms]">
              <div className="relative aspect-square overflow-hidden bg-sand">
                <Image
                  src={resolveImage(product.primaryImage, { width: 1200 })}
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              {product.galleryImages.length > 1 ? (
                <div className="grid grid-cols-3 gap-4">
                  {product.galleryImages.slice(1, 4).map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden bg-sand">
                      <Image
                        src={resolveImage(image, { width: 400 })}
                        alt={`${product.name} — view ${index + 2}`}
                        fill
                        sizes="(min-width: 1024px) 16vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Details */}
            <div>
              <Link
                href={`/brands/${brand.slug}`}
                className="inline-block text-xs font-medium uppercase tracking-luxe text-accent-deep hover:underline animate-fade-up"
              >
                {brand.name}
              </Link>
              <SplitHeadline
                delay={0.1}
                className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl"
              >
                {product.name}
              </SplitHeadline>
              {product.sku ? (
                <p className="mt-1 text-xs text-ink-faint animate-fade-up [animation-delay:160ms]">
                  SKU: {product.sku}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2 animate-fade-up [animation-delay:220ms]">
                {availability ? (
                  <Badge variant={availability.variant}>{availability.label}</Badge>
                ) : null}
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?type=${productType.slug}&category=${category.slug}`}
                  >
                    <Badge variant="outline" className="hover:border-accent">
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>

              {product.priceRange ? (
                <p className="mt-6 font-display text-xl text-ink animate-fade-up [animation-delay:300ms]">
                  {product.priceRange}
                  <span className="ml-2 align-middle text-xs font-sans text-ink-faint">
                    indicative range — confirmed during consultation
                  </span>
                </p>
              ) : null}

              {product.shortDescription ? (
                <p className="mt-5 text-base leading-relaxed text-ink-soft animate-fade-up [animation-delay:380ms]">
                  {product.shortDescription}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-fade-up [animation-delay:460ms]">
                <WhatsAppButton
                  sourceType="product"
                  sourceId={product.slug}
                  subject={product.name}
                  variant="primary"
                  size="lg"
                  label="Inquire on WhatsApp"
                />
                <Button href="/book-consultation" variant="outline" size="lg">
                  Book Consultation
                </Button>
              </div>

              {/* Technical specifications */}
              {specs.length > 0 ? (
                <div className="mt-10 animate-fade-up [animation-delay:540ms]">
                  <h2 className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
                    Technical Specifications
                  </h2>
                  <dl className="mt-4 divide-y divide-line border-y border-line">
                    {specs.map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-4 py-3 text-sm">
                        <dt className="text-ink-soft">{key}</dt>
                        <dd className="text-ink">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      {/* Related inspirations — reconnect product to spaces */}
      {inspirations.length > 0 ? (
        <Section tone="clay">
          <Container size="wide">
            <Reveal>
              <Heading
                eyebrow="In Context"
                title="Spaces using this product"
                description="See how this detail behaves in a finished design."
              />
            </Reveal>
            <Stagger className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {inspirations.map((inspiration) => (
                <VisualCard
                  key={inspiration.id}
                  image={inspiration.primaryImage}
                  eyebrow={inspiration.space?.title}
                  title={inspiration.title}
                  description={inspiration.shortDescription}
                />
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      {/* Related products */}
      {relatedProducts.length > 0 ? (
        <Section>
          <Container size="wide">
            <Reveal>
              <Heading eyebrow="Compare" title="Related products" />
            </Reveal>
            <Stagger className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4" each={0.06}>
              {relatedProducts.map((related) => (
                <ProductCard
                  key={related.id}
                  href={`/products/${related.slug}`}
                  name={related.name}
                  brandName={related.brand?.name}
                  priceRange={related.priceRange}
                  primaryImage={related.primaryImage}
                  availabilityStatus={related.availabilityStatus}
                />
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
