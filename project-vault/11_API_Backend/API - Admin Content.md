# API - Admin Content

## Purpose

Create, update, and archive content from the admin dashboard.

## Inputs

Authentication required.

Endpoints:

Inspirations:

* `POST /api/v1/admin/inspirations`
* `PUT /api/v1/admin/inspirations/:id`
* `DELETE /api/v1/admin/inspirations/:id`

Products:

* `POST /api/v1/admin/products`
* `PUT /api/v1/admin/products/:id`
* `DELETE /api/v1/admin/products/:id`

Brands:

* `POST /api/v1/admin/brands`
* `PUT /api/v1/admin/brands/:id`

Collections:

* `POST /api/v1/admin/collections`
* `PUT /api/v1/admin/collections/:id`

Showroom:

* `POST /api/v1/admin/showroom`
* `PUT /api/v1/admin/showroom/:id`

Site settings (singleton homepage image slots, see [[Database - site_settings]]):

* `GET /api/v1/admin/settings/homepage` — current homepage image slots, with
  built-in defaults applied for any unset key.
* `PUT /api/v1/admin/settings/homepage` — update one or more of `hero`,
  `kitchens`, `wardrobes`, `hardware`. Only provided keys are written (upsert).

## Outputs

Use standard success/error response format.

## Data Touched

Content tables and junction tables.

## Used By

[[Admin Dashboard]], [[Create Inspiration Admin]], [[Create Product Admin]]

## Error States

* Unauthorized.
* Validation error.
* Not found.
* Relationship constraint error.
* Archive failure.

## Security/Auth Rules

Admin authentication required for all endpoints.

## Open Questions

* Exact admin role model beyond Admin is future-only.
* DELETE archives (sets `status` to `ARCHIVED`) rather than hard-deleting. See [[Implementation Decisions]].

## Source Trace

Source files: `07-screen-event-flows.md`, `09-api-specification.md`, `10-techincal-architecture.md`.
