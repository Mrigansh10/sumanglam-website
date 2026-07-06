import { supabase, rows, camelizeRecord } from "@/lib/supabase";
import { newId, nowIso } from "@/lib/ids";
import type { Review } from "@/lib/db-types";
import type { ReviewInput } from "@/lib/validation/review";

export async function submitReview(input: ReviewInput) {
  // id / timestamps supplied explicitly — Prisma-created columns have no DB
  // defaults (see lib/ids.ts). Throw on failure: the route replies "thank you"
  // on success, and a silently dropped review must not look like a success.
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      id: newId(),
      author_name: input.authorName,
      rating: input.rating,
      content: input.content,
      is_approved: false,
      created_at: nowIso(),
      updated_at: nowIso(),
    })
    .select()
    .single();
  if (!data) throw new Error(`Failed to submit review: ${error?.message ?? "no row returned"}`);
  return camelizeRecord<Review>(data);
}

export async function getApprovedReviews() {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  return rows<Review>(data);
}

export async function getAllReviewsAdmin() {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false });
  return rows<Review>(data);
}

export async function setReviewApproval(id: string, isApproved: boolean) {
  const { data } = await supabase
    .from("reviews")
    .update({ is_approved: isApproved, updated_at: nowIso() })
    .eq("id", id)
    .select()
    .single();
  return data ? camelizeRecord<Review>(data) : null;
}

export async function deleteReview(id: string) {
  await supabase.from("reviews").delete().eq("id", id);
}
