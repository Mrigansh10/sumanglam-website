# DESIGN.md — Sumanglam V2

**Status: design phase, in progress. Last updated 2026-09-05.**

> # ⚠️ THE DIRECTION IS NOT LOCKED
>
> Nothing in this file is a decision. It records **where the V2 design phase stands** — the thesis,
> what survives from V1, what has been released, which concept directions are on the table, and how
> the choice will be made.
>
> **It is deliberately not a design system.** There are no tokens, no type scale, no component
> specs, because those get derived from a shipped artifact, not written ahead of one. Writing them
> now would lock the direction from prose, which is exactly the failure the standing instruction
> exists to prevent:
>
> *"Don't lock in the design profile, I still need to visualize all the options before choosing one."*
>
> **Before anything locks:** the options get rendered as images and chosen from images.

Companion documents: `PRODUCT.md` (positioning), `HANDOFF.md` (session-by-session state),
`project-vault/` (the documentation vault), and
[the Inspiration Library](project-vault/23_Inspiration_Library/Inspiration%20Library%20Index.md)
(hand-picked visual references, being built now).

---

## 1. What V2 is

A **complete redo** of the visual design of a site that is already live at https://sumanglam.co.
Not a refresh — a replacement of the visual world.

The structure barely moves. **Kitchens and Wardrobes carry the purpose and the aesthetic; Hardware
stays a main navigation section** — explicitly not demoted. The emphasis changes, the information
architecture does not. The reasoning: the site's job is the design-led kitchens and wardrobes
business. The walk-in hardware trade doesn't need a website, but it is real revenue and stays
visible.

## 2. The thesis

> **Designed around YOUR home.**

Personal, made-to-measure, **Mrida-led**. The claim is that the kitchen is planned around this
house, this family, this wall — not selected from a range.

Two alternatives were considered and rejected:

* **The Nolte-authority angle** — "we carry the German brand." Rejected: it borrows someone else's
  credibility and Nolte may commission their own Jaipur site.
* **The one-roof angle** — "kitchens, wardrobes, hardware, appliances, all in one place." Rejected:
  it is the hardware-store framing, and the business already reads that way to customers.

That second point is worth stating plainly, because it is the hardest problem in the brief. The
**real Google reviews** — 4.6★ from 84 reviews, scraped 2026-09-04 — describe Sumanglam as a
hardware store: *"Best hardware"*, *"Big Hettich dealer"*, *"wholesale and retail"*, *"ply, mica"*.
Customers describe the business the way the site is trying not to. The design has to carry a claim
the reviews don't yet support, without inventing anything.

## 3. What survives from V1

**The colour palette. That is the entire list.**

| Token | Hex | Role |
|---|---|---|
| Ivory | `#faf8f5` | Ground |
| Charcoal | `#221d17` | Ink |
| Bronze | `#9a7945` | Accent |
| Sand | `#e5dfd4` | Secondary surface, rules |

## 4. What has been released

These were binding constraints under V1. **They no longer bind the redo.**

* **Fraunces + Inter.** The typeface pairing is open. Note both sit on the craft floor's
  over-used-defaults list. `next/font/google` self-hosts, so a Google-hosted face still satisfies
  the sourcing requirement.
* **`rounded-full` on all buttons.** `PRODUCT.md` calls this "site-wide, non-negotiable" and
  `AGENTS.md` repeats it. **Superseded for V2.** Both documents still carry the old wording.
* **The Framer Motion system.** Shipped, documented as "complete and frozen" in
  `project-vault/19_As_Built/Motion System.md`. **Unfrozen.** Three.js, GSAP with ScrollTrigger,
  and Lenis remain user-approved and unused.
* **Nolte as the aesthetic bar.** `project-vault/20_Decisions/Decision - Nolte As Aesthetic
  Reference.md` is **superseded**. The reasoning is strategic, not aesthetic: Nolte may launch
  their own Jaipur site, so the identity must not lean on theirs. **Mrida is the differentiator
  that stays ours.**

## 5. Why V1 is being replaced

From a production audit of the live site at 1440px and 390px (2026-09-04):

* **Five consecutive uniform card grids after the hero** — roughly fifteen near-identical cards.
  The page has one shape and repeats it until it ends.
* **Flat type hierarchy** — too little distance between the largest and smallest type for any
  section to feel more important than another.
* **A 24,164px-tall mobile homepage.** Mobile is the priority surface and it is the worst one.
* The floating header pill **overlaps the hero headline** at scroll-top.
* A **"Leave a review" form on the homepage**, asking for reviews from people who have not bought
  anything. A deletion candidate, not a redesign candidate.

The site also contradicts its own former reference — Nolte's site uses mixed ratios and editorial
asymmetry — and breaks the vault's own "avoid uniform grids" rule.

**The real ceiling is imagery**, and no visual direction fixes it: nine published inspirations,
low-resolution 3D renders, visually similar to each other. See
`project-vault/19_As_Built/Content And Asset State.md`.

## 6. The craft floor — binding on the redo

Hard constraints from the impeccable skill, which kill patterns V1 uses everywhere:

* **No eyebrow/kicker labels above headings.** V1 uses them on nearly every section.
* **No section numbers** (01 / 02 / 03). V1's "why us" block uses them.
* **No grids of same-size icon + heading + text cards used as page structure.** This is V1's core
  problem, stated as a rule.
* Display face must be sourced to match the chosen world.
* Theme the browser surfaces — selection, caret, scrollbar, focus ring.
* Body measure **65–75ch**; display maximum **6rem**; tracking floor **−0.04em**.

Standing project rules that continue to apply unchanged: mobile-first; no ecommerce, checkout,
accounts, wishlists, or quotation engine; no glassmorphism, neon, dark-tech, aggressive popups, or
heavy motion; inspiration before products in every discovery flow; Nolte is kitchens-only;
wardrobes belong to Mrida; never invent metrics, company history, or the words "authorized dealer".

One more, from an explicit correction: **modern modular, not traditional-Indian.** The product is
modern. A heritage-Indian rendering was tried and rejected.

## 7. Candidate directions — none chosen

Two concept rounds were run through the impeccable skill. Both are recorded; neither is decided.

### Round 1 — seed `2541ca42`

**Assigned: The Jali** — Jaipur's pierced stone screens. A field of apertures, each opening framing
a glimpse. Five sketches were generated and live in `.impeccable/sketches/`
(`assigned.webp`, `challenger-assembly.webp`, `challenger-map.webp`, `challenger-coil.webp`,
`canon.webp`).

**Re-rolled at the user's request.** The jali's *logic* was liked; the rendering read "heavily
skewed towards traditional Indian design", and the actual orders are modern modular. The steer was
to take the same idea "in a bit broader sense".

Challengers dealt and retired with it: **Assembly Instructions**, **Guide Map**, **Coiled Earth**.

### Round 2 — seed `59f6e538` — **text-only, no sketches**

**Assigned: The Sorted Drawer** — the compositor's type case. A field of compartments where **each
cell is sized to exactly what it holds**: the jali's cell logic stripped of heritage ornament. It
is literally a drawer insert, so it is true to the Blum and Hettich organisers the business
actually sells.

Challengers:

* **The Archive Wall** — stacked labelled boxes, contents named on the face.
* **The Calibrated Rail** — instrument emission-line plates; content positioned against a
  measured scale.
* **The Tabla** — the lotería card grid; a field of named, illustrated tiles.

Also retired in this round: 16mm film, teletext, and a fluorescent tech spread.

> **Round 2 was decided on prose alone**, because image generation was exhausted. That is precisely
> why it is not locked.

## 8. How the direction gets chosen

**Choice happens on images. Not on descriptions, not on this file.**

The pipeline being built now:

1. **Hand-picked references.** The user browses and screenshots real sites from across the internet
   into the inbox at `web design inspirations/`.
2. **The Inspiration Library.** Each capture is catalogued, tagged on five facets, and clubbed onto
   boards inside the vault at `project-vault/23_Inspiration_Library/`. `Board - Visual Worlds` is
   the board the direction gets chosen from — by noticing which pile is returned to, not by
   reasoning about it.
3. **Visual comps** of the surviving options at **1440px and 390px**.
4. **The choice**, made against those comps.
5. *Then* the direction contract, and only then does this file gain a design system.

### Generation capacity — the constraint that shaped this

All three image routes were dry as of 2026-09-04:

| Route | State |
|---|---|
| Ideogram MCP | `MCP_DAILY_LIMIT` after 5 images. Free/Basic tier, small daily cap, bulk needs Pro |
| higgsfield CLI | Authenticated, **free plan, 0 credits** |
| `generate-image.mjs` | Needs `OPENAI_API_KEY`, not set |

**Fallback:** build the comps as **real coded HTML** at the target breakpoints and screenshot them
(Playwright is already a dependency). For a website this is arguably better than generated
pictures — it is the actual medium. The known cost: it **biases toward what is easy to code**, so
if it is used, push past what is comfortable to build.

## 9. Design system

**Empty on purpose.** Fills in once a direction is locked and built, derived from the shipped
artifact rather than from intentions: type scale and chosen faces, spacing system, component
inventory, motion rules, and the token set that replaces the V1 CSS variables.

---

## Known documentation drift

Flagged, not silently repaired — fixing doc drift as a side effect of a design task is out of scope,
and these are worth a deliberate pass:

* **`PRODUCT.md`** still asserts `rounded-full` is non-negotiable, still names nolte-kuechen.com as
  the aesthetic bar, and still says a "Test User" review needs removing — the reviews table has
  been empty since before 2026-08-12.
* **`AGENTS.md`** still carries "All buttons `rounded-full`" and "The motion system is complete and
  frozen".
* **`project-vault/20_Decisions/Decision - Nolte As Aesthetic Reference.md`** is superseded and not
  yet marked as such.

All three describe V1 correctly. They are wrong only about V2, and should be updated when the
direction locks — not before, or they will need updating twice.
