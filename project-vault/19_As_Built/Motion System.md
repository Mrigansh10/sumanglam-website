---
layer: as-built
status: complete
updated: 2026-08-22
---

# Motion System

> **Shipped and complete** (Session 8, 2026-07-03/04, commits `62677e2`→`9490616`). Treat it
> as finished. Do not add animation libraries; do not rebuild these primitives.

## Primitives — `components/motion/`

All are `"use client"` and all respect `useReducedMotion()`.

| Component | What it does | Watch out for |
|---|---|---|
| `SplitHeadline` | Masked word-by-word headline reveal | Masks are padded `0.2em` / `-0.2em` so descenders (g, y, p) don't clip. **Do not tighten** — see [[Trap - SplitHeadline Descender Clipping]] |
| `Stagger` | Single-trigger grid cascade, used sitewide for card grids | One trigger per grid, not per card |
| `Reveal` | Fade + rise on scroll into view (`delay`, `y` props) | The general-purpose workhorse |
| `Parallax` | Scroll-linked translate (`amount` prop, default 10) | **Never put a CSS transform on the same element** — see [[Trap - Parallax And Ken Burns Transform Conflict]] |
| `DrawRule` | The gold accent dash that draws in under every `Heading` eyebrow | Part of the design system, not decoration |
| `FadeInImage` | Card image load-in | Wraps `next/image` |
| `HeroAmbient` | Ambient hero motion layer | |
| `SmoothScroll` | Lenis wrapper | |

## Page Transitions

`app/(site)/template.tsx` — an **enter-only** fade + 14px rise, 0.45s,
`cubic-bezier(0.22, 1, 0.36, 1)`. `template.tsx` remounts per navigation (unlike `layout.tsx`),
which is what makes it replay.

Three deliberate properties, all documented in the file:

* **Enter-only.** True exit animations on the App Router need the fragile "frozen router" hack
  and break scroll restoration. Not doing it.
* **`searchParams`-only changes don't remount**, so filter/pagination browsing doesn't replay
  the fade.
* **Header, footer, and the floating WhatsApp button live in `layout.tsx`, outside this
  wrapper.** An ancestor transform re-anchors `position: fixed`. See
  [[Trap - Fixed Elements Inside Template]].

## Header Motion — `components/layout/site-header.tsx`

Floating glass pill: `fixed left-12 right-12 top-3 z-50`, background
`bg-gradient-to-b from-white/60 to-background/85 backdrop-blur-[32px]`.

**Hide-on-scroll:** hides after 100px of downward scroll, 5px jitter tolerance.

* Hide: 850ms `cubic-bezier(0.65, 0, 0.35, 1)`
* Reveal: 400ms `cubic-bezier(0, 0, 0.2, 1)`

Implemented with Framer Motion `animate`/`transition` props, **not CSS transitions** — browsers
apply the *old* transition value when `transition` and `transform` change in the same render,
which made hide and reveal appear swapped. See
[[Trap - CSS Transition And Transform Same Render]].

Mega-menu panels use `AnimatePresence`. Footer uses a stagger. Buttons have an icon nudge on
hover. Logo hover is **lift + brighten**, never opacity dimming.

## PageHero Entrance

`components/shared/page-hero.tsx` runs a staged entrance with a Ken Burns drift. The Ken Burns
transform lives on **its own layer inside** `Parallax` — a CSS transform must never share an
element with GSAP's.

## The Approved Stack

`framer-motion` (primary), plus `gsap` (with ScrollTrigger), `lenis`, and `three` — all
user-approved additions beyond the original architecture docs. See
[[User Approved Stack Extension - Three GSAP Lenis]]. In practice the shipped motion system is
overwhelmingly Framer Motion; GSAP/Lenis/Three are present but lightly used.

## Constraints That Still Bind

* Subtle only. No aggressive motion, no auto-playing disruptive media.
* Respect `prefers-reduced-motion` — every primitive already does; new ones must too.
* No particles, no transparent header, no dark-tech themes, no glassmorphism beyond the
  existing header treatment.
* All buttons `rounded-full`, site-wide, non-negotiable.

## Linked Notes

* [[Interaction Patterns]]
* [[Components]]
* [[Visual Style]]
* [[Accessibility Requirements]]
* [[Codebase Map]]

## Source Trace

`components/motion/*`, `app/(site)/template.tsx`, `components/layout/site-header.tsx`,
`components/shared/page-hero.tsx` read 2026-08-22; history from `HANDOFF.md` Sessions 2 and 8.
