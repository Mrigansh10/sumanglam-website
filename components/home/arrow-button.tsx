import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * V2 button: a squared label with a bronze arrow block on the end (no pill).
 * Shared classes are exported so client buttons (WhatsApp) can match.
 */
export const arrowButtonClasses = {
  root: "group inline-flex shrink-0 overflow-hidden whitespace-nowrap rounded-lg font-medium leading-none",
  // Semantic page/fg tokens, so both tones invert in dark mode.
  label: {
    light: "bg-page text-fg",
    dark: "bg-fg text-page",
  },
  size: {
    md: { label: "px-3.5 py-[11px] text-sm", arrow: "w-[38px] group-hover:w-11" },
    lg: { label: "px-[18px] py-[15px] text-[15px]", arrow: "w-[46px] group-hover:w-[52px]" },
  },
  arrow: "grid place-items-center bg-accent text-background transition-[width] duration-300",
};

type ArrowButtonProps = {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  size?: "md" | "lg";
  arrow?: string;
  external?: boolean;
};

export function ArrowButton({
  href,
  children,
  tone = "dark",
  size = "md",
  arrow = "→",
  external = false,
}: ArrowButtonProps) {
  const c = arrowButtonClasses;
  const content = (
    <>
      <span className={cn(c.label[tone], c.size[size].label)}>{children}</span>
      <span aria-hidden className={cn(c.arrow, c.size[size].arrow)}>
        {arrow}
      </span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={c.root}>
      {content}
    </a>
  ) : (
    <Link href={href} className={c.root}>
      {content}
    </Link>
  );
}

/** Underlined text link with a trailing arrow that nudges on hover. */
export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2.5 border-b border-current pb-1 text-[15px] font-medium after:transition-transform after:duration-300 after:content-['→'] hover:after:translate-x-1"
    >
      {children}
    </Link>
  );
}
