import { db } from "@/lib/db";
import { BookingProvider } from "@/components/site/booking-context";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { BookingModal } from "@/components/site/booking-modal";
import { BookButton } from "@/components/site/book-button";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";

export const revalidate = 60;

export const metadata = {
  title: "Our Artists — HK Salon For Men",
  description: "Meet the stylists and grooming specialists at HK Salon For Men, Hadiqa Kiani's flagship men's salon in Gulgasht Colony, Multan.",
  alternates: { canonical: "/artists" },
  openGraph: {
    type: "website",
    title: "Our Artists — HK Salon For Men",
    description: "Meet the stylists and grooming specialists at HK Salon For Men, Hadiqa Kiani's flagship men's salon in Gulgasht Colony, Multan.",
  },
};

async function getData() {
  const [settings, services, packages, team] = await Promise.all([
    db.setting.findUnique({ where: { id: 1 } }),
    db.service.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.package.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.teamMember.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
  ]);
  return { settings, services, packages, team };
}

export default async function ArtistsPage() {
  const { settings, services, packages, team } = await getData();
  if (!settings) return null;

  return (
    <BookingProvider>
      <div>
        <AnnouncementBar text={settings.announcement} />
        <Header menuUrl={settings.menuUrl} />

        <section className="py-20 sm:py-28 text-center">
          <Container>
            <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze">The hands behind the look</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl text-cream">Our Artists</h1>
            <p className="mt-3 text-cream/60 max-w-lg mx-auto">
              The team that makes every cut, beard and finish feel effortless.
            </p>
          </Container>
        </section>

        <section className="pb-20 sm:pb-28">
          <Reveal>
            <Container>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {team.map((t) => (
                  <div key={t.id} className="rounded-xl overflow-hidden border border-ink-line aspect-[3/4]">
                    {t.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.image} alt={`${t.name} — ${t.role}`} className="h-full w-full object-cover" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-14 text-center">
                <BookButton className="rounded-lg bg-bronze px-7 py-3.5 text-xs font-bold tracking-luxe-sm uppercase text-ink-deep hover:bg-champagne transition-colors">
                  Reserve Your Chair →
                </BookButton>
              </div>
            </Container>
          </Reveal>
        </section>

        <Footer
          legalName={settings.legalName}
          address={settings.address}
          instagram={settings.instagram}
          facebook={settings.facebook}
          tiktok={settings.tiktok}
        />
      </div>

      <WhatsAppFloat whatsapp={settings.whatsapp} />
      <BookingModal packages={packages} services={services} team={team} whatsapp={settings.whatsapp} />
    </BookingProvider>
  );
}
