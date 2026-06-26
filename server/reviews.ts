import { supabase, rows, camelizeRecord } from "@/lib/supabase";
import type { Review } from "@/lib/db-types";
import type { ReviewInput } from "@/lib/validation/review";

export async function submitReview(input: ReviewInput) {
  const { data } = await supabase
    .from("reviews")
    .insert({
      author_name: input.authorName,
      rating: input.rating,
      content: input.content,
      is_approved: false,
    })
    .select()
    .single();
  return data ? camelizeRecord<Review>(data) : null;
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
    .update({ is_approved: isApproved })
    .eq("id", id)
    .select()
    .single();
  return data ? camelizeRecord<Review>(data) : null;
}

export async function deleteReview(id: string) {
  await supabase.from("reviews").delete().eq("id", id);
}
