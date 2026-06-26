"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import {
  contentStatusOptions,
  featuredContentTypes,
  leadStatusOptions,
  setContentFeatured,
  setContentStatus,
  statusContentTypes,
  updateLeadStatus,
  type FeaturedContentType,
  type StatusContentType,
} from "@/server/admin";
import { setReviewApproval, deleteReview } from "@/server/reviews";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
}

export async function signOutAdmin() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdmin();

  const leadId = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!leadId || !leadStatusOptions.includes(status as never)) {
    throw new Error("Invalid lead status update.");
  }

  await updateLeadStatus(leadId, status as import("@/server/admin").LeadStatus);
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
}

export async function setContentStatusAction(formData: FormData) {
  await requireAdmin();

  const type = String(formData.get("type") ?? "") as StatusContentType;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (
    !id ||
    !statusContentTypes.includes(type) ||
    !contentStatusOptions.includes(status as never)
  ) {
    throw new Error("Invalid content status update.");
  }

  await setContentStatus(type, id, status as import("@/server/admin").ContentStatus);
  revalidatePath("/admin");
  revalidatePath("/admin/content");
}

export async function approveReviewAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const isApproved = formData.get("isApproved") === "true";
  if (!id) throw new Error("Missing review id.");
  await setReviewApproval(id, isApproved);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReviewAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing review id.");
  await deleteReview(id);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function setContentFeaturedAction(formData: FormData) {
  await requireAdmin();

  const type = String(formData.get("type") ?? "") as FeaturedContentType;
  const id = String(formData.get("id") ?? "");
  const featured = String(formData.get("featured") ?? "");

  if (!id || !featuredContentTypes.includes(type) || !["true", "false"].includes(featured)) {
    throw new Error("Invalid content featured update.");
  }

  await setContentFeatured(type, id, featured === "true");
  revalidatePath("/admin");
  revalidatePath("/admin/content");
}
