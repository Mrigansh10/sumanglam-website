---
layer: trap
severity: medium
area: motion
---

# Trap - Parallax And Ken Burns Transform Conflict

## The Trap

A CSS transform and a JS-driven transform on the **same element** fight. The animation library
writes `transform`, the stylesheet writes `transform`, and whichever loses produces jitter or a
dead animation.

## The Fix

The `PageHero` Ken Burns drift lives on **its own layer inside** `Parallax`, not on the
Parallax element itself.

**Rule: a CSS transform must never share an element with a GSAP- or Framer-driven transform.**
Add a wrapper div instead.

## Linked Notes

* [[Motion System]]
* [[Trap - Fixed Elements Inside Template]]
* [[Trap - CSS Transition And Transform Same Render]]

## Source Trace

`HANDOFF.md` Session 8; `components/shared/page-hero.tsx`, `components/motion/parallax.tsx`.
