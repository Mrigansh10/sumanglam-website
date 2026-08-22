---
layer: decision
date: 2026-07-04
status: standing
---

# Decision - Kitchen First Navigation

## Decision

**Kitchens lead everything.** Nav order puts Kitchens first on every surface, and the site's
local-SEO framing is kitchen-first with Jaipur intent.

Category structure is: **Kitchens + Appliances together · Wardrobes separate · Hardware
separate.**

## Why

Sumanglam is a **local marketing site for the showroom**, and modular kitchens are the business's
lead offering. The original IA treated the categories more evenly; reality is that kitchens are
what people search for and what the showroom floor is built around.

## What Changed (`e7ba294`)

* Nav order Kitchens-first everywhere — header, mega-menu, footer.
* **`/kitchens` now hosts the Appliances section** (built-in appliance categories).
* **`/hardware-appliances` became Hardware-only** — appliances removed, featured filtered to
  `type=hardware`, nav label changed to "Hardware".
* `/wardrobes` stays a separate top-level page (content owned by Mrida).
* Local-SEO titles and descriptions with Jaipur intent.
* Homepage tab title became brand-first and absolute:
  **"Sumanglam — Premium Modular Kitchens, Jaipur"**.
* `LocalBusiness` JSON-LD with the real address, geo and hours.

## Do Not "Fix" This

`/hardware-appliances` looking like it should contain appliances is **intentional**. The route
name is a legacy of the original spec; the content is deliberately Hardware-only.

## Linked Notes

* [[Navigation Structure]]
* [[Site Map]]
* [[Kitchens]]
* [[Hardware And Appliances]]
* [[Wardrobes]]
* [[Route Map]]
* [[SEO And Metadata]]

## Source Trace

`HANDOFF.md` Sessions 5 and 8; `components/layout/site-header.tsx`; `app/(site)/kitchens/`.
