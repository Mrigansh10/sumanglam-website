# Showroom Visit Intent

> **⚠️ Partly rerouted** — showroom CTAs currently point at `/contact`. See [[Decision - Showroom Temporarily Offline]].

## Trigger

User opens [[Showroom Experience]] or clicks Visit Showroom / Plan Visit from another page.

## User Steps

1. User opens Showroom Experience.
2. User explores Reception, Hardware Floor, Mrida Kitchen Floor, and Nolte Floor.
3. User clicks Plan Visit.
4. Contact options display: Call, WhatsApp, Consultation Booking.
5. Lead is captured if form/booking is used.

## System Steps

1. Load showroom sections.
2. Load related brands and inspirations if viewing detail.
3. Track Showroom Viewed and Showroom Visit Intent.
4. Capture source context for lead action.

## Success Condition

User chooses a visit/contact path.

## Failure/Edge Cases

* Missing map or business hours.
* Missing showroom section imagery.
* Contact action unavailable.

## Pages Involved

[[Showroom Experience]], [[Contact]], [[Book Consultation]], [[WhatsApp Inquiry]]

## Data Involved

[[Showroom Section]], [[Brand]], [[Inspiration]], [[Lead]], [[Consultation Request]]

## API/backend Involved

[[API - Showroom]], [[API - Consultations]], [[API - WhatsApp Tracking]], [[API - Analytics Events]]

## Validation Rules

Lead-generating actions must capture source context.

## Forbidden Mistakes

* Do not hide visit/contact actions on mobile.
* Do not present showroom as a generic retail store.

## Source Trace

Source files and sections: `07-screen-event-flows.md` Flow 6, `03-ui-ux-specification.md`, `06-content-model.md`.
