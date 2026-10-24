import * as React from "react";
import { cn } from "@/lib/utils";

type HeadingProps = {
  /** Accepted for existing callers but not rendered: V2 drops labels above headings. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  tone?: "default" | "light";
  className?: string;
};

/** Section heading with short supporting copy. */
export function Heading({
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
      <Tag
        className={cn(
          "font-display font-medium text-balance",
          Tag === "h1" && "text-[clamp(40px,6vw,88px)] leading-[0.98]",
          Tag === "h2" && "text-[clamp(34px,4.6vw,64px)] leading-none",
          Tag === "h3" && "text-2xl sm:text-3xl",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-[17px]",
            tone === "light" ? "text-ivory/70" : "text-ink-soft",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
