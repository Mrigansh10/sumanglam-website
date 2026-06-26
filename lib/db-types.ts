// Types matching the Supabase schema (camelCase, mirrors Prisma model names)

export type Brand = {
  id: string;
  name: string;
  slug: string;
  brandType: string;
  parentBrandId: string | null;
  description: string | null;
  story: string | null;
  logo: string | null;
  heroImage: string | null;
  isFeatured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  parentBrand?: Brand | null;
  childBrands?: Brand[];
};

export type Space = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  longDescription: string | null;
  coverImage: string | null;
  status: string;
  spaceId: string | null;
  createdAt: string;
  updatedAt: string;
  space?: Space | null;
};

export type Inspiration = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  longDescription: string | null;
  primaryImage: string | null;
  galleryImages: string[];
  videoUrl: string | null;
  spaceId: string;
  isFeatured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  space?: Space | null;
};

export type ProductType = {
  id: string;
  name: string;
  slug: string;
};

export type ProductSubcategory = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  brandId: string;
  productTypeId: string;
  subcategoryId: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  priceRange: string | null;
  primaryImage: string | null;
  galleryImages: string[];
  availabilityStatus: string;
  isFeatured: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  brand?: Brand | null;
  productType?: ProductType | null;
  subcategory?: ProductSubcategory | null;
};

export type ShowroomSection = {
  id: string;
  name: string;
  description: string | null;
  floorNumber: number | null;
  images: string[];
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  brands?: Array<{ brand: Brand }>;
  inspirations?: Array<{ inspiration: Inspiration }>;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  leadStatus: "new" | "contacted" | "qualified" | "converted" | "closed";
  leadSource: string | null;
  sourcePage: string | null;
  referringUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  consultations?: Consultation[];
};

export type Consultation = {
  id: string;
  leadId: string;
  projectType: string;
  requirements: string;
  preferredContactMethod: string | null;
  status: "new" | "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  lead?: Lead | null;
};

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
};
