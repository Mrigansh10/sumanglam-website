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

// Cloudinary's free plan rejects uploads over 10 MB. Hero/banner images only
// ever render at ~2560px wide, so we downscale large source photos in the
// browser before upload — this keeps full-res phone shots (often 12–25 MB)
// well under the limit and avoids the "Something went wrong" upload failure.
const MAX_EDGE = 3000;
const TARGET_BYTES = 9 * 1024 * 1024;

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

/**
 * Returns a downscaled JPEG Blob, or null to signal "upload the original as-is"
 * (small enough already, or not a rasterizable image like SVG).
 */
async function compressImage(file: File): Promise<Blob | null> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return null;

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => null);
  if (!bitmap) return null;

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= TARGET_BYTES) {
    bitmap.close?.();
    return null; // already small enough — keep original quality
  }

  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return null;
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  let quality = 0.85;
  let blob = await canvasToBlob(canvas, quality);
  while (blob && blob.size > TARGET_BYTES && quality > 0.5) {
    quality -= 0.1;
    blob = await canvasToBlob(canvas, quality);
  }
  return blob;
}

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
    setError(null);
    let blob: Blob | null = null;
    try {
      blob = await compressImage(file);
    } catch {
      blob = null; // fall back to the original file if anything goes wrong
    }
    const body = new FormData();
    if (blob) {
      const name = file.name.replace(/\.[^./\\]+$/, "") + ".jpg";
      body.append("file", blob, name);
    } else {
      body.append("file", file);
    }
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
                <p className="text-xs text-ink-faint">JPG, PNG, WEBP · large photos optimized automatically</p>
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
