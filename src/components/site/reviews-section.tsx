"use client";

import { useState } from "react";
import { Star, ExternalLink } from "lucide-react";

type Review = { id: string; quote: string; author: string; source: string; rating: number };

const INITIAL_COUNT = 4;
const GOOGLE_REVIEW_URL = "https://g.page/r/CcZfkbrCmCFLEAE/review";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? reviews : reviews.slice(0, INITIAL_COUNT);

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-10">
        <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze">What clients are saying</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl text-cream">Reviews</h2>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-2 rounded-lg border border-bronze/40 px-5 py-2.5 text-xs font-bold tracking-luxe-sm uppercase text-bronze hover:bg-bronze/10 transition-colors"
        >
          Leave Us A Review On Google <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-cream/40">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visible.map((r) => (
            <div key={r.id} className="rounded-xl border border-ink-line bg-ink-soft p-6 flex flex-col">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < r.rating ? "fill-bronze text-bronze" : "text-ink-line"}`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm text-cream/80 leading-relaxed flex-1">&ldquo;{r.quote}&rdquo;</p>
              <p className="mt-4 text-xs text-cream/50">
                {r.author} <span className="text-cream/30">· via {r.source}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {!expanded && reviews.length > INITIAL_COUNT && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full border border-bronze/40 px-6 py-2.5 text-xs font-semibold tracking-luxe-sm uppercase text-bronze hover:bg-bronze/10 transition-colors"
          >
            + Load more reviews
          </button>
        </div>
      )}
    </div>
  );
}
