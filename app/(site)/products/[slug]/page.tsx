import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { arrowButtonClasses as c } from "@/components/home/arrow-button";
import { ArrowLink } from "@/components/home/arrow-button";
import { WhatsAppArrowButton } from "@/components/home/whatsapp-arrow-button";
import { HardwareProductCard } from "@/components/hardware/product-card";
import { CopyCode } from "@/components/hardware/copy-code";
import { getProductBySlug } from "@/server/products";
import { getHardwareCategory } from "@/server/hardware";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";
import { facetValues, productFacts, CATEGORY_FACETS } from "@/lib/product-specs";
import { displayName, sentenceCase } from "@/lib/hardware";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await safeQuery(() => getProductBySlug(slug), null);
  if (!data) return { title: "Product" };
  return {
    // "Yale Luna Pro", never "Yale Luna Pro — Yale"
    title: data.brand
      ? `${data.brand.name} ${displayName(data.product.name, data.brand.name)}`
      : data.product.name,
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

  const { product, brand, categories } = data;
  if (!brand) notFound();
  const category = categories[0];
  const name = displayName(product.name, brand.name);
  const facts = productFacts(product.technicalSpecs);
  const opensWith = facetValues(category?.slug, facts, product.shortDescription);
  const facet = category ? CATEGORY_FACETS[category.slug] : undefined;

  // "More like this": the rest of the product's category, in catalogue order.
  const siblings = category
    ? ((await safeQuery(() => getHardwareCategory(category.slug), null))?.products ?? [])
        .filter((other) => other.id !== product.id)
        .slice(0, 4)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku ?? undefined,
    brand: { "@type": "Brand", name: brand.name },
    description: product.shortDescription ?? undefined,
    image: product.primaryImage ? resolveImage(product.primaryImage, { width: 1200 }) : undefined,
    url: `${siteConfig.url.replace(/\/$/, "")}/products/${product.slug}`,
  };

  return (
    <div className="font-tight">
      <PageViewTracker event="product_viewed" sourceType="product" sourceId={product.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10 lg:pt-[136px]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-fg/60 animate-fade-up">
          <Link href="/hardware" className="hover:text-fg">
            Hardware
          </Link>
          {category ? (
            <>
              <span aria-hidden>/</span>
              <Link href={`/hardware/${category.slug}`} className="hover:text-fg">
                {sentenceCase(category.name)}
              </Link>
            </>
          ) : null}
          <span aria-hidden>/</span>
          <span>{name}</span>
        </nav>

        <div className="mt-7 grid gap-9 lg:grid-cols-[1.15fr_1fr] lg:gap-[72px]">
          {/* One image per product, the same cut-out treatment as the grid */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-card/55 animate-fade-up lg:sticky lg:top-6 lg:self-start">
            <div className="absolute inset-x-[14%] inset-y-[9%]">
              <Image
                src={resolveImage(product.primaryImage, { width: 1400 })}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="grid content-start gap-[22px] animate-fade-up [animation-delay:120ms]">
            <Link href={`/brands/${brand.slug}`} className="justify-self-start text-[15px] text-fg/60 hover:text-fg">
              {brand.name}
            </Link>
            <h1 className="-mt-2 text-[clamp(40px,4.6vw,72px)] font-semibold leading-[0.95] tracking-[-0.04em]">
              {name}
            </h1>
            {product.sku ? <CopyCode code={product.sku} /> : null}
            {product.shortDescription ? (
              <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">{product.shortDescription}</p>
            ) : null}

            {opensWith.length > 0 && facet ? (
              <div>
                <p className="mb-2.5 text-sm text-fg/60">{facet.label}</p>
                <ul className="flex flex-wrap gap-2">
                  {opensWith.map((value) => (
                    <li key={value} className="rounded-lg bg-card/55 px-[13px] py-[9px] text-sm">
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {facts.variants.length > 0 ? (
              <div>
                <p className="mb-2.5 text-sm text-fg/60">Available in</p>
                <ul className="flex flex-wrap gap-2">
                  {facts.variants.map((variant) => (
                    <li key={variant} className="rounded-lg bg-card/55 px-[13px] py-[9px] text-sm">
                      {variant}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="grid gap-2.5">
              <WhatsAppArrowButton
                sourceType="product"
                subject={product.sku ? `${product.name} (code ${product.sku})` : product.name}
                size="lg"
                label="Ask for price on WhatsApp"
                block
              />
              <Link href="/showroom" className={cn(c.root, "flex w-full")}>
                <span className={cn("flex-1 text-fg ring-1 ring-inset ring-fg/15", c.size.lg.label)}>
                  See it at the showroom
                </span>
                <span aria-hidden className={cn(c.arrow, c.size.lg.arrow)}>
                  →
                </span>
              </Link>
              <p className="text-[13px] text-fg/60">
                We confirm the price and stock for your order. Nothing is sold online.
              </p>
            </div>

            {facts.specs.length > 0 ? (
              <div className="mt-3">
                <h2 className="mb-2 text-[22px] font-semibold tracking-[-0.03em]">Specifications</h2>
                <dl>
                  {facts.specs.map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-[1fr_1.4fr] gap-4 border-b border-fg/10 py-[13px] text-[15px]"
                    >
                      <dt className="text-fg/60">{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {siblings.length > 0 && category ? (
        <section
          aria-labelledby="more-heading"
          className="mx-auto max-w-[1480px] px-[22px] pt-[120px] lg:px-10"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <h2
              id="more-heading"
              className="text-[clamp(32px,3.6vw,56px)] font-medium leading-none tracking-[-0.04em]"
            >
              More {sentenceCase(category.name).toLowerCase()}
            </h2>
            <ArrowLink href={`/hardware/${category.slug}`}>See all</ArrowLink>
          </div>
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
            {siblings.map((other) => (
              <HardwareProductCard
                key={other.id}
                product={{
                  slug: other.slug,
                  name: displayName(other.name, other.brand?.name),
                  brand: other.brand?.name ?? "",
                  image: resolveImage(other.primaryImage, { width: 700 }),
                  meta:
                    facetValues(category.slug, productFacts(other.technicalSpecsJson), other.shortDescription).join(
                      " · ",
                    ) || undefined,
                }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
