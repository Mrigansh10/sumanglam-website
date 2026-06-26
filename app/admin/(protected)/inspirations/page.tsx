import type { Metadata } from "next";
import Link from "next/link";
import { supabase, rows } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Admin — Inspirations",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminInspirationsPage() {
  const { data } = await supabase
    .from("inspirations")
    .select("*, space:spaces(id, title)")
    .order("updated_at", { ascending: false });

  const inspirations = rows<Record<string, unknown>>(data);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Inspirations</h1>
        <Link
          href="/admin/inspirations/new"
          className="bg-ink px-4 py-2 text-sm font-medium text-background transition hover:bg-ink/80"
        >
          + New Inspiration
        </Link>
      </div>

      <div className="overflow-x-auto rounded border border-line">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead className="border-b border-line bg-clay/60 text-xs uppercase tracking-luxe text-ink-soft">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Space</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Featured</th>
              <th className="px-5 py-3 font-medium">Image</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {inspirations.map((item) => {
              const space = item.space as Record<string, unknown> | null;
              return (
                <tr key={item.id as string} className="align-middle">
                  <td className="px-5 py-3 font-medium">{item.title as string}</td>
                  <td className="px-5 py-3 text-ink-soft">{space?.title as string ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-medium ${item.status === "published" ? "text-green-700" : "text-ink-faint"}`}
                    >
                      {item.status as string}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-soft">
                    {item.isFeatured ? "Yes" : "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-soft">
                    {item.primaryImage ? (
                      <span className="text-green-700">Uploaded</span>
                    ) : (
                      <span className="text-amber-600">None</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/inspirations/${item.id as string}`}
                      className="text-xs text-ink-soft underline hover:text-ink"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
