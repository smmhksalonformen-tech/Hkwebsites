import type { Metadata } from "next";
import Image from "next/image";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login — HK Salon For Men",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-ink-deep flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Image src="/logo-cream.png" alt="HK Salon For Men" width={200} height={90} className="h-16 w-auto" />
          <p className="font-mono text-[10px] tracking-luxe uppercase text-bronze">Admin Portal</p>
        </div>
        <div className="rounded-xl border border-ink-line bg-ink-soft p-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
