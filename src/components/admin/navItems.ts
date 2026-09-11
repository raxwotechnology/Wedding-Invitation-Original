import { Users, Plus, CalendarDays, Images, Palette, Calculator } from "lucide-react";
import MalePictogramIcon from "./icons/MalePictogramIcon";
import FemalePictogramIcon from "./icons/FemalePictogramIcon";
import BanquetTableIcon from "./icons/BanquetTableIcon";
import ConfirmedBadgeIcon from "./icons/ConfirmedBadgeIcon";
import ClipboardClockIcon from "./icons/ClipboardClockIcon";
import type { NavItem, WeddingCouple } from "@/types/navigation";

/**
 * Returns the ordered list of 11 sidebar nav items.
 * Labels for partner-specific items are resolved dynamically from `couple`.
 * Each item's `isActive` predicate uses pathname + URLSearchParams so that
 * items sharing the same base path (/admin/guests) can still have independent
 * active states driven by query parameters.
 */
export function getNavItems(couple: WeddingCouple): NavItem[] {
  return [
    {
      id: "overview",
      label: "Overview",
      href: "/admin",
      icon: Users,
      isActive: (pathname) => pathname === "/admin",
    },
    {
      id: "add-guests",
      label: "Add Guests",
      href: "/admin/guests",
      icon: Plus,
      // Active only when on /admin/guests with no special filter params
      isActive: (pathname, sp) =>
        pathname === "/admin/guests" &&
        !sp.has("side") &&
        !sp.has("status"),
    },
    {
      id: "partner-a-guests",
      label: `${couple.partnerA}'s Guests`,
      href: "/admin/guests?side=A",
      icon: MalePictogramIcon,
      isActive: (pathname, sp) =>
        pathname === "/admin/guests" && sp.get("side") === "A",
    },
    {
      id: "partner-b-guests",
      label: `${couple.partnerB}'s Guests`,
      href: "/admin/guests?side=B",
      icon: FemalePictogramIcon,
      isActive: (pathname, sp) =>
        pathname === "/admin/guests" && sp.get("side") === "B",
    },
    {
      id: "agenda",
      label: "Edit My Agenda",
      href: "/admin/agenda",
      icon: CalendarDays,
      isActive: (pathname) => pathname.startsWith("/admin/agenda"),
    },
    {
      id: "gallery",
      label: "Image Gallery",
      href: "/admin/gallery",
      icon: Images,
      isActive: (pathname) => pathname.startsWith("/admin/gallery"),
    },
    {
      id: "colors",
      label: "Site Colors",
      href: "/admin/colors",
      icon: Palette,
      isActive: (pathname) => pathname.startsWith("/admin/colors"),
    },
    {
      id: "tables",
      label: "Assign Tables",
      href: "/admin/seating",
      icon: BanquetTableIcon,
      isActive: (pathname) => pathname.startsWith("/admin/seating"),
    },
    {
      id: "budget",
      label: "Budget Calculation",
      href: "/admin/budget",
      icon: Calculator,
      isActive: (pathname) => pathname.startsWith("/admin/budget"),
    },
    {
      id: "confirmed",
      label: "Participation Confirmed",
      href: "/admin/guests?status=Confirmed",
      icon: ConfirmedBadgeIcon,
      isActive: (pathname, sp) =>
        pathname === "/admin/guests" && sp.get("status") === "Confirmed",
    },
    {
      id: "pending",
      label: "Pending Guests",
      href: "/admin/guests?status=Pending",
      icon: ClipboardClockIcon,
      isActive: (pathname, sp) =>
        pathname === "/admin/guests" && sp.get("status") === "Pending",
    },
  ];
}
