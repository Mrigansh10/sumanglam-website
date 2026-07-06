import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Stagger } from "@/components/motion/stagger";
import { resolveImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sumanglam is a premium interior showroom for kitchens, wardrobes, hardware, and appliances — built on customization, expertise, and trust.",
};

// Company story copy is placeholder-quality and conservative by design:
// no metrics, no claims that aren't documented. Replace with the founders'
// real story before launch (project-vault/15_Open_Questions.md).
const values = [
  {
    title: "Inspiration before inventory",
    copy: "We'd rather show you a finished space than a shelf of boxes. Ideas first; products follow.",
  },
  {
    title: "Honest guidance",
    copy: "If a cheaper hinge will outlast the expensive one, we'll say so. Trust is the product we actually sell.",
  },
  {
    title: "Craft in the details",
    copy: "The way a drawer closes matters as much as the way a kitchen photographs.",
  },
  {
    title: "Long relationships",
    copy: "Homes evolve. We build for the second visit, the referral, and the next project.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Sumanglam"
        title="A showroom built the way homes should be"
        description="Kitchens, wardrobes, hardware, and appliances — curated under one roof, by people who believe the details are the design."
        image="sumanglam/inspirations/greige-floating-shelf-kitchen-5"
      />

      <Section>
        <Container size="narrow">
          <Reveal>
            <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              Sumanglam began with a simple frustration: choosing the things a
              home is made of — the kitchen, the wardrobes, the hardware you
              touch a hundred times a day — usually means hopping between
              dealers, catalogs, and guesswork.
            </p>
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
              So we built one place where those decisions could be made
              properly: full-scale displays you can walk through, brands we
              genuinely stand behind, and designers who start with how you
              live rather than what&apos;s in stock. Through Mrida, our in-house
              solution brand, we design and build personalized kitchens and
              wardrobes. Through partners like Nolte, Hettich, Bosch, and
              Hafele, we bring engineering you don&apos;t have to take on faith.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section tone="clay">
        <Container size="wide">
          <Reveal>
            <Heading eyebrow="What We Believe" title="The values behind the showroom" />
          </Reveal>
          <Stagger className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="border-t border-ink/15 pt-5">
                <h3 className="font-display text-xl text-ink">{value.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                  {value.copy}
                </p>
              </div>
            ))}
          </Stagger>
        </Container>
      </Section>

      <Section>
        <Container size="wide">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image
                  src={resolveImage("sumanglam/inspirations/taupe-charcoal-evening-kitchen-9", { width: 1200, enhance: "render" })}
                  alt="Inside the Sumanglam showroom"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Heading
                eyebrow="See It Yourself"
                title="The best introduction is a visit"
              description="Spend twenty minutes on our floors and you&apos;ll know whether we&apos;re your kind of people. We think you&apos;ll stay longer."
              />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact">Visit Us</Button>
                <Button href="/book-consultation" variant="outline">
                  Book Consultation
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
