"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Scissors, Package as PackageIcon, Users, Image as ImageIcon, Star, Newspaper, Settings, LogOut, Cake } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Services", href: "/admin/services", icon: Scissors },
  { label: "Packages", href: "/admin/packages", icon: PackageIcon },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Birthdays", href: "/admin/birthdays", icon: Cake },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
    toast.success("Signed out.");
  }

  return (
    <aside className="flex flex-col h-full bg-ink-soft border-r border-ink-line w-56 shrink-0">
      <div className="p-4 border-b border-ink-line">
        <Link href="/admin" className="flex flex-col leading-tight">
          <span className="font-display text-lg text-cream leading-none">HK Salon</span>
          <span className="font-mono text-[9px] uppercase tracking-luxe-sm text-bronze mt-1">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive ? "bg-bronze/10 text-bronze" : "text-cream/60 hover:bg-ink-line hover:text-cream"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-ink-line">
        <p className="px-3 py-1 text-[10px] text-cream/40 truncate font-mono">{email}</p>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-cream/60 hover:bg-ink-line hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
