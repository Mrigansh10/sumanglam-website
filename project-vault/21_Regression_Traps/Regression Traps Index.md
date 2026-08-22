---
layer: trap
status: index
updated: 2026-08-22
---

# Regression Traps Index

> Every entry here cost real debugging time at least once. **Skim the relevant section before
> editing that area** — most of these fail silently or look like a different problem entirely.

## Data Layer

| Trap | Symptom |
|---|---|
| [[Trap - No DB Defaults On Insert]] | Inserts fail; forms say "something went wrong" or fail silently |
| [[Trap - REST Shape Dates And Enums]] | `Invalid time value`; enum badges never match; fields read `undefined` |
| [[Trap - Joined Selects Must Fetch Rendered Fields]] | 500 the moment the first row exists |

## Images

| Trap | Symptom |
|---|---|
| [[Trap - Cloudinary Upscale 4.2MP Limit]] | Blank `<img>` on large sources |
| [[Trap - Gen Restore Repaints Real Photos]] | Photo loads but details/logos/text are subtly wrong |
| [[Trap - Gen Restore Cold Derivation Timeout]] | 504 on first view after an upload |

## Motion And React

| Trap | Symptom |
|---|---|
| [[Trap - Unmounting A Server Action Form]] | Delete button does nothing, no error |
| [[Trap - Fixed Elements Inside Template]] | Header/footer/WhatsApp drift on navigation |
| [[Trap - SplitHeadline Descender Clipping]] | Descenders clipped in headline reveals |
| [[Trap - Parallax And Ken Burns Transform Conflict]] | Jittery or dead hero animation |
| [[Trap - CSS Transition And Transform Same Render]] | Hide/reveal timings appear swapped |

## Security And Deployment

| Trap | Symptom |
|---|---|
| [[Trap - Vercel Env Quotes And Redeploy]] | Can't log in to admin after an env change |
| [[Trap - CSP Blocks New External Origins]] | New embed/script/image silently doesn't load |
| [[Trap - Stale Supabase Advisor Emails]] | Alarming "Action required" email about an already-fixed issue |

## Tooling

| Trap | Symptom |
|---|---|
| [[Trap - Stale Dev Build Cache]] | Page renders completely unstyled in dev |

## Two Meta-Lessons

1. **A write path that has never been exercised is not a working write path.** Consultation
   booking was broken in production for weeks with nobody noticing, because `leads` was empty
   so there was no downstream signal. `reviews` and `leads` are **still at 0 rows** — any code
   reading them is effectively untested.
2. **Silent failure is this project's default failure mode.** Cancelled submits, repainted
   images, blocked scripts, unfetched join fields — almost nothing here throws. Verify by
   observation, not by absence of errors.

## Linked Notes

* [[As Built Overview]]
* [[Codebase Map]]
* [[Quality Bar]]
* [[Forbidden Patterns]]

## Source Trace

Distilled from `HANDOFF.md` Sessions 2–16 and the code comments that record each fix.
