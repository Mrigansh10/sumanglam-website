---
layer: as-built
status: live
updated: 2026-08-22
---

# Spec Vs Built

> **Read this before trusting any note in `01_`–`18_`.** Those folders were written in June 2026
> from the original source documents. Where reality has moved, this table says so and points at
> the note that describes what actually runs.

## Divergences

| Spec note says | Reality | As-built note |
|---|---|---|
| Data access via **Prisma** | Prisma is schema + migrations only. **All runtime queries go over Supabase REST** | [[Data Access Layer]], [[Decision - Supabase REST Over Prisma]] |
| DB provider "Supabase or Neon, undecided" | **Supabase**, project `yikrshucrahamejrsklp`, ap-southeast-2. Decided and live | [[Data Access Layer]] |
| RLS posture unspecified | **RLS on all 19 tables + `_prisma_migrations`, zero anon policies.** App runs on the service-role key | [[Security Posture]] |
| [[Site Map]] / [[Navigation Structure]] — hardware **and** appliances on one page | **Kitchens + Appliances together · Wardrobes separate · Hardware separate.** `/hardware-appliances` is Hardware-only, nav label "Hardware" | [[Route Map]] |
| Nav order as originally listed | **Kitchens first everywhere** | [[Decision - Kitchen First Navigation]] |
| [[Inspiration]] has detail pages | **Detail pages removed.** `/inspiration/[slug]` 308s to `/inspiration`; the listing is a visual-only masonry mosaic | [[Decision - Inspirations Are Visual Only]] |
| [[Showroom Experience]] is a live page | **`/showroom` 307s to `/contact`.** Section removed from homepage, nav and footer | [[Decision - Showroom Temporarily Offline]] |
| [[Product Detail]] / product catalog is a V1 surface | **All 38 products are `draft`**; entry points removed. Reachable only by direct URL | [[Decision - Product Catalog Unpublished]] |
| Homepage hero and cards are page content | **Database-driven** via `site_settings`, edited in Admin → Homepage | [[Admin Surface]] |
| Animation = "Framer Motion documented" | A **complete, shipped motion system** with named primitives and page transitions. Frozen — don't extend casually | [[Motion System]] |
| Image handling = "Cloudinary" | A three-mode `resolveImage()` pipeline with a generative restore path and hard size rules | [[Image Delivery Pipeline]] |
| Deployment is a future step | **Live at sumanglam.co since 2026-07-06**, auto-deploying from `master` | [[Production Deployment]] |
| Reviews are unmodelled in `10_Database` | The `reviews` table exists and is wired end-to-end (submission + moderation + Google Reviews import). Currently **0 rows** | [[Database - reviews]] |
| Design tokens/fonts "not specified" | Decided: warm ivory / charcoal / bronze palette, **Fraunces** display + **Inter** body | [[Implementation Decisions]] |

## Spec Notes That Are Still Fully Authoritative

Do **not** treat these as stale — they remain the governing rules:

* [[Global Rules]], [[Quality Bar]], [[Forbidden Patterns]], [[17_Forbidden_Things]]
* [[Product Summary]], [[Target Users]], [[MVP Scope]]
* [[CTA Hierarchy]], [[CTA System]], [[Mobile Experience]]
* [[Visual Style]], [[Typography]], [[Spacing Layout]], [[Accessibility Requirements]]
* All of `07_Domain_Model` and `08_Content_Model` — the entity model didn't change
* The brand rules in `09_Content_Taxonomy` — Nolte kitchens-only, wardrobes are Mrida's,
  Blaupunkt under Hettich

## Resolved Open Questions

Items from [[15_Open_Questions]] and [[16_Conflicts]] that reality has now answered:

| Question | Answer |
|---|---|
| Supabase or Neon? | **Supabase** |
| Is Wardrobes top-level nav or under Mrida? | **Top-level nav page**, content owned by Mrida |
| Exact colour tokens and fonts? | Decided — see [[Implementation Decisions]] |
| Which pages need Three.js? | In practice **none** so far; the motion system is Framer Motion. Three is installed but effectively unused |
| Package manager? | **npm** |

Still genuinely open: duplicate-lead handling, notification delivery channel, and whether a
Solution API placeholder route is needed. See [[15_Open_Questions]].

## Linked Notes

* [[As Built Overview]]
* [[00_Index]]
* [[source-map]]
* [[Session Log]]

## Source Trace

Comparison of the `01_`–`18_` vault notes against the working tree and live site on 2026-08-22.
