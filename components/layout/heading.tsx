import * as React from "react";
import { DrawRule } from "@/components/motion/draw-rule";
import { cn } from "@/lib/utils";

type HeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  tone?: "default" | "light";
  className?: string;
};

/** Section heading with optional eyebrow and short supporting copy. */
export function Heading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  tone = "default",
  className,
}: HeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-luxe",
            align === "center" && "justify-center",
            tone === "light" ? "text-accent-soft" : "text-accent-deep",
          )}
        >
          <DrawRule className={tone === "light" ? "bg-accent-soft" : "bg-accent"} />
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={cn(
          "font-display font-medium tracking-tight text-balance",
          Tag === "h1" && "text-4xl sm:text-5xl lg:text-6xl",
          Tag === "h2" && "text-3xl sm:text-4xl",
          Tag === "h3" && "text-xl sm:text-2xl",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "light" ? "text-background/70" : "text-ink-soft",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
