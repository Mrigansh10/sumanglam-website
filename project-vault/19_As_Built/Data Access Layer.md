---
layer: as-built
status: live
updated: 2026-08-22
---

# Data Access Layer

> **The single most important as-built divergence from the spec.** The vault's `10_Database`
> and `12_Technical_Architecture` notes describe a Prisma-queried Postgres. That is **not what
> runs.** Prisma owns the schema; Supabase REST owns every runtime query.

## The Rule

* **Schema and migrations:** Prisma (`prisma/schema.prisma`, `npm run db:migrate`, `db:push`).
* **Every runtime read and write:** `@supabase/supabase-js` REST, through `server/*.ts`.
* **Never** import `lib/db.ts` (the Prisma client) into a page, route handler, or component.
* **Never** import `lib/supabase.ts` into a client component — it throws on purpose.

Why: the Prisma wire protocol (ports 5432/6543) is blocked on the developer's home network;
Supabase REST over 443 works. A network constraint, not a preference. Full reasoning in
[[Decision - Supabase REST Over Prisma]].

## The Client

`lib/supabase.ts` exports a single `supabase` client:

* URL is hardcoded (`https://yikrshucrahamejrsklp.supabase.co`, project `yikrshucrahamejrsklp`, ap-southeast-2).
* Key resolution: `SUPABASE_SERVICE_ROLE_KEY` **first**, falling back to `SUPABASE_ANON_KEY`.
  Since the RLS lockdown the service-role key is **required** — the anon key is inert.
* `auth: { persistSession: false }`.
* A `typeof window !== "undefined"` guard throws if the module is ever bundled clientside.

Helpers exported alongside it:

| Helper | Use |
|---|---|
| `rows<T>(data)` | Array of REST rows → camelCase typed array |
| `firstRow<T>(data)` | First row → camelCase typed object or `null` |
| `camelizeRecord<T>(row)` | Recursive snake_case → camelCase (handles nested arrays/objects) |

## The Shape Traps

REST does not return Prisma's shape. Three consequences bite repeatedly:

1. **Timestamps are ISO strings, not `Date`.** Coerce with `new Date(value)` before formatting.
2. **Enums come back lowercase**, not the uppercase Prisma form.
3. **Columns camelize literally** — `technical_specs_json` → `technicalSpecsJson`, not
   `technicalSpecs`. Bridge in the server function, not the component.

See [[Trap - REST Shape Dates And Enums]]. A full sweep was completed on 2026-07-05 and the
TypeScript build gate now blocks deploys, so these should only appear in **new** code.

## The Insert Trap

Prisma created these tables with **client-side** defaults (`@default(cuid())`, `@updatedAt`),
so the database has **no defaults for `id` or `updated_at`**. Every REST insert must supply
both, using `lib/ids.ts`:

```ts
import { newId, nowIso } from "@/lib/ids";
// insert: { id: newId(), created_at: nowIso(), updated_at: nowIso(), ... }
// update: { ..., updated_at: nowIso() }
```

This broke consultation booking silently in production for weeks. See
[[Trap - No DB Defaults On Insert]].

## The Join Trap

A joined `.select()` must name **every field the component renders**. A missing field is
invisible until the first row exists, then 500s. See
[[Trap - Joined Selects Must Fetch Rendered Fields]]. supabase-js types to-one joins as
arrays; the codebase uses `as unknown as` casts to bridge that.

## Failure Handling

`server/safe.ts` exports `safeQuery`, which wraps a query so a database failure degrades the
page (empty state) instead of crashing it. Public pages use it; this is why every page loads
even when Supabase is paused.

## Tables

19 application tables + `_prisma_migrations`. Prisma model → table mapping:

| Model | Table | Vault note |
|---|---|---|
| `Space` | `spaces` | [[Database - spaces]] |
| `Collection` | `collections` | [[Database - collections]] |
| `Inspiration` | `inspirations` | [[Database - inspirations]] |
| `Brand` | `brands` | [[Database - brands]] |
| `ProductType` | `product_types` | [[Database - product_types]] |
| `ProductCategory` | `product_categories` | [[Database - product_categories]] |
| `ProductSubcategory` | `product_subcategories` | [[Database - product_subcategories]] |
| `Product` | `products` | [[Database - products]] |
| `ShowroomSection` | `showroom_sections` | [[Database - showroom_sections]] |
| `Lead` | `leads` | [[Database - leads]] |
| `Consultation` | `consultations` | [[Database - consultations]] |
| `Review` | `reviews` | [[Database - reviews]] |
| `SiteSetting` | `site_settings` | [[Database - site_settings]] |
| `CollectionInspiration` | `collection_inspirations` | [[Database - collection_inspirations]] |
| `InspirationProduct` | `inspiration_products` | [[Database - inspiration_products]] |
| `InspirationBrand` | `inspiration_brands` | [[Database - inspiration_brands]] |
| `ProductCategoryMapping` | `product_category_mappings` | [[Database - product_category_mappings]] |
| `ShowroomBrandMapping` | `showroom_brand_mappings` | [[Database - showroom_brand_mappings]] |
| `ShowroomInspirationMapping` | `showroom_inspiration_mappings` | [[Database - showroom_inspiration_mappings]] |

Enums in the schema: `BrandType`, `AvailabilityStatus`, `LeadStatus`, `ContentStatus`,
`ConsultationStatus`, `ProjectType`, `ContactMethod`. See [[Database - Status Enums]] —
remembering that **REST hands them back lowercase**.

## Live Row Counts Worth Knowing

| Table | Rows | Consequence |
|---|---|---|
| `brands` | 15 | All seeded, 12 have hero images |
| `products` | 38 | **All `draft`** — nothing renders publicly |
| `inspirations` | 9 published + 10 draft | Drives the mosaic |
| `reviews` | **0** | The site renders no reviews at all. Not a bug |
| `leads` | **0** | No inbound leads captured yet |

Verified 2026-08-12 as `postgres` (`rolbypassrls`), so the zeroes are real, not RLS artifacts.

## Linked Notes

* [[Codebase Map]]
* [[Security Posture]]
* [[Database Overview]]
* [[Decision - Supabase REST Over Prisma]]
* [[Spec Vs Built]]

## Source Trace

`lib/supabase.ts`, `lib/ids.ts`, `server/*.ts`, `prisma/schema.prisma` read 2026-08-22;
row counts from the Session 16 DB inspection.
