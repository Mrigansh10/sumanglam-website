import { auth } from "@/auth";
import { errors, fail, handleRoute, ok } from "@/lib/api/response";
import { newId, nowIso } from "@/lib/ids";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { createCollectionSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const data = createCollectionSchema.parse(body);

    const { data: collection, error } = await supabase
      .from("collections")
      .insert({
        id: crypto.randomUUID(),
        title: data.title,
        slug: data.slug,
        short_description: data.shortDescription,
        long_description: data.longDescription,
        cover_image: data.coverImage,
        space_id: data.spaceId,
        status: data.status?.toLowerCase() ?? "draft",
        created_at: nowIso(),
        updated_at: nowIso(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("DUPLICATE_SLUG", "A collection with this slug already exists.", 409);
      throw error;
    }

    return ok({ collection: camelizeRecord(collection) }, { status: 201 });
  });
}
