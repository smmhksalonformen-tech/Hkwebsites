import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getLoyaltySiteUrl } from "@/lib/actions/loyalty";
import { LoyaltyMemberRow } from "@/components/admin/loyalty-member-row";
import { LoyaltySearch } from "@/components/admin/loyalty-search";
import { PendingStampRequest } from "@/components/admin/pending-stamp-request";

export const metadata: Metadata = { title: "Loyalty — HK Salon Admin" };

const requestedAtFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export default async function AdminLoyaltyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const [members, pendingRequests, loyaltyUrl] = await Promise.all([
    db.loyaltyMember.findMany({
      where: query
        ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { phone: { contains: query } }] }
        : undefined,
      orderBy: { createdAt: "desc" },
    }),
    db.loyaltyStampRequest.findMany({
      where: { status: "PENDING" },
      include: { member: true },
      orderBy: { createdAt: "asc" },
    }),
    getLoyaltySiteUrl(),
  ]);

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=1a1512&bgcolor=f3eadd&data=${encodeURIComponent(loyaltyUrl)}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-cream">Loyalty Card</h1>
        <p className="mt-1 text-sm text-cream/50">
          3 stamps = a free haircut + beard styling. Add a stamp after every paid service.
        </p>
      </div>

      {pendingRequests.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-luxe-sm text-amber-400">
            Pending Approvals ({pendingRequests.length})
          </h2>
          <div className="divide-y divide-ink-line rounded-xl border border-amber-500/30 bg-ink-soft">
            {pendingRequests.map((r) => (
              <PendingStampRequest
                key={r.id}
                request={{
                  id: r.id,
                  memberName: r.member.name,
                  memberPhone: r.member.phone,
                  createdAt: requestedAtFormatter.format(r.createdAt),
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <LoyaltySearch />

          <div className="divide-y divide-ink-line rounded-xl border border-ink-line bg-ink-soft">
            {members.length === 0 ? (
              <p className="p-6 text-sm text-cream/40">
                {query ? "No members match your search." : "No loyalty members yet — share the QR code to get started."}
              </p>
            ) : (
              members.map((m) => (
                <LoyaltyMemberRow
                  key={m.id}
                  member={{
                    id: m.id,
                    name: m.name,
                    phone: m.phone,
                    email: m.email,
                    stamps: m.stamps,
                    timesRedeemed: m.timesRedeemed,
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div className="h-fit rounded-xl border border-ink-line bg-ink-soft p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-luxe-sm text-bronze">Scan to Join</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="QR code linking to the HK Salon loyalty card" className="mx-auto mt-3 rounded-lg" />
          <p className="mt-3 break-all text-[11px] text-cream/40">{loyaltyUrl}</p>
          <a
            href={qrSrc}
            download="hk-salon-loyalty-qr.png"
            className="mt-4 inline-block rounded-lg border border-ink-line px-4 py-2 text-xs font-semibold text-cream/70 transition-colors hover:border-bronze hover:text-bronze"
          >
            Download to Print
          </a>
        </div>
      </div>
    </div>
  );
}
