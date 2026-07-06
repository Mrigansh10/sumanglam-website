import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { SplitHeadline } from "@/components/motion/split-headline";
import { Parallax } from "@/components/motion/parallax";
import { VisualCard } from "@/components/shared/visual-card";
import { BrandCard } from "@/components/shared/brand-card";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getHomepageData } from "@/server/homepage";
import { getHomepageImages } from "@/server/site-settings";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";
import { ReviewsSection } from "@/components/shared/reviews-section";
import { getGoogleReviews } from "@/server/google-reviews";
import { getApprovedReviews } from "@/server/reviews";

export const dynamic = "force-dynamic";

// Brand-first tab title (user preference: "Sumanglam" must be visible even on
// a narrow tab); local search intent carried by the rest of the title + description.
export const metadata: Metadata = {
  title: { absolute: "Sumanglam — Premium Modular Kitchens, Jaipur" },
  description:
    "Sumanglam is Jaipur's premium showroom for modular kitchens — German kitchens by Nolte, luxury personalized kitchens by Mrida — plus wardrobes, branded hardware, and built-in appliances. Visit us at New Aatish Market.",
};

// Homepage hero + "Explore Your Journey" card images are admin-managed via the
// site_settings table (Admin → Homepage). getHomepageImages() applies built-in
// defaults for any unset slot. See server/site-settings.ts.

const whySumanglam = [
  {
    title: "Customization",
    copy: "Every kitchen and wardrobe is planned around your home, your habits, and your taste — never from a template.",
  },
  {
    title: "Expert Guidance",
    copy: "Designers who listen first, then translate your brief into materials, layouts, and details that work.",
  },
  {
    title: "Premium Brands",
    copy: "Nolte, Hettich, Bosch, Häfele and more — curated partners we trust enough to put our name beside.",
  },
  {
    title: "Craftsmanship, Not Just Design",
    copy: "A kitchen or wardrobe is only as good as how it's installed. We hold our fitters to the same standard as our designers — every hinge, every finish, every edge.",
  },
  {
    title: "Design Support",
    copy: "From first sketch to final handover, one team stays accountable for your project.",
  },
  {
    title: "A Name People Pass On",
    copy: "Most of our clients were referred by someone whose home we'd already worked on. That trust — passed from one family to the next — is the reputation we work hardest to protect.",
  },
];

export default async function HomePage() {
  // showroomHighlights intentionally unused — the homepage Showroom Experience
  // section is temporarily removed until real showroom photos arrive.
  const { featuredInspirations, featuredBrands } = await safeQuery(
    getHomepageData,
    {
      featuredInspirations: [],
      featuredBrands: [],
      featuredProducts: [],
      showroomHighlights: [],
    },
  );
  const [googleReviews, siteReviews] = await Promise.all([
    getGoogleReviews().catch(() => null),
    getApprovedReviews().catch(() => []),
  ]);
  const IMAGES = await getHomepageImages();

  return (
    <>
      <PageViewTracker event="homepage_viewed" />

      {/* 1 — Hero */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
        <Parallax amount={12}>
          <Image
            src={resolveImage(IMAGES.hero, { width: 1920, enhance: "render" })}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/10" />
<Container size="wide" className="relative z-10 pb-40 pt-40 text-background sm:pb-28">
          <p className="mb-4 text-xs font-medium uppercase tracking-luxe text-accent-soft animate-fade-up">
            Premium Kitchens · Wardrobes · Hardware · Appliances
          </p>
          <SplitHeadline
            delay={0.15}
            className="max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Designed around your home.
          </SplitHeadline>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-background/80 sm:text-lg animate-fade-up [animation-delay:240ms]">
            A showroom where kitchens, wardrobes, and the details that hold them
            together are chosen the way they should be — in person, unhurried,
            with people who design for a living.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row animate-fade-up [animation-delay:360ms]">
            <Button href="/inspiration" size="lg" variant="accent">
              Explore Inspirations
            </Button>
            <Button href="/contact" size="lg" variant="outline-light">
              Visit Showroom
            </Button>
          </div>
        </Container>
      </section>

      {/* 2 — Explore Your Journey */}
      <Section>
        <Container size="wide">
          <Reveal>
            <Heading
              eyebrow="Begin Anywhere"
              title="Explore your journey"
              description="Start with the spaces you live in, or the details that complete them."
            />
          </Reveal>
          <Stagger className="mt-10 grid gap-8 md:grid-cols-3">
            <VisualCard
              href="/kitchens"
              image={IMAGES.kitchens}
              eyebrow="Nolte · Mrida · Bosch · Siemens"
              title="Kitchens & Appliances"
              description="Complete kitchen systems from Nolte and Mrida, paired with built-in appliances from Bosch, Siemens, Blaupunkt, and Liebherr."
              emphasis
              imageSizes="(min-width: 768px) 33vw, 100vw"
            />
            <VisualCard
              href="/wardrobes"
              image={IMAGES.wardrobes}
              eyebrow="Mrida · Modular · Walk-in"
              title="Wardrobes"
              description="Sliding doors, walk-in configurations, and modular storage systems — designed for your space and seen full-scale in our showroom."
              emphasis
              imageSizes="(min-width: 768px) 33vw, 100vw"
            />
            <VisualCard
              href="/hardware-appliances"
              image={IMAGES.hardware}
              eyebrow="Hettich · Blum · Häfele · Yale"
              title="Hardware"
              description="Hinges, handles, channels, locks, and fittings from Hettich, Blum, Häfele, Yale, Godrej, Dorset, and more — available independently."
              emphasis
              imageSizes="(min-width: 768px) 33vw, 100vw"
            />
          </Stagger>
        </Container>
      </Section>

      {/* 3 — Featured Inspirations */}
      {featuredInspirations.length > 0 ? (
        <Section tone="clay">
          <Container size="wide">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <Heading
                  eyebrow="Inspiration First"
                  title="Spaces worth imagining"
                  description="Recent ideas from our design studio and showroom floors."
                />
                <Button href="/inspiration" variant="outline" size="sm">
                  View All
                  <ArrowRight aria-hidden />
                </Button>
              </div>
            </Reveal>
            <Stagger className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {featuredInspirations.map((inspiration) => (
                <VisualCard
                  key={inspiration.id}
                  image={inspiration.primaryImage}
                  eyebrow={inspiration.space?.title}
                  title={inspiration.title}
                  description={inspiration.shortDescription}
                />
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      {/* 4 — Featured Brands */}
      {featuredBrands.length > 0 ? (
        <Section>
          <Container size="wide">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <Heading
                  eyebrow="Brands We Stand Behind"
                  title="Partners, not logos"
                  description="Every brand in our showroom earned its place — through engineering, design, and how it holds up in real homes."
                />
                <Button href="/brands" variant="outline" size="sm">
                  All Brands
                  <ArrowRight aria-hidden />
                </Button>
              </div>
            </Reveal>
            <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBrands.slice(0, 6).map((brand) => (
                <BrandCard
                  key={brand.id}
                  href={
                    brand.slug === "nolte"
                      ? "/nolte"
                      : brand.slug === "mrida"
                        ? "/mrida"
                        : `/brands/${brand.slug}`
                  }
                  name={brand.name}
                  description={brand.description}
                  heroImage={brand.heroImage}
                  brandType={brand.brandType}
                />
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      {/* 5 — Why Sumanglam */}
      <Section tone="ink">
        <Container size="wide">
          <Reveal>
            <Heading
              eyebrow="Why Sumanglam"
              title="The standard your home deserves"
              tone="light"
            />
          </Reveal>
          <Stagger className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {whySumanglam.map((item, index) => (
              <div key={item.title} className="border-t border-background/20 pt-5">
                <p className="font-display text-sm text-accent-soft">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-background/65">
                  {item.copy}
                </p>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 7 — Reviews */}
      <Section tone="clay">
        <Container size="wide">
          <Reveal>
            <Heading
              eyebrow="What Our Clients Say"
              title="Trusted by homeowners across Jaipur"
            />
          </Reveal>
          <div className="mt-12">
            <ReviewsSection googleData={googleReviews} siteReviews={siteReviews} />
          </div>
        </Container>
      </Section>

      {/* 8 — Consultation CTA */}
      <Section tone="clay" spacing="spacious">
        <Container size="narrow" className="text-center">
          <Reveal>
            <Heading
              align="center"
              eyebrow="Start a Conversation"
              title="Tell us about the home you're planning"
              description="A consultation is a conversation, not a commitment. Share your project and we'll bring the ideas, options, and honest advice."
            />
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/book-consultation" size="lg">
                Book Consultation
              </Button>
              <WhatsAppButton sourceType="homepage" size="lg" />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
