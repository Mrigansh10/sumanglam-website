-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "BrandType" AS ENUM ('solution', 'product');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('available', 'limited', 'discontinued', 'coming_soon');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'qualified', 'converted', 'closed');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('new', 'scheduled', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('kitchen', 'wardrobe', 'complete_home', 'hardware_appliances', 'other');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('phone', 'whatsapp', 'email');

-- CreateTable
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "hero_image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_description" TEXT,
    "long_description" TEXT,
    "cover_image" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "space_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspirations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "short_description" TEXT,
    "long_description" TEXT,
    "primary_image" TEXT,
    "gallery_images" TEXT[],
    "video_url" TEXT,
    "space_id" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspirations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand_type" "BrandType" NOT NULL,
    "parent_brand_id" TEXT,
    "description" TEXT,
    "story" TEXT,
    "logo" TEXT,
    "hero_image" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "product_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "product_type_id" TEXT NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_subcategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "product_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT,
    "brand_id" TEXT NOT NULL,
    "product_type_id" TEXT NOT NULL,
    "subcategory_id" TEXT,
    "short_description" TEXT,
    "long_description" TEXT,
    "price_range" TEXT,
    "primary_image" TEXT,
    "gallery_images" TEXT[],
    "availability_status" "AvailabilityStatus" NOT NULL DEFAULT 'available',
    "technical_specs_json" JSONB,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "showroom_sections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "floor_number" INTEGER,
    "images" TEXT[],
    "video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "showroom_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "lead_status" "LeadStatus" NOT NULL DEFAULT 'new',
    "lead_source" TEXT,
    "source_page" TEXT,
    "referring_url" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultations" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "project_type" "ProjectType" NOT NULL,
    "requirements" TEXT NOT NULL,
    "preferred_contact_method" "ContactMethod",
    "status" "ConsultationStatus" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_inspirations" (
    "collection_id" TEXT NOT NULL,
    "inspiration_id" TEXT NOT NULL,

    CONSTRAINT "collection_inspirations_pkey" PRIMARY KEY ("collection_id","inspiration_id")
);

-- CreateTable
CREATE TABLE "inspiration_products" (
    "inspiration_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "inspiration_products_pkey" PRIMARY KEY ("inspiration_id","product_id")
);

-- CreateTable
CREATE TABLE "inspiration_brands" (
    "inspiration_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "inspiration_brands_pkey" PRIMARY KEY ("inspiration_id","brand_id")
);

-- CreateTable
CREATE TABLE "product_category_mappings" (
    "product_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "product_category_mappings_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "showroom_brand_mappings" (
    "showroom_section_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "showroom_brand_mappings_pkey" PRIMARY KEY ("showroom_section_id","brand_id")
);

-- CreateTable
CREATE TABLE "showroom_inspiration_mappings" (
    "showroom_section_id" TEXT NOT NULL,
    "inspiration_id" TEXT NOT NULL,

    CONSTRAINT "showroom_inspiration_mappings_pkey" PRIMARY KEY ("showroom_section_id","inspiration_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spaces_slug_key" ON "spaces"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");

-- CreateIndex
CREATE INDEX "collections_space_id_idx" ON "collections"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "inspirations_slug_key" ON "inspirations"("slug");

-- CreateIndex
CREATE INDEX "inspirations_is_featured_idx" ON "inspirations"("is_featured");

-- CreateIndex
CREATE INDEX "inspirations_space_id_idx" ON "inspirations"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");

-- CreateIndex
CREATE INDEX "brands_is_featured_idx" ON "brands"("is_featured");

-- CreateIndex
CREATE UNIQUE INDEX "product_types_slug_key" ON "product_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_product_type_id_slug_key" ON "product_categories"("product_type_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_subcategories_category_id_slug_key" ON "product_subcategories"("category_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_brand_id_idx" ON "products"("brand_id");

-- CreateIndex
CREATE INDEX "products_product_type_id_idx" ON "products"("product_type_id");

-- CreateIndex
CREATE INDEX "products_is_featured_idx" ON "products"("is_featured");

-- CreateIndex
CREATE INDEX "leads_phone_idx" ON "leads"("phone");

-- CreateIndex
CREATE INDEX "consultations_lead_id_idx" ON "consultations"("lead_id");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspirations" ADD CONSTRAINT "inspirations_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_parent_brand_id_fkey" FOREIGN KEY ("parent_brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_subcategories" ADD CONSTRAINT "product_subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_type_id_fkey" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "product_subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_inspirations" ADD CONSTRAINT "collection_inspirations_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_inspirations" ADD CONSTRAINT "collection_inspirations_inspiration_id_fkey" FOREIGN KEY ("inspiration_id") REFERENCES "inspirations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspiration_products" ADD CONSTRAINT "inspiration_products_inspiration_id_fkey" FOREIGN KEY ("inspiration_id") REFERENCES "inspirations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspiration_products" ADD CONSTRAINT "inspiration_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspiration_brands" ADD CONSTRAINT "inspiration_brands_inspiration_id_fkey" FOREIGN KEY ("inspiration_id") REFERENCES "inspirations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspiration_brands" ADD CONSTRAINT "inspiration_brands_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category_mappings" ADD CONSTRAINT "product_category_mappings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category_mappings" ADD CONSTRAINT "product_category_mappings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showroom_brand_mappings" ADD CONSTRAINT "showroom_brand_mappings_showroom_section_id_fkey" FOREIGN KEY ("showroom_section_id") REFERENCES "showroom_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showroom_brand_mappings" ADD CONSTRAINT "showroom_brand_mappings_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showroom_inspiration_mappings" ADD CONSTRAINT "showroom_inspiration_mappings_showroom_section_id_fkey" FOREIGN KEY ("showroom_section_id") REFERENCES "showroom_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showroom_inspiration_mappings" ADD CONSTRAINT "showroom_inspiration_mappings_inspiration_id_fkey" FOREIGN KEY ("inspiration_id") REFERENCES "inspirations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

