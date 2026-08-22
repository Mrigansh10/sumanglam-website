# Showroom Experience

> **⛔ Currently offline.** `/showroom` 307-redirects to `/contact` pending real photography. The restore checklist is in `app/(site)/showroom/page.tsx`. See [[Decision - Showroom Temporarily Offline]].

## Purpose

Encourage physical showroom visits by presenting the showroom as an experience, not a retail store.

## User Goal

Understand what visiting the showroom feels like and choose to plan a visit, call, WhatsApp, or book a consultation.

## Entry Points

* Main navigation.
* Homepage Showroom Experience section.
* Product, brand, and inspiration CTAs.

## Exit Points

* Plan Visit contact options.
* [[Book Consultation]]
* [[WhatsApp Inquiry]]
* [[Contact]]

## UI Requirements

* Reception section.
* Hardware Floor section.
* Mrida Floor section.
* Nolte Floor section.
* Consultation process overview.
* Map or contact routing.
* CTA: Visit Showroom / Plan Your Visit.

## UX Behavior

* Make showroom visit feel premium and useful.
* Contact options should be visible and direct.
* Lead capture should preserve source context.

## Content Requirements

* Showroom section images.
* Floor descriptions.
* Related brands.
* Related inspirations.
* Consultation process copy.

## Data Requirements

* [[Database - showroom_sections]]
* [[Database - showroom_brand_mappings]]
* [[Database - showroom_inspiration_mappings]]
* [[Database - leads]] if lead captured.

## API/backend Requirements

* [[API - Showroom]]
* [[API - Consultations]]
* [[API - WhatsApp Tracking]]
* [[API - Analytics Events]]

## Auth/permission Rules

Public page.

## Edge Cases

* Missing showroom images.
* Missing map data.
* No showroom section detail.
* User wants directions or hours.

## Forbidden Mistakes

* Do not make the showroom look like a store aisle.
* Do not hide visit/contact actions on mobile.
* Do not use low-quality imagery.

## Linked Notes

* [[Showroom Visit Intent]]
* [[Showroom Section]]
* [[API - Showroom]]
* [[Contact]]

## Source Trace

Source files and sections: `01-prd.md`, `02-information_architecture.md`, `03-ui-ux-specification.md`, `05-domain-model.md`, `06-content-model.md`, `07-screen-event-flows.md`, `08-database-design.md`, `09-api-specification.md`.
