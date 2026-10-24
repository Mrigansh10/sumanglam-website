import * as React from "react";
import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  tone?: "default" | "clay" | "ink";
  spacing?: "default" | "compact" | "spacious";
};

/** Vertical page section with consistent rhythm and optional tonal ground. */
export function Section({ className, tone = "default", spacing = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        spacing === "default" && "py-16 sm:py-24",
        spacing === "compact" && "py-10 sm:py-14",
        spacing === "spacious" && "py-20 sm:py-32",
        tone === "clay" && "bg-clay",
        // Fixed charcoal in both modes: these bands carry ivory-outline buttons.
        tone === "ink" && "bg-charcoal text-ivory",
        className,
      )}
      {...props}
    />
  );
}
