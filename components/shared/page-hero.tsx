import Image from "next/image";
import { Heading } from "@/components/layout/heading";
import { Container } from "@/components/layout/container";
import { Parallax } from "@/components/motion/parallax";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string | null;
  /** Without an image, renders a calm clay-toned header. */
  size?: "default" | "tall";
  children?: React.ReactNode;
};

/** Shared page header — image-first when imagery exists, calm tonal otherwise. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  size = "default",
  children,
}: PageHeroProps) {
  if (image) {
    return (
      <div
        className={cn(
          "relative flex items-end overflow-hidden bg-ink",
          size === "tall" ? "min-h-[70svh]" : "min-h-[50svh]",
        )}
      >
        <Parallax amount={8}>
          <Image
            src={resolveImage(image, { width: 2560, enhance: "render" })}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <Container size="wide" className="relative z-10 pb-12 pt-32 text-background sm:pb-16">
          <Heading
            as="h1"
            eyebrow={eyebrow}
            title={title}
            description={description}
            tone="light"
          />
          {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
        </Container>
      </div>
    );
  }

  return (
    <div className="border-b border-line bg-clay">
      <Container size="wide" className="pb-16 pt-28 sm:pb-24 sm:pt-36">
        <Heading as="h1" eyebrow={eyebrow} title={title} description={description} />
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </Container>
    </div>
  );
}
