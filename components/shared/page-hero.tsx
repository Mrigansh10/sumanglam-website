import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Parallax } from "@/components/motion/parallax";
import { SplitHeadline } from "@/components/motion/split-headline";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  /** Accepted for existing callers but not rendered: V2 drops labels above headings. */
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string | null;
  /** Without an image, renders a calm clay-toned header. */
  size?: "default" | "tall";
  children?: React.ReactNode;
};

/**
 * Shared page header — image-first when imagery exists, calm tonal otherwise.
 * Staged entrance: the image settles (slow Ken Burns under the parallax), the
 * headline reveals word by word, and description → CTAs fade up in sequence.
 * All motion is progressive enhancement; reduced motion shows the hero at rest.
 * Text on the photo uses the fixed ivory/charcoal so dark mode can't flip it.
 */
export function PageHero({
  title,
  description,
  image,
  size = "default",
  children,
}: PageHeroProps) {
  const light = Boolean(image);

  const heading = (
    <>
      <SplitHeadline
        delay={0.15}
        className="max-w-4xl font-display text-[clamp(44px,7vw,104px)] font-medium leading-[0.95] text-balance"
      >
        {title}
      </SplitHeadline>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed sm:text-lg animate-fade-up [animation-delay:240ms]",
            light ? "text-ivory/75" : "text-ink-soft",
          )}
        >
          {description}
        </p>
      ) : null}
      {children ? (
        <div className="mt-8 flex flex-wrap gap-3 animate-fade-up [animation-delay:360ms]">
          {children}
        </div>
      ) : null}
    </>
  );

  if (image) {
    return (
      <div
        className={cn(
          "relative flex items-end overflow-hidden bg-charcoal",
          size === "tall" ? "min-h-[70svh]" : "min-h-[50svh]",
        )}
      >
        <Parallax amount={8}>
          {/* Ken Burns settle lives on its own layer so the CSS transform
              never conflicts with the GSAP parallax transform above it. */}
          <div className="absolute inset-0 animate-hero-zoom">
            <Image
              src={resolveImage(image, { width: 2560, enhance: "render" })}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-75"
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent animate-fade-in" />
        <Container size="wide" className="relative z-10 pb-12 pt-32 text-ivory sm:pb-16">
          {heading}
        </Container>
      </div>
    );
  }

  return (
    <div className="border-b border-line bg-clay">
      <Container size="wide" className="pb-16 pt-28 sm:pb-24 sm:pt-36">
        {heading}
      </Container>
    </div>
  );
}
