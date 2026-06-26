import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InspirationForm } from "@/components/admin/inspiration-form";
import { supabase, rows, camelizeRecord } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Admin — Edit Inspiration",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditInspirationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: inspirRaw }, { data: spacesRaw }, { data: brandsRaw }, { data: brandLinks }] =
    await Promise.all([
      supabase.from("inspirations").select("*").eq("id", id).limit(1),
      supabase.from("spaces").select("id, title").order("title", { ascending: true }),
      supabase.from("brands").select("id, name").order("name", { ascending: true }),
      supabase
        .from("inspiration_brands")
        .select("brand_id")
        .eq("inspiration_id", id),
    ]);

  if (!inspirRaw?.length) notFound();
  const inspiration = camelizeRecord<Record<string, unknown>>(inspirRaw[0]);

  const spaces = rows<{ id: string; title: string }>(spacesRaw);
  const brands = rows<{ id: string; name: string }>(brandsRaw);
  const brandIds = (brandLinks ?? []).map((l) => l.brand_id as string);

  // Map lowercase status to uppercase for the form type
  const statusMap: Record<string, "DRAFT" | "PUBLISHED" | "ARCHIVED"> = {
    draft: "DRAFT",
    published: "PUBLISHED",
    archived: "ARCHIVED",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/inspirations" className="text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-display text-2xl">{inspiration.title as string}</h1>
      </div>
      <InspirationForm
        spaces={spaces}
        brands={brands}
        mode="edit"
        initial={{
          id: inspiration.id as string,
          title: inspiration.title as string,
          slug: inspiration.slug as string,
          spaceId: inspiration.spaceId as string,
          shortDescription: (inspiration.shortDescription as string) ?? "",
          longDescription: (inspiration.longDescription as string) ?? "",
          primaryImage: (inspiration.primaryImage as string) ?? "",
          isFeatured: inspiration.isFeatured as boolean,
          status: statusMap[(inspiration.status as string) ?? "published"] ?? "PUBLISHED",
          brandIds,
        }}
      />
    </div>
  );
}
