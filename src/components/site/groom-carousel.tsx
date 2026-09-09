"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const DEFAULT_IMAGES = ["02", "03", "04", "06", "07", "09", "10", "C_P-11", "C_P-2", "C_P-3", "C_P-4"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function GroomCarousel({ images = DEFAULT_IMAGES }: { images?: string[] }) {
  // Start in source order (stable for SSR/hydration), shuffle once on mount so
  // the run of looks feels different every visit.
  const [IMAGES, setImages] = useState(images);
  useEffect(() => setImages(shuffle(images)), [images]);

  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const paused = useRef(false);

  useEffect(() => {
    function updateCount() {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    }
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (paused.current || lightbox !== null) return;
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [lightbox]);

  function prev() {
    setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  }
  function next() {
    setIndex((i) => (i + 1) % IMAGES.length);
  }

  const visible = Array.from({ length: visibleCount }, (_, i) => IMAGES[(index + i) % IMAGES.length]);

  return (
    <div className="relative" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((id, i) => (
          <button
            key={`${id}-${index}-${i}`}
            type="button"
            onClick={() => setLightbox(IMAGES.indexOf(id))}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] transition-transform duration-500 ease-out"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/groom/${id}.webp`}
              alt="Groom styling and sherwani-ready grooming at HK Salon For Men"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous photos"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-cream backdrop-blur-sm hover:bg-black/80 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next photos"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-cream backdrop-blur-sm hover:bg-black/80 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-6 flex justify-center gap-1.5">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to photo ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-bronze" : "w-1.5 bg-cream/30"}`}
          />
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-cream/30 bg-black/50 text-cream hover:bg-black/70"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i - 1 + IMAGES.length) % IMAGES.length));
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-cream/30 bg-black/50 text-cream hover:bg-black/70 sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/groom/${IMAGES[lightbox]}.webp`}
            alt="Groom styling and sherwani-ready grooming at HK Salon For Men"
            className="max-h-[85vh] w-auto rounded-xl border border-cream/10 object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i + 1) % IMAGES.length));
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-cream/30 bg-black/50 text-cream hover:bg-black/70 sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
