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
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getSpaceBySlug } from "@/server/spaces";
import { getBrandBySlug } from "@/server/brands";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wardrobes",
  description:
    "Wardrobes and storage systems by Mrida — walk-in suites, sliding wardrobes, and modular storage designed for Indian homes.",
};

const wardrobeTypes = [
  {
    title: "Walk-In Wardrobes",
    description:
      "A room dedicated to getting dressed. Floor-to-ceiling storage, island units, and finishes that make the whole space feel considered.",
    image: "/images/placeholders/wardrobe-1.svg",
    eyebrow: "Luxury · Spacious",
  },
  {
    title: "Sliding Door Wardrobes",
    description:
      "Space-efficient and seamless. Sliding systems that suit smaller rooms without compromising on storage or finish quality.",
    image: "/images/placeholders/wardrobe-2.svg",
    eyebrow: "Space-Saving · Sleek",
  },
  {
    title: "Modular Wardrobes",
    description:
      "Configured exactly to your wall dimensions, ceiling height, and what you need to store — every shelf, drawer, and hanging section planned.",
    image: "/images/placeholders/wardrobe-3.svg",
    eyebrow: "Custom · Flexible",
  },
];

export default async function WardrobesPage() {
  const [wardrobeSpace, mrida] = await Promise.all([
    safeQuery(() => getSpaceBySlug("wardrobe"), null),
    safeQuery(() => getBrandBySlug("mrida"), null),
  ]);

  const inspirations = wardrobeSpace?.featuredInspirations ?? [];
  const collections = wardrobeSpace?.collections ?? [];

  return (
    <>
      <PageViewTracker event="inspiration_viewed" sourceType="wardrobes" />

      <PageHero
        eyebrow="Wardrobes by Mrida"
        title="Storage designed like furniture"
        description="Every wardrobe we build is a Mrida project — measured for your room, planned around what you own, and finished like the rest of your home."
        image={wardrobeSpace?.space.heroImage ?? "/images/placeholders/wardrobe-1.svg"}
      >
        <Button href="/book-consultation" variant="accent">
          Book Wardrobe Consultation
        </Button>
        <Button href="/mrida" variant="outline-light">
          About Mrida
        </Button>
      </PageHero>

      {/* Mrida brand section */}
      <Section>
        <Container size="wide">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src={resolveImage(
                    mrida?.brand.heroImage ?? "/images/placeholders/wardrobe-2.svg",
                    { width: 1200, enhance: "render" }
                  )}
                  alt="Mrida wardrobes"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Heading
                eyebrow="Sumanglam's Wardrobe Studio"
                title="Mrida"
                description={
                  mrida?.brand.description ??
                  "Sumanglam's in-house brand for modular kitchens, wardrobes, and customized interior solutions for Indian homes."
                }
              />
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                {mrida?.brand.story ??
                  "Mrida wardrobes are designed around the way you live — how much you own, how you like to access it, and what the rest of your room demands. Every project begins with your walls and ends with a finished wardrobe that looks like it was always meant to be there."}
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

      {/* Wardrobe types */}
      <Section tone="clay">
        <Container size="wide">
          <Reveal>
            <Heading
              eyebrow="Find Your Configuration"
              title="Three ways to build your wardrobe"
              description="From dedicated walk-in suites to space-saving sliding systems — every configuration is built to Mrida's standard."
            />
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {wardrobeTypes.map((type, index) => (
              <Reveal key={type.title} delay={index * 0.08}>
                <VisualCard
                  href="/book-consultation"
                  image={type.image}
                  eyebrow={type.eyebrow}
                  title={type.title}
                  description={type.description}
                  imageSizes="(min-width: 768px) 33vw, 100vw"
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Inspirations */}
      {inspirations.length > 0 && (
        <Section>
          <Container size="wide">
            <Reveal>
              <Heading
                eyebrow="Wardrobe Inspirations"
                title="Ideas worth opening"
                description="Walk-ins, sliding systems, and storage walls from the Mrida studio."
              />
            </Reveal>
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {inspirations.slice(0, 6).map((inspiration, index) => (
                <Reveal key={inspiration.id} delay={(index % 3) * 0.08}>
                  <VisualCard
                    href={`/inspiration/${inspiration.slug}`}
                    image={inspiration.primaryImage}
                    title={inspiration.title}
                    description={inspiration.shortDescription}
                  />
                </Reveal>
              ))}
            </div>
            <div className="mt-10">
              <Button href="/inspiration?space=wardrobe" variant="outline">
                All Wardrobe Inspirations
              </Button>
            </div>
          </Container>
        </Section>
      )}

      {/* Collections */}
      {collections.length > 0 && (
        <Section tone="clay" spacing="compact">
          <Container size="wide">
            <Heading eyebrow="Wardrobe Collections" title="Browse by style" />
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
      )}

      {/* CTA */}
      <Section tone="ink" spacing="spacious">
        <Container size="narrow" className="text-center">
          <Reveal>
            <Heading
              align="center"
              eyebrow="Made for Your Room"
              title="A wardrobe that fits — your space and your life"
              description="Bring your room's measurements, or just your ideas. A Mrida designer will plan the rest with you."
              tone="light"
            />
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/book-consultation" variant="accent" size="lg">
                Book Consultation
              </Button>
              <WhatsAppButton sourceType="wardrobes" variant="outline-light" size="lg" />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
