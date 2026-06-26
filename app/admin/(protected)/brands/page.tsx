import type { Metadata } from "next";
import Link from "next/link";
import { supabase, rows } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Admin — Brands",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("brand_type", { ascending: true })
    .order("name", { ascending: true });

  const brands = rows<Record<string, unknown>>(data);
  const solution = brands.filter((b) => b.brandType === "solution");
  const product = brands.filter((b) => b.brandType === "product");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Brands</h1>

      {[
        { label: "Kitchen & Wardrobe Solution Brands", items: solution },
        { label: "Hardware & Appliance Brands", items: product },
      ].map(({ label, items }) => (
        <div key={label}>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-luxe text-ink-faint">
            {label}
          </h2>
          <div className="overflow-x-auto rounded border border-line">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead className="border-b border-line bg-clay/60 text-xs uppercase tracking-luxe text-ink-soft">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Featured</th>
                  <th className="px-5 py-3 font-medium">Hero Image</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((brand) => (
                  <tr key={brand.id as string} className="align-middle">
                    <td className="px-5 py-3 font-medium">{brand.name as string}</td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-soft">{brand.slug as string}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-medium ${brand.status === "published" ? "text-green-700" : "text-ink-faint"}`}
                      >
                        {brand.status as string}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-soft">
                      {brand.isFeatured ? "Yes" : "—"}
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-soft">
                      {brand.heroImage && !(brand.heroImage as string).startsWith("/") ? (
                        <span className="text-green-700">Uploaded</span>
                      ) : (
                        <span className="text-amber-600">Placeholder</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/brands/${brand.id as string}`}
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
        </div>
      ))}
    </div>
  );
}
