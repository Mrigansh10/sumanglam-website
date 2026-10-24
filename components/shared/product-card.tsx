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
  // Supabase serves lowercase enum values; legacy callers may pass uppercase.
  availabilityStatus?: string | null;
};

const availabilityLabel: Record<string, { label: string; variant: "success" | "warning" | "error" | "default" }> = {
  available: { label: "Available", variant: "success" },
  limited: { label: "Limited", variant: "warning" },
  discontinued: { label: "Discontinued", variant: "error" },
  coming_soon: { label: "Coming Soon", variant: "default" },
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
  const availabilityKey = availabilityStatus?.toLowerCase();
  const availability =
    availabilityKey && availabilityKey !== "available"
      ? availabilityLabel[availabilityKey] ?? null
      : null;

  return (
    <Link
      href={href}
      className="group block transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
        <FadeInImage
          src={resolveImage(primaryImage, { width: 800 })}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {availability ? (
          <div className="absolute left-3 top-3">
            <Badge variant={availability.variant}>{availability.label}</Badge>
          </div>
        ) : null}
      </div>
      <div className="pt-3.5">
        <h3 className="line-clamp-2 text-sm font-medium text-ink transition-colors group-hover:text-accent-deep sm:text-base">
          {name}
        </h3>
        {brandName ? <p className="mt-0.5 text-sm text-ink-faint">{brandName}</p> : null}
        {priceRange ? <p className="mt-1 text-sm text-ink-soft">{priceRange}</p> : null}
      </div>
    </Link>
  );
}
