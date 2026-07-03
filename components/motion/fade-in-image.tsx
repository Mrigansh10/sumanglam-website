"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type FadeInImageProps = React.ComponentProps<typeof Image>;

/**
 * next/image (fill) that fades in over the container's placeholder tone once
 * the file actually loads, instead of popping. The fade lives on a wrapper
 * span so the image element's own classes (hover zoom, transitions) are
 * untouched. Already-cached images (img.complete at hydration) show
 * immediately — no fade replay on back/forward navigation.
 */
export function FadeInImage(props: FadeInImageProps) {
  const [loaded, setLoaded] = useState(false);

  // onLoad misses images that finish decoding before hydration; the ref
  // callback catches those via img.complete.
  const handleRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setLoaded(true);
  }, []);

  return (
    <span
      className={cn(
        "absolute inset-0 block transition-opacity duration-700 ease-out",
        loaded ? "opacity-100" : "opacity-0",
      )}
    >
      <Image {...props} ref={handleRef} onLoad={() => setLoaded(true)} />
    </span>
  );
}
