---
layer: as-built
status: live
updated: 2026-08-22
---

# Image Delivery Pipeline

> Every image on the site flows through `resolveImage()` in `lib/images.ts` and is delivered
> by Cloudinary (cloud `de9turgsy`). Getting the `enhance` mode wrong is the most common way
> to silently ruin imagery on this project.

## `resolveImage(value, { width, height, enhance })`

Resolution order:

1. Absolute URL (`http://`, `https://`) → returned untouched.
2. Local path (`/images/...`) → returned untouched (seed/demo SVG placeholders).
3. Anything else → treated as a **Cloudinary public ID** and given the auto-polish transforms.

Auto-polish applied to every public ID: `f_auto` (AVIF/WebP per browser), `q_auto:good`,
plus `c_fill,g_auto` (content-aware crop) when both `width` and `height` are given.

Missing value or missing cloud name → `FALLBACK_IMAGE` (`/images/placeholders/fallback.svg`).

## The `enhance` Modes

| Mode | Transform | Use for |
|---|---|---|
| *(omitted)* | none | **Default.** Logos, product catalog, showroom/proof photos, admin previews |
| `true` / `"improve"` | `e_improve` | Raw, un-retouched uploads only. Off by default so it never double-processes photos already retouched in Gemini |
| `"render"` | `if_w_lt_2000_and_h_lt_2000` → `e_gen_restore` → `e_upscale` → `if_end` | **Only the low-res 3D renders** in large slots: homepage hero, page/category heroes, inspiration galleries, brand + mega-menu cards |

`"render"` exists because the source renders are ~1080px, ~150 KB, soft and JPEG-artifacted,
and there are no 3D source files to re-export. Cloudinary rebuilds detail, then the delivery
`w_` downsamples to something crisp.

## Three Hard Rules

1. **`e_gen_restore` is generative.** It reinvents small props and garbles visible text and
   logos. Eyeball every hero after upload. Never use `"render"` on logos, product shots,
   real proof photography, or admin previews. See [[Trap - Gen Restore Repaints Real Photos]].
2. **Upload real photos at ≥2000px wide.** Below that the `if_w_lt_2000_and_h_lt_2000` guard
   fires and gen_restore repaints a genuine photograph. Upscale first (Pillow LANCZOS to
   ≥2048px is the established step).
3. **Sources over 4.2 MP hard-fail `e_upscale`** with a 400 → blank `<img>`. That is exactly
   what the `if_w_lt_...` guard prevents; do not remove it. See
   [[Trap - Cloudinary Upscale 4.2MP Limit]].

## Cold-Derivation Timeout

The **first** request for a given gen_restore derivation takes 30s+, which makes
`next/image` return a 504. After any upload, **pre-warm the exact delivery URLs** — including
the `/if_end/` segment — before the page is viewed. See
[[Trap - Gen Restore Cold Derivation Timeout]].

## Cloudinary Folder Convention

| Folder | Contents |
|---|---|
| `sumanglam/home/` | Homepage hero + journey cards (uploaded via Admin → Homepage) |
| `sumanglam/spaces/` | Category page heroes (Admin → Spaces) |
| `sumanglam/inspirations/` | `<slug>-<n>`, where `-1` is the cover |
| `sumanglam/brands/` | `<slug>-hero` |
| `sumanglam/hardware/` | Hardware heroes and the Yale catalogue imports |

## Upload Path

`components/admin/image-upload.tsx` is dual-mode (file drag-drop + URL import). It
**downscales and compresses in-browser** (canvas → JPEG, ≤3000px, <9 MB) before upload so
files clear Cloudinary's **10 MB free-plan limit**. It stores **bare public IDs**, never full
URLs — that is what lets `resolveImage()` apply auto-polish. Server side:
`POST /api/v1/admin/upload` performs the signed upload.

## Hero Sourcing Notes

* `components/shared/page-hero.tsx` requests `width: 2560` for Retina sharpness and renders
  the image at `opacity-75` under a top gradient.
* Landscape sources only. Portrait sources look wrong in the wide hero — outpaint to ~16:9
  before uploading.
* **Never repeat an image twice on one page.** Featured inspiration covers already appear in
  the homepage grid, so the homepage hero must be a render that appears nowhere else.
* Flat, straight-on elevations betray the render origin — avoid them in published galleries.

## Related Generation Routes

Three image sources now feed this pipeline: the **Ideogram MCP** server (user scope, OAuth
complete 2026-08-12), the **higgsfield-\*** skills, and manual/vendor sourcing. Anything
produced by any of them still has to clear the size rules above.

## Linked Notes

* [[Image Strategy]] — the *specified* strategy
* [[Content And Asset State]]
* [[Backend - Cloudinary]]
* [[Asset Management]]
* [[Motion System]]

## Source Trace

`lib/images.ts`, `components/admin/image-upload.tsx`, `components/shared/page-hero.tsx`
read 2026-08-22; behaviour notes from `HANDOFF.md` Sessions 4–9 and 15–16.
