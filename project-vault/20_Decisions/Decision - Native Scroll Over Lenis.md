---
layer: decision
date: 2026-11-05
status: active
---

# Decision - Native Scroll Over Lenis

## Decision

The site uses the browser's native scrolling. Lenis smooth scroll was removed on 2026-11-05.

## Why

The user felt the smoothed scroll was heavy and chose native after comparing the two.

## What Was Done

* Deleted `components/motion/smooth-scroll.tsx` and the `lenis` dependency.
* Removed `data-lenis-prevent` from `components/home/ideas-rail.tsx`.
* Scroll-triggered animations stay on GSAP ScrollTrigger, which tracks native scroll.

## See Also

* [[Motion System]]
* [[User Approved Stack Extension - Three GSAP Lenis]]
