import { supabase, rows, camelizeRecord } from "@/lib/supabase";

export type ProductListParams = {
  page?: number;
  limit?: number;
  brand?: string;
  type?: string;
  category?: string;
  subcategory?: string;
};

export async function listProducts(params: ProductListParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(48, Math.max(1, params.limit ?? 12));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let brandId: string | null = null;
  if (params.brand) {
    const { data } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", params.brand)
      .limit(1);
    brandId = data?.[0]?.id ?? null;
  }

  let productTypeId: string | null = null;
  if (params.type) {
    const { data } = await supabase
      .from("product_types")
      .select("id")
      .eq("slug", params.type)
      .limit(1);
    productTypeId = data?.[0]?.id ?? null;
  }

  let productIds: string[] | null = null;
  if (params.category) {
    const { data: catData } = await supabase
      .from("product_categories")
      .select("id")
      .eq("slug", params.category)
      .limit(1);
    const catId = catData?.[0]?.id;
    if (catId) {
      const { data: mappings } = await supabase
        .from("product_category_mappings")
        .select("product_id")
        .eq("category_id", catId);
      productIds = mappings?.map((m) => m.product_id) ?? [];
    }
  }

  let query = supabase
    .from("products")
    .select("*, brand:brands(id, name, slug, logo), productType:product_types(id, name, slug)", {
      count: "exact",
    })
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true })
    .range(from, to);

  if (brandId) query = query.eq("brand_id", brandId);
  if (productTypeId) query = query.eq("product_type_id", productTypeId);
  if (params.subcategory) {
    const { data: subData } = await supabase
      .from("product_subcategories")
      .select("id")
      .eq("slug", params.subcategory)
      .limit(1);
    const subId = subData?.[0]?.id;
    if (subId) query = query.eq("subcategory_id", subId);
  }
  if (productIds !== null) {
    if (productIds.length === 0) return { items: [], pagination: { page, limit, total: 0, totalPages: 1 } };
    query = query.in("id", productIds);
  }

  const { data, count } = await query;
  const total = count ?? 0;
  return {
    items: rows(data),
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

export async function getProductBySlug(slug: string) {
  const { data: raw } = await supabase
    .from("products")
    .select("*, brand:brands(*), productType:product_types(*), subcategory:product_subcategories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);

  if (!raw?.length) return null;
  const product = camelizeRecord<Record<string, unknown>>(raw[0]);

  const [catMappings, inspirLinks] = await Promise.all([
    supabase
      .from("product_category_mappings")
      .select("category:product_categories(id, name, slug)")
      .eq("product_id", product.id as string),
    supabase
      .from("inspiration_products")
      .select("inspiration:inspirations(*, space:spaces(id, title, slug))")
      .eq("product_id", product.id as string),
  ]);

  const categories = (catMappings.data ?? [])
    .map((m) => camelizeRecord(m.category as Record<string, unknown>))
    .filter(Boolean);

  const inspirations = (inspirLinks.data ?? [])
    .map((m) => camelizeRecord(m.inspiration as Record<string, unknown>))
    .filter(Boolean);

  const { data: relatedRaw } = await supabase
    .from("products")
    .select("*, brand:brands(id, name, slug, logo)")
    .eq("brand_id", product.brandId as string)
    .eq("status", "published")
    .neq("id", product.id as string)
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true })
    .limit(4);

  return {
    product,
    brand: product.brand,
    categories,
    inspirations,
    relatedProducts: rows(relatedRaw),
  };
}

export async function getProductTaxonomy() {
  const { data: types } = await supabase
    .from("product_types")
    .select("*")
    .order("name", { ascending: true });

  const { data: categories } = await supabase
    .from("product_categories")
    .select("*")
    .order("name", { ascending: true });

  const { data: subcategories } = await supabase
    .from("product_subcategories")
    .select("*")
    .order("name", { ascending: true });

  const subByCat = new Map<string, unknown[]>();
  for (const sub of rows(subcategories)) {
    const s = sub as Record<string, unknown>;
    const list = subByCat.get(s.categoryId as string) ?? [];
    list.push(s);
    subByCat.set(s.categoryId as string, list);
  }

  const catByType = new Map<string, unknown[]>();
  for (const cat of rows(categories)) {
    const c = cat as Record<string, unknown>;
    const list = catByType.get(c.productTypeId as string) ?? [];
    list.push({ ...c, subcategories: subByCat.get(c.id as string) ?? [] });
    catByType.set(c.productTypeId as string, list);
  }

  return rows<Record<string, unknown>>(types).map((t) => ({
    ...t,
    categories: catByType.get(t.id as string) ?? [],
  }));
}
