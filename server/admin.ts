import { supabase, rows, camelizeRecord } from "@/lib/supabase";
import type { Consultation, Lead } from "@/lib/db-types";

// ---------------------------------------------------------------------------
// String union types (replaces Prisma enums — values match DB lowercase)
// ---------------------------------------------------------------------------

export const contentStatusOptions = ["draft", "published", "archived"] as const;
export type ContentStatus = (typeof contentStatusOptions)[number];

export const contentStatusLabels: Record<ContentStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export const leadStatusOptions = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "closed",
] as const;
export type LeadStatus = (typeof leadStatusOptions)[number];

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
};

export const featuredContentTypes = ["inspiration", "brand", "product"] as const;
export type FeaturedContentType = (typeof featuredContentTypes)[number];

export const statusContentTypes = [
  "inspiration",
  "brand",
  "product",
  "collection",
] as const;
export type StatusContentType = (typeof statusContentTypes)[number];

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

async function countTable(table: string, filters?: Record<string, unknown>) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filters) {
    for (const [col, val] of Object.entries(filters)) {
      q = q.eq(col, val as string);
    }
  }
  const { count } = await q;
  return count ?? 0;
}

export async function getAdminOverview() {
  const [
    spaces,
    collections,
    inspirations,
    brands,
    products,
    showroomSections,
    leads,
    consultations,
  ] = await Promise.all([
    countTable("spaces"),
    countTable("collections", { status: "published" }),
    countTable("inspirations", { status: "published" }),
    countTable("brands", { status: "published" }),
    countTable("products", { status: "published" }),
    countTable("showroom_sections"),
    countTable("leads"),
    countTable("consultations"),
  ]);

  const [{ data: recentLeadsRaw }, { data: recentConsultationsRaw }] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
    supabase
      .from("consultations")
      .select("*, lead:leads(*)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    counts: {
      spaces,
      collections,
      inspirations,
      brands,
      products,
      showroomSections,
      leads,
      consultations,
    },
    recentLeads: rows<Lead>(recentLeadsRaw),
    recentConsultations: rows<Consultation>(recentConsultationsRaw),
  };
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export async function getAdminLeads(options?: {
  status?: LeadStatus;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.min(50, Math.max(1, options?.limit ?? 25));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("leads")
    .select("*, consultations(id, created_at, status)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options?.status) {
    query = query.eq("lead_status", options.status);
  }

  const { data, count } = await query;
  return { items: rows<Lead>(data), total: count ?? 0, page, limit };
}

export async function getAdminLead(id: string) {
  const { data } = await supabase
    .from("leads")
    .select("*, consultations(*)")
    .eq("id", id)
    .limit(1);
  return data?.length ? camelizeRecord(data[0]) : null;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const { data } = await supabase
    .from("leads")
    .update({ lead_status: status })
    .eq("id", id)
    .select()
    .single();
  return data ? camelizeRecord(data) : null;
}

// ---------------------------------------------------------------------------
// Consultations
// ---------------------------------------------------------------------------

export async function getAdminConsultations(options?: { page?: number; limit?: number }) {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.min(50, Math.max(1, options?.limit ?? 25));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count } = await supabase
    .from("consultations")
    .select("*, lead:leads(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return { items: rows<Consultation>(data), total: count ?? 0, page, limit };
}

export async function getAdminConsultation(id: string) {
  const { data } = await supabase
    .from("consultations")
    .select("*, lead:leads(*)")
    .eq("id", id)
    .limit(1);
  return data?.length ? camelizeRecord(data[0]) : null;
}

// ---------------------------------------------------------------------------
// Content management
// ---------------------------------------------------------------------------

const contentListLimit = 50;

// Shapes of the trimmed selects below (camelized).
export type AdminContentRow = {
  id: string;
  slug: string;
  status: ContentStatus;
  isFeatured: boolean;
  updatedAt: string;
};
export type AdminCollectionRow = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  updatedAt: string;
};
export type AdminShowroomRow = {
  id: string;
  name: string;
  floorNumber: number | null;
  updatedAt: string;
};

export async function getAdminContentLists() {
  const [
    { data: inspirations },
    { data: brands },
    { data: products },
    { data: collections },
    { data: showroomSections },
  ] = await Promise.all([
    supabase
      .from("inspirations")
      .select("id, title, slug, status, is_featured, updated_at")
      .order("updated_at", { ascending: false })
      .limit(contentListLimit),
    supabase
      .from("brands")
      .select("id, name, slug, status, is_featured, updated_at")
      .order("updated_at", { ascending: false })
      .limit(contentListLimit),
    supabase
      .from("products")
      .select("id, name, slug, status, is_featured, updated_at")
      .order("updated_at", { ascending: false })
      .limit(contentListLimit),
    supabase
      .from("collections")
      .select("id, title, slug, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(contentListLimit),
    supabase
      .from("showroom_sections")
      .select("id, name, floor_number, updated_at")
      .order("updated_at", { ascending: false })
      .limit(contentListLimit),
  ]);

  return {
    inspirations: rows<AdminContentRow & { title: string }>(inspirations),
    brands: rows<AdminContentRow & { name: string }>(brands),
    products: rows<AdminContentRow & { name: string }>(products),
    collections: rows<AdminCollectionRow>(collections),
    showroomSections: rows<AdminShowroomRow>(showroomSections),
  };
}

export async function setContentStatus(
  type: StatusContentType,
  id: string,
  status: ContentStatus,
) {
  const tableMap: Record<StatusContentType, string> = {
    inspiration: "inspirations",
    brand: "brands",
    product: "products",
    collection: "collections",
  };
  const { data } = await supabase
    .from(tableMap[type])
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  return data ? camelizeRecord(data) : null;
}

export async function setContentFeatured(
  type: FeaturedContentType,
  id: string,
  isFeatured: boolean,
) {
  const tableMap: Record<FeaturedContentType, string> = {
    inspiration: "inspirations",
    brand: "brands",
    product: "products",
  };
  const { data } = await supabase
    .from(tableMap[type])
    .update({ is_featured: isFeatured })
    .eq("id", id)
    .select()
    .single();
  return data ? camelizeRecord(data) : null;
}
