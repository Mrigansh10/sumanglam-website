import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeInImage } from "@/components/motion/fade-in-image";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type VisualCardProps = {
  /** Omit for a purely visual (non-clickable) tile — Nolte-style browsing. */
  href?: string;
  image?: string | null;
  eyebrow?: string;
  title: string;
  description?: string | null;
  /** Aspect ratio of the image area. */
  ratio?: "landscape" | "portrait" | "square";
  /** Larger editorial treatment for hero-level cards. */
  emphasis?: boolean;
  imageSizes?: string;
};

/**
 * Image-first editorial card used for inspirations, collections, spaces, and
 * journey entry points. With `href` the whole card is tappable; without it,
 * the card is a quiet visual tile (no lift, no Explore affordance).
 */
export function VisualCard({
  href,
  image,
  eyebrow,
  title,
  description,
  ratio = "landscape",
  emphasis = false,
  imageSizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: VisualCardProps) {
  const body = (
    <>
      <div
        className={cn(
          "relative overflow-hidden bg-sand",
          ratio === "landscape" && "aspect-[3/2]",
          ratio === "portrait" && "aspect-[3/4]",
          ratio === "square" && "aspect-square",
        )}
      >
        <FadeInImage
          src={resolveImage(image, { width: 1200, enhance: "render" })}
          alt={title}
          fill
          sizes={imageSizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
      <div className={cn("pt-4", emphasis && "pt-5")}>
        {eyebrow ? (
          <p className="mb-1 text-xs font-medium uppercase tracking-luxe text-accent-deep">
            {eyebrow}
          </p>
        ) : null}
        <h3
          className={cn(
            "font-display text-ink transition-colors group-hover:text-accent-deep",
            emphasis ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl",
          )}
        >
          {title}
        </h3>
        {description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {description}
          </p>
        ) : null}
        {href ? (
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
            Explore
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
        ) : null}
      </div>
    </>
  );

  if (!href) {
    return <div className="group block">{body}</div>;
  }
  return (
    <Link
      href={href}
      className="group block transition-transform duration-500 ease-out will-change-transform hover:-translate-y-1"
    >
      {body}
    </Link>
  );
}
