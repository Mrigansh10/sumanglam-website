import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { FloatingWhatsApp } from "@/features/whatsapp/floating-whatsapp";
import { siteConfig } from "@/lib/site";
import { supabase, rows } from "@/lib/supabase";
import type { HeaderBrand } from "@/components/layout/site-header";

// LocalBusiness structured data — drives the "near me" / local-pack surface.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "S-13, New Aatish Market, Devi Nagar",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302019",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 26.8792033,
    longitude: 75.7584208,
  },
  hasMap: siteConfig.contact.mapsUrl,
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:30",
    closes: "20:00",
  },
  knowsAbout: [
    "modular kitchens",
    "German kitchens",
    "luxury acrylic kitchens",
    "wardrobes",
    "kitchen hardware",
    "built-in appliances",
  ],
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { data: rawBrands } = await supabase
    .from("brands")
    .select("name, slug, logo, hero_image")
    .eq("status", "published")
    .order("brand_type", { ascending: true })
    .order("name", { ascending: true });
  const brands = rows<HeaderBrand>(rawBrands);

  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <SiteHeader brands={brands} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
    </SmoothScroll>
  );
}
