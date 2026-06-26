"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  max?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (value: number) => void;
};

export function StarRating({ value, max = 5, size = "md", interactive, onChange }: Props) {
  const dim = size === "sm" ? 14 : 18;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < value;
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
            className={cn(
              interactive && "cursor-pointer transition-transform hover:scale-110",
              !interactive && "cursor-default",
            )}
            aria-label={interactive ? `Rate ${i + 1} star${i !== 0 ? "s" : ""}` : undefined}
          >
            <Star
              width={dim}
              height={dim}
              className={cn(
                "transition-colors",
                filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-sand-dark",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
