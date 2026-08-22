# Hardware And Appliances

> **⚠️ Scope changed.** `/hardware-appliances` is now **Hardware-only** — appliances moved to `/kitchens` and the nav label is "Hardware". This is deliberate, not a bug. See [[Decision - Kitchen First Navigation]].

## Purpose

Provide structured product discovery for hardware and appliances while preserving inspiration-first and showroom-led positioning.

## User Goal

Browse categories, understand available brands/products, compare basic specifications, and begin a WhatsApp or consultation conversation.

## Entry Points

* Main navigation.
* Homepage Explore Hardware & Appliances card.
* Brand pages.
* Inspiration details.

## Exit Points

* Category listings.
* [[Product Detail]]
* [[Brands]]
* [[WhatsApp Inquiry]]
* [[Book Consultation]]

## UI Requirements

* Hardware category entry points.
* Appliance category entry points.
* Featured products.
* Product listing.
* Basic filters by brand, type, category, subcategory.
* Product detail navigation.
* WhatsApp Inquiry CTA.

## UX Behavior

* Category -> Brand -> Product discovery.
* Product research should begin conversations, not checkout.
* Advanced filters should not be built in V1 unless explicitly approved.

## Content Requirements

* Hardware categories from [[Hardware Categories]].
* Appliance categories from [[Appliance Categories]].
* Brands and product descriptions.
* Technical specifications for products.

## Data Requirements

* [[Database - product_types]]
* [[Database - product_categories]]
* [[Database - product_subcategories]]
* [[Database - products]]
* [[Database - brands]]

## API/backend Requirements

* [[API - Products]]
* [[API - Brands]]
* [[API - WhatsApp Tracking]]
* [[API - Analytics Events]]

## Auth/permission Rules

Public page.

## Edge Cases

* No products for a selected category.
* Missing product images.
* Missing technical specs.
* Invalid filter combinations.

## Forbidden Mistakes

* Do not make this ecommerce.
* Do not implement checkout.
* Do not create advanced filters beyond V1 without approval.
* Do not hardcode content when database content exists.

## Linked Notes

* [[Product Discovery Journey]]
* [[Product Detail]]
* [[Hardware Categories]]
* [[Appliance Categories]]
* [[API - Products]]

## Source Trace

Source files and sections: `01-prd.md`, `02-information_architecture.md`, `05-domain-model.md`, `06-content-model.md`, `07-screen-event-flows.md`, `09-api-specification.md`, `15-content-taxonomy.md`.
