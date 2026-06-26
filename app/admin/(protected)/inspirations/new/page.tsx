import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InspirationForm } from "@/components/admin/inspiration-form";
import { supabase, rows } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Admin — New Inspiration",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewInspirationPage() {
  const [{ data: spacesRaw }, { data: brandsRaw }] = await Promise.all([
    supabase.from("spaces").select("id, title").order("title", { ascending: true }),
    supabase.from("brands").select("id, name").order("name", { ascending: true }),
  ]);

  const spaces = rows<{ id: string; title: string }>(spacesRaw);
  const brands = rows<{ id: string; name: string }>(brandsRaw);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/inspirations" className="text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-display text-2xl">New Inspiration</h1>
      </div>
      <InspirationForm spaces={spaces} brands={brands} mode="create" />
    </div>
  );
}
