---
layer: as-built
status: live
updated: 2026-08-22
---

# As Built Overview

> **Start here.** This is the *reality* layer of the vault. Notes in `01_`–`18_` describe what
> was **specified** in June 2026; this layer describes what is **actually running** at
> https://sumanglam.co. Where the two disagree, this layer wins — see [[Spec Vs Built]].

## One-Paragraph State

Sumanglam is **live in production** (launched 2026-07-06) on Vercel at `sumanglam.co`,
auto-deploying from `master`. It is a Next.js 15 App Router app on Supabase Postgres,
queried **entirely over the REST API** (not Prisma at runtime), with Cloudinary delivery,
Auth.js credentials-based admin, and a full Framer Motion motion system. The database is
locked down with RLS on all 20 tables and the app runs on the service-role key. The current
work phase is **content, not code** — see [[Content And Asset State]]. No application code has
changed since `2554f0e` (2026-07-23).

## Subsystem Status

| Subsystem | State | Note |
|---|---|---|
| Public site | ✅ Live | [[Route Map]] |
| Admin dashboard | ✅ Live | [[Admin Surface]] |
| Database | ✅ Live, RLS locked | [[Data Access Layer]], [[Security Posture]] |
| Auth | ✅ Live, env-var credentials | [[Security Posture]] |
| Images | ✅ Live, Cloudinary pipeline | [[Image Delivery Pipeline]] |
| Motion | ✅ Complete, frozen | [[Motion System]] |
| SEO on-site | ✅ Complete | [[SEO And Metadata]] |
| SEO off-site | ⏳ User-run, ongoing | [[SEO And Metadata]] |
| Deployment | ✅ Live | [[Production Deployment]] |
| Showroom page | ⛔ Temporarily offline | [[Decision - Showroom Temporarily Offline]] |
| Product catalog | ⛔ Unpublished (all draft) | [[Decision - Product Catalog Unpublished]] |
| Inspiration detail pages | ⛔ Removed by design | [[Decision - Inspirations Are Visual Only]] |
| Reviews | ⚠️ Table is empty (0 rows) | Renders nothing — not a bug |
| Leads | ⚠️ Table is empty (0 rows) | No inbound leads captured yet |

## What Is Blocking Progress

Nothing in the codebase. Every open item is **waiting on content or a user decision**:

* A larger, more varied 3D render batch.
* A wardrobes hero render.
* Real showroom photography (to bring [[Decision - Showroom Temporarily Offline|/showroom]] back).
* Dealer asset packs for the 3 remaining brand heroes (Godrej, Spitze, Brass Barony).
* Social profile URLs for the `sameAs` schema array.
* Confirmation on two copy claims — see [[Content And Asset State]].

Full detail lives in `HANDOFF.md` → *Pending Tasks*.

## How To Use This Layer

1. **"Where does X live?"** → [[Codebase Map]]
2. **"What does this URL render?"** → [[Route Map]]
3. **"How do I read/write data?"** → [[Data Access Layer]]
4. **"Why is it like this?"** → [[Decisions Index]]
5. **"What will bite me?"** → [[Regression Traps Index]] — **read before editing**
6. **"Is the spec note I'm reading still true?"** → [[Spec Vs Built]]

## Linked Notes

* [[00_Index]]
* [[Spec Vs Built]]
* [[Session Log]]
* [[Global Rules]]
* [[17_Forbidden_Things]]

## Source Trace

Derived from the live codebase (2026-08-22), `HANDOFF.md` sessions 1–16, `PRODUCT.md`,
`next.config.ts`, `lib/`, `server/`, and `prisma/schema.prisma`.
