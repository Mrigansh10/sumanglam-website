import { auth } from "@/auth";
import { errors, fail, handleRoute, ok } from "@/lib/api/response";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { updateCollectionSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const { data: existing } = await supabase.from("collections").select("id").eq("id", id).single();
    if (!existing) return errors.notFound("COLLECTION_NOT_FOUND", "Collection not found.");

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const data = updateCollectionSchema.parse(body);

    const update: Record<string, unknown> = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.slug !== undefined) update.slug = data.slug;
    if (data.shortDescription !== undefined) update.short_description = data.shortDescription;
    if (data.longDescription !== undefined) update.long_description = data.longDescription;
    if (data.coverImage !== undefined) update.cover_image = data.coverImage;
    if (data.spaceId !== undefined) update.space_id = data.spaceId;
    if (data.status !== undefined) update.status = data.status.toLowerCase();

    const { data: collection, error } = await supabase
      .from("collections")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("DUPLICATE_SLUG", "A collection with this slug already exists.", 409);
      throw error;
    }

    return ok({ collection: camelizeRecord(collection) });
  });
}
