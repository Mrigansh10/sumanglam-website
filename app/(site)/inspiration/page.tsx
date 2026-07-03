import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/layout/heading";
import { PageHero } from "@/components/shared/page-hero";
import { VisualCard } from "@/components/shared/visual-card";
import { Stagger } from "@/components/motion/stagger";
import { EmptyState } from "@/components/shared/empty-state";
import { PageViewTracker } from "@/components/shared/page-view-tracker";
import { Button } from "@/components/ui/button";
import { listInspirations } from "@/server/inspirations";
import { getCollections } from "@/server/collections";
import { getSpaces } from "@/server/spaces";
import { safeQuery } from "@/server/safe";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inspiration",
  description:
    "Browse kitchen, wardrobe, hardware, and appliance inspirations — complete spaces designed to spark your own.",
};

type SearchParams = Promise<{ space?: string; collection?: string; page?: string }>;

export default async function InspirationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ items, pagination }, collections, spaces] = await Promise.all([
    safeQuery(
      () =>
        listInspirations({
          page,
          limit: 12,
          space: params.space,
          collection: params.collection,
        }),
      { items: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 1 } },
    ),
    safeQuery(getCollections, []),
    safeQuery(getSpaces, []),
  ]);

  const activeCollection = collections.find((c) => c.slug === params.collection);

  const filterHref = (space?: string) => {
    const query = new URLSearchParams();
    if (space) query.set("space", space);
    const qs = query.toString();
    return qs ? `/inspiration?${qs}` : "/inspiration";
  };

  return (
    <>
      <PageViewTracker event="inspiration_viewed" sourceType="listing" />
      <PageHero
        eyebrow="Inspiration"
        title={activeCollection ? activeCollection.title : "Spaces worth imagining"}
        description={
          activeCollection?.shortDescription ??
          "Begin with complete spaces — kitchens, wardrobes, and the details that finish them. Products and brands follow naturally."
        }
      />

      <Section spacing="compact">
        <Container size="wide">
          {/* Space filter — simple, documented basic filtering only */}
          <nav aria-label="Filter by space" className="flex flex-wrap gap-2">
            <Link
              href={filterHref()}
              className={cn(
                "border px-4 py-2 text-sm transition-colors",
                !params.space
                  ? "border-ink bg-ink text-background"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink",
              )}
            >
              All Spaces
            </Link>
            {spaces.map((space) => (
              <Link
                key={space.id}
                href={filterHref(space.slug)}
                className={cn(
                  "border px-4 py-2 text-sm transition-colors",
                  params.space === space.slug
                    ? "border-ink bg-ink text-background"
                    : "border-line text-ink-soft hover:border-ink hover:text-ink",
                )}
              >
                {space.title}
              </Link>
            ))}
          </nav>

          {items.length > 0 ? (
            <>
              <Stagger className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((inspiration) => (
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
              {pagination.totalPages > 1 ? (
                <div className="mt-12 flex items-center justify-center gap-3">
                  {pagination.page > 1 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/inspiration?${new URLSearchParams({
                        ...(params.space ? { space: params.space } : {}),
                        ...(params.collection ? { collection: params.collection } : {}),
                        page: String(pagination.page - 1),
                      })}`}
                    >
                      Previous
                    </Button>
                  ) : null}
                  <span className="text-sm text-ink-soft">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  {pagination.page < pagination.totalPages ? (
                    <Button
                      variant="outline"
                      size="sm"
                      href={`/inspiration?${new URLSearchParams({
                        ...(params.space ? { space: params.space } : {}),
                        ...(params.collection ? { collection: params.collection } : {}),
                        page: String(pagination.page + 1),
                      })}`}
                    >
                      Next
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="No inspirations here yet"
                description="We're curating this collection. In the meantime, explore other spaces or visit the showroom to see ideas in person."
                action={{ label: "Browse All Inspirations", href: "/inspiration" }}
              />
            </div>
          )}
        </Container>
      </Section>

      {/* Collections */}
      {!params.collection && collections.length > 0 ? (
        <Section tone="clay">
          <Container size="wide">
            <Heading
              eyebrow="Curated Collections"
              title="Browse by collection"
              description="Groupings our designers return to again and again."
            />
            <Stagger className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <VisualCard
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  image={collection.coverImage}
                  eyebrow={collection.space?.title}
                  title={collection.title}
                  description={collection.shortDescription}
                  ratio="landscape"
                />
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
