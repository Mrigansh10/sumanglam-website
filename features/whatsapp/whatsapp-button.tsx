"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  type WhatsAppContext,
} from "@/features/whatsapp/whatsapp";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  sourceType: WhatsAppContext["sourceType"];
  sourceId?: string;
  subject?: string;
  label?: string;
  variant?: "accent" | "outline" | "ghost" | "primary" | "outline-light";
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * Click handler shared by every WhatsApp CTA: tracks the click with full
 * source context, then opens WhatsApp with a context-aware message. Falls
 * back to the contact page when no WhatsApp number is configured yet.
 */
export function useWhatsAppInquiry({
  sourceType,
  sourceId,
  subject,
}: Pick<WhatsAppContext, "sourceType" | "sourceId" | "subject">) {
  const pathname = usePathname();

  return function handleClick() {
    const context: WhatsAppContext = {
      sourceType,
      sourceId,
      subject,
      sourcePage: pathname,
    };
    trackEvent("whatsapp_clicked", { sourceType, sourceId });
    void fetch("/api/v1/events/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceType,
        sourceId: sourceId ?? null,
        sourcePage: pathname,
      }),
      keepalive: true,
    }).catch(() => undefined);

    const url = buildWhatsAppUrl(buildWhatsAppMessage(context));
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // WhatsApp number not configured yet — route to contact instead.
      window.location.href = "/contact";
    }
  };
}

/** WhatsApp inquiry CTA. */
export function WhatsAppButton({
  sourceType,
  sourceId,
  subject,
  label = "WhatsApp Inquiry",
  variant = "outline",
  size = "md",
  className,
}: WhatsAppButtonProps) {
  const handleClick = useWhatsAppInquiry({ sourceType, sourceId, subject });

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn(className)}
    >
      <MessageCircle aria-hidden />
      {label}
    </Button>
  );
}
