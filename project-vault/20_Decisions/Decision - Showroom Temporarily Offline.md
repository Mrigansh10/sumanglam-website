---
layer: decision
date: 2026-07-06
status: temporary
---

# Decision - Showroom Temporarily Offline

## Decision

The `/showroom` surface is **temporarily offline**. Taken down on launch day at the user's
request because the placeholder imagery looked wrong on a live premium site.

## What Was Done (`49dd6fd`)

* `/showroom` → **307 temporary redirect to `/contact`** in `next.config.ts`.
* The "Showroom Experience" section removed from the homepage.
* Nav and footer entries removed.
* Showroom CTAs across the site repointed to `/contact`.

The full page remains in `app/(site)/showroom/page.tsx` **and its restore checklist is written
at the top of that file**. The complete original page is in git history.

## Important

* This is **temporary and reversible** — a 307, not a 308, on purpose.
* The **consultation flow was never coupled to the showroom page**, so booking was unaffected.
* `getShowroomSections()` / `showroom_sections` / the admin showroom routes all still exist and
  work.

## To Restore

1. Get real showroom photography from the user.
2. Populate showroom sections via the admin.
3. Follow the checklist in `app/(site)/showroom/page.tsx`.
4. Remove the redirect from `next.config.ts`, restore the homepage section and nav/footer
   entries, repoint CTAs.
5. Add `/showroom` back to `app/sitemap.ts` — **not before**.

Note that `frame-src https://www.google.com` is already in the CSP for the Maps embed.

## Linked Notes

* [[Showroom Experience]]
* [[Showroom Visit Intent]]
* [[Route Map]]
* [[Content And Asset State]]

## Source Trace

`HANDOFF.md` Session 11; `next.config.ts`; `app/(site)/showroom/page.tsx`.
