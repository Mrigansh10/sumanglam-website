"use client";

import { arrowButtonClasses as c } from "@/components/home/arrow-button";
import { useWhatsAppInquiry } from "@/features/whatsapp/whatsapp-button";
import type { WhatsAppContext } from "@/features/whatsapp/whatsapp";
import { cn } from "@/lib/utils";

/** "Ask on WhatsApp" in the V2 button style, tracked like every WhatsApp CTA. */
export function WhatsAppArrowButton({
  sourceType,
  tone = "dark",
  size = "md",
}: {
  sourceType: WhatsAppContext["sourceType"];
  tone?: "dark" | "outline";
  size?: "md" | "lg";
}) {
  const handleClick = useWhatsAppInquiry({ sourceType });
  return (
    <button type="button" onClick={handleClick} className={c.root}>
      <span
        className={cn(
          tone === "dark" ? c.label.dark : "text-fg ring-1 ring-inset ring-fg/15",
          c.size[size].label,
        )}
      >
        Ask on WhatsApp
      </span>
      <span aria-hidden className={cn(c.arrow, c.size[size].arrow)}>
        →
      </span>
    </button>
  );
}
