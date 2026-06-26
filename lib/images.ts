import { clientEnv } from "@/lib/env";

/**
 * Media field resolution (Implementation Decision):
 * - Absolute URLs (https://...) are used as-is.
 * - Local paths (/images/...) are used as-is (seed/demo placeholders).
 * - Anything else is treated as a Cloudinary public ID and resolved through
 *   the cloud's delivery URL with sensible optimization defaults.
 */
export function resolveImage(
  value: string | null | undefined,
  options?: { width?: number; height?: number },
): string {
  if (!value) return FALLBACK_IMAGE;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }
  const cloudName = clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return FALLBACK_IMAGE;
  const transforms = ["f_auto", "q_auto"];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.width && options?.height) transforms.push("c_fill");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${value}`;
}

export const FALLBACK_IMAGE = "/images/placeholders/fallback.svg";
