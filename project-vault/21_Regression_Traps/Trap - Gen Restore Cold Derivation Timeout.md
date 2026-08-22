---
layer: trap
severity: medium
area: images
---

# Trap - Gen Restore Cold Derivation Timeout

## The Trap

The **first** request for a given `e_gen_restore` derivation takes **30 seconds or more** while
Cloudinary generates it. `next/image` gives up and returns a **504**, so the page ships with a
broken image — even though the transform is perfectly valid and will work on the second request.

## The Fix

**Pre-warm every derivation URL after any upload**, before anyone views the page.

Two details that make pre-warming actually work:

* Request the **exact** delivery URL the page will request — same width, same transform order.
* **Include the `/if_end/` segment.** A URL without it is a different derivation and warming it
  warms the wrong thing.

## When To Remember This

Any bulk upload. The Session 8 render placement (44 images) and every brand-hero batch since has
ended with a pre-warm pass. Build it into the upload script, not the checklist.

## Linked Notes

* [[Image Delivery Pipeline]]
* [[Trap - Cloudinary Upscale 4.2MP Limit]]
* [[Content And Asset State]]

## Source Trace

`HANDOFF.md` Sessions 8, 11, 12.
