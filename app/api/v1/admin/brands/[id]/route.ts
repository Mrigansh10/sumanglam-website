import { auth } from "@/auth";
import { errors, fail, handleRoute, ok } from "@/lib/api/response";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { updateBrandSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const { data, error } = await supabase.from("brands").select("*").eq("id", id).single();
    if (error || !data) return errors.notFound("BRAND_NOT_FOUND", "Brand not found.");
    return ok({ brand: camelizeRecord(data) });
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const { data: existing } = await supabase.from("brands").select("id").eq("id", id).single();
    if (!existing) return errors.notFound("BRAND_NOT_FOUND", "Brand not found.");

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const data = updateBrandSchema.parse(body);
    if (data.parentBrandId === id) return errors.badRequest("A brand cannot be its own parent.");

    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.slug !== undefined) update.slug = data.slug;
    if (data.brandType !== undefined) update.brand_type = data.brandType.toLowerCase();
    if (data.parentBrandId !== undefined) update.parent_brand_id = data.parentBrandId;
    if (data.description !== undefined) update.description = data.description;
    if (data.story !== undefined) update.story = data.story;
    if (data.logo !== undefined) update.logo = data.logo;
    if (data.heroImage !== undefined) update.hero_image = data.heroImage;
    if (data.isFeatured !== undefined) update.is_featured = data.isFeatured;
    if (data.status !== undefined) update.status = data.status.toLowerCase();

    const { data: brand, error } = await supabase
      .from("brands")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("DUPLICATE_SLUG", "A brand with this slug already exists.", 409);
      throw error;
    }

    return ok({ brand: camelizeRecord(brand) });
  });
}
