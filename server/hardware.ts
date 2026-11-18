import { supabase, rows } from "@/lib/supabase";
import type { Product } from "@/lib/db-types";

export type HardwareProduct = Product & {
  technicalSpecsJson?: Record<string, string> | null;
};

export type HardwareCategory = {
  id: string;
  name: string;
  slug: string;
  count: number;
  /** Up to three product images for the category tile. */
  previews: string[];
};

const PRODUCT_SELECT = "*, brand:brands(id, name, slug)";

// Local review of products before they go public: run the dev server with
// PREVIEW_DRAFTS=1. Never set in Vercel.
export const VISIBLE_STATUSES =
  process.env.PREVIEW_DRAFTS === "1" ? ["published", "draft"] : ["published"];

async function hardwareTypeId() {
  const { data } = await supabase.from("product_types").select("id").eq("slug", "hardware").limit(1);
  return (data?.[0]?.id as string | undefined) ?? null;
}

/**
 * Hardware categories that have at least one published product, in catalogue
 * order of their products. Empty categories are left out so the page never
 * shows a blank tile.
 */
export async function getHardwareCategories(): Promise<HardwareCategory[]> {
  const typeId = await hardwareTypeId();
  if (!typeId) return [];

  const { data } = await supabase
    .from("product_category_mappings")
    .select(
      "category:product_categories!inner(id, name, slug, product_type_id), product:products!inner(primary_image, status, is_featured, created_at)",
    )
    .eq("category.product_type_id", typeId)
    .in("product.status", VISIBLE_STATUSES);

  type Row = {
    category: { id: string; name: string; slug: string };
    product: { primary_image: string | null; is_featured: boolean; created_at: string };
  };
  const byCategory = new Map<string, { category: Row["category"]; products: Row["product"][] }>();
  for (const row of (data ?? []) as unknown as Row[]) {
    const entry = byCategory.get(row.category.id) ?? { category: row.category, products: [] };
    entry.products.push(row.product);
    byCategory.set(row.category.id, entry);
  }

  return [...byCategory.values()]
    .map(({ category, products }) => {
      const ordered = [...products].sort(
        (a, b) => Number(b.is_featured) - Number(a.is_featured) || a.created_at.localeCompare(b.created_at),
      );
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: products.length,
        previews: ordered.map((p) => p.primary_image).filter((image): image is string => !!image).slice(0, 3),
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** A hardware category and all its published products, in catalogue order. */
export async function getHardwareCategory(slug: string) {
  const typeId = await hardwareTypeId();
  if (!typeId) return null;

  const { data: categoryData } = await supabase
    .from("product_categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .eq("product_type_id", typeId)
    .limit(1);
  const category = categoryData?.[0] as { id: string; name: string; slug: string } | undefined;
  if (!category) return null;

  const { data: mappings } = await supabase
    .from("product_category_mappings")
    .select("product_id")
    .eq("category_id", category.id);
  const ids = (mappings ?? []).map((m) => m.product_id as string);
  if (ids.length === 0) return { category, products: [] as HardwareProduct[] };

  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .in("id", ids)
    .in("status", VISIBLE_STATUSES)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: true });

  return { category, products: rows<HardwareProduct>(data) };
}

/** Published hardware products for the landing page's featured row. */
export async function getFeaturedHardware(limit = 4) {
  const typeId = await hardwareTypeId();
  if (!typeId) return [];
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("product_type_id", typeId)
    .in("status", VISIBLE_STATUSES)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(limit);
  return rows<HardwareProduct>(data);
}
