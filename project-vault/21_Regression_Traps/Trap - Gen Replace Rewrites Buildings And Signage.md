---
layer: trap
status: active
updated: 2026-10-24
---

# Trap - Gen Replace Rewrites Buildings And Signage

**Symptom:** a Cloudinary `e_gen_replace` sky swap returns a believable image, but the building
next to the sky has been redesigned: the roof canopy grew a new panel, the
"KITCHEN HARDWARE / WARDROBE" sign became nonsense letters, and the side facade changed.

**Why:** generative replace repaints far beyond the region its `from_` prompt names. Same family
as [[Trap - Gen Restore Repaints Real Photos]].

**Rule:** never run generative edits (`e_gen_replace`, `e_gen_remove`, `e_gen_restore`) on real
photos of the showroom or anything a customer will compare against reality. For a sky swap,
build a mask locally (flood-fill the sky from the top edge, feather 1px) and composite a gradient
sky, so the building's pixels are untouched. `e_upscale` (super-resolution) was faithful on
signage and is fine.

**Where it bit:** the showroom-front photo for the homepage visit card, Session 20 (2026-10-24).
Final asset `sumanglam/home/showroom-front`.

## Linked Notes

* [[Regression Traps Index]]
* [[Image Delivery Pipeline]]
