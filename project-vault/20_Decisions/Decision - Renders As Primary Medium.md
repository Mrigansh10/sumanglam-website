---
layer: decision
date: 2026-07-03
status: standing
---

# Decision - Renders As Primary Medium

## Decision

**3D renders are the primary medium** for the aspirational layer of the site. Real photography
is reserved for a future "real projects / proof" section. Reviews stay photo-less.

## Why

The showroom photography available at the time was not at the standard the site's positioning
demands, and there is a usable library of ~50 clean 3D renders. Renders also let the site show
finished spaces rather than shelves of product boxes — which is the product principle
"ideas before inventory."

## Where Renders Are Used

Homepage hero, page and category heroes, inspiration galleries, brand cards, mega-menu kitchen
cards.

## The Technical Bargain

The renders are low-res (~1080px, ~150 KB, soft, JPEG-artifacted) and there are **no source 3D
files to re-export**. Rather than retouch ~50 images by hand, they are repaired **at delivery
time** by Cloudinary `enhance: "render"` (`e_gen_restore` + `e_upscale`), which restores and
4× super-resolves before the delivery `w_` downsamples.

This buys automation at the cost of three permanent rules, all in [[Image Delivery Pipeline]]:

1. `e_gen_restore` is **generative** — it garbles text and logos and reinvents small props.
   Never point it at logos, product shots, real proof photography or admin previews.
2. Real photos must be uploaded **≥2000px** or the guard fires and repaints them.
3. Sources **>4.2 MP hard-fail** `e_upscale`.

## Adjacent Accepted Sources

AI-enhanced phone photos (the Gemini v2 retouch pipeline) remain an accepted source for the
future proof section — **except** for Google Business Profile uploads, which should be
untouched originals.

## Linked Notes

* [[Image Strategy]]
* [[Image Delivery Pipeline]]
* [[Content And Asset State]]
* [[Decision - Inspirations Are Visual Only]]

## Source Trace

`HANDOFF.md` Sessions 5–9 and 13; `lib/images.ts`.
