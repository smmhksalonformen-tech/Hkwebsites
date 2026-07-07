import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { BookingProvider } from "@/components/site/booking-context";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { BookingModal } from "@/components/site/booking-modal";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";

export const revalidate = 60;

export const metadata = {
  title: "The Journal — HK Salon For Men",
  description: "Stories, guides and news from HK Salon For Men, Hadiqa Kiani's flagship men's grooming lounge in Multan.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "The Journal — HK Salon For Men",
    description: "Stories, guides and news from HK Salon For Men, Hadiqa Kiani's flagship men's grooming lounge in Multan.",
  },
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

async function getData() {
  const [settings, services, packages, team, posts] = await Promise.all([
    db.setting.findUnique({ where: { id: 1 } }),
    db.service.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.package.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.teamMember.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.blogPost.findMany({ where: { status: "published" }, orderBy: { createdAt: "desc" } }),
  ]);
  return { settings, services, packages, team, posts };
}

export default async function BlogPage() {
  const { settings, services, packages, team, posts } = await getData();
  if (!settings) return null;

  return (
    <BookingProvider>
      <div>
        <AnnouncementBar text={settings.announcement} />
        <Header menuUrl={settings.menuUrl} />

        <section className="py-20 sm:py-28 text-center">
          <Container>
            <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze">The journal</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl text-cream">Stories From HK Salon</h1>
            <p className="mt-3 text-cream/60 max-w-lg mx-auto">
              Notes on the Multan flagship, grooming guides and news from Hadiqa Kiani&apos;s salon for men.
            </p>
          </Container>
        </section>

        <section className="pb-20 sm:pb-28">
          <Reveal>
            <Container>
              {posts.length === 0 ? (
                <p className="text-center text-cream/40">No posts yet — check back soon.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="group rounded-2xl border border-ink-line overflow-hidden hover:border-bronze/50 transition-colors"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-ink-soft">
                        {p.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] font-mono uppercase tracking-luxe-sm text-bronze">{formatDate(p.createdAt)}</p>
                        <h2 className="mt-2 font-display text-xl text-cream leading-snug">{p.title}</h2>
                        <p className="mt-2 text-sm text-cream/60 line-clamp-2">{p.excerpt}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-bronze">
                          Read more <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
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
