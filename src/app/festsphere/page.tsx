import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { FestsphereEntryForm } from "@/components/festsphere/entry-form";

export const metadata: Metadata = {
  title: "Fest Sphere Mega Summer Bazar | HK Salon For Men",
  description: "Claim your 10% off coupon for HK Salon For Men at the Fest Sphere Mega Summer Bazar, Royal Orchard Multan.",
};

export default function FestspherePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-luxe text-bronze">HK Salon For Men &times; Fest Sphere</p>
          <h1 className="font-display mt-3 text-4xl italic text-champagne sm:text-5xl">Mega Summer Bazar</h1>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm text-cream/70">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-bronze" /> 25 July, Saturday
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-bronze" /> 6 PM &ndash; 11 PM
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-bronze" /> Royal Orchard, Multan
            </span>
          </div>

          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-cream/60">
            Visit the HK Salon For Men stand at the bazar and fill in your details below to instantly claim
            <span className="text-bronze"> 10% off</span> your next visit.
          </p>
        </div>

        <div className="mt-10">
          <FestsphereEntryForm />
        </div>
      </div>
    </main>
  );
}
