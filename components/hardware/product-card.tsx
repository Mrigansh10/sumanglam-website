import Link from "next/link";
import { FadeInImage } from "@/components/motion/fade-in-image";

export type HardwareCardData = {
  slug: string;
  name: string;
  brand: string;
  /** Resolved URL of the product's cut-out image. */
  image: string;
  /** One quiet line under the name, e.g. "Fingerprint · PIN · Card". */
  meta?: string;
};

/**
 * Every product sits the same way: its cut-out, centred on a soft tile, so a
 * grid of photos from different sources still reads as one set.
 */
export function HardwareProductCard({ product, sizes }: { product: HardwareCardData; sizes?: string }) {
  return (
    <Link href={`/products/${product.slug}`} className="group grid content-start gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-card/55">
        <div className="absolute inset-x-[14%] inset-y-[11%]">
          <FadeInImage
            src={product.image}
            alt={product.name}
            fill
            sizes={sizes ?? "(min-width: 1024px) 18vw, (min-width: 640px) 26vw, 40vw"}
            className="object-contain transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]"
          />
        </div>
      </div>
      <div>
        <p className="text-[13px] text-fg/60">{product.brand}</p>
        <p className="text-[17px] font-medium tracking-[-0.01em]">{product.name}</p>
        {product.meta ? <p className="mt-0.5 text-[13px] text-fg/60">{product.meta}</p> : null}
      </div>
    </Link>
  );
}
