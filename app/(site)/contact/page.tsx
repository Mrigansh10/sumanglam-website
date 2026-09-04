import type { Metadata } from "next";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/features/whatsapp/whatsapp-button";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Sumanglam showroom — phone, WhatsApp, email, directions, and business hours.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a person, not a form"
        description="Call, WhatsApp, or walk in — whichever suits you. We answer quickly during showroom hours."
      />

      <Section>
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Heading title="Reach us" />
              <dl className="mt-8 space-y-6 text-base">
                <div className="flex items-start gap-4">
                  <Phone className="mt-1 size-5 shrink-0 text-accent-deep" aria-hidden />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
                      Phone
                    </dt>
                    <dd className="mt-1 flex flex-col gap-0.5">
                      {[
                        siteConfig.contact.phone,
                        siteConfig.contact.phoneSecondary,
                        siteConfig.contact.phoneTertiary,
                      ].map((number) => (
                        <a
                          key={number}
                          href={`tel:${number.replace(/\s/g, "")}`}
                          className="text-ink hover:text-accent-deep"
                        >
                          {number}
                        </a>
                      ))}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 size-5 shrink-0 text-accent-deep" aria-hidden />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="text-ink hover:text-accent-deep"
                      >
                        {siteConfig.contact.email}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 size-5 shrink-0 text-accent-deep" aria-hidden />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
                      Showroom
                    </dt>
                    <dd className="mt-1 text-ink">{siteConfig.contact.address}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="mt-1 size-5 shrink-0 text-accent-deep" aria-hidden />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-luxe text-ink-faint">
                      Hours
                    </dt>
                    <dd className="mt-1 text-ink">{siteConfig.contact.hours}</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <WhatsAppButton sourceType="contact" variant="primary" size="lg" />
                <Button href="/book-consultation" variant="outline" size="lg">
                  Book Consultation
                </Button>
              </div>
            </div>

            <iframe
              src={siteConfig.contact.mapsEmbed}
              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sumanglam showroom location"
              className="min-h-72 w-full"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
