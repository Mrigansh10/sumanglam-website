---
layer: as-built
status: on-site complete
updated: 2026-08-22
---

# SEO And Metadata

> **On-site SEO is COMPLETE as of 2026-07-07.** Everything remaining is off-site and user-run.

## Structured Data

`app/(site)/layout.tsx` emits a JSON-LD `@graph` containing:

* a **`WebSite`** node — drives the "Sumanglam" site-name association in search results;
* a **`HomeGoodsStore`** node with the **real NAP**, geo coordinates and opening hours (see
  [[Content And Asset State]] — the address was never a placeholder).

`sameAs` is present but **empty pending social profile URLs**. When the LinkedIn / Instagram /
Facebook pages go live, collect the URLs and add them to the `sameAs` array on both nodes.

## Sitemap And Robots

`app/sitemap.ts` is deliberately **honest** — it lists only URLs that actually render:

`/`, `/inspiration`, `/kitchens`, `/wardrobes`, `/hardware-appliances`, `/brands`, `/nolte`,
`/mrida`, `/about`, `/contact`, `/architects-designers`, `/book-consultation`, plus brand
detail pages.

Removed on purpose: inspiration **detail** URLs (now real 308s), `/products`, `/showroom`.
Do not add URLs back to the sitemap while their routes redirect or render empty.

`app/robots.ts` allows crawling, including `/favicon.ico`.

## Titles And Intent

Local-search intent titles with **Jaipur** intent throughout. The homepage title is
brand-first and absolute: **"Sumanglam — Premium Modular Kitchens, Jaipur"**. Intent titles
also shipped for wardrobes, hardware and inspiration. `og:locale` is `en_IN`.

## Favicon

Google Search showed a generic globe because the site originally shipped an **SVG-only**
favicon and `/favicon.ico` 404'd — Google's favicon fetcher probes `/favicon.ico` and wants
raster at 48px multiples.

Fixed (`69ec5a2`, deployed and verified): a hand-built multi-size raster `app/favicon.ico`
(16/32/48, rasterized from `app/icon.svg` via `sharp`) alongside the SVG for browsers.
Post-deploy re-verified: `/favicon.ico` 200, robots allows it, both Googlebot and the Google
Favicon crawler UA fetch 200.

> **Our end is airtight.** The remaining wait is purely Google's Search-favicon refresh cadence
> — days to weeks for a new domain, and it cannot be forced. The only nudge is Search Console →
> URL Inspection → **Request Indexing**. If it's still a globe after 2–3 weeks, re-check, but
> don't assume a defect.

The mark itself is still a **placeholder** (traced "S") — see [[Content And Asset State]].

## Off-Site SEO — User-Run, Ongoing

All remaining levers are outside the codebase:

1. **Social profiles** → bios pointing at sumanglam.co, then hand the handles over for `sameAs`.
2. **Google Business Profile** — posts and photos cadence. Already linked to the site; sitemap
   is submitted to Search Console.
3. **Local citations** — JustDial, Sulekha, Houzz India — with the **exact same NAP** as the
   JSON-LD, character for character.
4. **Brand rep listings** — ask Nolte and Häfele to list the sumanglam.co URL on their
   dealer-locator pages.

## Analytics

GA4 via an inline snippet (allowlisted in the CSP). `lib/analytics.ts` holds event helpers;
`components/shared/page-view-tracker.tsx` fires page views. Event capture endpoints:
`POST /api/v1/events` and `POST /api/v1/events/whatsapp-click`.

## Linked Notes

* [[Performance SEO Security]]
* [[Production Deployment]]
* [[Content And Asset State]]
* [[API - Analytics Events]]
* [[API - WhatsApp Tracking]]
* [[Route Map]]

## Source Trace

`app/(site)/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `lib/analytics.ts`,
`next.config.ts` read 2026-08-22; history from `HANDOFF.md` Sessions 12–13.
