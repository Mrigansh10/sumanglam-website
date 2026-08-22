# Product Detail

> **⛔ Currently unpublished.** All 38 products are `draft` and every entry point was removed. The route still exists but renders empty. See [[Decision - Product Catalog Unpublished]].

## Purpose

Provide enough product information for research and high-intent inquiry without turning the site into ecommerce.

## User Goal

Understand a product's brand, category, images, specifications, availability, related inspirations, and inquiry options.

## Entry Points

* [[Hardware And Appliances]]
* [[Brands]]
* Inspiration details.
* Related products.

## Exit Points

* [[WhatsApp Inquiry]]
* [[Book Consultation]]
* Related inspirations.
* Related products.
* Brand page.

## UI Requirements

* Product gallery.
* Product name and brand.
* Category/subcategory.
* Short and long description.
* Price range or exact pricing if confirmed.
* Technical specifications.
* Downloads if available.
* Related inspirations.
* Related products.
* CTAs: WhatsApp Inquiry and Book Consultation.

## UX Behavior

* Research-oriented, not checkout-oriented.
* WhatsApp message should include product context.
* Related inspiration should reconnect products to spaces.

## Content Requirements

* SKU.
* Brand.
* Type/category/subcategory.
* Product copy.
* Product images.
* Technical specs.
* Availability status.
* SEO metadata.

## Data Requirements

* [[Database - products]]
* [[Database - brands]]
* [[Database - product_categories]]
* [[Database - product_subcategories]]
* [[Database - junction tables]]

## API/backend Requirements

* [[API - Products]]: `GET /api/v1/products/:slug`.
* [[API - WhatsApp Tracking]].
* [[API - Analytics Events]] for Product Viewed and Product CTA Clicked.

## Auth/permission Rules

Public page.

## Edge Cases

* Product not found.
* Product discontinued.
* Missing gallery.
* Missing technical specs.
* No related products.
* No related inspirations.

## Forbidden Mistakes

* Do not build checkout.
* Do not overpromise exact pricing if only price range is available.
* Do not serve full-resolution images.
* Do not use inconsistent API response handling.

## Linked Notes

* [[Product]]
* [[Product Discovery Journey]]
* [[API - Products]]
* [[16_Conflicts]]

## Source Trace

Source files and sections: `01-prd.md`, `05-domain-model.md`, `06-content-model.md`, `07-screen-event-flows.md`, `08-database-design.md`, `09-api-specification.md`.
