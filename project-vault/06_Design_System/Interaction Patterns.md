# Interaction Patterns

> **ℹ️ Implemented and frozen.** The shipped motion primitives and their constraints are in [[Motion System]].

## Interaction Philosophy

Interactions should feel premium, not playful.

## Allowed Motion

* Fade.
* Slide.
* Reveal.
* Gentle parallax.
* Smooth transitions.
* Scroll-triggered movement when subtle and purposeful.

## Approved Libraries

Original architecture includes Framer Motion.

The user has additionally approved:

* Three.js.
* GSAP with ScrollTrigger.
* Lenis.js.

See [[User Approved Stack Extension - Three GSAP Lenis]].

## Implementation Rules

* Motion must support aspiration, clarity, and storytelling.
* Respect reduced-motion preferences.
* Keep homepage load under the performance target.
* Avoid scroll hijacking.
* Do not use 3D or scroll effects where normal layout is enough.

## Forbidden Motion

* Bouncy animations.
* Attention-seeking motion.
* Aggressive effects.
* Heavy motion.
* Auto-playing disruptive effects.
* Excessive animation chains.

## Linked Notes

* [[User Approved Stack Extension - Three GSAP Lenis]]
* [[Homepage UX Specification]]
* [[Performance SEO Security]]
* [[16_Conflicts]]

## Source Trace

Source files: `03-ui-ux-specification.md`, `04-design-language.md`, `10-techincal-architecture.md`, user instruction on 2026-06-10.
