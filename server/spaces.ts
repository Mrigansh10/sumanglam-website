import { supabase, rows, camelizeRecord } from "@/lib/supabase";
import type { Space, Collection, Inspiration } from "@/lib/db-types";

export async function getSpaces() {
  const { data } = await supabase.from("spaces").select("*").order("title", { ascending: true });
  return rows<Space>(data);
}

export async function getSpaceBySlug(slug: string) {
  const { data: raw } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", slug)
    .limit(1);

  if (!raw?.length) return null;
  const space = camelizeRecord<Space>(raw[0]);

  const [collectionsRaw, inspirationsRaw] = await Promise.all([
    supabase
      .from("collections")
      .select("*")
      .eq("space_id", space.id)
      .eq("status", "published")
      .order("title", { ascending: true }),
    supabase
      .from("inspirations")
      .select("*")
      .eq("space_id", space.id)
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(12),
  ]);

  return {
    space,
    collections: rows<Collection>(collectionsRaw.data),
    featuredInspirations: rows<Inspiration>(inspirationsRaw.data),
  };
}
