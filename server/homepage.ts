import { supabase, rows } from "@/lib/supabase";
import type { Brand, Inspiration, Product, ShowroomSection } from "@/lib/db-types";

export async function getHomepageData() {
  const [
    { data: inspirData },
    { data: brandsData },
    { data: productsData },
    { data: showroomData },
  ] = await Promise.all([
    supabase
      .from("inspirations")
      .select("*, space:spaces(id, title, slug, hero_image)")
      .eq("is_featured", true)
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("brands")
      .select("*")
      .eq("is_featured", true)
      .eq("status", "published")
      .order("brand_type", { ascending: true })
      .order("name", { ascending: true })
      .limit(8),
    supabase
      .from("products")
      .select("*, brand:brands(id, name, slug, logo, hero_image)")
      .eq("is_featured", true)
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("showroom_sections")
      .select("*")
      .order("floor_number", { ascending: true }),
  ]);

  return {
    featuredInspirations: rows<Inspiration>(inspirData),
    featuredBrands: rows<Brand>(brandsData),
    featuredProducts: rows<Product>(productsData),
    showroomHighlights: rows<ShowroomSection>(showroomData),
  };
}
