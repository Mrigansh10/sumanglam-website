import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { updateSpaceSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const { data, error } = await supabase.from("spaces").select("*").eq("id", id).single();
    if (error || !data) return errors.notFound("SPACE_NOT_FOUND", "Space not found.");
    return ok({ space: camelizeRecord(data) });
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
    const { data: existing } = await supabase.from("spaces").select("id").eq("id", id).single();
    if (!existing) return errors.notFound("SPACE_NOT_FOUND", "Space not found.");

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const data = updateSpaceSchema.parse(body);

    const update: Record<string, unknown> = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;
    if (data.heroImage !== undefined) update.hero_image = data.heroImage;

    const { data: space, error } = await supabase
      .from("spaces")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return ok({ space: camelizeRecord(space) });
  });
}
