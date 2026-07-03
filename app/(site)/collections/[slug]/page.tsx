import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { VisualCard } from "@/components/shared/visual-card";
import { Stagger } from "@/components/motion/stagger";
import { EmptyState } from "@/components/shared/empty-state";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { getCollectionBySlug } from "@/server/collections";
import { safeQuery } from "@/server/safe";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await safeQuery(() => getCollectionBySlug(slug), null);
  if (!data) return { title: "Collection" };
  return {
    title: `${data.collection.title} Collection`,
    description: data.collection.shortDescription ?? undefined,
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await safeQuery(() => getCollectionBySlug(slug), null);
  if (!data) notFound();

  const { collection, inspirations, relatedCollections } = data;

  return (
    <>
      <PageViewTracker
        event="collection_viewed"
        sourceType="collection"
        sourceId={collection.slug}
      />
      <PageHero
        eyebrow={`${collection.space?.title ?? "Curated"} Collection`}
        title={collection.title}
        description={collection.longDescription ?? collection.shortDescription ?? undefined}
        image={collection.coverImage}
      />

      <Section>
        <Container size="wide">
          {inspirations.length > 0 ? (
            <Stagger className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {inspirations.map((inspiration) => (
                <VisualCard
                  key={inspiration.id}
                  href={`/inspiration/${inspiration.slug}`}
                  image={inspiration.primaryImage}
                  eyebrow={inspiration.space?.title}
                  title={inspiration.title}
                  description={inspiration.shortDescription}
                />
              ))}
            </Stagger>
          ) : (
            <EmptyState
              title="This collection is being curated"
              description="New inspirations are added as our designers complete them. Explore other collections meanwhile."
              action={{ label: "Browse All Inspirations", href: "/inspiration" }}
            />
          )}
        </Container>
      </Section>

      {relatedCollections.length > 0 ? (
        <Section tone="clay" spacing="compact">
          <Container size="wide">
            <Heading eyebrow="More to Explore" title="Related collections" />
            <Stagger className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCollections.map((related) => (
                <VisualCard
                  key={related.id}
                  href={`/collections/${related.slug}`}
                  image={related.coverImage}
                  title={related.title}
                  description={related.shortDescription}
                />
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
