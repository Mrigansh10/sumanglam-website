---
layer: as-built
status: live
updated: 2026-08-22
---

# Route Map

> Every URL the app answers, the file that renders it, where its data comes from, and whether
> it is publicly reachable. Companion to [[Codebase Map]].

## Public Pages — `app/(site)/`

| Route | File | Data source | State |
|---|---|---|---|
| `/` | `page.tsx` | `getHomepageData()`, `getHomepageImages()`, `getApprovedReviews()` | ✅ Live. Hero + 3 journey cards are **DB-driven** via `site_settings`, not hardcoded |
| `/inspiration` | `inspiration/page.tsx` | `listInspirations()` | ✅ Live. Masonry mosaic, **visual-only** — see [[Decision - Inspirations Are Visual Only]] |
| `/inspiration/[slug]` | `inspiration/[slug]/page.tsx` | — | ⛔ **308 → `/inspiration`** via `next.config.ts`. File kept; page body in git history |
| `/kitchens` | `kitchens/page.tsx` | `getSpaceBySlug()`, taxonomy | ✅ Live. **Also hosts the Appliances section** — see the Category Structure Rule below |
| `/wardrobes` | `wardrobes/page.tsx` | `getSpaceBySlug()` | ✅ Live. Hero still the older space render (pending content) |
| `/hardware-appliances` | `hardware-appliances/page.tsx` | `getSpaceBySlug()`, `getBrands()` | ✅ Live. **Hardware only** — appliances moved to `/kitchens`; nav label is "Hardware" |
| `/brands` | `brands/page.tsx` | `getBrands()` | ✅ Live. 15 brands split Kitchens / Appliances / Hardware |
| `/brands/[slug]` | `brands/[slug]/page.tsx` | `getBrandBySlug()` | ✅ Live. Catalog section renders **conditionally** (hidden while products are draft) |
| `/nolte` | `nolte/page.tsx` | `features/brands/solution-brand-page.tsx` | ✅ Live. Kitchens only, never wardrobes |
| `/mrida` | `mrida/page.tsx` | `features/brands/solution-brand-page.tsx` | ✅ Live. Kitchens + wardrobes + interiors |
| `/collections/[slug]` | `collections/[slug]/page.tsx` | `getCollectionBySlug()` | ⚠️ Built but effectively dormant — collections are unfilled pending the render batch |
| `/products` | `products/page.tsx` | `listProducts()` | ⛔ Reachable by URL but **unlinked and empty** — all 38 products are `draft`. Removed from sitemap |
| `/products/[slug]` | `products/[slug]/page.tsx` | `getProductBySlug()` | ⛔ Same. See [[Decision - Product Catalog Unpublished]] |
| `/showroom` | `showroom/page.tsx` | `getShowroomSections()` | ⛔ **307 → `/contact`**. Restore checklist is in the page file. See [[Decision - Showroom Temporarily Offline]] |
| `/book-consultation` | `book-consultation/page.tsx` | `features/consultations/consultation-form.tsx` → `POST /api/v1/consultations` | ✅ Live and **verified working on prod** since `4e744a4` |
| `/about` | `about/page.tsx` | static | ✅ Live. Origin story is still placeholder copy |
| `/contact` | `contact/page.tsx` | `lib/site.ts` + Maps embed | ✅ Live. Also the fallback target for showroom CTAs |
| `/architects-designers` | `architects-designers/page.tsx` | static | ✅ Live |

Group-level files: `layout.tsx` (nav data + header/footer + JSON-LD `@graph`),
`template.tsx` (enter-only transitions), `loading.tsx`, `error.tsx`, `not-found.tsx`.

## What The Navigation Actually Exposes

Header mega-menu, in order (**Kitchens first everywhere** — see
[[Decision - Kitchen First Navigation]]): Inspiration · Kitchens · Wardrobes · Hardware · Brands,
plus `/about`, `/contact`, `/architects-designers`, `/book-consultation`, and direct brand
links (`/nolte`, `/mrida`, `/brands/{hafele,hettich,blum,yale,godrej}`). Inspiration submenu
uses query filters: `/inspiration?space=kitchen|wardrobe|hardware|appliances`.

**Not in nav:** `/showroom` (removed), `/products` (removed), `/collections/*`.

**In `app/sitemap.ts`:** `/`, `/inspiration`, `/kitchens`, `/wardrobes`,
`/hardware-appliances`, `/brands`, `/nolte`, `/mrida`, `/about`, `/contact`,
`/architects-designers`, `/book-consultation` — plus brand detail pages. Deliberately honest:
no showroom, no products, no inspiration detail URLs. See [[SEO And Metadata]].

## Admin Pages — `app/admin/`

See [[Admin Surface]] for what each screen does.

| Route | File |
|---|---|
| `/admin/login` | `admin/login/page.tsx` + `login-form.tsx` |
| `/admin` | `admin/(protected)/page.tsx` — overview |
| `/admin/brands`, `/admin/brands/[id]` | brands list + edit |
| `/admin/spaces`, `/admin/spaces/[id]` | category page hero + intro copy |
| `/admin/homepage` | the 4 homepage image slots |
| `/admin/inspirations`, `/new`, `/[id]` | list, create, edit |
| `/admin/content` | publish/feature toggles |
| `/admin/leads` | leads inbox + status + **delete** |
| `/admin/consultations` | consultation inbox + **delete** |
| `/admin/reviews` | review moderation |

Server actions live in `app/admin/(protected)/actions.ts` (`deleteLeadAction`,
`deleteConsultationAction`, status/feature setters), each gated by `requireAdmin()`.

## Public API — `app/api/v1/`

All responses use the envelope `{ success: true, data }` / `{ success: false, error: { code, message } }`
from `lib/api/response.ts`.

| Endpoint | Methods | Notes |
|---|---|---|
| `/api/v1/homepage` | GET | |
| `/api/v1/spaces`, `/spaces/[slug]` | GET | |
| `/api/v1/brands`, `/brands/[slug]` | GET | |
| `/api/v1/inspirations`, `/inspirations/[slug]` | GET | |
| `/api/v1/collections`, `/collections/[slug]` | GET | |
| `/api/v1/products`, `/products/[slug]` | GET | |
| `/api/v1/showroom`, `/showroom/[id]` | GET | |
| `/api/v1/consultations` | POST | Zod-validated + rate-limited. Creates/updates a lead |
| `/api/v1/reviews` | GET/POST | Zod-validated. Submissions land unapproved |
| `/api/v1/events` | POST | GA-adjacent event capture |
| `/api/v1/events/whatsapp-click` | POST | WhatsApp intent tracking |

## Admin API — `app/api/v1/admin/`

**All 19+ handlers are auth-gated** (verified 1:1 handler-to-`auth()` sweep in Session 10).

| Endpoint | Methods |
|---|---|
| `admin/brands`, `admin/brands/[id]` | GET/POST/PATCH |
| `admin/inspirations`, `admin/inspirations/[id]` | GET/POST/PATCH |
| `admin/collections`, `admin/collections/[id]` | GET/POST/PATCH |
| `admin/products`, `admin/products/[id]` | GET/POST/PATCH |
| `admin/showroom`, `admin/showroom/[id]` | GET/POST/PATCH |
| `admin/spaces/[id]` | PATCH |
| `admin/leads`, `admin/leads/[id]` | GET/PATCH/**DELETE** |
| `admin/consultations`, `admin/consultations/[id]` | GET/PATCH/**DELETE** |
| `admin/reviews`, `admin/reviews/[id]` | GET/PATCH/DELETE |
| `admin/settings/homepage` | GET/PUT — upserts the `site_settings` slots |
| `admin/upload` | POST — Cloudinary signed upload |
| `/api/auth/[...nextauth]` | Auth.js handler |

## Redirects Configured In `next.config.ts`

| From | To | Type | Why |
|---|---|---|---|
| `/showroom` | `/contact` | 307 temporary | [[Decision - Showroom Temporarily Offline]] |
| `/inspiration/:slug` | `/inspiration` | 308 permanent | [[Decision - Inspirations Are Visual Only]] |

Domain-level 308s (Vercel/GoDaddy): `www.sumanglam.co` and the `*.vercel.app` URL → apex.

## Category Structure Rule

**Kitchens + Appliances together · Wardrobes separate · Hardware separate.** This is a
deliberate reorganisation from the original spec and it governs nav, page contents, and
brand grouping. Do not "fix" `/hardware-appliances` back into hosting appliances.

## Linked Notes

* [[As Built Overview]]
* [[Codebase Map]]
* [[Site Map]] — the *specified* site map, now partly stale
* [[Navigation Structure]]
* [[Spec Vs Built]]

## Source Trace

Read from `app/`, `components/layout/site-header.tsx`, `app/sitemap.ts`, and `next.config.ts`
on 2026-08-22.
