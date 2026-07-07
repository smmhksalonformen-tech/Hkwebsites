import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { BookingProvider } from "@/components/site/booking-context";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { BookingModal } from "@/components/site/booking-modal";
import { BookButton } from "@/components/site/book-button";
import { Container } from "@/components/site/container";

export const revalidate = 60;

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

async function getData(slug: string) {
  const [settings, services, packages, team, post] = await Promise.all([
    db.setting.findUnique({ where: { id: 1 } }),
    db.service.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.package.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.teamMember.findMany({ where: { status: "published" }, orderBy: { order: "asc" } }),
    db.blogPost.findUnique({ where: { slug } }),
  ]);
  return { settings, services, packages, team, post };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post not found — HK Salon For Men" };
  return {
    title: `${post.title} — HK Salon For Men`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { settings, services, packages, team, post } = await getData(slug);
  if (!settings) return null;
  if (!post || post.status !== "published") notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? `https://hksalonformen.com${post.image}` : undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.createdAt.toISOString(),
    mainEntityOfPage: `https://hksalonformen.com/blog/${post.slug}`,
    author: { "@type": "Organization", name: settings.siteName },
    publisher: { "@type": "Organization", name: settings.siteName },
  };

  return (
    <BookingProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <div>
        <AnnouncementBar text={settings.announcement} />
        <Header menuUrl={settings.menuUrl} />

        <article className="py-16 sm:py-24">
          <Container className="max-w-3xl">
            <Link href="/blog" className="flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream w-fit">
              <ArrowLeft className="h-4 w-4" /> Back to the journal
            </Link>

            <p className="mt-8 text-xs font-mono uppercase tracking-luxe-sm text-bronze">{formatDate(post.createdAt)}</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl text-cream leading-tight">{post.title}</h1>
            <p className="mt-5 text-lg text-cream/60 leading-relaxed">{post.excerpt}</p>

            {post.image && (
              <div className="mt-10 rounded-2xl overflow-hidden aspect-[16/9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="mt-10 text-cream/80 leading-relaxed whitespace-pre-line">{post.content}</div>

            <div className="mt-14 rounded-2xl border border-bronze/30 bg-bronze/5 p-8 text-center">
              <p className="font-display text-2xl text-cream">Ready to see it for yourself?</p>
              <p className="mt-2 text-sm text-cream/60">Reserve your chair at the flagship in Gulgasht Colony, Multan.</p>
              <div className="mt-6 flex justify-center">
                <BookButton className="rounded-lg bg-bronze px-6 py-3 text-xs font-bold tracking-luxe-sm uppercase text-ink-deep hover:bg-champagne transition-colors">
                  Reserve Your Chair →
                </BookButton>
              </div>
            </div>
          </Container>
        </article>

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
