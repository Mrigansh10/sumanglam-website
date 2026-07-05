"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/admin/image-upload";

type Space = { id: string; title: string; slug: string };
type Brand = { id: string; name: string };

type FormState = {
  title: string;
  slug: string;
  spaceId: string;
  shortDescription: string;
  longDescription: string;
  primaryImage: string;
  isFeatured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  brandIds: string[];
};

interface InspirationFormProps {
  spaces: Pick<Space, "id" | "title">[];
  brands: Brand[];
  initial?: Partial<FormState> & { id?: string };
  mode: "create" | "edit";
}

function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function InspirationForm({ spaces, brands, initial, mode }: InspirationFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    spaceId: initial?.spaceId ?? (spaces[0]?.id ?? ""),
    shortDescription: initial?.shortDescription ?? "",
    longDescription: initial?.longDescription ?? "",
    primaryImage: initial?.primaryImage ?? "",
    isFeatured: initial?.isFeatured ?? false,
    status: initial?.status ?? "PUBLISHED",
    brandIds: initial?.brandIds ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: mode === "create" ? toSlug(value) : prev.slug,
    }));
  }

  function toggleBrand(id: string) {
    setForm((prev) => ({
      ...prev,
      brandIds: prev.brandIds.includes(id)
        ? prev.brandIds.filter((b) => b !== id)
        : [...prev.brandIds, id],
    }));
  }

  async function submit() {
    setSaving(true);
    setError(null);
    const payload = {
      title: form.title,
      slug: form.slug,
      spaceId: form.spaceId,
      shortDescription: form.shortDescription || undefined,
      longDescription: form.longDescription || undefined,
      primaryImage: form.primaryImage || undefined,
      isFeatured: form.isFeatured,
      status: form.status,
      brandIds: form.brandIds,
    };
    try {
      const url =
        mode === "create"
          ? "/api/v1/admin/inspirations"
          : `/api/v1/admin/inspirations/${initial?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Save failed.");
      } else {
        router.push("/admin/inspirations");
        router.refresh();
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left — fields */}
      <div className="space-y-5">
        <Field label="Title">
          <input
            className="admin-input"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </Field>

        <Field label="Slug (URL)">
          <input
            className="admin-input font-mono text-sm"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </Field>

        <Field label="Space">
          <select
            className="admin-input"
            value={form.spaceId}
            onChange={(e) => set("spaceId", e.target.value)}
          >
            {spaces.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select
            className="admin-input"
            value={form.status}
            onChange={(e) => set("status", e.target.value as FormState["status"])}
          >
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => set("isFeatured", e.target.checked)}
          />
          Featured on homepage
        </label>

        <Field label="Short Description (shown on cards)">
          <textarea
            className="admin-input min-h-20 resize-y"
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
          />
        </Field>

        <Field label="Long Description (shown on inspiration detail page)">
          <textarea
            className="admin-input min-h-36 resize-y"
            value={form.longDescription}
            onChange={(e) => set("longDescription", e.target.value)}
          />
        </Field>

        <Field label="Brands featured in this inspiration">
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => (
              <label
                key={b.id}
                className={`cursor-pointer border px-3 py-1.5 text-xs transition ${
                  form.brandIds.includes(b.id)
                    ? "border-ink bg-ink text-background"
                    : "border-line text-ink-soft hover:border-ink"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={form.brandIds.includes(b.id)}
                  onChange={() => toggleBrand(b.id)}
                />
                {b.name}
              </label>
            ))}
          </div>
        </Field>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={submit}
            disabled={saving}
            className="bg-ink px-5 py-2.5 text-sm font-medium text-background transition hover:bg-ink/80 disabled:opacity-50"
          >
            {saving ? "Saving…" : mode === "create" ? "Create Inspiration" : "Save Changes"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>

      {/* Right — image */}
      <div>
        <ImageUpload
          label="Primary Image"
          value={form.primaryImage}
          folder="sumanglam/inspirations"
          aspectRatio="landscape"
          onChange={(id) => set("primaryImage", id)}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</label>
      {children}
    </div>
  );
}
