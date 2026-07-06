import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { nowIso } from "@/lib/ids";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { updateShowroomSectionSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const { data: existing } = await supabase.from("showroom_sections").select("id").eq("id", id).single();
    if (!existing) return errors.notFound("SHOWROOM_SECTION_NOT_FOUND", "Showroom section not found.");

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const { brandIds, inspirationIds, ...data } = updateShowroomSectionSchema.parse(body);

    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.description !== undefined) update.description = data.description;
    if (data.floorNumber !== undefined) update.floor_number = data.floorNumber;
    if (data.images !== undefined) update.images = data.images;
    if (data.videoUrl !== undefined) update.video_url = data.videoUrl;

    const { data: showroomSection, error } = await supabase
      .from("showroom_sections")
      .update({ ...update, updated_at: nowIso() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await Promise.all([
      brandIds !== undefined
        ? supabase.from("showroom_brand_mappings").delete().eq("showroom_section_id", id).then(async () => {
            if (brandIds.length) {
              await supabase.from("showroom_brand_mappings").insert(
                brandIds.map((brandId) => ({ showroom_section_id: id, brand_id: brandId }))
              );
            }
          })
        : Promise.resolve(),
      inspirationIds !== undefined
        ? supabase.from("showroom_inspiration_mappings").delete().eq("showroom_section_id", id).then(async () => {
            if (inspirationIds.length) {
              await supabase.from("showroom_inspiration_mappings").insert(
                inspirationIds.map((inspirationId) => ({ showroom_section_id: id, inspiration_id: inspirationId }))
              );
            }
          })
        : Promise.resolve(),
    ]);

    return ok({ showroomSection: camelizeRecord(showroomSection) });
  });
}
