---
layer: decision
date: 2026-07-04
status: standing
---

# Decision - Product Catalog Unpublished

## Decision

**All 38 products are set to `status = draft`** and every public entry point into the catalog
was removed. The site currently sells ideas, not SKUs.

## Why

Follows directly from [[Decision - Release Focus Over Catalog Depth]]: a thin, partially-imaged
catalog undermines a premium positioning more than no catalog does. Also keeps the site aligned
with the product principle that **inspiration comes before products**.

## What Was Removed (`e7ba294`)

* Hardware page CTA → repointed to the showroom (now `/contact`).
* Category tiles unlinked, replaced with a gold-dash capability list.
* The **Catalog section on brand pages renders conditionally** — it disappears when a brand has
  no published products.
* `/products` removed from `app/sitemap.ts`.

`/products` and `/products/[slug]` still exist and still work; they render empty and are
unreachable through the UI.

## Fully Reversible

Republish the products and restore the links. Nothing was deleted.

## The One Live Exception

The **Yale Smart Door Locks** import (20 products with full `technical_specs_json`, pricing and
real imagery) stays as a proof of concept that the pipeline works end to end.

## Linked Notes

* [[Product Detail]]
* [[Product Discovery Journey]]
* [[Route Map]]
* [[Decision - Release Focus Over Catalog Depth]]

## Source Trace

`HANDOFF.md` Sessions 7–8; `app/sitemap.ts`; `app/(site)/brands/[slug]/page.tsx`.
