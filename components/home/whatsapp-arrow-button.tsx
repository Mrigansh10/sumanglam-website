"use client";

import { arrowButtonClasses as c } from "@/components/home/arrow-button";
import { useWhatsAppInquiry } from "@/features/whatsapp/whatsapp-button";
import type { WhatsAppContext } from "@/features/whatsapp/whatsapp";
import { cn } from "@/lib/utils";

/** "Ask on WhatsApp" in the V2 button style, tracked like every WhatsApp CTA. */
export function WhatsAppArrowButton({
  sourceType,
  subject,
  tone = "dark",
  size = "md",
  label = "Ask on WhatsApp",
  block = false,
}: {
  sourceType: WhatsAppContext["sourceType"];
  subject?: string;
  tone?: "dark" | "light" | "outline";
  size?: "md" | "lg";
  label?: string;
  /** Full width, label stretching to the arrow. */
  block?: boolean;
}) {
  const handleClick = useWhatsAppInquiry({ sourceType, subject });
  return (
    <button type="button" onClick={handleClick} className={cn(c.root, block && "flex w-full")}>
      <span
        className={cn(
          tone === "outline" ? "text-fg ring-1 ring-inset ring-fg/15" : c.label[tone],
          c.size[size].label,
          block && "flex-1 text-left",
        )}
      >
        {label}
      </span>
      <span aria-hidden className={cn(c.arrow, c.size[size].arrow)}>
        →
      </span>
    </button>
  );
}
