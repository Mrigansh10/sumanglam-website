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
 * Pass `enhance: true` to add a light Cloudinary `e_improve` pass. It is OFF by
 * default so it never double-processes photos already retouched in Gemini; use
 * it only for raw, un-retouched uploads.
 */
export function resolveImage(
  value: string | null | undefined,
  options?: { width?: number; height?: number; enhance?: boolean },
): string {
  if (!value) return FALLBACK_IMAGE;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return FALLBACK_IMAGE;
  const transforms = ["f_auto", "q_auto:good"];
  if (options?.enhance) transforms.push("e_improve");
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.width && options?.height) transforms.push("c_fill", "g_auto");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${value}`;
}

export const FALLBACK_IMAGE = "/images/placeholders/fallback.svg";
