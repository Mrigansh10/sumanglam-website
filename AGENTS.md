# Agent Instructions

This project has a documentation vault at `project-vault/`. **Query the vault before scanning
the codebase** — it is maintained specifically so you don't have to re-derive context from
source files every session.

## The vault has two layers

* **Reality** — `19_As_Built/`, `20_Decisions/`, `21_Regression_Traps/`, `22_History/`.
  What actually runs in production.
* **Intent** — `01_`–`18_`. What was specified in June 2026 from the original source documents.

**Where the two disagree, reality wins.** `project-vault/19_As_Built/Spec Vs Built.md` is the
divergence table.

## Read order before implementing anything

1. `project-vault/00_Index.md`
2. `project-vault/19_As_Built/As Built Overview.md`
3. `project-vault/21_Regression_Traps/Regression Traps Index.md` — **skim the section for the
   area you're touching.** Most of these failure modes are silent.
4. `project-vault/19_As_Built/Codebase Map.md` — locate files instead of grepping
5. `project-vault/13_Rules_And_Constraints/Global Rules.md`
6. `project-vault/17_Forbidden_Things.md`
7. The relevant as-built note (Route Map, Data Access Layer, Image Delivery Pipeline, Motion
   System, Security Posture, Admin Surface)
8. The relevant page/flow/data/API/design spec note
9. `project-vault/20_Decisions/Decisions Index.md` if something looks broken — it may be
   deliberate
10. `project-vault/15_Open_Questions.md` and `16_Conflicts.md`

Also at the repo root: **`HANDOFF.md`** (live pending tasks + full session narrative) and
**`PRODUCT.md`** (product positioning — read it before asking product-context questions).

## Hard constraints

* Runtime data access is **Supabase REST**, never Prisma. Prisma is schema + migrations only.
* Every REST insert supplies `newId()` and `nowIso()` from `lib/ids.ts`.
* Every joined `.select()` names every field the component renders.
* Never import `lib/supabase.ts` into a client component.
* Don't add libraries. The motion system is complete and frozen.
* New external origins need a CSP entry in `next.config.ts`.
* Nolte is kitchens-only. Wardrobes belong to Mrida. Inspiration comes before products.
* Mobile-first. All buttons `rounded-full`.
* Never invent metrics, company history, or the words "authorized dealer" for Nolte.
* Treat `three`, `gsap` with `ScrollTrigger`, and `lenis` as user-approved stack additions.

## Rules

* Do not invent product requirements.
* Do not violate `12-dontdo.md` or derived forbidden rules.
* If an open question blocks implementation, stop and report it.
* Keep changes scoped to the requested feature.
* Prefer small, reviewable changes.
* End every coding task with changed files, tests run, and remaining risks.

## After shipping

* Update the affected **as-built** note, not just the spec note.
* Add a decision note to `20_Decisions/` if you changed how something works.
* Add a trap note to `21_Regression_Traps/` if something failed silently and cost you time.
* Add a Session Log entry to `HANDOFF.md` and to
  `project-vault/22_History/Session Log.md`.
