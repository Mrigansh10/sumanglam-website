# Product Discovery Journey

> **⛔ Currently dormant** — the product catalog is unpublished. See [[Decision - Product Catalog Unpublished]].

## Trigger

User opens a product listing or product-related category from Hardware & Appliances, brand pages, or inspiration detail.

## User Steps

1. User lands on product listing.
2. User browses products.
3. User applies basic filters.
4. System loads matching products.
5. User opens [[Product Detail]].
6. User reviews product information, images, specifications, related inspirations, and related products.
7. User clicks WhatsApp Inquiry or Book Consultation.

## System Steps

1. Load products with pagination/search/filtering.
2. Apply query parameters for page, limit, brand, type, category, subcategory.
3. Load product detail by slug.
4. Load brand, related inspirations, and related products.
5. Track Product Viewed and Product CTA Clicked.
6. Track WhatsApp click or consultation submission.

## Success Condition

User begins a product-specific conversation or consultation.

## Failure/Edge Cases

* Product not found.
* Empty filter result.
* Missing product images.
* Missing specifications.
* Product discontinued.

## Pages Involved

[[Hardware And Appliances]], [[Product Detail]], [[Brands]], [[Inspiration]], [[Book Consultation]], [[WhatsApp Inquiry]]

## Data Involved

[[Product]], [[Product Type]], [[Product Category]], [[Product Subcategory]], [[Brand]], [[Inspiration]]

## API/backend Involved

[[API - Products]], [[API - Brands]], [[API - Inspirations]], [[API - WhatsApp Tracking]], [[API - Consultations]]

## Validation Rules

Filters should map to existing slugs. Availability status must be one of `available`, `limited`, `discontinued`, or `coming_soon`.

## Forbidden Mistakes

* Do not build checkout.
* Do not use advanced filtering beyond V1 unless approved.
* Do not return inconsistent API response shapes.

## Source Trace

Source files and sections: `07-screen-event-flows.md` Flow 3, `08-database-design.md`, `09-api-specification.md`.
