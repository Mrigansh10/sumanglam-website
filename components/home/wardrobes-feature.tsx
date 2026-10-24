import { FadeInImage } from "@/components/motion/fade-in-image";
import { ArrowLink } from "@/components/home/arrow-button";
import { resolveImage } from "@/lib/images";

/** Nolte storage wall on the showroom floor (K5-2, professional shoot). */
const WARDROBE_IMAGE = "sumanglam/home/showroom-k5-storage-wall";

export function WardrobesFeature() {
  return (
    <section
      aria-labelledby="wardrobes-heading"
      className="mx-auto grid max-w-[1480px] items-center gap-8 px-[22px] pt-[120px] font-tight lg:grid-cols-[1.4fr_1fr] lg:gap-[72px] lg:px-10"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card lg:rounded-[20px]">
        <FadeInImage
          src={resolveImage(WARDROBE_IMAGE, { width: 1800 })}
          alt="Storage wall with lit oak shelving between cream cabinets"
          fill
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="grid justify-items-start gap-[22px]">
        <h2
          id="wardrobes-heading"
          className="text-[clamp(36px,5.6vw,88px)] font-medium leading-[0.98] tracking-[-0.04em]"
        >
          Wardrobes, made to measure.
        </h2>
        <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
          Walk-in, sliding and modular wardrobes, planned to your wall, your ceiling, and
          everything that goes inside.
        </p>
        <ArrowLink href="/wardrobes">Explore wardrobes</ArrowLink>
      </div>
    </section>
  );
}
