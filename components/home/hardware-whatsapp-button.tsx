"use client";

import { arrowButtonClasses as c } from "@/components/home/arrow-button";
import { useWhatsAppInquiry } from "@/features/whatsapp/whatsapp-button";
import { cn } from "@/lib/utils";

/** "Ask on WhatsApp" in the V2 button style, tracked like every WhatsApp CTA. */
export function HardwareWhatsAppButton() {
  const handleClick = useWhatsAppInquiry({ sourceType: "hardware" });
  return (
    <button type="button" onClick={handleClick} className={c.root}>
      <span className={cn(c.label.dark, c.size.md.label)}>Ask on WhatsApp</span>
      <span aria-hidden className={cn(c.arrow, c.size.md.arrow)}>
        →
      </span>
    </button>
  );
}
