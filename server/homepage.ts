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

// Hardware brands shown as logo tiles on the V2 homepage, in display order.
// Appliance brands (Bosch, Siemens, …) share brand_type "product", so the
// list is explicit rather than filtered by type.
export const HOMEPAGE_HARDWARE_BRAND_SLUGS = [
  "hettich",
  "blum",
  "hafele",
  "yale",
  "godrej",
  "dorset",
  "everyday",
  "spitze",
];

export type HomepageIdea = Pick<Inspiration, "id" | "title" | "slug" | "primaryImage">;
export type HomepageBrandLogo = Pick<Brand, "name" | "slug" | "logo">;

/**
 * Data for the V2 homepage: every published kitchen inspiration (the
 * "Ideas" rail) and the hardware brand logos.
 */
export async function getHomepageShowcase() {
  const [{ data: kitchenSpace }, { data: logoData }] = await Promise.all([
    supabase.from("spaces").select("id").eq("slug", "kitchen").limit(1),
    supabase
      .from("brands")
      .select("name, slug, logo")
      .eq("status", "published")
      .in("slug", HOMEPAGE_HARDWARE_BRAND_SLUGS),
  ]);

  const kitchenSpaceId = kitchenSpace?.[0]?.id as string | undefined;
  const { data: ideaData } = kitchenSpaceId
    ? await supabase
        .from("inspirations")
        .select("id, title, slug, primary_image")
        .eq("status", "published")
        .eq("space_id", kitchenSpaceId)
        .order("is_featured", { ascending: false })
        .order("updated_at", { ascending: false })
    : { data: [] };

  const logos = rows<HomepageBrandLogo>(logoData).sort(
    (a, b) =>
      HOMEPAGE_HARDWARE_BRAND_SLUGS.indexOf(a.slug) -
      HOMEPAGE_HARDWARE_BRAND_SLUGS.indexOf(b.slug),
  );

  return {
    kitchenIdeas: rows<HomepageIdea>(ideaData),
    hardwareLogos: logos,
  };
}
