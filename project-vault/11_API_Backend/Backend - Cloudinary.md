# Backend - Cloudinary

> **ℹ️ Implemented.** See [[Image Delivery Pipeline]] for `resolveImage()` and the size rules.

## Purpose

Cloudinary is the documented asset management provider for high-resolution inspiration galleries, product images, brand assets, and showroom images.

## Inputs

* Uploaded images.
* Cloudinary public IDs or URLs.
* Transformation parameters.

## Outputs

* Optimized responsive images.
* CDN-hosted media.

## Data Touched

Image fields in:

* [[Database - inspirations]]
* [[Database - products]]
* [[Database - brands]]
* [[Database - showroom_sections]]

## Used By

[[Homepage]], [[Inspiration]], [[Product Detail]], [[Brands]], [[Showroom Experience]], [[Admin Dashboard]]

## Error States

* Upload failure.
* Missing asset.
* Transformation failure.
* Full-resolution delivery by mistake.

## Security/Auth Rules

Uploads should be admin-only. Environment variables must be protected.

## Open Questions

* Whether to store public IDs, URLs, or structured media objects is unresolved.

## Source Trace

Source files: `01-prd.md`, `03-ui-ux-specification.md`, `10-techincal-architecture.md`, `12-dontdo.md`.
