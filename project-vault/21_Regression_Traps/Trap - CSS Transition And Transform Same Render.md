---
layer: trap
severity: medium
area: motion
---

# Trap - CSS Transition And Transform Same Render

## The Trap

Browsers apply the **old** `transition` value when `transition` and `transform` change in the
same render. The header's hide and reveal use different durations and easings — so with CSS
transitions the two animations appeared **swapped**: the fast reveal curve played on hide and
vice versa.

This is a browser behaviour, not a bug in the code. Chasing it in the CSS will not fix it.

## The Fix

`components/layout/site-header.tsx` uses Framer Motion `animate` / `transition` **props**, not
CSS transitions. Framer holds the values per-animation so they can't desync.

Current values:

* Hide: **850ms** `cubic-bezier(0.65, 0, 0.35, 1)`
* Reveal: **400ms** `cubic-bezier(0, 0, 0.2, 1)`
* Triggers after 100px of downward scroll, 5px jitter tolerance.

## The Rule

Any element whose transition **timing changes with its state** must be animated in JS, not CSS.

## Linked Notes

* [[Motion System]]
* [[Interaction Patterns]]

## Source Trace

`HANDOFF.md` Session 2; `components/layout/site-header.tsx`.
