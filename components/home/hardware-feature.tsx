import Image from "next/image";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { ArrowLink } from "@/components/home/arrow-button";
import { HardwareWhatsAppButton } from "@/components/home/hardware-whatsapp-button";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { HomepageBrandLogo } from "@/server/homepage";

// One cabinet piece, one door piece, so the section reads as hardware for the
// whole house. Brand-supplied stand-ins until Sumanglam's own photography exists.
const HARDWARE_IMAGES = [
  { id: "sumanglam/brands/blum-hero", alt: "Drawer cabinet on soft-close runners", position: "45% 50%" },
  {
    id: "sumanglam/hardware/yale/smart-door-locks/byyou-mortise",
    alt: "Smart lock fitted on a front door",
    position: "88% 50%",
  },
];

/**
 * Hardware gets its own pitch: it serves the most customers, including people
 * whose kitchens are built by independent carpenters — hence the logo wall and
 * a direct WhatsApp line rather than a consultation ask.
 */
export function HardwareFeature({ logos }: { logos: HomepageBrandLogo[] }) {
  return (
    <section
      aria-labelledby="hardware-heading"
      className="mx-auto grid max-w-[1480px] items-center gap-8 px-[22px] pt-[120px] font-tight lg:grid-cols-[1fr_1.4fr] lg:gap-[72px] lg:px-10"
    >
      <div className="grid grid-cols-2 gap-3.5 lg:order-2">
        {HARDWARE_IMAGES.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              "relative aspect-[2/3] overflow-hidden rounded-2xl bg-card lg:rounded-[20px]",
              index === 1 && "mt-14",
            )}
          >
            <FadeInImage
              src={resolveImage(image.id, { width: 900 })}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 28vw, 50vw"
              className="object-cover"
              style={{ objectPosition: image.position }}
            />
          </div>
        ))}
      </div>

      <div className="grid justify-items-start gap-[22px]">
        <h2
          id="hardware-heading"
          className="text-[clamp(36px,5.6vw,88px)] font-medium leading-[0.98] tracking-[-0.04em]"
        >
          Hardware, for the whole home.
        </h2>
        <p className="max-w-[46ch] text-[17px] leading-normal text-fg/60">
          Hinges, channels, door closers, tower bolts, handles and locks from Hettich, Blum, Häfele,
          Yale and more, for every door, window and cabinet. Whether we&apos;re building it or your
          carpenter is, it&apos;s all at our counter.
        </p>
        {logos.length > 0 ? (
          <ul aria-label="Brands at our counter" className="grid w-full max-w-[440px] grid-cols-4 gap-2">
            {logos.map((brand) => (
              <li
                key={brand.slug}
                // Always white: several logos are dark or carry their own white box.
                className="grid h-14 place-items-center rounded-[10px] border border-card bg-white px-2.5 py-2"
              >
                {brand.logo && !brand.logo.startsWith("/") ? (
                  <span className="relative block h-[34px] w-full">
                    <Image
                      src={resolveImage(brand.logo, { width: 240 })}
                      alt={brand.name}
                      fill
                      sizes="100px"
                      className="object-contain"
                    />
                  </span>
                ) : (
                  <span className="text-xs font-medium text-fg/70">{brand.name}</span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
          <HardwareWhatsAppButton />
          <ArrowLink href="/hardware-appliances">Explore hardware</ArrowLink>
        </div>
      </div>
    </section>
  );
}
