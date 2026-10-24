import type { Metadata } from "next";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { HomeHero } from "@/components/home/home-hero";
import { BusinessRows } from "@/components/home/business-rows";
import { IdeasRail } from "@/components/home/ideas-rail";
import { WardrobesFeature } from "@/components/home/wardrobes-feature";
import { HardwareFeature } from "@/components/home/hardware-feature";
import { getHomepageShowcase } from "@/server/homepage";
import { getHomepageImages } from "@/server/site-settings";
import { safeQuery } from "@/server/safe";

export const dynamic = "force-dynamic";

// Brand-first tab title (user preference: "Sumanglam" must be visible even on
// a narrow tab); local search intent carried by the rest of the title + description.
export const metadata: Metadata = {
  title: { absolute: "Sumanglam — Premium Modular Kitchens, Jaipur" },
  description:
    "Sumanglam is Jaipur's premium showroom for modular kitchens — German kitchens by Nolte, luxury personalized kitchens by Mrida — plus wardrobes, branded hardware, and built-in appliances. Visit us at New Aatish Market.",
};

/**
 * V2 homepage. Hero + the three business rows read the admin-managed image
 * slots (Admin → Homepage, server/site-settings.ts); the wardrobe and hardware
 * photos are fixed in their components.
 */
export default async function HomePage() {
  const [images, { kitchenIdeas, hardwareLogos }] = await Promise.all([
    getHomepageImages(),
    safeQuery(getHomepageShowcase, { kitchenIdeas: [], hardwareLogos: [] }),
  ]);

  // Never show the same picture twice on one page: an idea already used as a
  // business-row image drops out of the rail.
  const slotImages = new Set(Object.values(images));
  const ideas = kitchenIdeas.filter((idea) => !slotImages.has(idea.primaryImage ?? ""));

  return (
    <>
      <PageViewTracker event="homepage_viewed" />
      <HomeHero image={images.hero} />
      <BusinessRows images={images} />
      {ideas.length > 0 ? <IdeasRail ideas={ideas} /> : null}
      <WardrobesFeature />
      <HardwareFeature logos={hardwareLogos} />
    </>
  );
}
