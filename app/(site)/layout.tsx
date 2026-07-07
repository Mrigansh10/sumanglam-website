import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { FloatingWhatsApp } from "@/features/whatsapp/floating-whatsapp";
import { siteConfig } from "@/lib/site";
import { supabase, rows } from "@/lib/supabase";
import type { HeaderBrand } from "@/components/layout/site-header";

// LocalBusiness structured data — drives the "near me" / local-pack surface.
// The @id anchor lets the WebSite node below reference this as publisher.
const localBusinessJsonLd = {
  "@type": "HomeGoodsStore",
  "@id": `${siteConfig.url}/#business`,
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

// WebSite node: tells Google the canonical site name for the "Sumanglam"
// brand query and search-result site-name display. sameAs (social profiles)
// should be added here once the accounts are confirmed.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    localBusinessJsonLd,
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      alternateName: ["Sumanglam Jaipur", "Sumanglam Kitchens"],
      publisher: { "@id": `${siteConfig.url}/#business` },
      inLanguage: "en",
    },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader brands={brands} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
    </SmoothScroll>
  );
}
