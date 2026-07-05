import { supabase, rows, camelizeRecord } from "@/lib/supabase";
import type { Collection, Inspiration } from "@/lib/db-types";

export async function getCollections() {
  const { data } = await supabase
    .from("collections")
    .select("*, space:spaces(id, title, slug)")
    .eq("status", "published")
    .order("title", { ascending: true });
  return rows<Collection>(data);
}

export async function getCollectionBySlug(slug: string) {
  const { data: raw } = await supabase
    .from("collections")
    .select("*, space:spaces(id, title, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1);

  if (!raw?.length) return null;
  const collection = camelizeRecord<Collection>(raw[0]);

  const [memberLinks, relatedRaw] = await Promise.all([
    supabase
      .from("collection_inspirations")
      .select("inspiration:inspirations(*, space:spaces(id, title, slug))")
      .eq("collection_id", collection.id),
    supabase
      .from("collections")
      .select("*")
      .eq("space_id", collection.spaceId as string)
      .eq("status", "published")
      .neq("id", collection.id)
      .limit(3),
  ]);

  const inspirations = ((memberLinks.data ?? []) as unknown as Array<{ inspiration: Record<string, unknown> | null }>)
    .map((m) => m.inspiration)
    .filter((i): i is Record<string, unknown> => i !== null && i.status === "published")
    .map((i) => camelizeRecord<Inspiration>(i));

  return {
    collection,
    inspirations,
    relatedCollections: rows<Collection>(relatedRaw.data),
  };
}
