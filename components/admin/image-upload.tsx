"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { resolveImage } from "@/lib/images";

interface ImageUploadProps {
  value?: string | null;
  onChange: (publicId: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
}

type Mode = "file" | "url";

export function ImageUpload({
  value,
  onChange,
  folder = "sumanglam",
  label = "Image",
  aspectRatio = "landscape",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("file");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "portrait"
        ? "aspect-[3/4]"
        : "aspect-[16/9]";

  async function upload(body: FormData) {
    setError(null);
    setUploading(true);
    try {
      const res = await fetch("/api/v1/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error?.message ?? "Upload failed.");
        return;
      }
      onChange(json.data.publicId);
      setUrlInput("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleFile(file: File) {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    await upload(body);
  }

  async function handleUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const body = new FormData();
    body.append("url", trimmed);
    body.append("folder", folder);
    await upload(body);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>

      {/* Preview / drop zone */}
      <div
        className={`relative ${aspectClass} w-full overflow-hidden border border-dashed border-line bg-clay/40 transition hover:border-ink/40`}
        onClick={() => mode === "file" && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
      >
        {value ? (
          <Image src={resolveImage(value, { width: 800 })} alt={label} fill className="object-cover" />
        ) : null}

        {mode === "file" && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 text-center ${value ? "bg-ink/40 opacity-0 hover:opacity-100" : ""} cursor-pointer transition`}>
            {uploading ? (
              <p className="text-sm font-medium text-background">Uploading…</p>
            ) : (
              <>
                <p className="text-sm font-medium text-ink-soft">
                  {value ? "Replace image" : "Click or drag to upload"}
                </p>
                <p className="text-xs text-ink-faint">JPG, PNG, WEBP · max 20 MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mode tabs */}
      <div className="flex gap-0 border border-line">
        {(["file", "url"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(null); }}
            className={`flex-1 py-1.5 text-xs transition ${
              mode === m
                ? "bg-ink text-background"
                : "bg-background text-ink-soft hover:text-ink"
            }`}
          >
            {m === "file" ? "Upload file" : "Import from URL"}
          </button>
        ))}
      </div>

      {/* URL input */}
      {mode === "url" && (
        <div className="flex gap-2">
          <input
            className="admin-input flex-1"
            placeholder="Paste image URL from brand website…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrl(); } }}
          />
          <button
            type="button"
            onClick={handleUrl}
            disabled={uploading || !urlInput.trim()}
            className="shrink-0 bg-ink px-4 text-sm text-background transition hover:bg-ink/80 disabled:opacity-40"
          >
            {uploading ? "…" : "Import"}
          </button>
        </div>
      )}

      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      {value && !value.startsWith("/") ? (
        <p className="truncate text-xs text-ink-faint">ID: {value}</p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
