import { auth } from "@/auth";
import { errors, fail, handleRoute, ok } from "@/lib/api/response";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { createBrandSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const data = createBrandSchema.parse(body);

    const { data: brand, error } = await supabase
      .from("brands")
      .insert({
        id: crypto.randomUUID(),
        name: data.name,
        slug: data.slug,
        brand_type: data.brandType?.toLowerCase(),
        parent_brand_id: data.parentBrandId,
        description: data.description,
        story: data.story,
        logo: data.logo,
        hero_image: data.heroImage,
        is_featured: data.isFeatured ?? false,
        status: data.status?.toLowerCase() ?? "draft",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("DUPLICATE_SLUG", "A brand with this slug already exists.", 409);
      throw error;
    }

    return ok({ brand: camelizeRecord(brand) }, { status: 201 });
  });
}
