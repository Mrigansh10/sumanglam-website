import { auth } from "@/auth";
import { errors, fail, handleRoute, ok } from "@/lib/api/response";
import { supabase, camelizeRecord } from "@/lib/supabase";
import { createProductSchema } from "@/lib/validation/admin-content";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await request.json().catch(() => null);
    if (!body) return errors.badRequest("Request body must be valid JSON.");

    const { categoryIds, ...data } = createProductSchema.parse(body);

    const id = crypto.randomUUID();

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        id,
        name: data.name,
        slug: data.slug,
        sku: data.sku,
        brand_id: data.brandId,
        product_type_id: data.productTypeId,
        subcategory_id: data.subcategoryId,
        short_description: data.shortDescription,
        long_description: data.longDescription,
        price_range: data.priceRange,
        primary_image: data.primaryImage,
        gallery_images: data.galleryImages,
        availability_status: data.availabilityStatus?.toLowerCase(),
        technical_specs: data.technicalSpecs,
        is_featured: data.isFeatured ?? false,
        status: data.status?.toLowerCase() ?? "draft",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return fail("DUPLICATE_SLUG", "A product with this slug already exists.", 409);
      throw error;
    }

    if (categoryIds.length) {
      await supabase.from("product_category_mappings").insert(
        categoryIds.map((categoryId) => ({ product_id: id, category_id: categoryId }))
      );
    }

    return ok({ product: camelizeRecord(product) }, { status: 201 });
  });
}
