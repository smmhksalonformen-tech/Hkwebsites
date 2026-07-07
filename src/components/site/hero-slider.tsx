"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  "/hero/slide-1.jpg",
  "/hero/slide-2.jpg",
  "/hero/slide-3.jpg",
  "/hero/slide-4.jpg",
  "/hero/slide-5.jpg",
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-deep">
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover grayscale" />
        </div>
      ))}

      {/* Dark wash so overlaid text stays readable */}
      <div className="absolute inset-0 bg-ink-deep/70" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(62% 55% at 50% 38%, rgba(201,177,139,0.18), rgba(0,0,0,0) 70%)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-deep/50 via-transparent to-ink" />
    </div>
  );
}
