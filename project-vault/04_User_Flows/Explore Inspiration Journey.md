# Explore Inspiration Journey

> **⚠️ Changed** — the journey now ends at the mosaic; there are no inspiration detail pages. See [[Decision - Inspirations Are Visual Only]].

## Trigger

User clicks Explore Inspirations from the homepage or opens Inspiration navigation.

## User Steps

1. User lands on [[Homepage]].
2. User clicks Explore Inspirations.
3. User browses inspiration listing.
4. User browses collections.
5. User selects an inspiration.
6. User explores images, related brands, related products, and related inspirations.
7. User clicks Book Consultation, Visit Showroom, or WhatsApp Inquiry.

## System Steps

1. Load inspiration listing.
2. Load collections.
3. Load inspiration detail.
4. Load images, related brands, related products, related inspirations.
5. Track viewed events and CTA clicks.
6. Capture source context for lead-generating actions.

## Success Condition

User moves from inspiration to engagement: consultation, showroom intent, or WhatsApp inquiry.

## Failure/Edge Cases

* Empty collection.
* Missing image/gallery.
* Missing related products.
* Failed content fetch.

## Pages Involved

[[Homepage]], [[Inspiration]], [[Brands]], [[Product Detail]], [[Book Consultation]], [[Showroom Experience]]

## Data Involved

[[Inspiration]], [[Inspiration Collection]], [[Brand]], [[Product]], [[Lead]], [[Consultation Request]]

## API/backend Involved

[[API - Homepage]], [[API - Inspirations]], [[API - Collections]], [[API - Brands]], [[API - Products]], [[API - Consultations]], [[API - Analytics Events]]

## Validation Rules

Slugs must resolve to published content. Lead actions must capture source page, source type, referring URL, and timestamp.

## Forbidden Mistakes

* Do not make products the first step of this journey.
* Do not clutter inspiration cards with excessive metadata.
* Do not lose source tracking.

## Source Trace

Source files and sections: `07-screen-event-flows.md` Flow 1, `01-prd.md`, `06-content-model.md`.
