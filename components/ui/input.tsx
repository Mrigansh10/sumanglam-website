import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-line bg-surface px-3.5 py-2 text-base text-ink placeholder:text-ink-faint transition-colors focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-error md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
