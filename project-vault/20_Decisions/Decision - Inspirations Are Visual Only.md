---
layer: decision
date: 2026-07-05
status: standing
---

# Decision - Inspirations Are Visual Only

## Decision

Inspirations are a **purely visual surface**. `/inspiration` is a masonry mosaic of captioned
covers and gallery angles. **There are no inspiration detail pages.**

## Why

`nolte-kuechen.com/en-GB/private-customers` is the agreed aesthetic bar: mixed-ratio imagery,
roughly 70/30 image-to-text, no uniform grids. A detail page per inspiration pulled the
experience back toward a catalog and away from an editorial gallery. Shipped in `0f95f57`
after the gallery-pacing pass in `c8ad41b`.

## Consequences

* `/inspiration/[slug]` **308s permanently to `/inspiration`** via `next.config.ts`. The route
  file remains; its page body is in git history.
* Inspiration detail URLs were removed from `app/sitemap.ts` so crawlers consolidate onto the
  listing.
* `VisualCard`'s `href` prop became **optional** — cards without a destination are normal here.
* An inspiration's multi-angle renders are its **gallery**, not separate entries. One render
  set = one inspiration.

## Standing Rules That Follow

* **Never repeat an image twice on one page.**
* Flat, straight-on elevations betray the render origin — keep them out of published galleries.
* Nothing unclickable may look like a button (this drove the hardware page's category tiles
  becoming a gold-dash capability list rather than tile-buttons).

## Linked Notes

* [[Inspiration]]
* [[Explore Inspiration Journey]]
* [[Route Map]]
* [[Content And Asset State]]
* [[Decision - Renders As Primary Medium]]

## Source Trace

`HANDOFF.md` Session 9; `next.config.ts` redirects; `components/shared/visual-card.tsx`.
