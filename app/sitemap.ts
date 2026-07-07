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

  // NOTE: /products and /showroom are intentionally absent (catalog unpublished
  // for launch; showroom offline until photography). Inspiration DETAIL urls are
  // absent because the pages were removed in the visual-only restyle — they 308
  // to /inspiration via next.config redirects.
  const staticRoutes = [
    "",
    "/inspiration",
    "/kitchens",
    "/nolte",
    "/mrida",
    "/wardrobes",
    "/hardware-appliances",
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

  const [collections, brands] = await Promise.all([
    fetchSlugs("collections"),
    fetchSlugs("brands"),
  ]);

  return [
    ...staticRoutes,
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
  ];
}
