"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";

type Space = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
};

export default function SpaceEditPage() {
  const { id } = useParams<{ id: string }>();

  const [space, setSpace] = useState<Space | null>(null);
  const [form, setForm] = useState<Partial<Space>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/admin/spaces/${id}`)
      .then((r) => r.json())
      .then((json) => {
        const s = json.data?.space ?? null;
        setSpace(s);
        if (s) setForm(s);
      });
  }, [id]);

  function set(key: keyof Space, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/v1/admin/spaces/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description ?? undefined,
          heroImage: form.heroImage ?? undefined,
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

  if (!space) {
    return <p className="text-sm text-ink-soft">Loading…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin/spaces" className="text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="font-display text-2xl">{space.title}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left — text fields */}
        <div className="space-y-5">
          <Field label="Title">
            <input
              className="admin-input"
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>

          <Field label="Slug (used in page URLs — read-only)">
            <input
              className="admin-input font-mono text-sm opacity-60"
              value={form.slug ?? ""}
              readOnly
            />
          </Field>

          <Field label="Intro Description (shown beneath the hero)">
            <textarea
              className="admin-input min-h-32 resize-y"
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </div>

        {/* Right — hero image */}
        <div className="space-y-6">
          <ImageUpload
            label="Hero Image (banner at the top of the category page)"
            value={form.heroImage}
            folder="sumanglam/spaces"
            aspectRatio="landscape"
            onChange={(publicId) => set("heroImage", publicId)}
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
