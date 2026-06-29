import { auth } from "@/auth";
import { errors, handleRoute, ok } from "@/lib/api/response";
import { supabase } from "@/lib/supabase";
import { homepageSettingsSchema } from "@/lib/validation/admin-content";
import { getHomepageImages, HOMEPAGE_SLOT_KEYS } from "@/server/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const images = await getHomepageImages();
    return ok({ images });
  });
}

export async function PUT(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const data = homepageSettingsSchema.parse(body);

    const updatedAt = new Date().toISOString();
    const updates = (Object.keys(HOMEPAGE_SLOT_KEYS) as (keyof typeof data)[])
      .filter((slot) => data[slot] !== undefined)
      .map((slot) => ({
        key: HOMEPAGE_SLOT_KEYS[slot],
        value: data[slot] as string,
        updated_at: updatedAt,
      }));

    if (updates.length) {
      const { error } = await supabase
        .from("site_settings")
        .upsert(updates, { onConflict: "key" });
      if (error) throw error;
    }

    const images = await getHomepageImages();
    return ok({ images });
  });
}
