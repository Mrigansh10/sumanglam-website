import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { createShowroomSectionSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const { brandIds, inspirationIds, ...data } = createShowroomSectionSchema.parse(body);

    const id = crypto.randomUUID();

    const { data: showroomSection, error } = await supabase
      .from("showroom_sections")
      .insert({
        id,
        name: data.name,
        description: data.description,
        floor_number: data.floorNumber,
        images: data.images,
        video_url: data.videoUrl,
      })
      .select()
      .single();

    if (error) throw error;

    await Promise.all([
      brandIds?.length
        ? supabase.from("showroom_brand_mappings").insert(
            brandIds.map((brandId) => ({ showroom_section_id: id, brand_id: brandId }))
          )
        : Promise.resolve(),
      inspirationIds?.length
        ? supabase.from("showroom_inspiration_mappings").insert(
            inspirationIds.map((inspirationId) => ({ showroom_section_id: id, inspiration_id: inspirationId }))
          )
        : Promise.resolve(),
    ]);

    return ok({ showroomSection: camelizeRecord(showroomSection) }, { status: 201 });
  });
}
