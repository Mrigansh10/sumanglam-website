---
layer: decision
date: 2026-07-02
status: standing
---

# Decision - Release Focus Over Catalog Depth

## Decision

**Stop building the detailed per-product hardware catalog.** Focus instead on: photos,
page beautification, animations, and shipping for release.

## Why

Going product-by-product and vendor-by-vendor — the way the Yale Smart Door Locks import went —
would require **massively scaling up the content operation**, which the business does not need
right now. Decided after a stakeholder discussion at the end of Session 7.

## What This Changed

| Before | After |
|---|---|
| Import more vendor catalogues | **Paused.** `scripts/yale-catalogue/` is kept as a reusable pipeline for if/when scale-up is chosen |
| Build a general catalogue-import CLI or admin UI | **Not started.** Options were weighed and parked |
| Deepen product data | All 38 products moved to `draft` — [[Decision - Product Catalog Unpublished]] |

The Yale Smart Door Locks import (20 products, full specs, real imagery) **stays live as a
working proof of concept**. Do not delete it; do not extend it.

## Status Of The Four Release Goals

1. **Put up the photos** — partly done (44 renders placed, 12/15 brand heroes). Blocked on the
   next render batch. See [[Content And Asset State]].
2. **Beautify the pages** — done.
3. **Animations** — done and frozen. See [[Motion System]].
4. **Complete and ship** — **done: launched 2026-07-06.** See [[Production Deployment]].

## Do Not Resume Without A New Decision

Importing more Yale or other vendor product categories.

## Linked Notes

* [[As Built Overview]]
* [[Decision - Product Catalog Unpublished]]
* [[MVP Scope]]

## Source Trace

`HANDOFF.md` "Current Direction" header and Session 7.
