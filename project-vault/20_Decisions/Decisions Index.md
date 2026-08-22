---
layer: decision
status: index
updated: 2026-08-22
---

# Decisions Index

> Decisions of record — the "why is it like this?" layer. Each note states the decision, the
> reasoning, what it changed, and whether it is reversible. **Do not reverse one of these
> casually**; several look like bugs from the outside.

## Architecture

| Decision | Date | Reversible? |
|---|---|---|
| [[Decision - Supabase REST Over Prisma]] | 2026-06-19 | In principle — it's a network constraint |
| [[Decision - RLS Lockdown And Service Role]] | 2026-07-06 | No. Standing security posture |

## Scope

| Decision | Date | Reversible? |
|---|---|---|
| [[Decision - Release Focus Over Catalog Depth]] | 2026-07-02 | Only with a new stakeholder decision |
| [[Decision - Product Catalog Unpublished]] | 2026-07-04 | Yes — republish and restore links |
| [[Decision - Showroom Temporarily Offline]] | 2026-07-06 | **Yes, and intended to be** — needs real photos |

## Experience

| Decision | Date | Reversible? |
|---|---|---|
| [[Decision - Kitchen First Navigation]] | 2026-07-04 | No. Business positioning |
| [[Decision - Inspirations Are Visual Only]] | 2026-07-05 | No. Detail pages were deliberately removed |
| [[Decision - Renders As Primary Medium]] | 2026-07-03 | Softens as real photography arrives |
| [[Decision - Nolte As Aesthetic Reference]] | 2026-07-05 | No. Standing quality bar |

## Things That Look Like Bugs But Are Decisions

* `/hardware-appliances` contains **no appliances** — [[Decision - Kitchen First Navigation]]
* `/showroom` redirects to `/contact` — [[Decision - Showroom Temporarily Offline]]
* `/inspiration/[slug]` redirects to the listing — [[Decision - Inspirations Are Visual Only]]
* `/products` is empty — [[Decision - Product Catalog Unpublished]]
* The site shows **no reviews at all** — the table is genuinely empty, see [[Database - reviews]]
* Brand pages have no Catalog section — it renders conditionally on published products

## Earlier Decisions

Pre-launch implementation choices (package manager, colour tokens, fonts, enum values) live in
[[Implementation Decisions]]. Stack extensions live in
[[User Approved Stack Extension - Three GSAP Lenis]].

## Linked Notes

* [[As Built Overview]]
* [[Spec Vs Built]]
* [[Session Log]]
* [[Regression Traps Index]]

## Source Trace

Distilled from `HANDOFF.md` Sessions 2–16.
