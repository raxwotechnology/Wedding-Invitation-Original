"use client";

import { useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, HelpCircle, Users, Plus, CheckSquare, BarChart2, Armchair, Settings } from "lucide-react";
import Link from "next/link";
import SidebarDrawer from "@/components/admin/SidebarDrawer";
import SidebarNavItem from "@/components/admin/SidebarNavItem";
import { getNavItems } from "@/components/admin/navItems";
import { useCouple } from "@/context/CoupleContext";
import type { WeddingCouple } from "@/types/navigation";

// ---------------------------------------------------------------------------
// Bottom tab bar for mobile
// ---------------------------------------------------------------------------
const BOTTOM_TAB_ITEMS = [
  { id: "overview", label: "Overview", href: "/admin", icon: Users },
  { id: "add-guests", label: "Guests", href: "/admin/guests", icon: Plus },
  { id: "rsvp", label: "RSVP", href: "/admin/rsvp", icon: CheckSquare },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: BarChart2 },
  { id: "tables", label: "Seating", href: "/admin/seating", icon: Armchair },
  { id: "settings", label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

function AppBrand({ couple }: { couple: WeddingCouple }) {
  return (
    <span className="font-cursive text-[26px] leading-tight text-[#1a1a1a] truncate select-none">
      {couple.partnerA}{" "}
      <span className="text-[#FA2B56]">&amp;</span>{" "}
      {couple.partnerB}
    </span>
  );
}

function UserAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-full bg-rose-100 overflow-hidden shrink-0 shadow-sm"
      title="Wedding Admin"
    >
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
        alt="Admin"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function DesktopSidebarContent({ couple }: { couple: WeddingCouple }) {
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();
  const sp = new URLSearchParams(rawSearchParams?.toString() ?? "");
  const navItems = getNavItems(couple);

  return (
    <nav aria-label="Admin Navigation" className="p-4 space-y-1">
      {navItems.map((item) => (
        <SidebarNavItem
          key={item.id}
          item={item}
          isActive={item.isActive(pathname, sp)}
        />
      ))}
    </nav>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { couple } = useCouple();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const isTabActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col font-sans text-gray-800">
      {/* ── Top bar ── */}
      <header
        className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 lg:px-6 py-3"
        aria-label="Top bar"
      >
        <div className="flex items-center gap-3">
          {/* Hamburger (visible on mobile / drawer trigger) */}
          <button
            ref={hamburgerRef}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="p-1.5 rounded-lg text-gray-500 hover:text-[#FA2B56] hover:bg-rose-50 transition-colors"
          >
            <Menu size={22} aria-hidden="true" />
          </button>

          <AppBrand couple={couple} />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex text-xs font-semibold text-gray-500 hover:text-[#FA2B56] px-3 py-1.5 rounded-full border border-gray-200 hover:border-rose-200 transition-colors"
          >
            View Live Invitation ↗
          </Link>
          <UserAvatar />
        </div>
      </header>

      {/* ── Layout body with Desktop Sidebar + Main content ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop permanent sidebar for large screens (lg) */}
        <aside className="hidden lg:block w-72 bg-white border-r border-gray-100 shrink-0 overflow-y-auto">
          <Suspense fallback={<div className="p-4 text-xs text-gray-400">Loading menu…</div>}>
            <DesktopSidebarContent couple={couple} />
          </Suspense>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* ── Mobile bottom tab bar (< lg) ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center px-2 py-2 z-40 shadow-lg"
        aria-label="Quick navigation"
      >
        {BOTTOM_TAB_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isTabActive(item.href);

          return (
            <Link key={item.id} href={item.href} aria-current={active ? "page" : undefined}>
              <div
                className={`flex flex-col items-center p-1.5 rounded-xl transition-colors ${
                  active ? "text-[#FA2B56]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-[#FA2B56]" : ""}`} />
                <span className="text-[9px] font-semibold mt-1 leading-none">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Slide-in drawer (mobile & drawer trigger) ── */}
      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        couple={couple}
        triggerRef={hamburgerRef}
      />
    </div>
  );
}
