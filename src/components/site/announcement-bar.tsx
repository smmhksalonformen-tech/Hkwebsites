"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { BookButton } from "./book-button";

export function AnnouncementBar({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-champagne text-ink-deep text-xs sm:text-sm">
      <div className="mx-auto max-w-[1200px] px-4 py-2 flex items-center justify-center gap-2 relative">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        <span className="text-center">
          {text}{" "}
          <BookButton className="underline underline-offset-2 font-semibold hover:no-underline">
            Book your chair
          </BookButton>
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 text-ink-deep/60 hover:text-ink-deep"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
