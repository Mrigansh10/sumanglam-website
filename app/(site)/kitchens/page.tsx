import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { VisualCard } from "@/components/shared/visual-card";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getSpaceBySlug } from "@/server/spaces";
import { getBrandBySlug } from "@/server/brands";
import { getProductTaxonomy } from "@/server/products";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Modular Kitchens in Jaipur",
  description:
    "Premium modular kitchens in Jaipur by Nolte and Mrida — German precision, luxury acrylic and lacquer finishes, and personalized Indian design under one roof.",
};

export default async function KitchensPage() {
  const [kitchenSpace, nolte, mrida, taxonomy] = await Promise.all([
    safeQuery(() => getSpaceBySlug("kitchen"), null),
    safeQuery(() => getBrandBySlug("nolte"), null),
    safeQuery(() => getBrandBySlug("mrida"), null),
    safeQuery(getProductTaxonomy, []),
  ]);

  const inspirations = kitchenSpace?.featuredInspirations ?? [];
  const collections = kitchenSpace?.collections ?? [];
  const appliance = taxonomy.find((type) => type.slug === "appliance");

  return (
    <>
      <PageViewTracker event="inspiration_viewed" sourceType="kitchens" />
      <PageHero
        eyebrow="Kitchens"
        title="The room your home revolves around"
        description="Two ways to get there: Nolte's German design systems, or Mrida's made-for-you modular kitchens. Both begin with how you cook."
        image={kitchenSpace?.space.heroImage ?? "/images/placeholders/kitchen-1.svg"}
      >
        <Button href="/book-consultation" variant="accent">
          Book Kitchen Consultation
        </Button>
        <Button href="/showroom" variant="outline-light">
          Visit Showroom
        </Button>
      </PageHero>

      {/* Nolte */}
      <Section>
        <Container size="wide">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src={resolveImage(nolte?.brand.heroImage ?? "/images/placeholders/kitchen-1.svg", { width: 1200, enhance: "render" })}
                  alt="Nolte kitchens"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Heading
                eyebrow="Premium German Kitchens"
                title="Nolte"
                description={
                  nolte?.brand.description ??
                  "Premium German kitchen solutions — design systems built around precision, quality, and luxury living."
                }
              />
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                {nolte?.brand.story ??
                  "Complete kitchen systems, planned and engineered as one coherent space."}
              </p>
              <div className="mt-7">
                <Button href="/nolte" variant="outline">
                  Explore Nolte Kitchens
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Mrida */}
      <Section tone="clay">
        <Container size="wide">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="lg:order-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src={resolveImage(mrida?.brand.heroImage ?? "/images/placeholders/kitchen-2.svg", { width: 1200, enhance: "render" })}
                  alt="Mrida kitchens"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:order-1">
              <Heading
                eyebrow="Personalized Modular Kitchens"
                title="Mrida"
                description={
                  mrida?.brand.description ??
                  "Sumanglam's in-house brand for modular kitchens, wardrobes, and customized interior solutions for Indian homes."
                }
              />
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                Mrida kitchens are measured, designed, and built around your
                family — including the wardrobes and storage that complete the
                rest of the home.
              </p>
              <div className="mt-7">
                <Button href="/mrida" variant="outline">
                  Explore Mrida
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Built-in appliances */}
      {appliance && appliance.categories.length > 0 ? (
        <Section>
          <Container size="wide">
            <Reveal>
              <Heading
                eyebrow="Appliances"
                title="Built to live inside the kitchen"
                description="Cooking, cooling, and cleaning, integrated into the cabinetry — Bosch, Siemens, Liebherr, Häfele, and Blaupunkt."
              />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {appliance.categories.map((category) => (
                <div
                  key={category.id}
                  className="border border-line bg-surface px-5 py-4"
                >
                  <span className="text-sm font-medium text-ink sm:text-base">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Kitchen inspirations */}
      {inspirations.length > 0 ? (
        <Section>
          <Container size="wide">
            <Reveal>
              <Heading
                eyebrow="Kitchen Inspirations"
                title="Ideas to cook with"
                description="Complete kitchen concepts from our studio and showroom floors."
              />
            </Reveal>
            <Stagger className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {inspirations.slice(0, 6).map((inspiration) => (
                <VisualCard
                  key={inspiration.id}
                  href={`/inspiration/${inspiration.slug}`}
                  image={inspiration.primaryImage}
                  title={inspiration.title}
                  description={inspiration.shortDescription}
                />
              ))}
            </Stagger>
            <div className="mt-10">
              <Button href="/inspiration?space=kitchen" variant="outline">
                All Kitchen Inspirations
              </Button>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Collections + philosophy */}
      {collections.length > 0 ? (
        <Section tone="clay" spacing="compact">
          <Container size="wide">
            <Heading eyebrow="Kitchen Collections" title="Browse by style" />
            <div className="mt-8 flex flex-wrap gap-3">
              {collections.map((collection) => (
                <Button
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  variant="outline"
                  size="sm"
                >
                  {collection.title}
                </Button>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section tone="ink">
        <Container size="narrow" className="text-center">
          <Heading
            align="center"
            eyebrow="Our Design Philosophy"
            title="A kitchen is planned twice"
            description="Once around how you cook — the rhythm, the reach, the routine. Then around how it looks. Get the first right and the second follows. That's how we design every kitchen, German or Mrida."
            tone="light"
          />
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/book-consultation" variant="accent" size="lg">
              Book Kitchen Consultation
            </Button>
            <WhatsAppButton sourceType="kitchens" variant="outline-light" size="lg" />
          </div>
        </Container>
      </Section>
    </>
  );
}
