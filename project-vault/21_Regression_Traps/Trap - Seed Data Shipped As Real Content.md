---
layer: trap
status: resolved
updated: 2026-09-04
---

# Trap — Seed Data Shipped As Real Content

## Symptom

The site displays content that looks real, is presented as verified, and nobody
questions — because it renders correctly and has been there since launch.

## What Happened

`data/google-reviews.json` shipped with **10 fabricated testimonials** and an invented
**"4.6 ★ · 156 reviews on Google"** aggregate. It was committed once in `71bc191` as seed
content and went live at launch on 2026-07-06. It was still live on **2026-09-04**, nearly
two months, badged "Google" on the homepage next to a "Write a Google review" link.

Three separate things hid it:

1. **`scripts/scrape-google-reviews.ts` was never run.** It required an interactive Google
   sign-in and an ENTER keypress, and every session that might have run it was unattended.
   The `lastScraped: null` field in the JSON was the tell — the script sets a real ISO
   timestamp whenever it completes — and nobody read it.
2. **The vault recorded the wrong conclusion.** The `reviews` **table** is empty, so
   [[Content And Asset State]] and the Session 16 log concluded "the site renders no reviews
   at all." But the homepage reviews block reads the **static JSON**, not the table. The
   correct observation produced a false conclusion because nobody checked which source the
   component actually used.
3. **`PRODUCT.md` asserted it was genuine** — "Google reviews: genuine, from the real Google
   Business Profile" — which made it look already-verified to every later reader.

Found by screenshotting production and noticing reviews rendering while the database said
zero rows.

## Resolved

**2026-09-04, `38c7bfb`.** Scraped the real profile: **4.6 from 84 reviews**, 38 with text.
Eight curated reviews now render, verbatim. The fabricated "156" is gone — note the 4.6 was
accidentally correct, which is exactly what made the rest look plausible.

Two scraper bugs had to be fixed before it could run at all, both of which had made the
"just run the script" fix look easy and quietly fail:

* The **interactive ENTER prompt** defeated the script whenever `stdin` wasn't a TTY —
  backgrounded, piped, or agent-run, `readline` hit EOF and the run ended before scraping.
  Replaced with DOM polling; no keypress needed.
* **`page.evaluate()` cannot contain named inner functions** under tsx. esbuild rewrites
  `const pick = () => {}` into a `__name(...)` call for stack-trace names, and that helper
  doesn't exist in the browser context — the run died with `__name is not defined` *after*
  loading all 500 review cards.

## Why It Matters

This is the failure mode with the worst blast radius in the project. Fabricated testimonials
attributed to a real platform on a live commercial site violate the project's own
first principle (*"never invent metrics… no invented proof"*), and unlike a visual bug there
is no symptom to notice — it looks like the feature working.

## The Rule

* **A script that writes output must refuse to write when it captured nothing.** The old
  scraper would happily have written an empty file over the live one. It now exits non-zero
  and writes nothing on a zero capture.
* **Seed content must be self-identifying.** A `lastScraped: null`, a `seed: true` flag, or a
  loud placeholder string — something that fails a grep, not something that renders cleanly.
* **Trace the component to its actual data source before concluding anything about what
  renders.** An empty table does not mean an empty section.
* **Never restate an unverified claim as fact in a doc.** `PRODUCT.md` laundered a guess into
  a confirmed statement, and every later reader inherited it.

## Related

* [[Trap - Vercel Env Quotes And Redeploy]] — the other "looks fine, isn't" deployment trap
* [[Content And Asset State]]
* [[Regression Traps Index]] — see meta-lesson 2, silent failure
* [[SEO And Metadata]]

## Source Trace

Discovered 2026-09-04 by comparing a production screenshot against live DB row counts;
`data/google-reviews.json`, `server/google-reviews.ts`, `scripts/scrape-google-reviews.ts`.
