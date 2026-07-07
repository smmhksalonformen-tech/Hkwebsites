"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Faq = { question: string; answer: string };

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={f.question} className="rounded-xl border border-ink-line overflow-hidden">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="font-display text-lg text-cream">{f.question}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-bronze transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <div className="px-5 pb-4 text-sm text-cream/60 leading-relaxed">{f.answer}</div>}
        </div>
      ))}
    </div>
  );
}
