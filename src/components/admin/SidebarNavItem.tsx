"use client";

import Link from "next/link";
import type { NavItem } from "@/types/navigation";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  onNavigate?: () => void;
}

export default function SidebarNavItem({
  item,
  isActive,
  onNavigate,
}: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate ? () => onNavigate() : undefined}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-150 ${
        isActive
          ? "bg-white border border-rose-200 text-gray-900 shadow-sm font-semibold"
          : "text-gray-700 hover:bg-rose-50/40 hover:text-gray-900 font-medium"
      }`}
    >
      {/* Icon with theme color */}
      <span className="w-5 h-5 shrink-0 text-[#FA2B56] flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </span>

      {/* Label */}
      <span className="text-[14.5px] leading-snug tracking-tight truncate">
        {item.label}
      </span>
    </Link>
  );
}
