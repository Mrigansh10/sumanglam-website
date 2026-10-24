import { clientEnv } from "@/lib/env";

/**
 * Context-aware WhatsApp message helpers.
 * Every entry point builds a message that tells the showroom team exactly
 * what the visitor was looking at (vault rule: no generic WhatsApp messages).
 */

export type WhatsAppContext = {
  sourceType:
    | "homepage"
    | "inspiration"
    | "collection"
    | "brand"
    | "product"
    | "showroom"
    | "kitchens"
    | "wardrobes"
    | "hardware"
    | "contact"
    | "consultation"
    | "architects"
    | "general";
  sourceId?: string;
  /** Human-readable subject, e.g. product or inspiration title. */
  subject?: string;
  sourcePage: string;
};

export function buildWhatsAppMessage(context: WhatsAppContext): string {
  const { sourceType, subject } = context;
  switch (sourceType) {
    case "product":
      return `Hello Sumanglam, I'm interested in the product "${subject ?? "a product"}" I saw on your website. Could you share more details?`;
    case "inspiration":
      return `Hello Sumanglam, I loved the "${subject ?? "an inspiration"}" design on your website. I'd like to know more about creating something similar.`;
    case "collection":
      return `Hello Sumanglam, I'm exploring your "${subject ?? "a collection"}" collection and would like to know more.`;
    case "brand":
      return `Hello Sumanglam, I'd like to know more about ${subject ?? "one of your brands"} and what you offer.`;
    case "showroom":
      return `Hello Sumanglam, I'd like to plan a visit to your showroom${subject ? ` (${subject})` : ""}. What would be a good time?`;
    case "kitchens":
      return `Hello Sumanglam, I'm planning a kitchen project and would like to discuss options.`;
    case "wardrobes":
      return `Hello Sumanglam, I'm interested in Mrida wardrobes and storage solutions. Could we discuss my requirements?`;
    case "hardware":
      return `Hello Sumanglam, I'm looking for hardware and fittings. Could you help me check what's available?`;
    case "consultation":
      return `Hello Sumanglam, I'd like to book a design consultation.`;
    case "architects":
      return `Hello Sumanglam, I'm a design professional interested in collaborating with you.`;
    default:
      return `Hello Sumanglam, I found your website and would like to know more about your kitchens, wardrobes, and interior solutions.`;
  }
}

export function buildWhatsAppUrl(message: string): string | null {
  const number = clientEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
