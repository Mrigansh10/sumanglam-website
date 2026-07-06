import { auth } from "@/auth";
import { errors, fail, handleRoute, ok } from "@/lib/api/response";
import { newId, nowIso } from "@/lib/ids";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { createInspirationSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const { collectionIds, brandIds, productIds, ...data } = createInspirationSchema.parse(body);

    const id = crypto.randomUUID();

    const { data: inspiration, error } = await supabase
      .from("inspirations")
      .insert({
        id,
        title: data.title,
        slug: data.slug,
        short_description: data.shortDescription,
        long_description: data.longDescription,
        primary_image: data.primaryImage,
        gallery_images: data.galleryImages,
        video_url: data.videoUrl,
        space_id: data.spaceId,
        is_featured: data.isFeatured ?? false,
        status: data.status?.toLowerCase() ?? "draft",
        created_at: nowIso(),
        updated_at: nowIso(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("DUPLICATE_SLUG", "An inspiration with this slug already exists.", 409);
      throw error;
    }

    // Insert junction rows in parallel
    await Promise.all([
      collectionIds?.length
        ? supabase.from("collection_inspirations").insert(
            collectionIds.map((collectionId) => ({ collection_id: collectionId, inspiration_id: id }))
          )
        : Promise.resolve(),
      brandIds?.length
        ? supabase.from("inspiration_brands").insert(
            brandIds.map((brandId) => ({ inspiration_id: id, brand_id: brandId }))
          )
        : Promise.resolve(),
      productIds?.length
        ? supabase.from("inspiration_products").insert(
            productIds.map((productId) => ({ inspiration_id: id, product_id: productId }))
          )
        : Promise.resolve(),
    ]);

    return ok({ inspiration: camelizeRecord(inspiration) }, { status: 201 });
  });
}
