# HANDOFF — Sumanglam Digital Showroom

**Last updated:** 2026-06-28
**Repo:** https://github.com/Mrigansh10/sumanglam-website
**Dev server:** `npm run dev` → http://localhost:3000

> ⚠️ **Uncommitted work on disk** (working tree, not yet committed) — safe to commit as one batch:
> - `lib/images.ts` Cloudinary auto-polish (this one IS committed, c5b9038)
> - `app/admin/(protected)/brands/[id]/page.tsx` — brand enum-casing fix
> - `app/admin/(protected)/layout.tsx` — adds "Spaces" to admin nav
> - `components/shared/page-hero.tsx` — hero source width 1920→2560
> - `lib/validation/admin-content.ts` — adds `spaceSchema` / `updateSpaceSchema`
> - `app/admin/(protected)/spaces/` (new) — Spaces list + edit pages
> - `app/api/v1/admin/spaces/[id]/route.ts` (new) — GET/PUT for a space

---

## What This Project Is

A premium **digital showroom** (NOT ecommerce) for Sumanglam — modular kitchens (Nolte, Mrida), Mrida wardrobes, premium hardware, and appliances. Goal: inspire, build trust, and convert into showroom visits, WhatsApp conversations, and consultation bookings.

---

## Tech Stack (Actual)

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router (TypeScript) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) — REST only via `@supabase/supabase-js` |
| Auth | Auth.js v5 (credentials provider) |
| Images | Cloudinary (cloud: `de9turgsy`) |
| Schema/Migrations | Prisma — schema + migrations only, never for runtime queries |

> **Why Supabase REST, not Prisma for queries:** The Prisma wire protocol (ports 5432/6543) is blocked on the developer's home network. Supabase REST over HTTPS port 443 works fine. This is a network constraint, not a design choice.

---

## Supabase

- **Project ID:** `yikrshucrahamejrsklp`
- **URL:** `https://yikrshucrahamejrsklp.supabase.co`
- **Region:** ap-southeast-2 (Sydney)
- **Anon Key:** in `.env` as `SUPABASE_ANON_KEY`
- **RLS:** Disabled on all tables **except `reviews`** (which has RLS enabled but no policies — see Known Issues)

---

## Admin Access

- **URL:** `/admin` (redirects to `/admin/login` if unauthenticated)
- **Email:** `admin@sumanglam.co`
- **Password:** `sumanglam2024`

---

## Key Files

| File | Purpose |
|---|---|
| `lib/supabase.ts` | Supabase client + `rows<T>()`, `camelizeRecord<T>()`, `firstRow<T>()` helpers |
| `lib/db-types.ts` | TypeScript interfaces for all DB models |
| `lib/images.ts` | `resolveImage(value, { width, height, enhance })` — Cloudinary URL builder. Bare public IDs (admin uploads) flow through the transform branch and get `f_auto,q_auto:good` auto-polish; full URLs / `/`-paths pass through untouched |
| `components/shared/page-hero.tsx` | Shared page header. Image hero renders at `opacity-75` under a top gradient; source requested at `width: 2560` for Retina sharpness |
| `app/admin/(protected)/spaces/` | Admin editor for Spaces (category pages — Kitchens, Wardrobes…). List + per-space edit (title, intro copy, hero image upload to `sumanglam/spaces`) |
| `lib/site.ts` | Site config: name, contact details, social links |
| `app/(site)/layout.tsx` | Site layout — fetches brands for nav, renders header/footer |
| `components/layout/site-header.tsx` | Floating glass pill nav with mega-menu + scroll-hide behaviour |
| `server/*.ts` | All data-fetching functions (use Supabase REST) |
| `app/api/v1/admin/` | All admin CRUD API routes (all on Supabase now) |
| `app/(site)/page.tsx` | Homepage — `IMAGES` object at top controls hero/card photos |

---

## Running Locally

```bash
cd /Users/MriganshChaudhary/Desktop/sumanglam-website
npm run dev
```

`.env` file already configured. No setup needed.

---

## Current State (as of 2026-06-26)

### Working

**Public site**
- Homepage with hero, featured brands/inspirations, why-us, showroom highlights, reviews, CTA
- `/brands` — all 15 brands, split into Kitchens / Appliances / Hardware
- `/nolte`, `/mrida` — dedicated solution brand pages
- `/kitchens`, `/wardrobes`, `/hardware-appliances` — category pages
- `/inspiration`, `/inspiration/[slug]` — gallery + detail
- `/showroom`, `/book-consultation`, `/about`, `/contact`, `/architects-designers`
- All pages load without crashes (DB errors handled gracefully by `safeQuery`)

**Navigation**
- Floating glass pill header (`fixed left-12 right-12 top-3 z-50`)
- Mega-menu: Inspiration, Kitchens, Wardrobes, Hardware, Brands — all with panels
- Brands mega-menu auto-populated from DB, split by category
- **Hide-on-scroll:** hides after 100px downward scroll, 5px jitter tolerance
  - Uses Framer Motion `motion.div` animate/transition props (NOT CSS transitions — browser has a bug where changing `transition` and `transform` in the same render uses the old transition value, making hide/reveal appear swapped)
  - Hide: 850ms `cubic-bezier(0.65, 0, 0.35, 1)` | Reveal: 400ms `cubic-bezier(0, 0, 0.2, 1)`

**Admin**
- Login, overview, brands list+edit, **spaces list+edit (hero image + intro copy)**, inspirations list+create+edit, content toggles, leads, reviews moderation
- Image upload (dual-mode: file drag-drop + URL import via Cloudinary). Stores **bare public IDs**, not full URLs, so they pick up auto-polish via `resolveImage()`
- All admin API routes now use Supabase (rewritten from Prisma on 2026-06-26)
- Hero images: set per-category in **Admin → Spaces → Edit**. Landscape source recommended; Cloudinary handles responsive sizing. Portrait sources look wrong in the wide hero — outpaint to ~16:9 before uploading

**Design system**
- All buttons `rounded-full` (pill) — site-wide, intentional
- Glass header: `bg-gradient-to-b from-white/60 to-background/85 backdrop-blur-[32px]`
- Logo hover: lift + brighten (NOT opacity dimming)
- No particles, no transparent header, no dark-tech themes

### Known Issues

| Issue | Priority | Fix |
|---|---|---|
| **Reviews table RLS** — anon key cannot read or write reviews | Medium | Supabase dashboard → Table Editor → `reviews` → RLS → disable, or add anon read policy |
| **Homepage category card images** — showing SVG placeholders | High | Upload real photos to Cloudinary, update `IMAGES` in `app/(site)/page.tsx` |
| **Brand logos/hero images missing** for most brands | High | Admin → `/admin/brands/[id]` → URL import tab → paste image URL |
| **TypeScript build errors suppressed** — `ignoreBuildErrors: true` in `next.config.ts` | Low | Update pages using uppercase Prisma enums (e.g. `"PUBLISHED"`) to lowercase (Supabase returns lowercase) |
| **Supabase REST shape vs old Prisma shape** — REST returns timestamps as ISO **strings** (not `Date`) and enums **lowercase** (not uppercase). Root cause of the content-page `Invalid time value` crash and the brand-save enum error. | Medium | When porting code that assumed Prisma's shape: coerce dates with `new Date(value)` before formatting, and `.toUpperCase()` enums on load if the form/API contract expects uppercase. Fixed in the 4 admin list pages + brands edit; **still un-swept:** public brands page hardcodes `brandType="SOLUTION"`, homepage passes lowercase; `availabilityStatus` enum unchecked. |

---

## Pending Tasks (Priority Order)

1. **Upload brand logos** — all 15 brands via admin URL import
2. **Upload brand hero images** — Nolte, Mrida, key brands
3. **Homepage category card photos** — update `IMAGES` in `app/(site)/page.tsx`
4. **Mark featured content** — set `is_featured=true` in Supabase for brands + inspirations to appear on homepage
5. **Add inspiration content** — create inspirations via admin with real images
6. **Fix reviews RLS** — disable on `reviews` table in Supabase dashboard
7. **Populate showroom sections** — add floors/sections via admin
8. **Deploy to Vercel** — import `Mrigansh10/sumanglam-website`, add env vars, set domain

---

## Environment Variables

```
SUPABASE_ANON_KEY=...
NEXTAUTH_SECRET=...          # generate: openssl rand -base64 32
NEXTAUTH_URL=https://your-domain.com
ADMIN_EMAIL=admin@sumanglam.co
ADMIN_PASSWORD=sumanglam2024
CLOUDINARY_CLOUD_NAME=de9turgsy
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Database: Seeded Data

15 brands in DB: Nolte, Mrida, Bosch, Siemens, Liebherr, Blaupunkt, Häfele, Hettich, Blum, Yale, Godrej, Dorset, Brass Barony, Spitze, Everyday

Brand rules (non-negotiable):
- **Nolte** — kitchens only, never wardrobes
- **Mrida** — kitchens + wardrobes + interiors
- **Blaupunkt** is a child brand of **Hettich**
- **Häfele** appears in both Hardware and Appliances — intentional

---

## Session Log

### Session 1 — 2026-06-10 (Planning, in `showroom_website/`)
Documentation audit across all 16 source docs. Fixed discovery flow inconsistencies, removed Nolte wardrobes from PRD, added Wardrobes page definition, fixed DB schema gaps, synced project-vault. No code written yet.

### Session 2 — 2026-06-12 to 2026-06-19 (Build)
- Full Next.js project scaffolded
- Supabase project created and all tables migrated
- Discovered Prisma wire protocol blocked on home network → switched all runtime DB calls to Supabase REST
- All public pages built
- Admin dashboard built (overview, brands, inspirations, content, leads, reviews)
- Cloudinary image upload integrated
- Reviews system added (submission + Google Reviews integration)
- Header scroll-hide behaviour implemented (Framer Motion)
- 15 brands seeded

### Session 3 — 2026-06-26 (Admin API fix + GitHub migration)
- Supabase project was paused (vacation) — restored
- All admin API routes rewritten from Prisma to Supabase REST
- `framer-motion` installed (was imported but missing from package.json)
- GitHub repo transferred from `speedvibecode/sumanglam-website` to `Mrigansh10/sumanglam-website` with full history
- This HANDOFF.md created

### Session 4 — 2026-06-27/28 (Images + Spaces editor)
- **Cloudinary auto-polish** wired into `resolveImage()` — bare public IDs get `f_auto,q_auto:good` (+ `e_improve` when `enhance` set); committed c5b9038
- **Fixed admin content-page crash** (`Invalid time value`) — Supabase ISO-string timestamps; patched `formatDate` in content/consultations/leads/reviews pages (committed 12618e5)
- **Fixed brand-save enum error** — form sent lowercase from Supabase; normalize to uppercase on load in brands edit page (uncommitted)
- **Built Spaces admin editor** — set each category page's hero banner + intro copy from `/admin/spaces` (uncommitted; see top-of-file list)
- **Bumped hero source width** 1920→2560 in `page-hero.tsx` for sharper Retina rendering (uncommitted)
- **Photo workflow established** — AI-retouch phone photos via Gemini (locked v2 prompt), then Cloudinary serves them. "Realistic enough to read as a photograph, not a render" is the bar.

---

## Hard Rules (Do Not Violate)

- No ecommerce, checkout, user accounts, wishlists, quotation engine
- Nolte = kitchens only. Wardrobes = Mrida only, never a standalone catalog
- Inspiration before products in every discovery flow
- Mobile-first always
- No glassmorphism, neon, dark-tech themes, aggressive popups, heavy motion
- API response envelopes: `{ success: true, data }` / `{ success: false, error: { code, message } }`
- All buttons `rounded-full` — site-wide, non-negotiable
