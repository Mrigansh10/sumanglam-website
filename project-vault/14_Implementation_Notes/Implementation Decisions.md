# Implementation Decisions

## Purpose

Tracks non-blocking implementation choices made while building V1 so future agents do not rediscover or reverse them casually.

## Decisions

### Package Manager

Use npm. The project now has `package-lock.json`.

### Visual Tokens

Use a restrained premium interior-showroom palette:

* Warm ivory background.
* White content surfaces.
* Deep warm charcoal ink.
* Muted bronze accent.
* Soft clay/sand neutrals.

Reason: Source docs specified luxury, warmth, trust, Apple minimalism, editorial design, and no exact color tokens.

### Typography

Use Fraunces for display typography and Inter for body/UI text through `next/font/google`.

Reason: Source docs specified elegant, modern, confident, readable typography but no exact font family.

### Animation Stack

Install and configure Three.js, GSAP with ScrollTrigger, and Lenis.js as approved dependencies. Use them only for subtle, performance-conscious motion. Respect reduced-motion preferences.

Reason: User explicitly approved this stack after the original architecture docs.

### Database Provider

A Supabase PostgreSQL project was used during implementation based on the previous executor progress. The docs still allow Supabase or Neon. Treat production provider as a launch decision until credentials, billing, and ownership are confirmed.

### Content Status

Add `ContentStatus` enum with `DRAFT`, `PUBLISHED`, and `ARCHIVED` to content tables.

Reason: Content model requires draft/published/archived, while the original database table list omitted those fields.

### Consultation Status

Add conservative V1 consultation statuses: `NEW`, `SCHEDULED`, `COMPLETED`, `CANCELLED`.

Reason: The docs required a consultation status field but did not define allowed values.

### Project Type

Use `KITCHEN`, `WARDROBE`, `COMPLETE_HOME`, `HARDWARE_APPLIANCES`, and `OTHER`.

Reason: Project type enum was not specified; these values match documented spaces and consultation intent.

### Duplicate Lead Handling

If a consultation is submitted with an existing phone number, update the most recent matching lead instead of creating a duplicate, then create a new consultation.

Reason: Duplicate lead behavior was open; this preserves pipeline history without fragmenting one contact.

### Admin Auth

Use Auth.js credentials provider with one configured admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

Reason: V1 requires admin-only authentication and excludes public user accounts. This is a placeholder until real production auth ownership is decided.

### Admin Notification

Consultation creation logs an admin notification placeholder. Real notification delivery is not implemented yet.

Reason: Notification channel was an open question. Lead and consultation data remain visible in admin.

### Admin Foundation Scope

Implement protected admin login, overview, leads list/status update, consultations list, content overview, and admin read/update APIs for leads and consultations. Full CRUD forms for content are deferred.

Reason: V1 needs admin foundation, but complete CRUD forms should be built after first QA and content ownership decisions.

### Admin Rendering Mode

Force the admin route segment and admin login page to dynamic rendering.

Reason: Admin pages read live lead/content data and should not evaluate database queries during production build. This also avoids exhausting free-tier database session-pool limits during build-time static generation.

### Lint Command

Use `eslint . --max-warnings=0` for `npm run lint`.

Reason: `next lint` is deprecated and will be removed in Next.js 16. The ESLint CLI catches the same Next/core-web-vitals rules through `eslint.config.mjs`.

### Admin Content DELETE Archives

`DELETE /api/v1/admin/inspirations/:id` and `DELETE /api/v1/admin/products/:id` set `status` to `ARCHIVED` instead of hard-deleting rows. Brands, collections, and showroom sections have no DELETE endpoint.

Reason: The API doc left archive-vs-hard-delete open. Archiving preserves junction history and inbound references, and matches the content governance model.

### Admin Content Status Controls

The admin content page lists inspirations, brands, products, collections, and showroom sections (most recently updated 50 each) with inline status and featured controls via server actions. Full create/edit forms remain deferred and should call the documented admin content APIs.

Reason: Gives admins immediate publish/draft/archive and featured control without committing to full form UX before content ownership decisions.

### Floating WhatsApp On Mobile

Keep the floating WhatsApp action on mobile, but increase mobile homepage hero bottom padding so it does not overlap the hero CTAs.

Reason: Persistent mobile WhatsApp access is documented, but screenshot QA caught overlap with the secondary hero CTA.

### Motion Architecture

Lenis is driven by GSAP's ticker and synced to ScrollTrigger (`components/motion/smooth-scroll.tsx`) so smooth scroll and scroll-triggered animation share one clock. `Reveal` (fade/slide on scroll) and `Parallax` (gentle scrub on hero imagery) are the only scroll effects. Three.js renders one lazy-loaded ambient particle layer on the homepage hero (`HeroAmbient`), paused offscreen via IntersectionObserver and skipped under reduced motion, on screens below 768px, and on WebGL failure.

Reason: User-approved stack must feel premium without scroll hijacking or mobile cost. All three layers degrade to fully visible static content.

### Routes And IA

* `/nolte` and `/mrida` are dedicated solution-brand pages; `/brands/[slug]` redirects those two slugs and serves product brands.
* `/wardrobes` is framed entirely as Mrida Wardrobes, omitted from the main navigation, and links only to inspiration and consultation (Conflict 6).
* Browsing spine: Space -> Collection -> Inspiration (Conflict 2). Collections live at `/collections/[slug]`.
* Product filters are limited to the documented brand/type/category/subcategory query params (Conflict 5).

### Media Field Shape

Image fields are strings: absolute URLs and local paths are used as-is; any other value is treated as a Cloudinary public ID resolved by `lib/images.ts` with `f_auto,q_auto` transforms. Seed imagery is local placeholder SVGs in `public/images/placeholders/`.

### No Analytics Table

`POST /api/v1/events` and `/events/whatsapp-click` validate and log but do not persist; GA4 is the documented analytics provider and the database schema must stay within documented tables. Revisit if WhatsApp attribution needs durable storage.

### Demo Seed Content

Taxonomy (spaces, collections, brands, categories, showroom sections) is seeded verbatim from the vault. The 10 inspirations and 18 products are demo content derived from the documented taxonomy, marked in `prisma/seed.ts`, and must be replaced with real curated content before launch.

### Database Connection Pooling

The Supabase session pooler caps at 15 clients on the free tier; `DATABASE_URL` must include `connection_limit=4&pool_timeout=20` (dev/long-running) or use the transaction pooler with `pgbouncer=true&connection_limit=1` (serverless). Without this, parallel Prisma pools exhaust the pooler and pages serve empty fallbacks.

### Homepage Image Slots Are Admin-Managed

The homepage hero banner and the three "Explore Your Journey" category card images
(Kitchens, Wardrobes, Hardware) were previously hardcoded as an `IMAGES` constant
in `app/(site)/page.tsx`. They are now stored in the [[Database - site_settings]]
key/value table (`home_hero`, `home_kitchens`, `home_wardrobes`, `home_hardware`)
and edited from a new admin **Homepage** page that reuses the shared `ImageUpload`
widget. `server/site-settings.ts` reads them with built-in defaults applied for any
unset key, so behaviour is unchanged until an admin overrides a slot. Uploaded 3D
renders (Cloudinary public IDs) get the `enhance: "render"` restore/upscale pass at
the homepage call sites.

Reason: "Hardcoded content where a content model can exist" is a documented
anti-pattern; these slots needed first-class admin editing for the render rollout.

### SEO Foundation

`app/sitemap.ts` (static routes + published slugs), `app/robots.ts` (disallow `/admin`, `/api`), relative canonical (`alternates: { canonical: "./" }`) resolved per page against `metadataBase`, LocalBusiness JSON-LD in the site layout with placeholder contact details.

### Security Hardening Pass (2026-07-05)

Findings and fixes from a MurphyScan launch-readiness audit (skill installed at
`.claude/skills/murphyscan/`, run via `/murphyscan`):

* **Admin login hardened** (`auth.ts`): credential comparison is now timing-safe
  (SHA-256 digests + `crypto.timingSafeEqual`), login attempts are rate-limited
  (5 per 15 min per IP, reusing `lib/api/rate-limit`), and JWT sessions expire
  after 24 h (was the 30-day default). Single-admin panel, so short sessions cost
  nothing.
* **Security headers** (`next.config.ts` `headers()`): HSTS (2 y, includeSubDomains),
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy:
  strict-origin-when-cross-origin`, minimal `Permissions-Policy`. A full CSP was
  deliberately deferred — it needs testing against Next inline scripts, Framer
  Motion, GA4, and Cloudinary before launch, and a broken CSP is worse than none
  at first ship.
* **Credential hygiene**: the admin password previously lived in `HANDOFF.md`
  (committed since Session 3) — scrubbed from the file and **rotated** in `.env`;
  anything ever committed is treated as burned. Rule: credentials live only in
  `.env` / Vercel env vars, docs point at the var names.
* **Known residual risks** (not code-fixable here): RLS is disabled on all tables,
  so the anon key is the only wall around leads/consultations PII — the key is
  server-only (verified: no client-component imports, no literals in the repo),
  but the durable fix is RLS policies + a service-role key for server writes,
  which needs a Supabase dashboard session. The in-memory rate limiter is
  per-instance (documented V1 trade-off). `ignoreBuildErrors: true` still skips
  type gates on deploy.

### Security Hardening Pass 2 (2026-07-05)

* **Content-Security-Policy**: full CSP in `next.config.ts`. `'unsafe-inline'` is
  accepted for script/style because Next hydration and the GA4 init snippet are
  inline and nonce-based CSP would require adding middleware; external script
  injection is still blocked. Allowlist: GA (`*.googletagmanager.com`,
  `*.google-analytics.com`, `*.analytics.google.com`), Google Maps embeds
  (`frame-src www.google.com`), Cloudinary images. Any new external resource
  domain must be added to the `contentSecurityPolicy` array or it will be blocked.
* **Type gate restored**: `ignoreBuildErrors` removed after fixing all suppressed
  errors. Key patterns: supabase-js types to-one joins as arrays → cast link rows
  `as unknown as` the runtime object shape; `rows<T>()`/`camelizeRecord<T>()` now
  called with real `lib/db-types` types at every server query; enum-consuming
  components (ProductCard availability, BrandCard type badge) normalize to the
  lowercase Supabase representation via `.toLowerCase()` at the boundary.
* **Supabase key strategy**: `lib/supabase.ts` prefers `SUPABASE_SERVICE_ROLE_KEY`
  when present (falls back to anon), throws if imported client-side, and disables
  session persistence. Production DDL cannot run from auto-mode sessions, so RLS
  changes ship as reviewed scripts: `scripts/security/fix-reviews-rls.sql`
  (immediate — restores the reviews feature under RLS) and
  `scripts/security/rls-lockdown.sql` (post-service-key — RLS on everywhere, anon
  grants nothing, service role bypasses).
* **RLS lockdown executed 2026-07-06** (user-run): RLS enabled on all 19 tables,
  zero anon policies. Verified anon key inert (empty reads, 401 writes) while the
  app — public, forms, admin — runs fully on the service-role key.
  `SUPABASE_SERVICE_ROLE_KEY` is now a REQUIRED env var in every environment;
  `fix-reviews-rls.sql` was superseded before it was ever needed.

## Source Trace

Derived from `project-vault/15_Open_Questions.md`, `project-vault/16_Conflicts.md`, `project-vault/18_Build_Order.md`, source docs, and implementation work on 2026-06-10.
