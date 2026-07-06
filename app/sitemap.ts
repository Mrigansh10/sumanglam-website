import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

async function fetchSlugs(table: string) {
  try {
    const { data } = await supabase
      .from(table)
      .select("slug, updated_at")
      .eq("status", "published");
    return (data ?? []).map((r) => ({ slug: r.slug as string, updatedAt: new Date(r.updated_at as string) }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/inspiration",
    "/kitchens",
    "/nolte",
    "/mrida",
    "/wardrobes",
    "/hardware-appliances",
    "/products",
    "/brands",
    "/architects-designers",
    "/about",
    "/contact",
    "/book-consultation",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [inspirations, collections, brands, products] = await Promise.all([
    fetchSlugs("inspirations"),
    fetchSlugs("collections"),
    fetchSlugs("brands"),
    fetchSlugs("products"),
  ]);

  return [
    ...staticRoutes,
    ...inspirations.map((item) => ({
      url: `${base}/inspiration/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...collections.map((item) => ({
      url: `${base}/collections/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...brands
      .filter((item) => item.slug !== "nolte" && item.slug !== "mrida")
      .map((item) => ({
        url: `${base}/brands/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
    ...products.map((item) => ({
      url: `${base}/products/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
