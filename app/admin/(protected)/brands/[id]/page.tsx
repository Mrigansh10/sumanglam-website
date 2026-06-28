"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";

type Brand = {
  id: string;
  name: string;
  slug: string;
  brandType: "SOLUTION" | "PRODUCT";
  description: string | null;
  story: string | null;
  logo: string | null;
  heroImage: string | null;
  isFeatured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export default function BrandEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [brand, setBrand] = useState<Brand | null>(null);
  const [form, setForm] = useState<Partial<Brand>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/admin/brands/${id}`)
      .then((r) => r.json())
      .then((json) => {
        const raw = json.data?.brand ?? null;
        // Supabase stores enums lowercase ("solution"/"published"), but the
        // admin API contract + <select> options use uppercase. Normalize on
        // load so the form sends the values the validator expects.
        const b: Brand | null = raw
          ? {
              ...raw,
              brandType: raw.brandType?.toUpperCase() ?? "PRODUCT",
              status: raw.status?.toUpperCase() ?? "PUBLISHED",
            }
          : null;
        setBrand(b);
        if (b) setForm(b);
      });
  }, [id]);

  function set(key: keyof Brand, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/v1/admin/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          brandType: form.brandType,
          description: form.description ?? undefined,
          story: form.story ?? undefined,
          logo: form.logo ?? undefined,
          heroImage: form.heroImage ?? undefined,
          isFeatured: form.isFeatured,
          status: form.status,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Save failed.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (!brand) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin/brands" className="text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-display text-2xl">{brand.name}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left — text fields */}
        <div className="space-y-5">
          <Field label="Name">
            <input
              className="admin-input"
              value={form.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          <Field label="Slug">
            <input
              className="admin-input font-mono text-sm"
              value={form.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
            />
          </Field>

          <Field label="Brand Type">
            <select
              className="admin-input"
              value={form.brandType ?? "PRODUCT"}
              onChange={(e) => set("brandType", e.target.value)}
            >
              <option value="SOLUTION">Solution (kitchen / wardrobe system brand)</option>
              <option value="PRODUCT">Product (hardware / appliance brand)</option>
            </select>
          </Field>

          <Field label="Status">
            <select
              className="admin-input"
              value={form.status ?? "PUBLISHED"}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isFeatured ?? false}
              onChange={(e) => set("isFeatured", e.target.checked)}
            />
            Featured on homepage brands section
          </label>

          <Field label="Short Description (shown on brand cards)">
            <textarea
              className="admin-input min-h-24 resize-y"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <Field label="Brand Story (shown on brand detail page)">
            <textarea
              className="admin-input min-h-40 resize-y"
              value={form.story ?? ""}
              onChange={(e) => set("story", e.target.value)}
            />
          </Field>
        </div>

        {/* Right — images */}
        <div className="space-y-6">
          <ImageUpload
            label="Hero Image (banner on brand page)"
            value={form.heroImage}
            folder="sumanglam/brands"
            aspectRatio="landscape"
            onChange={(id) => set("heroImage", id)}
          />
          <ImageUpload
            label="Logo (shown on brand cards)"
            value={form.logo}
            folder="sumanglam/brands/logos"
            aspectRatio="square"
            onChange={(id) => set("logo", id)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          onClick={save}
          disabled={saving}
          className="bg-ink px-5 py-2.5 text-sm font-medium text-background transition hover:bg-ink/80 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {success && <p className="text-sm text-green-700">Saved.</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </label>
      {children}
    </div>
  );
}
