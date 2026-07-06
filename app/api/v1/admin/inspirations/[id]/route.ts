import { auth } from "@/auth";
import { errors, fail, handleRoute, ok } from "@/lib/api/response";
import { nowIso } from "@/lib/ids";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { updateInspirationSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const { data: existing } = await supabase.from("inspirations").select("id").eq("id", id).single();
    if (!existing) return errors.notFound("INSPIRATION_NOT_FOUND", "Inspiration not found.");

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const { collectionIds, brandIds, productIds, ...data } = updateInspirationSchema.parse(body);

    const update: Record<string, unknown> = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.slug !== undefined) update.slug = data.slug;
    if (data.shortDescription !== undefined) update.short_description = data.shortDescription;
    if (data.longDescription !== undefined) update.long_description = data.longDescription;
    if (data.primaryImage !== undefined) update.primary_image = data.primaryImage;
    if (data.galleryImages !== undefined) update.gallery_images = data.galleryImages;
    if (data.videoUrl !== undefined) update.video_url = data.videoUrl;
    if (data.spaceId !== undefined) update.space_id = data.spaceId;
    if (data.isFeatured !== undefined) update.is_featured = data.isFeatured;
    if (data.status !== undefined) update.status = data.status.toLowerCase();

    const { data: inspiration, error } = await supabase
      .from("inspirations")
      .update({ ...update, updated_at: nowIso() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("DUPLICATE_SLUG", "An inspiration with this slug already exists.", 409);
      throw error;
    }

    // Replace junction rows for any relation arrays that were provided
    await Promise.all([
      collectionIds !== undefined
        ? supabase.from("collection_inspirations").delete().eq("inspiration_id", id).then(async () => {
            if (collectionIds.length) {
              await supabase.from("collection_inspirations").insert(
                collectionIds.map((collectionId) => ({ collection_id: collectionId, inspiration_id: id }))
              );
            }
          })
        : Promise.resolve(),
      brandIds !== undefined
        ? supabase.from("inspiration_brands").delete().eq("inspiration_id", id).then(async () => {
            if (brandIds.length) {
              await supabase.from("inspiration_brands").insert(
                brandIds.map((brandId) => ({ inspiration_id: id, brand_id: brandId }))
              );
            }
          })
        : Promise.resolve(),
      productIds !== undefined
        ? supabase.from("inspiration_products").delete().eq("inspiration_id", id).then(async () => {
            if (productIds.length) {
              await supabase.from("inspiration_products").insert(
                productIds.map((productId) => ({ inspiration_id: id, product_id: productId }))
              );
            }
          })
        : Promise.resolve(),
    ]);

    return ok({ inspiration: camelizeRecord(inspiration) });
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const { data: existing } = await supabase.from("inspirations").select("id").eq("id", id).single();
    if (!existing) return errors.notFound("INSPIRATION_NOT_FOUND", "Inspiration not found.");

    // Archive instead of hard-delete
    const { data: inspiration } = await supabase
      .from("inspirations")
      .update({ status: "archived", updated_at: nowIso() })
      .eq("id", id)
      .select()
      .single();

    return ok({ inspiration: inspiration ? camelizeRecord(inspiration) : null });
  });
}
