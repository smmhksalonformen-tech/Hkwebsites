"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { src: "/founder/2.jpg", alt: "Hadiqa Kiani wearing the Sitara-i-Imtiaz medal" },
  { src: "/founder/1.jpg", alt: "Hadiqa Kiani, founder of HK Salon For Men" },
  { src: "/founder/3.jpg", alt: "Hadiqa Kiani smiling, wearing the Sitara-i-Imtiaz medal" },
  { src: "/founder/4.jpg", alt: "Hadiqa Kiani in the garden, wearing the Sitara-i-Imtiaz medal" },
  { src: "/founder/5.jpg", alt: "Hadiqa Kiani, recipient of Pakistan's Sitara-i-Imtiaz" },
  { src: "/founder/6.jpg", alt: "Archival photo of Hadiqa Kiani receiving the Tamgha-i-Imtiaz" },
];

export function FounderCarousel() {
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }
  function next() {
    setIndex((i) => (i + 1) % SLIDES.length);
  }

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
      {SLIDES.map((slide, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <button
        type="button"
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-cream backdrop-blur-sm hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-cream backdrop-blur-sm hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to photo ${i + 1}`}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-bronze" : "bg-cream/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
