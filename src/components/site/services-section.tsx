"use client";

import { useMemo, useState } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { BookButton } from "./book-button";

type Service = { title: string; category: string; description: string; duration: string; price: string };

const CATEGORIES = ["All", "Haircut & Styling", "Beard & Shave", "Facials & Skin", "Hair Colour", "Hands & Feet", "Massage & Relaxation"];
const INITIAL_COUNT = 9;

export function ServicesSection({ services }: { services: Service[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory = category === "All" || s.category === category;
      const matchesQuery = query.trim().length === 0 || s.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [services, category, query]);

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div>
          <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze">The menu</p>
          <h2 className="font-display text-4xl sm:text-5xl text-cream mt-1">Services</h2>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services"
            className="w-full rounded-lg border border-ink-line bg-ink-soft pl-9 pr-3 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:border-bronze focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors ${
              category === c
                ? "border-bronze bg-bronze text-ink-deep"
                : "border-ink-line text-cream/70 hover:border-bronze/50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-cream/50 text-center py-12">No services match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((s) => (
            <div key={s.title} className="rounded-xl border border-ink-line bg-ink-soft p-6 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl text-cream">{s.title}</h3>
                <span className="shrink-0 text-xs text-bronze whitespace-nowrap">{s.price ?? "On request"}</span>
              </div>
              <p className="text-sm text-cream/60 leading-relaxed">{s.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-ink-line">
                <span className="flex items-center gap-1.5 text-xs text-cream/40">
                  <Clock className="h-3.5 w-3.5" /> {s.duration}
                </span>
                <BookButton
                  prefill={s.title}
                  className="flex items-center gap-1 text-xs font-semibold tracking-wide uppercase text-bronze hover:text-champagne transition-colors"
                >
                  Book <ArrowRight className="h-3 w-3" />
                </BookButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {!expanded && filtered.length > INITIAL_COUNT && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setExpanded(true)}
            className="rounded-full border border-bronze/40 px-6 py-2.5 text-xs font-semibold tracking-luxe-sm uppercase text-bronze hover:bg-bronze/10 transition-colors"
          >
            + Show all {filtered.length} services
          </button>
        </div>
      )}

      <p className="text-center text-xs text-cream/40 mt-8">
        Some à la carte prices vary with length and volume. For exact pricing, message us on WhatsApp.
      </p>
    </div>
  );
}
