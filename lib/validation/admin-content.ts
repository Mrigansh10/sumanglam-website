import { z } from "zod";

/**
 * Server-side validation for the admin content CRUD endpoints
 * (project-vault/11_API_Backend/API - Admin Content.md).
 */

export const contentStatusValues = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const brandTypeValues = ["SOLUTION", "PRODUCT"] as const;
export const availabilityStatusValues = [
  "AVAILABLE",
  "LIMITED",
  "DISCONTINUED",
  "COMING_SOON",
] as const;

const CONTROL_CHARS = new RegExp("[\\x00-\\x1f\\x7f]", "g");

// Strips ASCII control characters while preserving normal text.
const sanitized = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value.replace(CONTROL_CHARS, ""));

const requiredText = (max: number) =>
  sanitized(max).pipe(z.string().min(1, "Required."));

const optionalText = (max: number) => sanitized(max).optional();

const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must be at least 2 characters.")
  .max(160)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must use lowercase letters, numbers, and hyphens.",
  );

const idSchema = z.string().trim().min(1, "Required.").max(64);

const mediaUrlSchema = z.string().trim().min(1).max(600);

const contentStatusSchema = z.enum(contentStatusValues);

// ---------------------------------------------------------------------------
// Inspirations
// ---------------------------------------------------------------------------

export const createInspirationSchema = z.object({
  title: requiredText(200),
  slug: slugSchema,
  shortDescription: optionalText(500),
  longDescription: optionalText(8000),
  primaryImage: mediaUrlSchema.optional(),
  galleryImages: z.array(mediaUrlSchema).max(40).optional(),
  videoUrl: mediaUrlSchema.optional(),
  spaceId: idSchema,
  isFeatured: z.boolean().optional(),
  status: contentStatusSchema.optional(),
  collectionIds: z.array(idSchema).max(50).optional(),
  brandIds: z.array(idSchema).max(50).optional(),
  productIds: z.array(idSchema).max(100).optional(),
});

export const updateInspirationSchema = createInspirationSchema.partial();

export type CreateInspirationInput = z.infer<typeof createInspirationSchema>;
export type UpdateInspirationInput = z.infer<typeof updateInspirationSchema>;

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const createProductSchema = z.object({
  name: requiredText(200),
  slug: slugSchema,
  sku: optionalText(80),
  brandId: idSchema,
  productTypeId: idSchema,
  subcategoryId: idSchema.optional(),
  shortDescription: optionalText(500),
  longDescription: optionalText(8000),
  priceRange: optionalText(120),
  primaryImage: mediaUrlSchema.optional(),
  galleryImages: z.array(mediaUrlSchema).max(40).optional(),
  availabilityStatus: z.enum(availabilityStatusValues).optional(),
  technicalSpecs: z.record(z.string().max(120), z.string().max(600)).optional(),
  isFeatured: z.boolean().optional(),
  status: contentStatusSchema.optional(),
  categoryIds: z.array(idSchema).min(1, "At least one category is required.").max(50),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export const createBrandSchema = z.object({
  name: requiredText(160),
  slug: slugSchema,
  brandType: z.enum(brandTypeValues),
  parentBrandId: idSchema.optional(),
  description: optionalText(2000),
  story: optionalText(8000),
  logo: mediaUrlSchema.optional(),
  heroImage: mediaUrlSchema.optional(),
  isFeatured: z.boolean().optional(),
  status: contentStatusSchema.optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

// ---------------------------------------------------------------------------
// Spaces
// ---------------------------------------------------------------------------

export const spaceSchema = z.object({
  title: requiredText(160),
  description: optionalText(2000),
  heroImage: mediaUrlSchema.optional(),
});

// Spaces are a fixed taxonomy; only their hero image and copy are editable.
// Slug is intentionally omitted — page code looks spaces up by slug.
export const updateSpaceSchema = spaceSchema.partial();

export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const createCollectionSchema = z.object({
  title: requiredText(200),
  slug: slugSchema,
  shortDescription: optionalText(500),
  longDescription: optionalText(8000),
  coverImage: mediaUrlSchema.optional(),
  spaceId: idSchema.optional(),
  status: contentStatusSchema.optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial();

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;

// ---------------------------------------------------------------------------
// Showroom sections
// ---------------------------------------------------------------------------

export const createShowroomSectionSchema = z.object({
  name: requiredText(200),
  description: optionalText(2000),
  floorNumber: z.number().int().min(-2).max(50).optional(),
  images: z.array(mediaUrlSchema).max(40).optional(),
  videoUrl: mediaUrlSchema.optional(),
  brandIds: z.array(idSchema).max(50).optional(),
  inspirationIds: z.array(idSchema).max(100).optional(),
});

export const updateShowroomSectionSchema = createShowroomSectionSchema.partial();

export type CreateShowroomSectionInput = z.infer<typeof createShowroomSectionSchema>;
export type UpdateShowroomSectionInput = z.infer<typeof updateShowroomSectionSchema>;
