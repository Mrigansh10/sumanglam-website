import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { resolveImage } from "@/lib/images";

type ProductCardProps = {
  href: string;
  name: string;
  brandName?: string | null;
  priceRange?: string | null;
  primaryImage?: string | null;
  availabilityStatus?: "AVAILABLE" | "LIMITED" | "DISCONTINUED" | "COMING_SOON";
};

const availabilityLabel: Record<string, { label: string; variant: "success" | "warning" | "error" | "default" }> = {
  AVAILABLE: { label: "Available", variant: "success" },
  LIMITED: { label: "Limited", variant: "warning" },
  DISCONTINUED: { label: "Discontinued", variant: "error" },
  COMING_SOON: { label: "Coming Soon", variant: "default" },
};

/** Research-oriented product card — informs and invites inquiry, no cart. */
export function ProductCard({
  href,
  name,
  brandName,
  priceRange,
  primaryImage,
  availabilityStatus,
}: ProductCardProps) {
  const availability =
    availabilityStatus && availabilityStatus !== "AVAILABLE"
      ? availabilityLabel[availabilityStatus]
      : null;

  return (
    <Link
      href={href}
      className="group block transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-sand">
        <FadeInImage
          src={resolveImage(primaryImage, { width: 800 })}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {availability ? (
          <div className="absolute left-3 top-3">
            <Badge variant={availability.variant}>{availability.label}</Badge>
          </div>
        ) : null}
      </div>
      <div className="pt-3.5">
        {brandName ? (
          <p className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
            {brandName}
          </p>
        ) : null}
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-ink transition-colors group-hover:text-accent-deep sm:text-base">
          {name}
        </h3>
        {priceRange ? <p className="mt-1 text-sm text-ink-soft">{priceRange}</p> : null}
      </div>
    </Link>
  );
}
