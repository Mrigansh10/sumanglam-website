import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/shared/page-hero";
import { ProductCard } from "@/components/shared/product-card";
import { Stagger } from "@/components/motion/stagger";
import { EmptyState } from "@/components/shared/empty-state";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Button } from "@/components/ui/button";
import { listProducts, getProductTaxonomy } from "@/server/products";
import { getBrands } from "@/server/brands";
import { safeQuery } from "@/server/safe";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Research premium hardware and appliances — compare specifications and start an inquiry with our showroom team.",
};

type SearchParams = Promise<{
  page?: string;
  brand?: string;
  type?: string;
  category?: string;
  subcategory?: string;
}>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ items, pagination }, taxonomy, brands] = await Promise.all([
    safeQuery(
      () =>
        listProducts({
          page,
          limit: 12,
          brand: params.brand,
          type: params.type,
          category: params.category,
          subcategory: params.subcategory,
        }),
      { items: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1 } },
    ),
    safeQuery(getProductTaxonomy, []),
    safeQuery(getBrands, { solutionBrands: [], productBrands: [] }),
  ]);

  const activeType = taxonomy.find((type) => type.slug === params.type);
  const activeCategory = activeType?.categories.find(
    (category) => category.slug === params.category,
  );

  // Basic documented filters only: brand, type, category, subcategory.
  const buildHref = (next: Partial<Record<string, string | undefined>>) => {
    const merged = { ...params, page: undefined, ...next };
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) query.set(key, value);
    }
    const qs = query.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const filterGroups = (
    <>
      <div>
        <h2 className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
          Type
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm">
          <li>
            <Link
              href={buildHref({ type: undefined, category: undefined })}
              className={cn(
                "transition-colors hover:text-ink",
                !params.type ? "font-medium text-ink" : "text-ink-soft",
              )}
            >
              All
            </Link>
          </li>
          {taxonomy.map((type) => (
            <li key={type.id}>
              <Link
                href={buildHref({ type: type.slug, category: undefined })}
                className={cn(
                  "transition-colors hover:text-ink",
                  params.type === type.slug ? "font-medium text-ink" : "text-ink-soft",
                )}
              >
                {type.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {activeType ? (
        <div>
          <h2 className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
            Category
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {activeType.categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={buildHref({
                    category:
                      params.category === category.slug ? undefined : category.slug,
                  })}
                  className={cn(
                    "transition-colors hover:text-ink",
                    params.category === category.slug
                      ? "font-medium text-ink"
                      : "text-ink-soft",
                  )}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <h2 className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
          Brand
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm">
          <li>
            <Link
              href={buildHref({ brand: undefined })}
              className={cn(
                "transition-colors hover:text-ink",
                !params.brand ? "font-medium text-ink" : "text-ink-soft",
              )}
            >
              All Brands
            </Link>
          </li>
          {brands.productBrands.map((brand) => (
            <li key={brand.id}>
              <Link
                href={buildHref({
                  brand: params.brand === brand.slug ? undefined : brand.slug,
                })}
                className={cn(
                  "transition-colors hover:text-ink",
                  params.brand === brand.slug ? "font-medium text-ink" : "text-ink-soft",
                )}
              >
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <>
      <PageViewTracker event="product_viewed" sourceType="product-listing" />
      <PageHero
        eyebrow="Products"
        title={activeCategory?.name ?? "Hardware & appliance catalog"}
        description="Compare options, check specifications, and begin a conversation — every product here supports a space, not a shopping cart."
      />

      <Section spacing="compact">
        <Container size="wide">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Filters — collapsed behind a disclosure on mobile so products
                stay first on screen; open sidebar on desktop. */}
            <aside className="lg:w-60 lg:shrink-0" aria-label="Product filters">
              <details className="group border border-line bg-surface open:pb-5 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                  Filter Products
                  <span aria-hidden className="text-ink-faint transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <div className="space-y-7 px-5 pt-2">{filterGroups}</div>
              </details>
              <div className="hidden space-y-7 lg:block">{filterGroups}</div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {items.length > 0 ? (
                <>
                  <p className="text-sm text-ink-soft">
                    {pagination.total} product{pagination.total === 1 ? "" : "s"}
                  </p>
                  <Stagger className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3" each={0.06}>
                    {items.map((product) => (
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
                  </Stagger>
                  {pagination.totalPages > 1 ? (
                    <div className="mt-12 flex items-center justify-center gap-3">
                      {pagination.page > 1 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          href={buildHref({ page: String(pagination.page - 1) })}
                        >
                          Previous
                        </Button>
                      ) : null}
                      <span className="text-sm text-ink-soft">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      {pagination.page < pagination.totalPages ? (
                        <Button
                          variant="outline"
                          size="sm"
                          href={buildHref({ page: String(pagination.page + 1) })}
                        >
                          Next
                        </Button>
                      ) : null}
                    </div>
                  ) : null}
                </>
              ) : (
                <EmptyState
                  title="No products match this selection"
                  description="Try a different category or brand — or ask us directly; the showroom carries more than the site."
                  action={{ label: "Clear Filters", href: "/products" }}
                />
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
