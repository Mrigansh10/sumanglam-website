# Homepage

> **⚠️ Partly superseded.** The hero and journey-card images are now **database-driven** via `site_settings` ([[Admin Surface]]), the Showroom Experience section was removed ([[Decision - Showroom Temporarily Offline]]), and the reviews surface currently renders nothing ([[Database - reviews]]). See [[Route Map]].

## Purpose

Create a strong first impression, introduce Sumanglam, build trust, inspire exploration, and move visitors toward inspirations, showroom visits, consultation, or WhatsApp inquiry.

## User Goal

Understand what Sumanglam offers and decide where to explore next.

## Entry Points

* Direct traffic to `/`.
* Search results.
* Brand/social referrals.
* Shared links.

## Exit Points

* [[Inspiration]]
* [[Kitchens]]
* [[Brands]]
* [[Showroom Experience]]
* [[Book Consultation]]
* [[WhatsApp Inquiry]]

## UI Requirements

* Full-viewport hero with one premium image or slow-moving cinematic visual.
* Minimal headline and supporting statement.
* Primary CTA: Explore Inspirations.
* Secondary CTA: Visit Showroom.
* Explore Your Journey section with two large visual cards: Explore Spaces and Explore Hardware & Appliances.
* Featured Inspirations section with large imagery and editorial presentation.
* Featured Brands section with meaningful brand descriptions, not logo wall only.
* Why Sumanglam section with customization, expert guidance, premium brands, showroom experience, design support, trusted local presence.
* Showroom Experience section covering Reception, Hardware Floor, Mrida Floor, Nolte Floor, and consultation process.
* Consultation CTA section.
* Footer with contact details, location, business hours, WhatsApp, navigation, brand links, social links.

## UX Behavior

* Image-first, copy-second.
* Subtle fade, reveal, gentle parallax, or scroll interactions.
* No aggressive motion.
* Desktop may use hover effects on visual cards.
* Mobile uses simple tap behavior and thumb-friendly CTAs.
* Persistent WhatsApp access on mobile.

## Content Requirements

* Professional kitchen visuals, official brand assets, high-quality renders, or edited showroom photography.
* Featured inspirations.
* Featured brands: Nolte, Mrida, Bosch, Siemens, Liebherr, Hafele, Blaupunkt, Hettich, Yale, Godrej, Dorset, Blum, Spitze, Brass Barony, Everyday.
* Short, human, premium copy.
* Final hero copy is open.

## Data Requirements

* [[Database - inspirations]] for featured inspirations.
* [[Database - brands]] for featured brands.
* [[Database - products]] for featured products if used.
* [[Database - showroom_sections]] for showroom highlights.

## API/backend Requirements

* [[API - Homepage]]: `GET /api/v1/homepage`.
* [[API - Analytics Events]] for Homepage Viewed and CTA clicks.
* [[API - WhatsApp Tracking]] for WhatsApp actions.

## Auth/permission Rules

Public page. No user account required.

## Edge Cases

* Missing featured inspirations.
* Missing brand assets.
* Cloudinary image failure.
* Slow network on mobile.
* Reduced-motion preference.

## Forbidden Mistakes

* Do not make homepage feel like ecommerce.
* Do not use low-quality phone photography in the hero.
* Do not overcrowd sections.
* Do not use generic icon grids for Why Sumanglam.
* Do not hide critical CTAs on mobile.
* Do not use disruptive auto-playing media.

## Linked Notes

* [[Homepage UX Specification]]
* [[Visual Style]]
* [[Interaction Patterns]]
* [[Explore Inspiration Journey]]
* [[Brand Discovery Journey]]
* [[Showroom Visit Intent]]
* [[CTA Hierarchy]]

## Source Trace

Source files and sections: `02-information_architecture.md` Page Definitions, `03-ui-ux-specification.md`, `04-design-language.md`, `07-screen-event-flows.md`, `09-api-specification.md`.
