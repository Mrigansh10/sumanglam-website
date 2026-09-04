---
layer: as-built
status: in-progress
updated: 2026-08-22
---

# Content And Asset State

> **This is where the project actually is.** The code is done; the work in front of us is
> content. Everything in [[As Built Overview|"what is blocking progress"]] resolves here.

## Imagery Strategy As Built

**3D renders are the primary medium** for the aspirational layer: homepage hero, page/category
heroes, inspiration galleries, brand cards and mega-menu cards. Real photography is reserved for
a **future "real projects / proof" section**. Reviews stay photo-less.

The renders are low-res (~1080px, ~150 KB, soft, JPEG-artifacted) with no source 3D files to
re-export. They are fixed **at delivery time** by Cloudinary `enhance: "render"` rather than by
manual processing — see [[Image Delivery Pipeline]].

## Renders Placed So Far

Session 8 clustered **44 renders** into **9 spaces** (7 kitchens, 2 walk-ins) via an approved
contact-sheet review, uploaded them as `sumanglam/inspirations/<slug>-<n>` (`-1` = cover), and
published **9 inspirations** (10 more drafted as placeholders). The homepage hero was set to a
**sage-green render**, and ~17 hardcoded placeholder SVGs were swapped out.

**Rule: never use the same image twice on one page.** Featured inspiration covers already appear
in the homepage grid, so the hero must be unique to it.

## Brand Heroes — 12 of 15 Live

| Status | Brands |
|---|---|
| ✅ Live | Bosch, Siemens, Hettich, Dorset (Session 9); Blum, Häfele, Yale, Liebherr, Everyday (Session 12); plus Nolte, Mrida and one more from the original seed |
| ⏳ Blocked | **Godrej, Spitze, Brass Barony** |

The three stragglers publish only packshots and title cards online, so they need **dealer asset
packs from brand reps**. Spitze and Everyday are sister brands under Maruti Interior Products —
one rep may cover both. Brass Barony has no web presence at all.

**Sourcing routes that worked** (documented so they don't need rediscovering):

* **Blum** — blum.com product DB; size is in the URL path, `/images/{w}/{h}/…`
* **Häfele** — hafele.com US. The India site is bot-walled to non-browser UAs but works with a
  Chrome UA string
* **Yale** — ASSA ABLOY Scene7: `gw-assets.assaabloy.com/is/image/assaabloy/<name>?wid=2560`.
  Asset names contain URL-encoded spaces and crop suffixes like `%201:16x9`
* **Liebherr** — `www-assets.liebherr.com`; drop the `_wNNN` suffix for the original
* **Everyday** — everyday-india.com slider

Pipeline for each: download → **Pillow LANCZOS upscale to ≥2048px** (dodges the gen_restore
guard) → Cloudinary `sumanglam/brands/<slug>-hero` → REST `PATCH hero_image` → pre-warm the URL.

## The 15 Brands

Nolte, Mrida, Bosch, Siemens, Liebherr, Blaupunkt, Häfele, Hettich, Blum, Yale, Godrej, Dorset,
Brass Barony, Spitze, Everyday.

**Non-negotiable brand rules:**

* **Nolte** — kitchens only, never wardrobes.
* **Mrida** — kitchens + wardrobes + interiors. Wardrobes belong to Mrida.
* **Blaupunkt** is a child brand of **Hettich**.
* **Häfele** appears in both Hardware and Appliances — intentional, not a duplicate.

## Outstanding Content Items

| Item | Waiting on |
|---|---|
| Larger, more varied render batch | User is arranging it. On arrival: cluster → contact sheet → approve → bulk upload → **pre-warm derivations** |
| `/wardrobes` hero | A wardrobe render, set via Admin → Spaces → wardrobe |
| Collections on `/inspiration` | Fill from the new render batch |
| 3 brand heroes | Dealer asset packs |
| Showroom photography | Real photos, then restore the page — [[Decision - Showroom Temporarily Offline]] |
| OG / social share image | Deliberately deferred until the render batch. A temporary 1200×630 `f_jpg` crop of the sage hero is in `lib/site.ts` |
| Favicon | **Placeholder** — a potrace-vectorized "S" from `sumanglam_logo.jpeg` on terracotta `#b96a57`. Replace when the original vector logo is found. Ships as `app/icon.svg` + `app/apple-icon.png` + a hand-built multi-size raster `app/favicon.ico` (16/32/48) that Google Search needs |
| About-page origin story | Still placeholder copy |
| Social profile URLs | For the `sameAs` array — [[SEO And Metadata]] |

## Copy Guardrails

**Never invent metrics or company history.** There are deliberately no years-in-business,
project counts, or client numbers anywhere on the site or in social copy.

Two claims are **unconfirmed and must not be used** until the user confirms:

1. The words **"authorized dealer"** or **"exclusive"** for Nolte — only wording the actual
   agreement permits.
2. Whether Sumanglam handles **installation / end-to-end execution**.

LinkedIn company-page copy (1,331 chars) and a 120-char tagline are written and approved,
waiting on the user to create the page. Full text is in `HANDOFF.md` Session 15.

## Real NAP (must match everywhere)

```
S-13, New Aatish Market, opp. Metro Pillar No. 48, Mansarovar, Jaipur, Rajasthan 302020
Mon–Sat, 10:30 AM – 8:00 PM (closed Sundays)
+91 94140 78298 · inquiries@sumanglam.co
```

This is the address in `lib/site.ts` and the JSON-LD — **it was never a placeholder**. Local
citations must use it verbatim.

## Google Business Profile

Cover photo should be a real, wide 16:9 full-kitchen showroom shot, no text or watermark,
≥1080×608, sized to a multiple of 48px. The user's phone photos of the renovated Nolte floor
were **rejected by GBP** — most likely a reverse-image match against Nolte's official imagery,
or Google's authenticity filter. Advice given: upload **untouched originals** (not run through
the Gemini retouch pipeline), from the Maps app, signed in as the owner, location on, retry
after a day.

## Linked Notes

* [[Image Delivery Pipeline]]
* [[Image Strategy]]
* [[Content Governance]]
* [[Product Brands]]
* [[Solution Brands]]
* [[Parent Brand Relationships]]
* [[SEO And Metadata]]

## Source Trace

`HANDOFF.md` Sessions 7–16, `lib/site.ts`, `app/` icon assets, and the live DB row counts.
