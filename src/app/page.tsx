import Image from "next/image";
import { MapPin, Clock as ClockIcon, Navigation, Phone, FileText, Download } from "lucide-react";
import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";
import { BookingProvider } from "@/components/site/booking-context";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { BookingModal } from "@/components/site/booking-modal";
import { ServicesSection } from "@/components/site/services-section";
import { BookButton } from "@/components/site/book-button";
import { Container } from "@/components/site/container";
import { HeroSlider } from "@/components/site/hero-slider";
import { FounderCarousel } from "@/components/site/founder-carousel";
import { InstagramIcon } from "@/components/site/social-icons";
import { Reveal } from "@/components/site/reveal";
import { FaqAccordion } from "@/components/site/faq-accordion";
import { ReviewsSection } from "@/components/site/reviews-section";

export const revalidate = 60;

export const metadata = {
  alternates: { canonical: "/" },
};

async function getData() {
  const [settings, services, packages, team, testimonials] = await Promise.all([
    db.setting.findUnique({ where: { id: 1 } }),
    db.service.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.package.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.teamMember.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.testimonial.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
  ]);
  return { settings, services, packages, team, testimonials };
}

const FAQS = [
  {
    question: "Is HK Salon For Men only for men?",
    answer: "Yes. HK Salon For Men is exclusively a men's grooming salon — every service, from haircuts to facials, is designed and delivered specifically for men.",
  },
  {
    question: "Is this Hadiqa Kiani's first salon for men?",
    answer: "Yes. HK Salon For Men in Multan is Hadiqa Kiani's first venture into men's grooming, and it serves as the flagship location for the brand.",
  },
  {
    question: "How do I book an appointment?",
    answer: "Tap \"Reserve Your Chair\" anywhere on the site, choose your service, specialist, date and time, and confirm — your booking is sent straight to us on WhatsApp.",
  },
  {
    question: "Do you accept walk-ins?",
    answer: "Walk-ins are welcome during opening hours, though booking ahead through the website guarantees your preferred time and specialist.",
  },
  {
    question: "What is the Deep Clean Hydra Therapy?",
    answer: "It's our signature multi-step facial — deep cleansing, extraction and hydration using clinical-grade tools, built specifically for men's skin rather than adapted from a women's treatment menu.",
  },
  {
    question: "Where can I see your full price list?",
    answer: "The complete, up-to-date price menu is available as a PDF right on the site — look for \"View Full Menu\" or \"Download PDF\" in the menu section.",
  },
];

export default async function Home() {
  const { settings, services, packages, team, testimonials } = await getData();
  if (!settings) return null;

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: settings.siteName,
    legalName: settings.legalName,
    url: "https://hksalonformen.com",
    image: "https://hksalonformen.com/founder-hadiqa.jpg",
    telephone: `+${settings.whatsapp}`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Multan",
      addressCountry: "PK",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "12:00",
      closes: "23:00",
    },
    sameAs: [
      `https://www.instagram.com/${settings.instagram}/`,
      `https://www.facebook.com/${settings.facebook}`,
      `https://www.tiktok.com/@${settings.tiktok}`,
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <BookingProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div id="top">
        <AnnouncementBar text={settings.announcement} />
        <Header menuUrl={settings.menuUrl} />

        {/* HERO */}
        <section className="relative overflow-hidden py-24 sm:py-32 text-center">
          <HeroSlider />
          <Container className="relative">
            <div className="flex justify-center">
              <Image
                src="/logo-cream.png"
                alt="Hadiqa Kiani Salon For Men"
                width={520}
                height={230}
                className="w-full max-w-md h-auto"
                priority
              />
            </div>
            <div className="mx-auto mt-6 h-px w-16 bg-bronze/50" />
            <p className="mt-6 font-display italic text-2xl sm:text-3xl text-cream/90">{settings.tagline}</p>
            <div className="mt-9 flex justify-center">
              <BookButton className="flex items-center gap-2 rounded-lg bg-bronze px-7 py-3.5 text-xs font-bold tracking-luxe-sm uppercase text-ink-deep hover:bg-champagne transition-colors">
                Reserve Your Chair →
              </BookButton>
            </div>
          </Container>
        </section>

        {/* EXPERIENCE IN MOTION */}
        <section className="py-20 sm:py-28 bg-ink">
          <Reveal>
          <Container>
            <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze text-center">Step inside</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl text-cream text-center">The Experience, In Motion</h2>
            <p className="mt-3 text-cream/60 text-center max-w-lg mx-auto">
              Sharp fades. Clean beards. A look that speaks for itself.
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { id: "1", alt: "An Experience of Style — a precision haircut in progress at HK Salon For Men" },
                { id: "2", alt: "More Than Grooming — a stylist finishing a client's cut at HK Salon For Men" },
                { id: "3", alt: "Make Every Impression Count — the finished look at HK Salon For Men" },
              ].map((img) => (
                <div key={img.id} className="rounded-2xl overflow-hidden aspect-[4/5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/experience/${img.id}.jpg`}
                    alt={img.alt}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </Container>
          </Reveal>
        </section>

        {/* HYDRAFACIAL SPOTLIGHT */}
        <section className="py-20 sm:py-28">
          <Reveal>
          <Container>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze">Signature Treatment</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl text-cream">The Hydrafacial Experience</h2>
              <p className="mt-5 text-cream/60 leading-relaxed">
                A multi-step deep-cleanse and hydration ritual — extraction, infusion, and a finish that leaves
                skin visibly brighter. Clinical-grade tools, dermatologist-grade serums, and a technique built
                for real, visible results. Not an add-on. A full reset for your skin.
              </p>
              <div className="mt-8 flex justify-center">
                <BookButton
                  prefill="Deep Clean Hydra Therapy"
                  className="rounded-lg bg-bronze px-6 py-3 text-xs font-bold tracking-luxe-sm uppercase text-ink-deep hover:bg-champagne transition-colors"
                >
                  Book The Hydrafacial
                </BookButton>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[
                { id: "photo-1", alt: "Hydrafacial treatment tools and skincare products at HK Salon For Men" },
                { id: "photo-2", alt: "Applying serum during the Deep Clean Hydra Therapy at HK Salon For Men" },
                { id: "photo-3", alt: "Hydrafacial device and towels prepared for treatment at HK Salon For Men" },
                { id: "photo-4", alt: "The Hydrafacial console and skincare products set up for treatment at HK Salon For Men" },
                { id: "photo-5", alt: "A Hydrafacial treatment head applied to a client's face at HK Salon For Men" },
                { id: "photo-6", alt: "Close-up of a client's jawline after the Deep Clean Hydra Therapy" },
              ].map((img) => (
                <div key={img.id} className="rounded-xl overflow-hidden aspect-[4/5] border border-ink-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/hydrafacial/${img.id}.jpg`}
                    alt={img.alt}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </Container>
          </Reveal>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-20 sm:py-28">
          <Reveal>
          <Container>
            <ServicesSection services={services} />
          </Container>
          </Reveal>
        </section>

        {/* MENU / PRICE LIST */}
        <section id="menu" className="py-20 sm:py-28 bg-ink">
          <Reveal>
          <Container className="max-w-2xl text-center">
            <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze">Every service, every price</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl text-cream">The Full Price Menu</h2>
            <p className="mt-4 text-cream/60 leading-relaxed">
              Browse our complete list of services, treatments and prices — or download a copy to take with you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={settings.menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-bronze px-6 py-3 text-xs font-bold tracking-luxe-sm uppercase text-ink-deep hover:bg-champagne transition-colors"
              >
                <FileText className="h-4 w-4" /> View Full Menu
              </a>
              <a
                href={settings.menuUrl}
                download
                className="flex items-center gap-2 rounded-lg border border-ink-line px-6 py-3 text-xs font-bold tracking-luxe-sm uppercase text-cream hover:border-bronze transition-colors"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </div>
          </Container>
          </Reveal>
        </section>

        {/* SIGNATURES / PACKAGES */}
        <section id="signatures" className="py-20 sm:py-28 bg-ink">
          <Reveal>
          <Container>
            <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze text-center">Curated bundles</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl text-cream text-center mb-12">Signatures</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {packages.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-2xl border p-6 flex flex-col ${p.featured ? "border-bronze" : "border-ink-line"}`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-6 rounded-full bg-bronze px-3 py-1 text-[10px] font-bold tracking-wide uppercase text-ink-deep">
                      Most Loved
                    </span>
                  )}
                  <h3 className="font-display text-2xl text-cream">{p.title}</h3>
                  <p className="text-sm text-cream/50 mt-1">{p.tagline}</p>
                  <p className="font-display text-3xl text-bronze mt-4">{formatPKR(p.price)}</p>
                  <ul className="mt-5 space-y-2 flex-1">
                    {p.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-cream/70">
                        <span className="text-bronze">✂</span> {item}
                      </li>
                    ))}
                  </ul>
                  <BookButton
                    prefill={`${p.title} (Package · ${formatPKR(p.price)})`}
                    className={`mt-6 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wide uppercase transition-colors ${
                      p.featured ? "bg-bronze text-ink-deep hover:bg-champagne" : "border border-ink-line text-cream hover:border-bronze"
                    }`}
                  >
                    Book This
                  </BookButton>
                </div>
              ))}
            </div>
          </Container>
          </Reveal>
        </section>

        {/* REVIEWS */}
        <section className="py-20 sm:py-28">
          <Reveal>
            <Container>
              <ReviewsSection reviews={testimonials} />
            </Container>
          </Reveal>
        </section>

        {/* ABOUT FOUNDER */}
        <section className="py-20 sm:py-28">
          <Reveal>
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FounderCarousel />
              <div>
                <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze">The founder</p>
                <h2 className="mt-2 font-display text-4xl text-cream">About Hadiqa Kiani</h2>
                <span className="mt-3 inline-block rounded-full border border-bronze/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-bronze">
                  Her First Men&apos;s Salon · Flagship, Multan
                </span>
                <div className="mt-4 h-px w-16 bg-bronze/50" />
                <p className="mt-6 text-cream/70 leading-relaxed whitespace-pre-line">{settings.aboutFounder}</p>
              </div>
            </div>
          </Container>
          </Reveal>
        </section>

        {/* LOCATION */}
        <section id="location" className="py-20 sm:py-28">
          <Reveal>
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze">Find us</p>
                <h2 className="mt-2 font-display text-4xl sm:text-5xl text-cream">Come in, sit back, look sharp.</h2>
                <div className="mt-6 space-y-3 text-sm text-cream/70">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-bronze" /> {settings.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-bronze" /> {settings.hours}
                  </p>
                  <a href={`tel:+${settings.whatsapp}`} className="flex items-center gap-2 hover:text-cream">
                    <Phone className="h-4 w-4 text-bronze" /> {settings.phone} · {settings.phoneSecondary}
                  </a>
                  <a
                    href={`https://www.instagram.com/${settings.instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-cream"
                  >
                    <InstagramIcon className="h-4 w-4 text-bronze" />
                    @{settings.instagram}
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <BookButton className="rounded-lg bg-bronze px-6 py-3 text-xs font-bold tracking-luxe-sm uppercase text-ink-deep hover:bg-champagne transition-colors">
                    Book Appointment
                  </BookButton>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-xs font-bold tracking-luxe-sm uppercase text-ink-deep hover:bg-[#1ebe5d] transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapsQuery)}&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HK Salon For Men location on Google Maps"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-sm px-4 py-2 text-xs text-cream hover:bg-black/90"
                >
                  <Navigation className="h-3.5 w-3.5" /> Get Directions
                </a>
              </div>
            </div>
          </Container>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="py-20 sm:py-28 bg-ink">
          <Reveal>
            <Container className="max-w-2xl">
              <p className="font-mono text-xs tracking-luxe-sm uppercase text-bronze text-center">Good to know</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl text-cream text-center mb-10">
                Frequently Asked Questions
              </h2>
              <FaqAccordion faqs={FAQS} />
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
