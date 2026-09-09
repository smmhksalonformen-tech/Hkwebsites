import { db } from "@/lib/db";
import { BookingProvider } from "@/components/site/booking-context";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { BookingModal } from "@/components/site/booking-modal";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { MessageCircle } from "lucide-react";
import { formatPKR } from "@/lib/utils";

export const revalidate = 60;

export const metadata = {
  title: "New Deals & Student Packages — HK Salon For Men",
  description:
    "New grooming deals and student packages at HK Salon For Men — sharp cuts, beard shaping and full sessions at student-friendly rates in Multan.",
  alternates: { canonical: "/deals" },
  openGraph: {
    type: "website",
    title: "New Deals & Student Packages — HK Salon For Men",
    description:
      "New grooming deals and student packages at HK Salon For Men — student-friendly rates in Multan.",
  },
};

/**
 * PLACEHOLDER student-package content — edit these (names, prices, what's
 * included, tags) with the real deals. Each card's WhatsApp button pre-fills
 * a message naming the package.
 */
type Pkg = {
  name: string;
  tag: string;
  price: number;
  was?: number;
  items: string[];
  featured?: boolean;
};

const STUDENT_PACKAGES: Pkg[] = [
  {
    name: "Student Cut",
    tag: "The quick refresh",
    price: 900,
    was: 1200,
    items: ["Hair Cut", "Styling", "Student ID rate"],
  },
  {
    name: "Cut + Beard",
    tag: "Sharp from every angle",
    price: 1500,
    was: 1900,
    items: ["Hair Cut", "Beard Shaping", "Hot Towel", "Styling"],
    featured: true,
  },
  {
    name: "The Full Session",
    tag: "The complete grooming session",
    price: 2600,
    was: 3400,
    items: ["Hair Cut", "Beard", "Head & Shoulder Massage", "Wash", "Deep Cleansing"],
  },
  {
    name: "4-Person Deal",
    tag: "Bring the squad",
    price: 3200,
    was: 4800,
    items: ["4 × Hair Cut", "4 × Styling", "One combined booking"],
  },
];

export default async function DealsPage() {
  const [settings, services, packages, team] = await Promise.all([
    db.setting.findUnique({ where: { id: 1 } }),
    db.service.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.package.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.teamMember.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
  ]);
  if (!settings) return null;

  const wa = settings.whatsapp;

  return (
    <BookingProvider>
      <div>
        <AnnouncementBar text={settings.announcement} />
        <Header menuUrl={settings.menuUrl} />

        {/* Hero */}
        <section className="py-20 text-center sm:py-28">
          <Container>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-luxe-sm text-bronze">New this season</p>
              <h1 className="mt-3 font-display text-4xl text-cream sm:text-6xl">
                New Deals &amp; Student Packages
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-cream/60">
                Grooming built for students — the same chairs, the same barbers, student-friendly rates. Pick a
                package and send us one message; we&apos;ll lock in your slot on WhatsApp.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Packages */}
        <section className="pb-24">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STUDENT_PACKAGES.map((p) => {
                const text = encodeURIComponent(
                  `Hi HK Salon For Men — I'd like the "${p.name}" package (${formatPKR(p.price)}). Please share availability.`
                );
                return (
                  <div
                    key={p.name}
                    className={`relative flex flex-col rounded-2xl border p-6 transition-colors ${
                      p.featured ? "border-bronze bg-bronze/[0.06]" : "border-ink-line hover:border-bronze/60"
                    }`}
                  >
                    {p.featured && (
                      <span className="absolute -top-3 left-6 rounded-full bg-bronze px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-deep">
                        Best Value
                      </span>
                    )}
                    <h2 className="font-display text-2xl text-cream">{p.name}</h2>
                    <p className="mt-1 text-sm text-cream/50">{p.tag}</p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-display text-3xl text-bronze">{formatPKR(p.price)}</span>
                      {p.was && (
                        <span className="text-sm text-cream/35 line-through">{formatPKR(p.was)}</span>
                      )}
                    </div>

                    <ul className="mt-5 flex-1 space-y-2">
                      {p.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-cream/70">
                          <span className="text-bronze">✂</span> {item}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`https://wa.me/${wa}?text=${text}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                        p.featured
                          ? "bg-bronze text-ink-deep hover:bg-champagne"
                          : "border border-ink-line text-cream hover:border-bronze"
                      }`}
                    >
                      <MessageCircle className="h-4 w-4" /> Get This Deal
                    </a>
                  </div>
                );
              })}
            </div>

            <p className="mt-10 text-center text-xs text-cream/40">
              Student rates on presentation of a valid student ID. Deals cannot be combined with other offers.
            </p>
          </Container>
        </section>

        <Footer
          legalName={settings.legalName}
          address={settings.address}
          instagram={settings.instagram}
          facebook={settings.facebook}
          tiktok={settings.tiktok}
        />
        <WhatsAppFloat whatsapp={settings.whatsapp} />
        <BookingModal packages={packages} services={services} team={team} whatsapp={settings.whatsapp} />
      </div>
    </BookingProvider>
  );
}
