import { auth } from "@/auth";
import { errors, fail, handleRoute, ok } from "@/lib/api/response";
import { nowIso } from "@/lib/ids";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { updateProductSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const { id } = await params;
    const { data: existing } = await supabase.from("products").select("id").eq("id", id).single();
    if (!existing) return errors.notFound("PRODUCT_NOT_FOUND", "Product not found.");

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const { categoryIds, ...data } = updateProductSchema.parse(body);

    const update: Record<string, unknown> = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.slug !== undefined) update.slug = data.slug;
    if (data.sku !== undefined) update.sku = data.sku;
    if (data.brandId !== undefined) update.brand_id = data.brandId;
    if (data.productTypeId !== undefined) update.product_type_id = data.productTypeId;
    if (data.subcategoryId !== undefined) update.subcategory_id = data.subcategoryId;
    if (data.shortDescription !== undefined) update.short_description = data.shortDescription;
    if (data.longDescription !== undefined) update.long_description = data.longDescription;
    if (data.priceRange !== undefined) update.price_range = data.priceRange;
    if (data.primaryImage !== undefined) update.primary_image = data.primaryImage;
    if (data.galleryImages !== undefined) update.gallery_images = data.galleryImages;
    if (data.availabilityStatus !== undefined) update.availability_status = data.availabilityStatus.toLowerCase();
    if (data.technicalSpecs !== undefined) update.technical_specs = data.technicalSpecs;
    if (data.isFeatured !== undefined) update.is_featured = data.isFeatured;
    if (data.status !== undefined) update.status = data.status.toLowerCase();

    const { data: product, error } = await supabase
      .from("products")
      .update({ ...update, updated_at: nowIso() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("DUPLICATE_SLUG", "A product with this slug already exists.", 409);
      throw error;
    }

    if (categoryIds !== undefined) {
      await supabase.from("product_category_mappings").delete().eq("product_id", id);
      if (categoryIds.length) {
        await supabase.from("product_category_mappings").insert(
          categoryIds.map((categoryId) => ({ product_id: id, category_id: categoryId }))
        );
      }
    }

    return ok({ product: camelizeRecord(product) });
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
    const { data: existing } = await supabase.from("products").select("id").eq("id", id).single();
    if (!existing) return errors.notFound("PRODUCT_NOT_FOUND", "Product not found.");

    // Archive instead of hard-delete
    const { data: product } = await supabase
      .from("products")
      .update({ status: "archived", updated_at: nowIso() })
      .eq("id", id)
      .select()
      .single();

    return ok({ product: product ? camelizeRecord(product) : null });
  });
}
