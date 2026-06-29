"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";

type Slots = {
  hero: string;
  kitchens: string;
  wardrobes: string;
  hardware: string;
};

export default function HomepageSettingsPage() {
  const [form, setForm] = useState<Slots | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/v1/admin/settings/homepage")
      .then((r) => r.json())
      .then((json) => setForm(json.data?.images ?? null))
      .catch(() => setError("Could not load homepage settings."));
  }, []);

  function set(key: keyof Slots, value: string) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSuccess(false);
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/v1/admin/settings/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Save failed.");
      } else {
        setForm(json.data.images);
        setSuccess(true);
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return <p className="text-sm text-ink-soft">{error ?? "Loading…"}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Homepage</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          The hero banner and the three &ldquo;Explore Your Journey&rdquo; cards.
          Upload 3D renders &mdash; they&rsquo;re automatically restored and
          upscaled for crisp full-bleed display.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ImageUpload
          label="Hero banner (top of homepage)"
          value={form.hero}
          folder="sumanglam/home"
          aspectRatio="landscape"
          onChange={(id) => set("hero", id)}
        />
        <ImageUpload
          label="Kitchens & Appliances card"
          value={form.kitchens}
          folder="sumanglam/home"
          aspectRatio="landscape"
          onChange={(id) => set("kitchens", id)}
        />
        <ImageUpload
          label="Wardrobes card"
          value={form.wardrobes}
          folder="sumanglam/home"
          aspectRatio="landscape"
          onChange={(id) => set("wardrobes", id)}
        />
        <ImageUpload
          label="Hardware card"
          value={form.hardware}
          folder="sumanglam/home"
          aspectRatio="landscape"
          onChange={(id) => set("hardware", id)}
        />
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
