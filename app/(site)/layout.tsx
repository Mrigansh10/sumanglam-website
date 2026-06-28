import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { FloatingWhatsApp } from "@/features/whatsapp/floating-whatsapp";
import { siteConfig } from "@/lib/site";
import { supabase, rows } from "@/lib/supabase";
import type { HeaderBrand } from "@/components/layout/site-header";

// LocalBusiness structured data. Address/phone are placeholders until the
// business confirms official details (project-vault/15_Open_Questions.md).
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
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
