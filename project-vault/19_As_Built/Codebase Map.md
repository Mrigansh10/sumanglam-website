---
layer: as-built
status: live
updated: 2026-08-22
---

# Codebase Map

> Purpose: **answer "where does X live?" without scanning the repo.** Paths are relative to
> the repo root `/Users/MriganshChaudhary/Desktop/sumanglam-website`.

## Top-Level Shape

| Path | What it is |
|---|---|
| `app/` | Next.js 15 App Router — public site, admin, API routes. See [[Route Map]] |
| `components/` | Shared React components (layout, motion, shared, ui, admin) |
| `features/` | Feature-scoped components (brands, consultations, whatsapp) |
| `server/` | **All data fetching.** Server-only functions over Supabase REST. See [[Data Access Layer]] |
| `lib/` | Client + server utilities: supabase client, images, validation, ids, env, site config |
| `prisma/` | Schema + migrations **only** — never used for runtime queries. See [[Decision - Supabase REST Over Prisma]] |
| `scripts/` | One-off + reusable tooling (security SQL, Yale importer, review scraper) |
| `public/` | Static assets and local SVG placeholders |
| `project-vault/` | This vault |
| `01-*.md` … `16-*.md` | Original source specification docs (root). Superseded by this vault |
| `HANDOFF.md` | Running session log + pending tasks. The narrative companion to this vault |
| `PRODUCT.md` | Product source of truth (untracked). Read before asking product questions |
| `AGENTS.md` / `CLAUDE.md` | Agent entry instructions |

## `app/` — Routes

Three route groups:

* `app/(site)/` — the public marketing site. Wrapped by `app/(site)/layout.tsx` (fetches brands
  for nav, renders header/footer, emits JSON-LD) and `app/(site)/template.tsx` (enter-only page
  transitions — see [[Trap - Fixed Elements Inside Template]]).
* `app/admin/` — `login/` (public) and `(protected)/` (auth-gated layout). See [[Admin Surface]].
* `app/api/v1/` — REST handlers. Public endpoints at the top level, admin endpoints under
  `admin/`. Also `app/api/auth/[...nextauth]/route.ts` for Auth.js.

Root-level special files: `app/layout.tsx`, `app/not-found.tsx`, `app/robots.ts`,
`app/sitemap.ts`, `app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`.

## `server/` — The Data Layer

Every public page reads through these. **Never query Supabase directly from a page.**

| File | Exports |
|---|---|
| `server/homepage.ts` | `getHomepageData` |
| `server/spaces.ts` | `getSpaces`, `getSpaceBySlug` |
| `server/brands.ts` | `getBrands`, `getBrandBySlug` |
| `server/inspirations.ts` | `listInspirations`, `getInspirationBySlug` |
| `server/collections.ts` | `getCollections`, `getCollectionBySlug` |
| `server/products.ts` | `listProducts`, `getProductBySlug`, `getProductTaxonomy` |
| `server/showroom.ts` | `getShowroomSections`, `getShowroomSectionById` |
| `server/reviews.ts` | `submitReview`, `getApprovedReviews`, `getAllReviewsAdmin`, `setReviewApproval`, `deleteReview` |
| `server/google-reviews.ts` | `getGoogleReviews` |
| `server/leads.ts` | `createConsultation` |
| `server/site-settings.ts` | `getHomepageImages`, `HOMEPAGE_IMAGE_DEFAULTS`, `HOMEPAGE_SLOT_KEYS` |
| `server/admin.ts` | `getAdminOverview`, `getAdminLeads`, `getAdminLead`, `updateLeadStatus`, `deleteLead`, `getAdminConsultations`, `getAdminConsultation`, `deleteConsultation`, `getAdminContentLists`, `setContentStatus`, `setContentFeatured`, plus the status option/label constants |
| `server/safe.ts` | `safeQuery` — wraps queries so a DB failure degrades the page instead of crashing it |

## `lib/` — Utilities

| File | Purpose |
|---|---|
| `lib/supabase.ts` | The Supabase client (**server-only, throws in browser**) + `rows<T>()`, `firstRow<T>()`, `camelizeRecord<T>()` snake→camel helpers |
| `lib/images.ts` | `resolveImage(value, { width, height, enhance })`. See [[Image Delivery Pipeline]] |
| `lib/ids.ts` | `newId()` / `nowIso()` — **required on every REST insert**. See [[Trap - No DB Defaults On Insert]] |
| `lib/db-types.ts` | TypeScript interfaces for every DB model |
| `lib/db.ts` | Prisma client (schema tooling only) |
| `lib/env.ts` | Env access + `clientEnv` |
| `lib/site.ts` | Site config: name, NAP, contact, social links, OG image URL |
| `lib/analytics.ts` | GA4 event helpers |
| `lib/utils.ts` | `cn()` and misc |
| `lib/api/response.ts` | The `{ success, data }` / `{ success, error }` envelope helpers |
| `lib/api/rate-limit.ts` | In-memory rate limiting (**not durable across instances** — known gap) |
| `lib/api/prisma-errors.ts` | Legacy error mapping |
| `lib/validation/*.ts` | Zod schemas: `consultation`, `review`, `events`, `admin-content` |

## `components/`

| Folder | Contents |
|---|---|
| `components/layout/` | `site-header.tsx` (floating glass pill nav + mega-menu + scroll-hide), `site-footer.tsx`, `container.tsx`, `section.tsx`, `heading.tsx` |
| `components/motion/` | `split-headline.tsx`, `stagger.tsx`, `reveal.tsx`, `parallax.tsx`, `draw-rule.tsx`, `fade-in-image.tsx`, `hero-ambient.tsx`, `smooth-scroll.tsx`. See [[Motion System]] |
| `components/shared/` | `page-hero.tsx`, `visual-card.tsx`, `brand-card.tsx`, `product-card.tsx`, `reviews-section.tsx`, `review-form.tsx`, `star-rating.tsx`, `empty-state.tsx`, `page-view-tracker.tsx` |
| `components/ui/` | shadcn-style primitives: `button`, `badge`, `card`, `input`, `label`, `select`, `textarea`, `skeleton` |
| `components/admin/` | `image-upload.tsx` (in-browser downscale before Cloudinary), `inspiration-form.tsx`, `delete-confirm-form.tsx` (see [[Trap - Unmounting A Server Action Form]]) |

## `features/`

| File | Purpose |
|---|---|
| `features/brands/solution-brand-page.tsx` | Shared body for `/nolte` and `/mrida` |
| `features/consultations/consultation-form.tsx` | The booking form |
| `features/whatsapp/whatsapp.ts` | Link/message builders |
| `features/whatsapp/whatsapp-button.tsx` | Inline CTA |
| `features/whatsapp/floating-whatsapp.tsx` | Persistent mobile CTA (lives in `layout.tsx`, **outside** the template) |

## `scripts/`

| Path | Purpose |
|---|---|
| `scripts/security/rls-lockdown.sql` | The RLS lockdown DDL (run by the user; auto-mode cannot run prod DDL). Includes `_prisma_migrations` |
| `scripts/security/fix-reviews-rls.sql` | Obsolete — superseded by the full lockdown; kept for history |
| `scripts/yale-catalogue/import-category.mjs` | Reusable vendor-catalogue importer. **Paused** — see [[Decision - Release Focus Over Catalog Depth]] |
| `scripts/scrape-google-reviews.ts` | `npm run scrape:reviews` |

## Config Files

| File | Notable contents |
|---|---|
| `next.config.ts` | Full CSP, security headers, the two `redirects()` (`/showroom`→`/contact`, `/inspiration/:slug`→`/inspiration`), `images.remotePatterns` allowlist, `dangerouslyAllowSVG` |
| `auth.ts` | Auth.js v5 credentials provider. Env-var comparison, timing-safe, **rate-limited 5/15min/IP**, 24h session |
| `package.json` | Scripts incl. `typecheck`, `db:*`, `scrape:reviews` |
| `prisma/schema.prisma` | 19 models + 7 enums — the schema of record |

## Dependencies Actually Installed

`next` 15.5, `react` 19, `typescript` 5.9, `tailwindcss` 4.1, `@supabase/supabase-js`,
`@prisma/client` + `prisma`, `next-auth` 5 beta, `cloudinary`, `zod` 3, `framer-motion` 12,
`gsap` 3, `lenis` 1.3, `three` 0.180, `lucide-react`, `class-variance-authority`, `clsx`,
`tailwind-merge`. Dev: `playwright`, `tsx`, `eslint`.

> **Do not add libraries.** The motion work is complete and deliberately built on what is
> already here. See [[Motion System]] and [[Forbidden Patterns]].

## Linked Notes

* [[As Built Overview]]
* [[Route Map]]
* [[Data Access Layer]]
* [[Folder Structure]] — the *specified* structure, partly superseded by this note

## Source Trace

Read directly from the working tree on 2026-08-22.
