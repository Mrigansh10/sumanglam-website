import { supabase, camelizeRecord } from "@/lib/supabase";
import { newId, nowIso } from "@/lib/ids";

// String union types matching DB enum values (lowercase)
export type ProjectType =
  | "kitchen"
  | "wardrobe"
  | "complete_home"
  | "hardware_appliances"
  | "other";

export type ContactMethod = "phone" | "whatsapp" | "email";

export type ConsultationInput = {
  name: string;
  phone: string;
  email?: string | null;
  // The public form submits uppercase enum values; inserts normalize to the
  // lowercase DB representation below.
  projectType: ProjectType | Uppercase<ProjectType>;
  requirements: string;
  preferredContactMethod?: ContactMethod | Uppercase<ContactMethod> | null;
  sourcePage?: string | null;
  sourceType?: string | null;
  referringUrl?: string | null;
};

/**
 * Creates (or reuses by phone) a Lead and attaches a Consultation.
 * Duplicate handling decision: an existing lead with the same phone is
 * updated rather than duplicated, preserving its pipeline status.
 */
export async function createConsultation(input: ConsultationInput) {
  const { data: existing } = await supabase
    .from("leads")
    .select("*")
    .eq("phone", input.phone)
    .order("created_at", { ascending: false })
    .limit(1);

  let lead: Record<string, unknown>;

  if (existing?.length) {
    const existingLead = camelizeRecord<Record<string, unknown>>(existing[0]);
    const { data: updated, error } = await supabase
      .from("leads")
      .update({
        name: input.name,
        email: input.email ?? existingLead.email,
        source_page: input.sourcePage ?? existingLead.sourcePage,
        lead_source: input.sourceType ?? existingLead.leadSource,
        referring_url: input.referringUrl ?? existingLead.referringUrl,
        updated_at: nowIso(),
      })
      .eq("id", existingLead.id as string)
      .select()
      .single();
    if (error) console.error("[leads] update failed:", error.message);
    lead = updated ? camelizeRecord<Record<string, unknown>>(updated) : existingLead;
  } else {
    // id / timestamps supplied explicitly — Prisma-created columns have no DB
    // defaults (see lib/ids.ts).
    const { data: created, error } = await supabase
      .from("leads")
      .insert({
        id: newId(),
        name: input.name,
        phone: input.phone,
        email: input.email ?? null,
        lead_source: input.sourceType ?? "consultation_form",
        source_page: input.sourcePage ?? null,
        referring_url: input.referringUrl ?? null,
        created_at: nowIso(),
        updated_at: nowIso(),
      })
      .select()
      .single();
    if (!created) throw new Error(`Failed to create lead: ${error?.message ?? "no row returned"}`);
    lead = camelizeRecord<Record<string, unknown>>(created);
  }

  const { data: consultData, error: consultError } = await supabase
    .from("consultations")
    .insert({
      id: newId(),
      lead_id: lead.id as string,
      // Form may submit uppercase values; DB stores lowercase
      project_type: input.projectType.toLowerCase(),
      requirements: input.requirements,
      preferred_contact_method: input.preferredContactMethod
        ? input.preferredContactMethod.toLowerCase()
        : null,
      created_at: nowIso(),
      updated_at: nowIso(),
    })
    .select()
    .single();

  if (!consultData)
    throw new Error(`Failed to create consultation: ${consultError?.message ?? "no row returned"}`);
  const consultation = camelizeRecord<Record<string, unknown>>(consultData);

  notifyAdmin(lead.name as string, consultation.id as string);

  return { lead, consultation };
}

/**
 * Admin notification placeholder. The notification channel (email/WhatsApp/
 * dashboard) is an unresolved open question — see
 * project-vault/15_Open_Questions.md. Logged for now; leads remain visible
 * in the admin dashboard regardless.
 */
function notifyAdmin(leadName: string, consultationId: string) {
  console.info(
    `[notification] New consultation ${consultationId} from ${leadName}. Configure a real channel before launch.`,
  );
}
