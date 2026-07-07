"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { updateSettings } from "@/lib/actions/settings";

type Setting = {
  siteName: string;
  legalName: string;
  tagline: string;
  standardsQuote: string;
  aboutFounder: string;
  address: string;
  hours: string;
  phone: string;
  phoneSecondary: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  mapsQuery: string;
  announcement: string;
  menuUrl: string;
} | null;

const FIELD = "w-full rounded-lg border border-ink-line bg-ink-soft px-3 py-2.5 text-sm text-cream focus:border-bronze focus:outline-none";
const LABEL = "text-xs font-mono uppercase tracking-luxe-sm text-cream/50";

export function SettingsForm({ settings }: { settings: Setting }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) toast.success(result.message);
      else toast.error(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="font-display text-xl text-cream border-b border-ink-line pb-2">Brand</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={LABEL}>Site Name</label>
            <input name="siteName" defaultValue={settings?.siteName ?? ""} className={FIELD} />
          </div>
          <div className="space-y-1.5">
            <label className={LABEL}>Legal Name</label>
            <input name="legalName" defaultValue={settings?.legalName ?? ""} className={FIELD} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Hero Tagline</label>
          <input name="tagline" defaultValue={settings?.tagline ?? ""} className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Standards Quote</label>
          <textarea name="standardsQuote" defaultValue={settings?.standardsQuote ?? ""} rows={2} className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Announcement Bar Text</label>
          <input name="announcement" defaultValue={settings?.announcement ?? ""} className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>About Founder</label>
          <textarea name="aboutFounder" defaultValue={settings?.aboutFounder ?? ""} rows={4} className={FIELD} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-cream border-b border-ink-line pb-2">Contact & Location</h2>
        <div className="space-y-1.5">
          <label className={LABEL}>Address</label>
          <input name="address" defaultValue={settings?.address ?? ""} className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Hours</label>
          <input name="hours" defaultValue={settings?.hours ?? ""} className={FIELD} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={LABEL}>Phone (display)</label>
            <input name="phone" defaultValue={settings?.phone ?? ""} className={FIELD} />
          </div>
          <div className="space-y-1.5">
            <label className={LABEL}>Phone (secondary)</label>
            <input name="phoneSecondary" defaultValue={settings?.phoneSecondary ?? ""} className={FIELD} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>WhatsApp Number (digits only, with country code)</label>
          <input name="whatsapp" defaultValue={settings?.whatsapp ?? ""} placeholder="923200005337" className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Instagram Handle (no @)</label>
          <input name="instagram" defaultValue={settings?.instagram ?? ""} className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Facebook Page (username, from facebook.com/username)</label>
          <input name="facebook" defaultValue={settings?.facebook ?? ""} className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>TikTok Handle (no @)</label>
          <input name="tiktok" defaultValue={settings?.tiktok ?? ""} className={FIELD} />
        </div>
        <div className="space-y-1.5">
          <label className={LABEL}>Google Maps Search Query</label>
          <input name="mapsQuery" defaultValue={settings?.mapsQuery ?? ""} className={FIELD} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-cream border-b border-ink-line pb-2">Documents</h2>
        <div className="space-y-1.5">
          <label className={LABEL}>Price Menu (PDF path or URL)</label>
          <input name="menuUrl" defaultValue={settings?.menuUrl ?? ""} placeholder="/menu.pdf" className={FIELD} />
          <p className="text-xs text-cream/40">
            To replace the menu, drop the new PDF file in the project&apos;s <code>public/</code> folder and point this at
            its filename (e.g. <code>/menu.pdf</code>).
          </p>
        </div>
      </section>

      <button type="submit" disabled={isPending}
        className="flex items-center gap-2 rounded-lg bg-bronze px-5 py-2.5 text-sm font-semibold text-ink-deep hover:bg-champagne transition-colors disabled:opacity-60">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Settings
      </button>
    </form>
  );
}
