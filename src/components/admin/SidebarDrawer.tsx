"use client";

import { useEffect, useRef, Suspense, type RefObject } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { getNavItems } from "./navItems";
import type { WeddingCouple } from "@/types/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SidebarDrawerProps {
  /** Controls whether the drawer is currently visible. */
  isOpen: boolean;
  /** Called when the drawer should be dismissed (Escape / backdrop / X). */
  onClose: () => void;
  /** Wedding couple — drives the header title and partner-specific nav labels. */
  couple: WeddingCouple;
  /**
   * Ref to the button that triggered the drawer.
   * Focus is restored to this element when the drawer closes.
   */
  triggerRef: RefObject<HTMLButtonElement>;
}

// ---------------------------------------------------------------------------
// NavContent — reads searchParams, must live inside <Suspense>
// ---------------------------------------------------------------------------

function NavContent({
  couple,
  onClose,
}: {
  couple: WeddingCouple;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();
  const sp = new URLSearchParams(rawSearchParams?.toString() ?? "");
  
  // Display ALL 11 items matching user's requested menu layout
  const navItems = getNavItems(couple);

  return (
    <nav
      aria-label="Guest management navigation"
      className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
    >
      {navItems.map((item) => (
        <SidebarNavItem
          key={item.id}
          item={item}
          isActive={item.isActive(pathname, sp)}
          onNavigate={onClose}
        />
      ))}
    </nav>
  );
}

// Skeleton shown while useSearchParams resolves
function NavSkeleton() {
  return (
    <div className="flex-1 px-4 py-4 space-y-2">
      {Array.from({ length: 11 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
        >
          <div className="w-[22px] h-[22px] bg-gray-100 rounded-md animate-pulse shrink-0" />
          <div
            className="h-4 bg-gray-100 rounded-md animate-pulse"
            style={{ width: `${55 + (i % 4) * 10}%` }}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SidebarDrawer — main component
// ---------------------------------------------------------------------------

export default function SidebarDrawer({
  isOpen,
  onClose,
  couple,
  triggerRef,
}: SidebarDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // ── Auto-close on route change ────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── Escape key ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Focus management ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => closeButtonRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // ── Focus trap ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const selectors =
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>(selectors));

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Drawer panel ─────────────────────────────────────────────────── */}
      <div
        id="guest-sidebar-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Guest Management navigation menu"
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-2xl",
          "w-[85vw] max-w-[320px]",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-5 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-cursive text-[28px] leading-tight text-[#1a1a1a]">
                {couple.partnerA}{" "}
                <span className="text-[#FA2B56]">&amp;</span>{" "}
                {couple.partnerB}
              </h2>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Admin Management
              </p>
            </div>

            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ── Navigation (Suspense boundary for useSearchParams) ──────────── */}
        <Suspense fallback={<NavSkeleton />}>
          <NavContent couple={couple} onClose={onClose} />
        </Suspense>
      </div>
    </>
  );
}
