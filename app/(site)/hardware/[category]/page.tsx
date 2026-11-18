import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { CategoryBrowser, type BrowserProduct } from "@/components/hardware/category-browser";
import { getHardwareCategory } from "@/server/hardware";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";
import { CATEGORY_FACETS, facetValues, productFacts } from "@/lib/product-specs";
import { CATEGORY_COPY, displayName, sentenceCase } from "@/lib/hardware";

export const dynamic = "force-dynamic";

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: slug } = await params;
  const data = await safeQuery(() => getHardwareCategory(slug), null);
  if (!data) return { title: "Hardware" };
  const name = sentenceCase(data.category.name);
  return {
    title: `${name} in Jaipur`,
    description: `${CATEGORY_COPY[slug] ?? `${name} we carry.`} ${data.products.length} products at Sumanglam, Jaipur. Ask us for price and stock.`,
  };
}

export default async function HardwareCategoryPage({ params }: { params: Params }) {
  const { category: slug } = await params;
  const data = await safeQuery(() => getHardwareCategory(slug), null);
  // A category with nothing published is treated as not there yet.
  if (!data || data.products.length === 0) notFound();

  const { category, products } = data;
  const name = sentenceCase(category.name);
  const facet = CATEGORY_FACETS[slug];

  const items: BrowserProduct[] = products.map((product) => {
    const facts = productFacts(product.technicalSpecsJson);
    const facets = facetValues(slug, facts, product.shortDescription);
    return {
      slug: product.slug,
      name: displayName(product.name, product.brand?.name),
      brand: product.brand?.name ?? "",
      brandSlug: product.brand?.slug ?? "",
      image: resolveImage(product.primaryImage, { width: 700 }),
      meta: facets.join(" · ") || undefined,
      facets,
      haystack: [product.name, product.sku, product.shortDescription].join(" ").toLowerCase(),
    };
  });

  return (
    <div className="font-tight">
      <PageViewTracker event="collection_viewed" sourceType="hardware" sourceId={slug} />

      <section className="mx-auto grid max-w-[1480px] gap-[22px] px-[22px] pt-[120px] lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16 lg:px-10 lg:pt-[136px]">
        <div className="grid gap-[22px]">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-fg/60 animate-fade-up">
            <Link href="/hardware" className="hover:text-fg">
              Hardware
            </Link>
            <span aria-hidden>/</span>
            <span>{name}</span>
          </nav>
          <h1 className="animate-fade-up text-[clamp(56px,9vw,150px)] font-semibold leading-[0.86] tracking-[-0.04em]">
            {name}
          </h1>
        </div>
        <p className="max-w-[38ch] text-[17px] leading-normal text-fg/60 animate-fade-up [animation-delay:120ms]">
          {CATEGORY_COPY[slug] ? `${CATEGORY_COPY[slug]} ` : ""}Ask us for price and stock on any of
          them.
        </p>
      </section>

      <CategoryBrowser
        products={items}
        categoryName={name}
        facet={facet ? { label: facet.label, options: facet.options.map((option) => option.value) } : undefined}
      />
    </div>
  );
}
