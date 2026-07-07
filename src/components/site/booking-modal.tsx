"use client";

import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Scissors, User, Calendar, MessageCircle } from "lucide-react";
import { useBooking } from "./booking-context";
import { createLead } from "@/lib/actions/leads";
import { formatPKR } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Option = { label: string; value: string };

const TIME_SLOTS = [
  "12:00 pm", "12:45 pm", "1:30 pm", "2:15 pm", "3:00 pm", "3:45 pm",
  "4:30 pm", "5:15 pm", "6:00 pm", "6:45 pm", "7:30 pm", "8:15 pm", "9:00 pm", "9:45 pm",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function readStored(key: string) {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

export function BookingModal({
  packages,
  services,
  team,
  whatsapp,
}: {
  packages: { title: string; price: number }[];
  services: { title: string }[];
  team: { name: string }[];
  whatsapp: string;
}) {
  const { open, prefill, closeBooking } = useBooking();
  const [step, setStep] = useState(0);
  const [service, setService] = useState<string | null>(prefill?.label ?? null);
  const [specialist, setSpecialist] = useState("No preference");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState(() => readStored("hk_booking_name"));
  const [phone, setPhone] = useState(() => readStored("hk_booking_phone"));
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(prefill ? 1 : 0);
    setService(prefill?.label ?? null);
    setDate(today());
  }, [open, prefill]);

  const options: Option[] = useMemo(
    () => [
      ...packages.map((p) => ({ label: `${p.title} (Package · ${formatPKR(p.price)})`, value: p.title })),
      ...services.map((s) => ({ label: s.title, value: s.title })),
    ],
    [packages, services]
  );

  if (!open) return null;

  function reset() {
    setStep(0);
    setService(null);
    setSpecialist("No preference");
    setDate("");
    setTime("");
    setName(readStored("hk_booking_name"));
    setPhone(readStored("hk_booking_phone"));
  }

  function handleClose() {
    closeBooking();
    setTimeout(reset, 300);
  }

  async function handleSend() {
    setSending(true);
    const lines = [
      `Hello HK Salon For Men, I'd like to book an appointment.`,
      service ? `Service: ${service}` : null,
      `Specialist: ${specialist}`,
      date ? `Date: ${date}` : null,
      time ? `Time: ${time}` : null,
      `Name: ${name}`,
      `Phone: ${phone}`,
    ].filter(Boolean);

    await createLead({ name, phone, service: service ?? undefined, specialist, date, time });

    try {
      window.localStorage.setItem("hk_booking_name", name);
      window.localStorage.setItem("hk_booking_phone", phone);
    } catch {
      // localStorage unavailable — safe to ignore
    }

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
    setSending(false);
    handleClose();
  }

  const canNext = [!!service, true, !!date && !!time, name.trim().length > 0 && phone.trim().length > 0][step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-ink-line bg-ink-soft shadow-2xl max-h-[85vh] flex flex-col">
        <div className="p-6 pb-4 border-b border-ink-line shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-luxe-sm uppercase text-bronze">Reserve your chair</p>
              <h2 className="font-display text-2xl text-cream mt-1">Book an appointment</h2>
            </div>
            <button onClick={handleClose} className="text-cream/50 hover:text-cream transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-1.5 mt-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-bronze" : "bg-ink-line")} />
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {step === 0 && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-mono tracking-luxe-sm uppercase text-cream/50">
                <Scissors className="h-3.5 w-3.5" /> What would you like?
              </p>
              <div className="space-y-2">
                {options.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setService(o.value)}
                    className={cn(
                      "w-full text-left rounded-lg border px-4 py-3 text-sm text-cream transition-colors",
                      service === o.value ? "border-bronze bg-bronze/10" : "border-ink-line hover:border-bronze/50"
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-mono tracking-luxe-sm uppercase text-cream/50">
                <User className="h-3.5 w-3.5" /> Choose your specialist
              </p>
              <div className="space-y-2">
                {["No preference", ...team.map((t) => t.name)].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSpecialist(n)}
                    className={cn(
                      "w-full text-left rounded-lg border px-4 py-3 text-sm text-cream transition-colors",
                      specialist === n ? "border-bronze bg-bronze/10" : "border-ink-line hover:border-bronze/50"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-xs font-mono tracking-luxe-sm uppercase text-cream/50">
                  <Calendar className="h-3.5 w-3.5" /> Pick a date
                </p>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-ink-line bg-ink-deep px-4 py-3 text-sm text-cream focus:border-bronze focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-mono tracking-luxe-sm uppercase text-cream/50">Pick a time</p>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={cn(
                        "rounded-lg border px-2 py-2.5 text-xs text-cream transition-colors",
                        time === t ? "border-bronze bg-bronze/10" : "border-ink-line hover:border-bronze/50"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-xs font-mono tracking-luxe-sm uppercase text-cream/50">
                  <User className="h-3.5 w-3.5" /> Your details
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-ink-line bg-ink-deep px-4 py-3 text-sm text-cream focus:border-bronze focus:outline-none"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full rounded-lg border border-ink-line bg-ink-deep px-4 py-3 text-sm text-cream focus:border-bronze focus:outline-none"
                />
              </div>
              <div className="rounded-lg border border-bronze/30 bg-bronze/5 p-4 space-y-2 text-sm">
                <p className="text-xs font-mono tracking-luxe-sm uppercase text-bronze mb-1">Your booking</p>
                {[
                  ["Service", service],
                  ["Specialist", specialist],
                  ["Date", date],
                  ["Time", time],
                  ["Name", name || "—"],
                  ["Phone", phone || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-cream/80">
                    <span>{label}</span>
                    <span className="text-cream">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-cream/50">
                Tapping the button opens WhatsApp with these details ready to send. The salon confirms your slot on chat.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 pt-4 border-t border-ink-line flex items-center justify-between shrink-0">
          <button
            onClick={() => (step === 0 ? handleClose() : setStep((s) => s - 1))}
            className="flex items-center gap-1 text-sm text-cream/70 hover:text-cream transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="flex items-center gap-1 rounded-lg bg-bronze px-5 py-2.5 text-sm font-semibold text-ink-deep disabled:opacity-40 hover:bg-champagne transition-colors"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canNext || sending}
              className="flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-ink-deep disabled:opacity-40 hover:bg-[#1ebe5d] transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Send on WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
