"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked — the value is still visible to copy by hand.
    }
  }

  return (
    <button type="button" onClick={handleCopy} className="shrink-0 p-1 text-cream/40 hover:text-bronze" aria-label="Copy">
      {copied ? <Check className="h-3.5 w-3.5 text-bronze" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
