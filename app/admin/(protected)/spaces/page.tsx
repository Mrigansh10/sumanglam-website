import type { Metadata } from "next";
import Link from "next/link";
import { supabase, rows } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Admin — Spaces",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSpacesPage() {
  const { data } = await supabase
    .from("spaces")
    .select("*")
    .order("title", { ascending: true });

  const spaces = rows<Record<string, unknown>>(data);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Spaces</h1>
      <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
        Spaces power the category pages (Kitchens, Wardrobes, …). Set each
        space&apos;s hero banner image and intro copy here.
      </p>

      <div className="overflow-x-auto rounded border border-line">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead className="border-b border-line bg-clay/60 text-xs uppercase tracking-luxe text-ink-soft">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Hero Image</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {spaces.map((space) => (
              <tr key={space.id as string} className="align-middle">
                <td className="px-5 py-3 font-medium">{space.title as string}</td>
                <td className="px-5 py-3 font-mono text-xs text-ink-soft">{space.slug as string}</td>
                <td className="px-5 py-3 text-xs">
                  {space.heroImage && !(space.heroImage as string).startsWith("/") ? (
                    <span className="text-green-700">Uploaded</span>
                  ) : (
                    <span className="text-amber-600">Placeholder</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/spaces/${space.id as string}`}
                    className="text-xs text-ink-soft underline hover:text-ink"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!spaces.length ? (
        <p className="text-sm text-ink-soft">No spaces found.</p>
      ) : null}
    </div>
  );
}
