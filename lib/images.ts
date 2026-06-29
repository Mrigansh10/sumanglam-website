import { clientEnv } from "@/lib/env";

/**
 * Media field resolution (Implementation Decision):
 * - Absolute URLs (https://...) are used as-is.
 * - Local paths (/images/...) are used as-is (seed/demo placeholders).
 * - Anything else is treated as a Cloudinary public ID and resolved through
 *   the cloud's delivery URL with an "auto-polish" set of transforms so every
 *   hosted image looks consistent and premium without per-file editing.
 *
 * Auto-polish defaults (applied to every Cloudinary public ID):
 * - f_auto         — best format per browser (AVIF/WebP).
 * - q_auto:good    — automatic quality with a premium-friendly floor so the
 *                    source next/image re-optimizes from isn't pre-degraded.
 * - g_auto + c_fill — content-aware cropping when a fixed box is requested, so
 *                    the subject (not the edge) survives the crop.
 *
 * The `enhance` option:
 * - `true` / `"improve"` — a light Cloudinary `e_improve` pass. OFF by default so
 *   it never double-processes photos already retouched in Gemini; use it only for
 *   raw, un-retouched uploads.
 * - `"render"` — generative restore + AI super-resolution (`e_gen_restore` +
 *   `e_upscale`) applied BEFORE the sizing pass. Built for the low-res 3D kitchen
 *   renders (small, soft, JPEG-artifacted): it rebuilds detail so they look sharp
 *   at hero/full-bleed size, then the delivery `w_` downsamples for a crisp,
 *   sensibly-sized file. Generative — reserve it for render content; never use it
 *   on logos or real product/proof photography, where it can invent details.
 */
export function resolveImage(
  value: string | null | undefined,
  options?: { width?: number; height?: number; enhance?: boolean | "improve" | "render" },
): string {
  if (!value) return FALLBACK_IMAGE;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return FALLBACK_IMAGE;

  // Each entry is a separate "/"-delimited transformation component, applied in
  // order. The render restoration must run as its own components ahead of the
  // delivery/sizing pass.
  const components: string[] = [];
  if (options?.enhance === "render") components.push("e_gen_restore", "e_upscale");

  const delivery = ["f_auto", "q_auto:good"];
  if (options?.enhance === true || options?.enhance === "improve") delivery.push("e_improve");
  if (options?.width) delivery.push(`w_${options.width}`);
  if (options?.height) delivery.push(`h_${options.height}`);
  if (options?.width && options?.height) delivery.push("c_fill", "g_auto");
  components.push(delivery.join(","));

  return `https://res.cloudinary.com/${cloudName}/image/upload/${components.join("/")}/${value}`;
}

export const FALLBACK_IMAGE = "/images/placeholders/fallback.svg";
