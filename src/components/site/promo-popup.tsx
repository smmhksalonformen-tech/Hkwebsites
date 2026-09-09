"use client";

import { useEffect, useState } from "react";
import { X, GraduationCap, MessageCircle } from "lucide-react";

const SEEN_KEY = "hk_student_promo_seen_v1";

export function PromoPopup({ whatsapp }: { whatsapp: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  const waText = encodeURIComponent(
    "Hi HK Salon For Men — I'd like details on your new student packages."
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
      onClick={close}
    >
      <div
        className="relative w-full max-h-[92dvh] overflow-y-auto rounded-t-3xl border border-ink-line bg-ink-soft p-6 shadow-2xl shadow-black/60 sm:max-w-md sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-ink-line text-cream/70 transition-colors hover:border-bronze hover:text-cream"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bronze/15 text-bronze">
          <GraduationCap className="h-6 w-6" />
        </div>

        <p className="mt-5 font-mono text-[11px] uppercase tracking-luxe-sm text-bronze">
          New at HK Salon For Men
        </p>
        <h2 id="promo-title" className="mt-2 font-display text-3xl text-cream sm:text-4xl">
          Student Packages Are Here
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-cream/65">
          New deals and grooming packages built for students — sharp cuts, beard shaping and full sessions at
          student-friendly rates. Tap through to see them all and enquire in one message.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href="/deals"
            onClick={close}
            className="rounded-xl bg-bronze px-5 py-3 text-center text-xs font-bold uppercase tracking-wide text-ink-deep transition-colors hover:bg-champagne"
          >
            View All Packages
          </a>
          <a
            href={`https://wa.me/${whatsapp}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink-line px-5 py-3 text-xs font-bold uppercase tracking-wide text-cream transition-colors hover:border-bronze"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" /> Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
