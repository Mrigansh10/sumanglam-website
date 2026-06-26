import { supabase, rows, camelizeRecord } from "@/lib/supabase";
import type { Brand } from "@/lib/db-types";

export async function getBrands() {
  const { data } = await supabase
    .from("brands")
    .select("*")
    .eq("status", "published")
    .order("brand_type", { ascending: true })
    .order("name", { ascending: true });

  const all = rows<Brand>(data);
  const byId = new Map(all.map((b) => [b.id, b]));
  const brands: Brand[] = all.map((b) => ({
    ...b,
    parentBrand: b.parentBrandId ? (byId.get(b.parentBrandId) ?? null) : null,
  }));

  return {
    solutionBrands: brands.filter((b) => b.brandType === "solution"),
    productBrands: brands.filter((b) => b.brandType === "product"),
  };
}

export async function getBrandBySlug(slug: string) {
  const { data: brandRaw } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);

  if (!brandRaw?.length) return null;
  const brand = camelizeRecord<Brand>(brandRaw[0]);

  const [parentBrandResult, childBrandsResult, inspirLinkResult, productsResult] =
    await Promise.all([
      brand.parentBrandId
        ? supabase
            .from("brands")
            .select("id, name, slug")
            .eq("id", brand.parentBrandId)
            .limit(1)
        : Promise.resolve({ data: null }),
      supabase
        .from("brands")
        .select("*")
        .eq("parent_brand_id", brand.id)
        .eq("status", "published"),
      supabase
        .from("inspiration_brands")
        .select("inspiration_id")
        .eq("brand_id", brand.id),
      supabase
        .from("products")
        .select("*, brand:brands(id, name, slug, logo)")
        .eq("brand_id", brand.id)
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true })
        .limit(12),
    ]);

  const parentBrand = parentBrandResult.data?.length
    ? camelizeRecord<Brand>(parentBrandResult.data[0])
    : null;
  const childBrands = rows<Brand>(childBrandsResult.data);

  const inspirIds = inspirLinkResult.data?.map((l) => l.inspiration_id as string) ?? [];
  let inspirations: import("@/lib/db-types").Inspiration[] = [];
  if (inspirIds.length > 0) {
    const { data: inspirData } = await supabase
      .from("inspirations")
      .select("*, space:spaces(id, title, slug)")
      .eq("status", "published")
      .in("id", inspirIds);
    inspirations = rows<import("@/lib/db-types").Inspiration>(inspirData);
  }

  const products = rows<import("@/lib/db-types").Product>(productsResult.data);

  return {
    brand: { ...brand, parentBrand, childBrands },
    inspirations,
    products,
  };
}
