---
layer: trap
severity: high
area: images
---

# Trap - Gen Restore Repaints Real Photos

## The Trap

`e_gen_restore` — the first step of `enhance: "render"` — is **generative**. It reinvents small
props, and it **garbles visible text and logos**. On a 3D render that's an acceptable trade for
sharpness. On a real photograph or a brand logo it is falsification.

The guard `if_w_lt_2000_and_h_lt_2000` only skips the restore for **large** sources. Upload a
real photo at, say, 1600px and gen_restore will happily repaint it.

## The Two Rules

1. **Never set `enhance: "render"`** on logos, product catalog images, showroom / proof
   photography, or admin previews. It is wired into large render slots only.
2. **Upload real photos ≥2000px wide.** The established step is a Pillow LANCZOS upscale to
   ≥2048px before the Cloudinary upload. All five brand heroes in Session 12 were upscaled this
   way specifically to dodge the guard.

## Always

**Eyeball heroes after upload.** This failure mode is silent — the image loads, it just isn't
quite the thing you uploaded.

## Linked Notes

* [[Image Delivery Pipeline]]
* [[Trap - Cloudinary Upscale 4.2MP Limit]]
* [[Content And Asset State]]

## Source Trace

`HANDOFF.md` Sessions 8, 9, 12; `lib/images.ts`.
