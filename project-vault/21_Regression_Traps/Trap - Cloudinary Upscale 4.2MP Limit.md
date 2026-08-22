---
layer: trap
severity: high
area: images
---

# Trap - Cloudinary Upscale 4.2MP Limit

## The Trap

Cloudinary's `e_upscale` **hard-fails with a 400 on sources over 4.2 megapixels.** With the
`enhance: "render"` transform chain, that means the image doesn't degrade — it returns nothing.
A blank `<img>`.

## How It Showed Up

Large uploads blanked entirely; the Nolte imagery disappeared.

## The Fix

`lib/images.ts` guards the whole restore chain with a Cloudinary condition:

```
if_w_lt_2000_and_h_lt_2000 / e_gen_restore / e_upscale / if_end
```

Sources over that threshold **skip the restore pass** and take the delivery transforms only —
which is correct, because a large source doesn't need restoring.

## Do Not

Remove the `if_w_lt_2000_and_h_lt_2000` / `if_end` guard. And when pre-warming derivation URLs,
**include the `/if_end/` segment** — the URL without it is a different derivation.

## The Companion Trap

The same guard is why real photos must be uploaded ≥2000px — below the threshold, gen_restore
repaints them. See [[Trap - Gen Restore Repaints Real Photos]].

## Linked Notes

* [[Image Delivery Pipeline]]
* [[Decision - Renders As Primary Medium]]

## Source Trace

`HANDOFF.md` Session 8; `lib/images.ts`.
