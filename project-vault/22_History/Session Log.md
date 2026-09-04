---
layer: history
status: index
updated: 2026-09-04
---

# Session Log

> A condensed index of the 16 build sessions. **The full narrative lives in `HANDOFF.md`** at
> the repo root — this note exists so the graph can trace *when* and *why* something was
> decided without duplicating 30 KB of prose.

## Timeline

| # | Date | What happened | Led to |
|---|---|---|---|
| 1 | 2026-06-10 | Documentation audit across all 16 source docs; vault created and synced. No code | This vault's `01_`–`18_` layer |
| 2 | 06-12 → 06-19 | Full build: Next.js scaffold, Supabase project + migrations, all public pages, admin dashboard, Cloudinary, reviews, 15 brands seeded. **Prisma wire protocol found blocked → switched to REST** | [[Decision - Supabase REST Over Prisma]], [[Trap - CSS Transition And Transform Same Render]] |
| 3 | 06-26 | Supabase unpaused; all admin API routes rewritten Prisma → REST; repo moved to `Mrigansh10`; `HANDOFF.md` created | [[Data Access Layer]] |
| 4 | 06-27/28 | Cloudinary auto-polish in `resolveImage()`; Spaces admin editor; hero width 1920→2560; first REST-shape crashes fixed | [[Image Delivery Pipeline]], [[Trap - REST Shape Dates And Enums]] |
| 5 | 06-28/29 | Mega-menu heroes, **category reorganisation**, upload fix, render pipeline | [[Decision - Kitchen First Navigation]] |
| 6 | 06-29 | Render pipeline committed; **homepage images moved into `site_settings`** | [[Admin Surface]] |
| 7 | 07-02 | Yale catalogue proof of concept (20 SKUs live); hardware heroes; **STRATEGIC PIVOT** | [[Decision - Release Focus Over Catalog Depth]] |
| 8 | 07-03/04 | **Full motion system** (6 commits); 44 renders placed into 9 inspirations; kitchen-first launch pass; 38 products → draft | [[Motion System]], [[Decision - Product Catalog Unpublished]], four motion traps |
| 9 | 07-04/05 | 4 brand heroes; **Nolte reference restyle → inspirations become visual-only** | [[Decision - Inspirations Are Visual Only]], [[Decision - Nolte As Aesthetic Reference]] |
| 10 | 07-05 | `/murphyscan` audit: timing-safe compare, login rate limit, 24h sessions, security headers, credentials rotated | [[Security Posture]] |
| 10b | 07-05 | **Full CSP**; `ignoreBuildErrors` removed (~132 TS errors fixed, 2 real enum bugs found); RLS groundwork | [[Trap - CSP Blocks New External Origins]] |
| 10c | 07-06 | **RLS lockdown executed** on all 19 tables; anon key verified inert | [[Decision - RLS Lockdown And Service Role]] |
| 11 | 07-06 | 🚀 **LAUNCH DAY.** Vercel + sumanglam.co. Showroom taken offline. **Consultation booking fixed — it had never worked** | [[Production Deployment]], [[Decision - Showroom Temporarily Offline]], [[Trap - No DB Defaults On Insert]], [[Trap - Joined Selects Must Fetch Rendered Fields]] |
| 12 | 07-07 | 5 more brand heroes (12/15); **on-site SEO complete**; favicon shipped; DNS triage (no defect) | [[SEO And Metadata]], [[Content And Asset State]] |
| 13 | 07-08/09 | `_prisma_migrations` RLS gap closed; raster favicon for Google; **admin credentials rotated**; GBP advice | [[Trap - Stale Supabase Advisor Emails]], [[Trap - Vercel Env Quotes And Redeploy]] |
| 14 | 07-23 | Admin **delete** for leads and consultations, with the unmount-cancels-submit fix | [[Trap - Unmounting A Server Action Form]] |
| 15 | 08-05 → 08-10 | Docs and tooling only: `PRODUCT.md` written, higgsfield skills, LinkedIn copy, Ideogram MCP added | [[Content And Asset State]] |
| 16 | 08-12 | Ideogram OAuth completed; **`reviews` and `leads` confirmed at 0 rows**; handoff committed | [[Data Access Layer]] |

## Commit Landmarks

| Commit | What |
|---|---|
| `e7ba294` | Kitchen-first launch pass. Attribution switches to **Mrigansh10** from here on |
| `62677e2` → `9490616` | The motion system (6 commits) |
| `0f95f57` | Inspirations become visual-only |
| `49dd6fd` | Showroom offline |
| `4e744a4` | `lib/ids.ts` — the insert fix that unbroke consultation booking |
| `8452004` / `69ec5a2` | Favicon (SVG, then the raster `.ico` Google needs) |
| `2554f0e` | **Current production commit.** No app code has changed since 2026-07-23 |

## Shape Of The Work

* **Sessions 1–9:** build and content.
* **Sessions 10–13:** harden, launch, stabilise.
* **Sessions 14–16:** small features, then docs and tooling only.

The pattern since launch is that **the codebase is done and the bottleneck is content**. See
[[Content And Asset State]].

## Linked Notes

* [[As Built Overview]]
* [[Spec Vs Built]]
* [[Regression Traps Index]]
* [[Implementation Decisions]]

## Source Trace

Condensed from `HANDOFF.md` Session Log (2026-08-12) and `git log`.

## Session 18 — 2026-09-04

**Commit:** `993da44` — first app-code change since `2554f0e` (2026-07-23).

Opened as V2 kickoff / complete design redo; two production problems surfaced first.

* **Fabricated reviews found live.** `data/google-reviews.json` had shipped with 10 invented
  testimonials and an invented "4.6 ★ · 156 reviews" aggregate, badged Google, live since
  launch. `lastScraped: null` proved the scraper never ran. Produced
  [[Trap - Seed Data Shipped As Real Content]]. **Still live — needs an interactive scrape.**
* **NAP corrected to match the Google Business Profile** — address, pincode `302019` →
  `302020`, and the JSON-LD geo longitude (the old value was the Maps viewport centre, ~250m
  off). Added the GBP office number; `phoneSecondary` had never been rendered anywhere.
* **Review scraper rewritten** — persistent sign-in profile, full-list capture, and it now
  refuses to write on a zero capture.
* **Design audit of production** — the homepage is five consecutive uniform card grids;
  mobile is 24,164px tall. Tokens are good. The ceiling is imagery, not layout.

* **Reviews fixed the same session** (`38c7bfb`) — real profile scraped, 4.6 ★ / 84 reviews,
  8 curated of 38 published verbatim. Surfaced two positioning facts: the genuine reviews read
  as a *hardware store*, and three 1-star reviews are public on Google.
* **V2 design redo opened (direction NOT locked).** Kitchens + Wardrobes carry the purpose,
  Hardware stays a main nav section. Ran the `impeccable` redesign flow: **only the colour
  palette survives** — Fraunces/Inter, `rounded-full`, and the frozen motion system are all
  released, and **Nolte is no longer the aesthetic bar** (they may build their own Jaipur
  site, so Mrida is the differentiator that stays ours). Thesis: *designed around YOUR home*.
  Two rolls: `2541ca42` → The Jali (re-rolled: too traditional-Indian for a modern modular
  product), `59f6e538` → The Sorted Drawer (a type case; each cell sized to what it holds —
  the jali's logic without the ornament). **Chosen in a text-only round and explicitly not
  locked**: every image-generation route is out of quota, and the user wants to see all
  options visualized first. No `DESIGN.md`, no direction contract, no build.
