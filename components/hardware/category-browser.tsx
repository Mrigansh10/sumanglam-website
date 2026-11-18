"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { HardwareProductCard, type HardwareCardData } from "@/components/hardware/product-card";
import { WhatsAppArrowButton } from "@/components/home/whatsapp-arrow-button";
import { cn } from "@/lib/utils";

export type BrowserProduct = HardwareCardData & {
  /** Lowercased name, code and description for search. */
  haystack: string;
  facets: string[];
  brandSlug: string;
};

type Props = {
  products: BrowserProduct[];
  facet?: { label: string; options: string[] };
  categoryName: string;
};

/** Search, quick filters and the product grid for one hardware category. */
export function CategoryBrowser({ products, facet, categoryName }: Props) {
  const [query, setQuery] = useState("");
  const [option, setOption] = useState("");
  const [brand, setBrand] = useState("");

  const brands = useMemo(() => {
    const seen = new Map<string, string>();
    for (const product of products) seen.set(product.brandSlug, product.brand);
    return [...seen.entries()];
  }, [products]);

  const q = query.trim().toLowerCase();
  const visible = products.filter(
    (product) =>
      (!option || product.facets.includes(option)) &&
      (!brand || product.brandSlug === brand) &&
      (!q || product.haystack.includes(q)),
  );

  const reset = () => {
    setQuery("");
    setOption("");
    setBrand("");
  };

  const chip = (active: boolean) =>
    cn(
      "shrink-0 whitespace-nowrap rounded-full px-[15px] py-[9px] text-sm transition-colors",
      active ? "bg-fg text-page" : "bg-card/55 hover:bg-card",
    );

  return (
    <>
      <div className="sticky top-0 z-20 mt-12 border-b border-fg/10 bg-page/90 py-3.5 backdrop-blur-md">
        <div className="mx-auto grid max-w-[1480px] gap-3 px-[22px] lg:grid-cols-[minmax(260px,360px)_1fr] lg:items-center lg:gap-5 lg:px-10">
          <label className="flex h-12 items-center gap-2.5 rounded-[10px] bg-card/55 px-3.5 ring-accent focus-within:ring-2">
            <Search aria-hidden className="size-[18px] shrink-0 opacity-50" />
            <span className="sr-only">Search {categoryName.toLowerCase()}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or code"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-fg/45 focus-visible:!outline-none"
            />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {facet ? (
              <>
                <span className="mr-1 whitespace-nowrap text-sm text-fg/60">{facet.label}</span>
                <button type="button" aria-pressed={!option} onClick={() => setOption("")} className={chip(!option)}>
                  Any
                </button>
                {facet.options.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={option === value}
                    onClick={() => setOption(option === value ? "" : value)}
                    className={chip(option === value)}
                  >
                    {value}
                  </button>
                ))}
              </>
            ) : null}
            {/* Brand filter only earns its place once a category has two brands */}
            {brands.length > 1 ? (
              <>
                <span className={cn("mr-1 whitespace-nowrap text-sm text-fg/60", facet && "ml-4")}>Brand</span>
                <button type="button" aria-pressed={!brand} onClick={() => setBrand("")} className={chip(!brand)}>
                  All
                </button>
                {brands.map(([slug, name]) => (
                  <button
                    key={slug}
                    type="button"
                    aria-pressed={brand === slug}
                    onClick={() => setBrand(brand === slug ? "" : slug)}
                    className={chip(brand === slug)}
                  >
                    {name}
                  </button>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1480px] px-[22px] lg:px-10">
        <p aria-live="polite" className="pb-[22px] pt-[26px] text-sm text-fg/60">
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </p>
        {visible.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-11">
            {visible.map((product) => (
              <HardwareProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid justify-items-center gap-3.5 py-20 text-center">
            <p className="text-[22px] font-medium">Nothing matches that.</p>
            <p className="text-fg/60">Send us the code on WhatsApp and we&apos;ll check for you.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-1 border-b border-fg/30 pb-[3px] text-[15px] font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="mt-24 grid gap-[22px] border-t border-fg/15 pb-4 pt-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-[clamp(28px,3.2vw,46px)] font-medium leading-[1.05] tracking-[-0.035em]">
              Can&apos;t find it here?
            </h2>
            <p className="mt-2.5 max-w-[46ch] text-[17px] leading-normal text-fg/60">
              We stock more than we list. Send the code or a photo and we&apos;ll check.
            </p>
          </div>
          <WhatsAppArrowButton sourceType="hardware" size="lg" />
        </div>
      </section>
    </>
  );
}
