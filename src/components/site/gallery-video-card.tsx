"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function GalleryVideoCard({
  image,
  videoUrl,
  alt,
  className,
}: {
  image: string;
  videoUrl?: string | null;
  alt: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleClick() {
    if (!videoUrl) return;
    setPlaying(true);
    setTimeout(() => videoRef.current?.play(), 50);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn("relative block w-full h-full overflow-hidden bg-ink-soft group", className)}
      disabled={!videoUrl}
    >
      {playing && videoUrl ? (
        <video ref={videoRef} src={videoUrl} controls playsInline className="h-full w-full object-cover" />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {videoUrl && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-deep">
                <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
              </span>
            </span>
          )}
        </>
      )}
    </button>
  );
}
