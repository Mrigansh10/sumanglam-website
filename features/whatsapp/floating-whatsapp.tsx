"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  type WhatsAppContext,
} from "@/features/whatsapp/whatsapp";
import { inHomeClosing, inHomeHero } from "@/components/home/home-hero-zone";
import { cn } from "@/lib/utils";

/** Maps the current route to a WhatsApp source type for context-aware messages. */
function sourceTypeForPath(pathname: string): WhatsAppContext["sourceType"] {
  if (pathname === "/") return "homepage";
  if (pathname.startsWith("/inspiration")) return "inspiration";
  if (pathname.startsWith("/collections")) return "collection";
  if (pathname.startsWith("/brands") || pathname.startsWith("/nolte") || pathname.startsWith("/mrida"))
    return "brand";
  if (pathname.startsWith("/products")) return "product";
  if (pathname.startsWith("/showroom")) return "showroom";
  if (pathname.startsWith("/kitchens")) return "kitchens";
  if (pathname.startsWith("/wardrobes")) return "wardrobes";
  if (pathname.startsWith("/contact")) return "contact";
  if (pathname.startsWith("/book-consultation")) return "consultation";
  if (pathname.startsWith("/architects-designers")) return "architects";
  return "general";
}

/**
 * Persistent mobile WhatsApp access (vault: Mobile Experience).
 * Hidden on admin routes. Falls back to /contact when no number is configured.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  // Kept off the homepage hero and closing section, where it would sit on top of their content.
  const [overHero, setOverHero] = useState(pathname === "/");

  useEffect(() => {
    const update = () => setOverHero(inHomeHero(pathname) || inHomeClosing(pathname));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  function handleClick() {
    const sourceType = sourceTypeForPath(pathname);
    trackEvent("whatsapp_clicked", { sourceType });
    void fetch("/api/v1/events/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceType, sourceId: null, sourcePage: pathname }),
      keepalive: true,
    }).catch(() => undefined);

    const url = buildWhatsAppUrl(
      buildWhatsAppMessage({ sourceType, sourcePage: pathname }),
    );
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = "/contact";
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Chat with us on WhatsApp"
      aria-hidden={overHero || undefined}
      tabIndex={overHero ? -1 : undefined}
      className={cn(
        "fixed bottom-5 right-5 z-40 flex size-13 items-center justify-center rounded-full bg-fg text-page shadow-lg transition-[transform,opacity] duration-300 hover:scale-105 hover:bg-accent-deep md:bottom-7 md:right-7",
        overHero && "pointer-events-none scale-90 opacity-0",
      )}
    >
      <MessageCircle className="size-6" aria-hidden />
    </button>
  );
}
