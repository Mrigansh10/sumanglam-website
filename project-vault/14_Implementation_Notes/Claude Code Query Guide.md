# Claude Code Query Guide

> **This vault is the context layer. Query it before scanning the codebase.**
> Folders `19_`–`22_` describe what actually runs; `01_`–`18_` describe what was specified.
> Where they disagree, [[Spec Vs Built]] decides.

## Read Order For Any Task

1. [[As Built Overview]] — the current state of every subsystem.
2. [[Regression Traps Index]] — **skim the section for the area you're touching.** Most of these
   fail silently.
3. [[Codebase Map]] — locate the files instead of grepping for them.
4. [[Global Rules]] and [[17_Forbidden_Things]] — the standing constraints.
5. The relevant as-built note ([[Route Map]], [[Data Access Layer]], [[Image Delivery Pipeline]],
   [[Motion System]], [[Security Posture]], [[Admin Surface]]).
6. The relevant spec note in `01_`–`18_` for intent and edge cases.
7. [[Decisions Index]] if something looks wrong — it may be deliberate.

`HANDOFF.md` at the repo root holds the live pending-task list and the full session narrative.
`PRODUCT.md` holds product positioning — **read it before asking product-context questions.**

## Fast Answers

| Question | Note |
|---|---|
| What does this URL render? | [[Route Map]] |
| Where does this code live? | [[Codebase Map]] |
| How do I query the DB? | [[Data Access Layer]] |
| Why is this page redirecting? | [[Decisions Index]] |
| What will break if I touch this? | [[Regression Traps Index]] |
| What content is still missing? | [[Content And Asset State]] |
| Is this spec note still true? | [[Spec Vs Built]] |

## Non-Negotiables Before Writing Code

* **Never** import `lib/db.ts` (Prisma) into a page, route or component — [[Data Access Layer]].
* **Never** import `lib/supabase.ts` into a client component.
* **Every REST insert** supplies `newId()` and `nowIso()` — [[Trap - No DB Defaults On Insert]].
* **Every joined select** names every field the component renders.
* **Don't add libraries.** The motion system is complete — [[Motion System]].
* New external origins need a CSP entry — [[Trap - CSP Blocks New External Origins]].
* All buttons `rounded-full`. Mobile-first. Inspiration before products.

## After Implementing

* Update the affected as-built note (`19_`–`22_`), not just the spec note.
* Record a new decision in `20_Decisions/` if you changed how something works.
* Add a trap note if something failed silently and cost you time.
* Update `HANDOFF.md` with a Session Log entry.

## Original Read Order (still valid for spec detail)

1. Read `project-vault/00_Index.md`.
2. Read `project-vault/13_Rules_And_Constraints/Global Rules.md`.
3. Read `project-vault/17_Forbidden_Things.md`.
4. Read the relevant page/screen note.
5. Read linked flow notes.
6. Read linked data/content/database/API notes.
7. Check `project-vault/15_Open_Questions.md`.
8. Check `project-vault/16_Conflicts.md`.
9. Only then propose files to edit.

## Before Editing Database Or API Code

1. Read the relevant database note.
2. Read linked domain/content model notes.
3. Read linked API/backend notes.
4. Check open questions/conflicts.
5. Do not change schema casually.
6. Update vault notes if implementation decisions resolve open questions.

## Before Editing UI

1. Read `project-vault/06_Design_System/Visual Style.md`.
2. Read `project-vault/06_Design_System/Typography.md`.
3. Read `project-vault/06_Design_System/Spacing Layout.md`.
4. Read `project-vault/06_Design_System/Interaction Patterns.md`.
5. Read `project-vault/05_UI_UX/Homepage UX Specification.md` if working on homepage.
6. Read the relevant page note and screen event flows.
7. Check forbidden patterns.
8. Preserve consistency with the design system.

## Before Using Three.js, GSAP ScrollTrigger, Or Lenis.js

1. Read `project-vault/12_Technical_Architecture/User Approved Stack Extension - Three GSAP Lenis.md`.
2. Read `project-vault/06_Design_System/Interaction Patterns.md`.
3. Confirm the effect supports premium storytelling.
4. Respect reduced-motion preferences.
5. Lazy-load heavy animation/3D where possible.
6. Verify mobile performance.

## Claude Code Working Rules

* Do not invent product requirements.
* Do not violate `12-dontdo.md` or derived forbidden rules.
* Do not build excluded V1 features.
* If a blocking open question appears, stop and report it.
* Keep changes small and reviewable.
* End with changed files, tests run, and remaining risks.

## Source Trace

Source files: `11-rules.md`, `12-dontdo.md`, `13-master-context.md`, `14-project-bootstrap.md`, user instruction on 2026-06-10.
