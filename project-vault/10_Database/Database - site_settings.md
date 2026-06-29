# Database - site_settings

## Purpose

Stores editable, singleton site configuration that has no richer content model of
its own — currently the homepage image slots that were previously hardcoded in
page code (the hero banner and the three "Explore Your Journey" category cards).
This lets admins manage those images from the dashboard instead of in source,
satisfying the "no hardcoded content where a model can exist" rule.

## Shape

A narrow key/value table. One row per setting; values are strings interpreted by
`lib/images.ts` exactly like every other image field (absolute URL or local path
used as-is, otherwise a Cloudinary public ID).

## Fields / Properties

* `key` — primary key, stable string identifier.
* `value` — nullable string. Empty/null means "fall back to the built-in default".
* `updated_at`

## Known Keys

* `home_hero` — homepage hero banner image.
* `home_kitchens` — "Kitchens & Appliances" journey card image.
* `home_wardrobes` — "Wardrobes" journey card image.
* `home_hardware` — "Hardware" journey card image.

## Relationships

None. This table is intentionally standalone and additive — it relates to no
other domain table.

## Used By

* [[API - Admin Content]] (Site Settings section)
* [[Homepage UX Specification]]
* Homepage read path (`server/site-settings.ts`)

## Validation Rules

* `key` is unique (primary key) and writes are restricted to the known keys above.
* `value` max length matches the shared media URL bound (600 chars).
* Unknown keys are rejected by the admin endpoint.

## Content Rules

* Values are resolved through `lib/images.ts`; uploaded 3D renders (Cloudinary
  public IDs) additionally receive the `enhance: "render"` restore/upscale pass
  at the homepage call sites.
* Missing keys fall back to the defaults declared in `server/site-settings.ts`.

## Open Questions

None for V1. Additional singleton settings can reuse this table with new keys.

## Source Trace

Source: implementation decision on 2026-06-29 to make hardcoded homepage image
slots admin-managed. See [[Implementation Decisions]].
