# Inspiration

> **⚠️ Superseded in structure.** Inspirations are now a **visual-only masonry mosaic with no detail pages** — `/inspiration/[slug]` 308s to the listing. See [[Decision - Inspirations Are Visual Only]].

## Purpose

Show aspirational spaces and help users browse visual ideas before evaluating brands or products.

## User Goal

Find inspiring kitchen, wardrobe, hardware, appliance, showroom, or project ideas and continue into related solutions.

## Entry Points

* Homepage Explore Inspirations CTA.
* Main navigation.
* Related collection links.
* Brand pages.
* Product pages.

## Exit Points

* Inspiration detail.
* [[Kitchens]]
* [[Brands]]
* [[Product Detail]]
* [[Book Consultation]]
* [[WhatsApp Inquiry]]

## UI Requirements

* Visual-first inspiration listing.
* Collection browsing.
* Large editorial imagery.
* Filters by space and collection if supported.
* Inspiration detail pages with images, related brands, related products, and related inspirations.
* CTAs: Explore Related Solutions, Book Consultation, Visit Showroom, WhatsApp Inquiry.

## UX Behavior

* Browsing should feel calm and curated.
* Users should be encouraged to explore complete spaces before products.
* Empty states should preserve premium tone and guide users to other collections.

## Content Requirements

* Kitchen inspirations.
* Wardrobe inspirations.
* Hardware details.
* Real projects if available.
* Showroom highlights.
* Collections such as German Kitchens, Modern Kitchens, Luxury Wardrobes, Storage Solutions.

## Data Requirements

* [[Content Type - Inspiration]]
* [[Content Type - Collection]]
* [[Database - inspirations]]
* [[Database - collections]]
* [[Database - junction tables]]

## API/backend Requirements

* [[API - Inspirations]]: `GET /api/v1/inspirations`, `GET /api/v1/inspirations/:slug`.
* [[API - Collections]].
* [[API - Analytics Events]] for Inspiration Viewed and Collection Viewed.

## Auth/permission Rules

Public page. Admin editing is separate.

## Edge Cases

* No inspirations in a collection.
* Missing related products.
* Missing related brands.
* Slow image loading.
* Invalid inspiration slug.

## Forbidden Mistakes

* Do not make inspiration secondary to product grids.
* Do not use stock-photo aesthetics.
* Do not clutter listing cards.
* Do not create collections without long-term relevance.

## Linked Notes

* [[Explore Inspiration Journey]]
* [[Inspiration Collection]]
* [[Content Type - Inspiration]]
* [[Inspiration Collections]]
* [[API - Inspirations]]

## Source Trace

Source files and sections: `01-prd.md` Inspiration & Space Discovery System, `02-information_architecture.md` Inspiration page, `06-content-model.md`, `07-screen-event-flows.md`, `15-content-taxonomy.md`.
