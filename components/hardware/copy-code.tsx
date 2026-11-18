"use client";

import { useState } from "react";

/** The product code with a one-tap copy, for pasting into WhatsApp. */
export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the code stays visible to copy by hand.
    }
  }

  return (
    <p className="flex items-center gap-2.5 text-sm text-fg/60">
      Code <span className="font-medium text-fg">{code}</span>
      <button
        type="button"
        onClick={copy}
        className="rounded-md bg-card/55 px-[9px] py-[5px] text-[13px] text-fg transition-colors hover:bg-card"
      >
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </p>
  );
}
