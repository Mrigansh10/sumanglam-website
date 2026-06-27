import type { Metadata } from "next";
import type { ContentStatus } from "@/server/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  contentStatusLabels,
  contentStatusOptions,
  getAdminContentLists,
  type FeaturedContentType,
  type StatusContentType,
} from "@/server/admin";
import { setContentFeaturedAction, setContentStatusAction } from "../actions";

export const metadata: Metadata = {
  title: "Admin Content",
  robots: { index: false, follow: false },
};

function formatDate(value: string | number | Date | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  // Supabase REST returns timestamps as ISO strings; coerce before formatting.
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function StatusControl({
  type,
  id,
  status,
  label,
}: {
  type: StatusContentType;
  id: string;
  status: ContentStatus;
  label: string;
}) {
  return (
    <form action={setContentStatusAction} className="flex gap-2">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={id} />
      <Select
        name="status"
        defaultValue={status}
        aria-label={`Status for ${label}`}
        className="h-9 min-w-32 text-xs"
      >
        {contentStatusOptions.map((option) => (
          <option key={option} value={option}>
            {contentStatusLabels[option]}
          </option>
        ))}
      </Select>
      <button
        type="submit"
        className="border border-line px-3 text-xs transition hover:border-ink"
      >
        Save
      </button>
    </form>
  );
}

function FeaturedControl({
  type,
  id,
  isFeatured,
  label,
}: {
  type: FeaturedContentType;
  id: string;
  isFeatured: boolean;
  label: string;
}) {
  return (
    <form action={setContentFeaturedAction}>
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="featured" value={isFeatured ? "false" : "true"} />
      <button
        type="submit"
        aria-label={`${isFeatured ? "Unfeature" : "Feature"} ${label}`}
        className="border border-line px-3 py-2 text-xs transition hover:border-ink"
      >
        {isFeatured ? "Featured" : "Not featured"}
      </button>
    </form>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="px-5 py-12 text-center text-sm text-ink-soft">
      No {label} yet.
    </div>
  );
}

export default async function AdminContentPage() {
  const { inspirations, brands, products, collections, showroomSections } =
    await getAdminContentLists();

  const featuredSections: {
    key: FeaturedContentType;
    title: string;
    description: string;
    items: {
      id: string;
      label: string;
      slug: string;
      status: ContentStatus;
      isFeatured: boolean;
      updatedAt: string | Date;
    }[];
  }[] = [
    {
      key: "inspiration",
      title: "Inspirations",
      description:
        "Visual-first concepts linked to spaces, collections, brands, and products.",
      items: inspirations.map((item) => ({ ...item, label: item.title })),
    },
    {
      key: "brand",
      title: "Brands",
      description:
        "Solution and product brands. Nolte and Mrida require distinct treatment.",
      items: brands.map((item) => ({ ...item, label: item.name })),
    },
    {
      key: "product",
      title: "Products",
      description: "Research and inquiry products. No ecommerce checkout.",
      items: products.map((item) => ({ ...item, label: item.name })),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Content</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Manage publish state and featured placement for showroom content.
        </p>
        <p className="mt-1 text-xs text-ink-faint">
          Full create and edit forms use the documented admin content APIs
          under /api/v1/admin.
        </p>
      </div>

      {featuredSections.map((section) => (
        <Card key={section.key}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="border-b border-line bg-clay/60 text-xs uppercase tracking-luxe text-ink-soft">
                  <tr>
                    <th className="px-5 py-4 font-medium">Title</th>
                    <th className="px-5 py-4 font-medium">Slug</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Featured</th>
                    <th className="px-5 py-4 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {section.items.map((item) => (
                    <tr key={item.id} className="align-top">
                      <td className="px-5 py-4">
                        <p className="font-medium">{item.label}</p>
                        <p className="mt-1 text-xs text-ink-faint">{item.id}</p>
                      </td>
                      <td className="px-5 py-4 text-ink-soft">{item.slug}</td>
                      <td className="px-5 py-4">
                        <StatusControl
                          type={section.key}
                          id={item.id}
                          status={item.status}
                          label={item.label}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <FeaturedControl
                          type={section.key}
                          id={item.id}
                          isFeatured={item.isFeatured}
                          label={item.label}
                        />
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        {formatDate(item.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!section.items.length ? (
              <EmptyState label={section.title.toLowerCase()} />
            ) : null}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Collections</CardTitle>
          <CardDescription>
            Curated inspiration groupings for space-first browsing.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="border-b border-line bg-clay/60 text-xs uppercase tracking-luxe text-ink-soft">
                <tr>
                  <th className="px-5 py-4 font-medium">Title</th>
                  <th className="px-5 py-4 font-medium">Slug</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {collections.map((collection) => (
                  <tr key={collection.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium">{collection.title}</p>
                      <p className="mt-1 text-xs text-ink-faint">{collection.id}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-soft">{collection.slug}</td>
                    <td className="px-5 py-4">
                      <StatusControl
                        type="collection"
                        id={collection.id}
                        status={collection.status}
                        label={collection.title}
                      />
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {formatDate(collection.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!collections.length ? <EmptyState label="collections" /> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Showroom sections</CardTitle>
          <CardDescription>
            Physical areas that drive showroom visit intent.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="border-b border-line bg-clay/60 text-xs uppercase tracking-luxe text-ink-soft">
                <tr>
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Floor</th>
                  <th className="px-5 py-4 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {showroomSections.map((section) => (
                  <tr key={section.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium">{section.name}</p>
                      <p className="mt-1 text-xs text-ink-faint">{section.id}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {section.floorNumber ?? "Not set"}
                    </td>
                    <td className="px-5 py-4 text-ink-soft">
                      {formatDate(section.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showroomSections.length ? (
            <EmptyState label="showroom sections" />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
