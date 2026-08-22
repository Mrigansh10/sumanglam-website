---
layer: trap
severity: medium
area: motion
---

# Trap - SplitHeadline Descender Clipping

## The Trap

`SplitHeadline` reveals words from behind a mask. A mask sized to the line box **clips
descenders** — the tails of g, y, p, q, j get cut off mid-animation.

## The Fix

The masks are deliberately padded `0.2em` / `-0.2em` in
`components/motion/split-headline.tsx`. **Do not tighten this** to make the mask "fit" — it is
not slop, it is the fix.

## Why It Recurs

The padding looks like a mistake when you read the component cold, and it looks like dead space
in dev tools. It is the single most likely thing for a well-meaning cleanup pass to remove.

## Linked Notes

* [[Motion System]]
* [[Typography]]

## Source Trace

`HANDOFF.md` Session 8; `components/motion/split-headline.tsx`.
