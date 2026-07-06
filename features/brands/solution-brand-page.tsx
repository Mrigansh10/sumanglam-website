import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { VisualCard } from "@/components/shared/visual-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import type { getBrandBySlug } from "@/server/brands";

type BrandData = NonNullable<Awaited<ReturnType<typeof getBrandBySlug>>>;

type SolutionBrandPageProps = {
  data: BrandData;
  eyebrow: string;
  /** Pillars shown under the story — design philosophy / focus areas. */
  pillars: Array<{ title: string; copy: string }>;
  /** Extra sections rendered between inspirations and the closing CTA. */
  children?: React.ReactNode;
  ctaTitle: string;
  ctaDescription: string;
};

/**
 * Shared layout for solution-brand pages (Nolte, Mrida). Brand storytelling
 * first, inspirations second, consultation close — never a product filter.
 */
export function SolutionBrandPage({
  data,
  eyebrow,
  pillars,
  children,
  ctaTitle,
  ctaDescription,
}: SolutionBrandPageProps) {
  const { brand, inspirations } = data;

  return (
    <>
      <PageViewTracker event="brand_viewed" sourceType="brand" sourceId={brand.slug} />
      <PageHero
        eyebrow={eyebrow}
        title={brand.name}
        description={brand.description ?? undefined}
        image={brand.heroImage}
        size="tall"
      >
        <Button href="/book-consultation" variant="accent">
          Book Consultation
        </Button>
        <Button href="/contact" variant="outline-light">
          Visit Showroom
        </Button>
      </PageHero>

      {/* Story */}
      {brand.story ? (
        <Section spacing="compact">
          <Container size="narrow">
            <Reveal>
              <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                {brand.story}
              </p>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* Pillars */}
      <Section tone="clay">
        <Container size="wide">
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={(index % 3) * 0.08}>
                <div className="border-t border-ink/15 pt-5">
                  <h3 className="font-display text-xl text-ink">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {pillar.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Inspirations */}
      <Section>
        <Container size="wide">
          <Reveal>
            <Heading
              eyebrow="In Practice"
              title={`${brand.name} inspirations`}
              description="Spaces designed with this brand at their core."
            />
          </Reveal>
          {inspirations.length > 0 ? (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {inspirations.slice(0, 6).map((inspiration, index) => (
                <Reveal key={inspiration.id} delay={(index % 3) * 0.08}>
                  <VisualCard
                    href={`/inspiration/${inspiration.slug}`}
                    image={inspiration.primaryImage}
                    eyebrow={inspiration.space?.title}
                    title={inspiration.title}
                    description={inspiration.shortDescription}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="Inspirations coming soon"
                description={`We're photographing ${brand.name} spaces for the site. See them in person at the showroom meanwhile.`}
                action={{ label: "Visit Us", href: "/contact" }}
              />
            </div>
          )}
        </Container>
      </Section>

      {children}

      {/* Closing CTA */}
      <Section tone="ink" spacing="spacious">
        <Container size="narrow" className="text-center">
          <Heading
            align="center"
            eyebrow="Next Step"
            title={ctaTitle}
            description={ctaDescription}
            tone="light"
          />
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/book-consultation" variant="accent" size="lg">
              Book Consultation
            </Button>
            <WhatsAppButton
              sourceType="brand"
              sourceId={brand.slug}
              subject={brand.name}
              variant="outline-light"
              size="lg"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
