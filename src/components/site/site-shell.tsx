import { db } from "@/lib/db";
import { BookingProvider } from "./booking-context";
import { Header } from "./header";
import { Footer } from "./footer";
import { AnnouncementBar } from "./announcement-bar";
import { WhatsAppFloat } from "./whatsapp-float";
import { BookingModal } from "./booking-modal";

type Settings = NonNullable<Awaited<ReturnType<typeof db.setting.findUnique>>>;

/** Shared public-page chrome (header, footer, booking modal) for the gift card pages. */
export async function SiteShell({ settings, children }: { settings: Settings; children: React.ReactNode }) {
  const [services, packages, team] = await Promise.all([
    db.service.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.package.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.teamMember.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
  ]);

  return (
    <BookingProvider>
      <div>
        <AnnouncementBar text={settings.announcement} />
        <Header menuUrl={settings.menuUrl} />
        {children}
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
