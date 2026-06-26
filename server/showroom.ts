import { supabase, rows, camelizeRecord } from "@/lib/supabase";
import type { ShowroomSection, Brand, Inspiration } from "@/lib/db-types";

export async function getShowroomSections() {
  const { data: sectionsRaw } = await supabase
    .from("showroom_sections")
    .select("*")
    .order("floor_number", { ascending: true });

  const sections = rows<ShowroomSection>(sectionsRaw);
  if (!sections.length) return [];

  const sectionIds = sections.map((s) => s.id);

  const [{ data: brandMappings }, { data: inspirMappings }] = await Promise.all([
    supabase
      .from("showroom_brand_mappings")
      .select("showroom_section_id, brand:brands(*)")
      .in("showroom_section_id", sectionIds),
    supabase
      .from("showroom_inspiration_mappings")
      .select("showroom_section_id, inspiration:inspirations(*, space:spaces(id, title, slug))")
      .in("showroom_section_id", sectionIds),
  ]);

  const brandsBySectionId = new Map<string, Array<{ brand: Brand }>>();
  for (const m of (brandMappings ?? []) as Array<{ showroom_section_id: string; brand: Record<string, unknown> }>) {
    const list = brandsBySectionId.get(m.showroom_section_id) ?? [];
    list.push({ brand: camelizeRecord<Brand>(m.brand) });
    brandsBySectionId.set(m.showroom_section_id, list);
  }

  const inspirBySectionId = new Map<string, Array<{ inspiration: Inspiration }>>();
  for (const m of (inspirMappings ?? []) as Array<{ showroom_section_id: string; inspiration: Record<string, unknown> }>) {
    const list = inspirBySectionId.get(m.showroom_section_id) ?? [];
    list.push({ inspiration: camelizeRecord<Inspiration>(m.inspiration) });
    inspirBySectionId.set(m.showroom_section_id, list);
  }

  return sections.map((s) => ({
    ...s,
    brands: brandsBySectionId.get(s.id) ?? [],
    inspirations: inspirBySectionId.get(s.id) ?? [],
  }));
}

export async function getShowroomSectionById(id: string) {
  const { data: raw } = await supabase
    .from("showroom_sections")
    .select("*")
    .eq("id", id)
    .limit(1);

  if (!raw?.length) return null;
  const section = camelizeRecord<ShowroomSection>(raw[0]);

  const [{ data: brandMappings }, { data: inspirMappings }] = await Promise.all([
    supabase
      .from("showroom_brand_mappings")
      .select("brand:brands(*)")
      .eq("showroom_section_id", id),
    supabase
      .from("showroom_inspiration_mappings")
      .select("inspiration:inspirations(*, space:spaces(id, title, slug))")
      .eq("showroom_section_id", id),
  ]);

  const brands = ((brandMappings ?? []) as Array<{ brand: Record<string, unknown> }>)
    .map((m) => camelizeRecord<Brand>(m.brand));

  const inspirations = ((inspirMappings ?? []) as Array<{ inspiration: Record<string, unknown> }>)
    .map((m) => camelizeRecord<Inspiration>(m.inspiration));

  return { section, brands, inspirations };
}
