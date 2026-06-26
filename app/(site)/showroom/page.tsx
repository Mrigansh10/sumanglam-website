import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { getShowroomSections } from "@/server/showroom";
import { safeQuery } from "@/server/safe";
import { resolveImage } from "@/lib/images";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Showroom Experience",
  description:
    "Visit the Sumanglam showroom — four floors of full-scale kitchens, wardrobes, hardware, and appliances you can see and touch before deciding.",
};

const consultationProcess = [
  { step: "Welcome", copy: "Arrive, settle in, and tell us about your project over a coffee." },
  { step: "Walk the Floors", copy: "See full-scale kitchens, wardrobes, and hardware — guided or at your own pace." },
  { step: "Talk Details", copy: "Materials, layouts, timelines, and honest budget ranges with a designer." },
  { step: "Take It Home", copy: "Leave with ideas and next steps — never an obligation." },
];

export default async function ShowroomPage() {
  const sections = await safeQuery(getShowroomSections, []);

  return (
    <>
      <PageViewTracker event="showroom_viewed" sourceType="showroom" />
      <PageHero
        eyebrow="The Showroom Experience"
        title="Some decisions need to be touched"
        description="Screens can't tell you how a drawer closes or how a finish feels in evening light. Our showroom can."
        image="/images/placeholders/showroom-1.svg"
        size="tall"
      >
        <Button href="/contact" variant="accent">
          Plan Your Visit
        </Button>
        <WhatsAppButton sourceType="showroom" variant="outline-light" />
      </PageHero>

      {/* Floors */}
      <Section>
        <Container size="wide">
          <Reveal>
            <Heading
              eyebrow="Four Floors"
              title="A guided route through your home"
              description="Each floor is built around a part of your project — walk them in order or head straight to what matters."
            />
          </Reveal>
          <div className="mt-12 space-y-16">
            {sections.map((section, index) => (
              <Reveal key={section.id}>
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                      <Image
                        src={resolveImage(section.images[0], { width: 1200 })}
                        alt={section.name}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
                    <p className="text-xs font-medium uppercase tracking-luxe text-accent-deep">
                      {section.floorNumber === 0
                        ? "Ground Floor"
                        : `Floor ${section.floorNumber}`}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
                      {section.name}
                    </h3>
                    <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-soft">
                      {section.description}
                    </p>
                    {section.brands.length > 0 ? (
                      <p className="mt-4 text-sm text-ink-faint">
                        Featuring:{" "}
                        {section.brands
                          .slice(0, 6)
                          .map((entry) => entry.brand.name)
                          .join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Consultation process */}
      <Section tone="clay">
        <Container size="wide">
          <Reveal>
            <Heading
              eyebrow="What a Visit Looks Like"
              title="No pressure, just a plan"
            />
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {consultationProcess.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.08}>
                <div className="border-t border-ink/15 pt-5">
                  <p className="font-display text-sm text-accent-deep">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-lg text-ink">{item.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Visit details */}
      <Section tone="ink">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <Heading
                eyebrow="Plan Your Visit"
                title="We're easy to find, and easier to talk to"
                tone="light"
              />
              <div className="mt-8 space-y-4 text-sm text-background/80">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent-soft" aria-hidden />
                  {siteConfig.contact.address}
                </p>
                <p className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-accent-soft" aria-hidden />
                  {siteConfig.contact.hours}
                </p>
                <p className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent-soft" aria-hidden />
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    className="hover:text-background"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </p>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/book-consultation" variant="accent" size="lg">
                  Book Consultation
                </Button>
                <WhatsAppButton sourceType="showroom" variant="outline-light" size="lg" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <iframe
                src={siteConfig.contact.mapsEmbed}
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sumanglam showroom location"
                className="min-h-64 w-full"
              />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
