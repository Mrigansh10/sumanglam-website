import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { VisualCard } from "@/components/shared/visual-card";
import { SolutionBrandPage } from "@/features/brands/solution-brand-page";
import { getBrandBySlug } from "@/server/brands";
import { safeQuery } from "@/server/safe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mrida — Kitchens, Wardrobes & Custom Interiors",
  description:
    "Mrida is Sumanglam's in-house solution brand: modular kitchens, premium wardrobes, and customized interior solutions designed for Indian homes.",
};

// Mrida owns kitchens AND wardrobes (project-vault rules).
const pillars = [
  {
    title: "Modular Kitchens",
    copy: "Kitchens planned around Indian cooking — masala pull-outs, tall larders, and worktops that handle real use.",
  },
  {
    title: "Premium Wardrobes",
    copy: "Walk-ins, sliding systems, and storage walls — wardrobes designed around what you actually own.",
  },
  {
    title: "Customized Solutions",
    copy: "TV units, vanities, pooja units, study corners — interiors completed in the same hand as the kitchen.",
  },
  {
    title: "Designed for Indian Homes",
    copy: "Materials, hardware, and layouts chosen for Indian climates, families, and routines.",
  },
  {
    title: "Personalized Design",
    copy: "Every project starts with your home's measurements and your family's habits — never a catalog page.",
  },
  {
    title: "One Accountable Team",
    copy: "Design, production, and installation under one roof, with one team answerable for the result.",
  },
];

export default async function MridaPage() {
  const data = await safeQuery(() => getBrandBySlug("mrida"), null);
  if (!data) notFound();

  return (
    <SolutionBrandPage
      data={data}
      eyebrow="Sumanglam's In-House Solution Brand"
      pillars={pillars}
      ctaTitle="Design your home with Mrida"
      ctaDescription="From a single wardrobe to a complete home, every Mrida project begins with a conversation and a measuring tape."
    >
      {/* Wardrobe spotlight — wardrobes live under Mrida */}
      <Section tone="clay">
        <Container size="wide">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Heading
                eyebrow="Mrida Wardrobes"
                title="Wardrobes, the Mrida way"
                description="Storage designed like furniture — walk-in suites, sliding systems, and full storage walls."
              />
              <Button href="/wardrobes" variant="outline" size="sm">
                Explore Mrida Wardrobes
              </Button>
            </div>
          </Reveal>
          <Stagger className="mt-10 grid gap-8 md:grid-cols-2">
            <VisualCard
              href="/wardrobes"
              image="sumanglam/inspirations/ivory-jali-walk-in-2"
              title="Walk-In Wardrobes"
              description="Dedicated dressing spaces with open hanging, glass drawers, and islands."
              imageSizes="(min-width: 768px) 50vw, 100vw"
            />
            <VisualCard
              href="/wardrobes"
              image="sumanglam/inspirations/bronze-glass-walk-in-2"
              title="Sliding & Storage Walls"
              description="Full-height wardrobes that read as architecture, not furniture."
              imageSizes="(min-width: 768px) 50vw, 100vw"
            />
          </Stagger>
        </Container>
      </Section>
    </SolutionBrandPage>
  );
}
