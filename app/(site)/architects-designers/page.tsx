import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { BrandCard } from "@/components/shared/brand-card";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getBrands } from "@/server/brands";
import { safeQuery } from "@/server/safe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Architects & Designers",
  description:
    "Partner with Sumanglam — premium brand access, technical guidance, and showroom support for architects, interior designers, and builders.",
};

// Lead-generation page only. No portal, accounts, or trade dashboard in V1
// (project-vault/17_Forbidden_Things.md).
const supports = [
  {
    title: "Brand & Product Access",
    copy: "One showroom for Nolte, Hettich, Blum, Bosch, Häfele, Yale, and more — compare real samples with your clients.",
  },
  {
    title: "Technical Guidance",
    copy: "Specification details, hardware compatibility, and installation considerations answered by people who work with these systems daily.",
  },
  {
    title: "Client Presentations",
    copy: "Use the showroom floors to walk your clients through materials and finishes at full scale.",
  },
  {
    title: "Project Coordination",
    copy: "Delivery timelines, site coordination, and after-sales support handled with your project schedule in mind.",
  },
];

export default async function ArchitectsDesignersPage() {
  const { productBrands } = await safeQuery(getBrands, {
    solutionBrands: [],
    productBrands: [],
  });

  return (
    <>
      <PageViewTracker event="brand_cta_clicked" sourceType="architects" />
      <PageHero
        eyebrow="Architects & Designers"
        title="A showroom that works like a partner"
        description="Bring your projects, your clients, and your specifications. We'll bring brand depth, technical answers, and floor space to present them."
        image="sumanglam/inspirations/taupe-charcoal-evening-kitchen-6"
      >
        <Button href="/book-consultation" variant="accent">
          Schedule a Discussion
        </Button>
        <WhatsAppButton sourceType="architects" variant="outline-light" />
      </PageHero>

      <Section>
        <Container size="wide">
          <Reveal>
            <Heading
              eyebrow="How We Support Professionals"
              title="What working with us looks like"
            />
          </Reveal>
          <Stagger className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {supports.map((item) => (
              <div key={item.title} className="border-t border-line pt-5">
                <h3 className="font-display text-xl text-ink">{item.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                  {item.copy}
                </p>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {productBrands.length > 0 ? (
        <Section tone="clay">
          <Container size="wide">
            <Reveal>
              <Heading
                eyebrow="The Ecosystem"
                title="Brands you can specify with confidence"
              />
            </Reveal>
            <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productBrands.slice(0, 6).map((brand) => (
                <BrandCard
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  name={brand.name}
                  description={brand.description}
                  heroImage={brand.heroImage}
                  parentBrandName={brand.parentBrand?.name}
                />
              ))}
            </Stagger>
            <div className="mt-10">
              <Button href="/brands" variant="outline">
                Explore All Brands
              </Button>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="ink" spacing="spacious">
        <Container size="narrow" className="text-center">
          <Heading
            align="center"
            eyebrow="Let's Talk Projects"
            title="Schedule a discussion"
            description="Tell us about your practice and current projects — we'll set up a conversation at the showroom or on a call."
            tone="light"
          />
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/book-consultation" variant="accent" size="lg">
              Schedule a Discussion
            </Button>
            <WhatsAppButton sourceType="architects" variant="outline-light" size="lg" />
          </div>
        </Container>
      </Section>
    </>
  );
}
