import { supabase, rows, camelizeRecord } from "@/lib/supabase";
import type { Inspiration, Collection, Product, Brand } from "@/lib/db-types";

export type InspirationListParams = {
  page?: number;
  limit?: number;
  space?: string;
  collection?: string;
};

export async function listInspirations(params: InspirationListParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(48, Math.max(1, params.limit ?? 12));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let spaceId: string | null = null;
  if (params.space) {
    const { data } = await supabase
      .from("spaces")
      .select("id")
      .eq("slug", params.space)
      .limit(1);
    spaceId = data?.[0]?.id ?? null;
  }

  let inspirationIds: string[] | null = null;
  if (params.collection) {
    const { data: collData } = await supabase
      .from("collections")
      .select("id")
      .eq("slug", params.collection)
      .limit(1);
    const collId = collData?.[0]?.id;
    if (collId) {
      const { data: links } = await supabase
        .from("collection_inspirations")
        .select("inspiration_id")
        .eq("collection_id", collId);
      inspirationIds = links?.map((l) => l.inspiration_id as string) ?? [];
    }
  }

  let query = supabase
    .from("inspirations")
    .select("*, space:spaces(id, title, slug)", { count: "exact" })
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (spaceId) query = query.eq("space_id", spaceId);
  if (inspirationIds !== null) {
    if (inspirationIds.length === 0) {
      return { items: [], pagination: { page, limit, total: 0, totalPages: 1 } };
    }
    query = query.in("id", inspirationIds);
  }

  const { data, count } = await query;
  const total = count ?? 0;

  return {
    items: rows<Inspiration>(data),
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

export async function getInspirationBySlug(slug: string) {
  const { data: raw } = await supabase
    .from("inspirations")
    .select("*, space:spaces(id, title, slug, hero_image)")
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);

  if (!raw?.length) return null;
  const inspiration = camelizeRecord<Inspiration>(raw[0]);

  const [collLinks, productLinks, brandLinks, relatedRaw] = await Promise.all([
    supabase
      .from("collection_inspirations")
      .select("collection:collections(id, title, slug, status)")
      .eq("inspiration_id", inspiration.id),
    supabase
      .from("inspiration_products")
      .select("product:products(*, brand:brands(id, name, slug, logo))")
      .eq("inspiration_id", inspiration.id),
    supabase
      .from("inspiration_brands")
      .select("brand:brands(id, name, slug, logo, hero_image, brand_type)")
      .eq("inspiration_id", inspiration.id),
    supabase
      .from("inspirations")
      .select("*, space:spaces(id, title, slug)")
      .eq("space_id", inspiration.spaceId)
      .eq("status", "published")
      .neq("id", inspiration.id)
      .order("is_featured", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(3),
  ]);

  const collections = (collLinks.data ?? [])
    .map((l) => l.collection)
    .filter((c): c is Record<string, unknown> => c !== null && (c as Record<string, unknown>).status === "published")
    .map((c) => camelizeRecord<Collection>(c));

  const products = (productLinks.data ?? [])
    .map((l) => l.product)
    .filter((p): p is Record<string, unknown> => p !== null)
    .map((p) => camelizeRecord<Product>(p));

  const brands = (brandLinks.data ?? [])
    .map((l) => l.brand)
    .filter((b): b is Record<string, unknown> => b !== null)
    .map((b) => camelizeRecord<Brand>(b));

  const relatedInspirations = rows<Inspiration>(relatedRaw.data);

  return { inspiration, collections, products, brands, relatedInspirations };
}
