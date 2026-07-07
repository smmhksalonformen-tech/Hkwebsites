"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function WhatsAppFloat({ whatsapp }: { whatsapp: string }) {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {showBubble && (
        <div className="relative max-w-[230px] animate-bubble-in rounded-2xl rounded-br-sm border border-ink-line bg-ink-soft px-4 py-3 text-sm shadow-2xl shadow-black/40">
          <button
            type="button"
            onClick={() => setShowBubble(false)}
            aria-label="Dismiss"
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink-line text-cream/70 hover:text-cream transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="font-display text-cream">HK Salon For Men</p>
          <p className="mt-1 text-cream/60">Hi 👋 How can we help you?</p>
        </div>
      )}
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 animate-whatsapp-float items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 hover:scale-105 transition-transform"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.06 23.617a.75.75 0 0 0 .918.903l5.98-1.56A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.659-.526-5.166-1.438l-.37-.22-3.831.999 1.027-3.713-.242-.382A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>
    </div>
  );
}
