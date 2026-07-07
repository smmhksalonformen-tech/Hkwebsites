import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-ink-deep overflow-hidden">
      <div className="hidden lg:flex">
        <AdminSidebar email={session.email} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 h-12 border-b border-ink-line bg-ink-soft">
          <span className="font-display text-cream text-sm">HK Salon Admin</span>
          <span className="ml-auto font-mono text-xs text-cream/40 truncate">{session.email}</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
