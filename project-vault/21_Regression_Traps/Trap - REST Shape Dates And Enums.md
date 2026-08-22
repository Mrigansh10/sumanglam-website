---
layer: trap
severity: high
area: data
---

# Trap - REST Shape Dates And Enums

## The Trap

Supabase REST does **not** return Prisma's shape. Code ported from Prisma, or written by anyone
assuming Prisma, breaks in three ways:

| Prisma gave you | REST gives you |
|---|---|
| `Date` objects | **ISO strings** |
| Uppercase enums (`PUBLISHED`) | **lowercase** (`published`) |
| Field names as modelled | **literal camelization** of the column: `technical_specs_json` → `technicalSpecsJson` |

## How It Showed Up

* Admin content pages crashed with **`Invalid time value`** — `formatDate` was handed a string.
* Brand save threw an enum error — the form sent the lowercase value REST had loaded.
* The product-detail **spec table silently never rendered** — the UI read
  `product.technicalSpecs` while `camelizeRecord` produced `technicalSpecsJson`.
* `ProductCard`'s availability badge and `BrandCard`'s "Solutions" badge **never matched**,
  because they compared against uppercase constants.

## The Fix

* Coerce before formatting: `new Date(value)`.
* Compare enums against **lowercase** DB values.
* Bridge column-name mismatches **in the `server/` function**, not in the component —
  `getProductBySlug` does this for `technicalSpecsJson` → `technicalSpecs`.

## Current Status

A full sweep was completed 2026-07-05, `ignoreBuildErrors` was removed, and the TypeScript
build gate now blocks deploys. **This should only appear in new code.**

## Linked Notes

* [[Data Access Layer]]
* [[Decision - Supabase REST Over Prisma]]
* [[Database - Status Enums]]

## Source Trace

`HANDOFF.md` Sessions 4, 7, 10b; `lib/supabase.ts`; `server/products.ts`.
