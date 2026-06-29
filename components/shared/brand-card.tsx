import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { resolveImage } from "@/lib/images";

type BrandCardProps = {
  href: string;
  name: string;
  description?: string | null;
  heroImage?: string | null;
  brandType?: "SOLUTION" | "PRODUCT";
  parentBrandName?: string | null;
};

/** Brand storytelling card — meaningful description, never just a logo tile. */
export function BrandCard({
  href,
  name,
  description,
  heroImage,
  brandType,
  parentBrandName,
}: BrandCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-line bg-surface transition-colors hover:border-accent-soft"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-sand">
        <Image
          src={resolveImage(heroImage, { width: 800, enhance: "render" })}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-xl text-ink">{name}</h3>
          {brandType === "SOLUTION" ? <Badge variant="accent">Solutions</Badge> : null}
        </div>
        {parentBrandName ? (
          <p className="mt-1 text-xs text-ink-faint">A {parentBrandName} brand</p>
        ) : null}
        {description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
            {description}
          </p>
        ) : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-ink">
          Explore Brand
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
