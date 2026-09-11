"use client";

import { useState } from "react";
import { Search, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";
import { useGuests } from "@/context/GuestContext";
import type { Guest, RsvpStatus } from "@/types/guest";

// ─── Relative-time helper ─────────────────────────────────────────────────────

/**
 * Formats an ISO timestamp as a human-friendly relative label.
 * e.g. "Just now", "5 min ago", "2 hrs ago", "3 days ago"
 */
function relativeTime(iso?: string): string {
  if (!iso) return "—";
  const diffMs  = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1)   return "Just now";
  if (diffMin < 60)  return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr  < 24)  return `${diffHr} hr${diffHr !== 1 ? "s" : ""} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
}

// ─── Column component ─────────────────────────────────────────────────────────

interface ColumnProps {
  title: RsvpStatus;
  icon: React.ElementType;
  items: Guest[];
  colorClass: string;
  bgClass: string;
  borderClass: string;
  onStatusChange: (id: string, status: RsvpStatus) => void;
}

function Column({ title, icon: Icon, items, colorClass, bgClass, borderClass, onStatusChange }: ColumnProps) {
  return (
    <div className={`flex-1 bg-white rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border ${borderClass} flex flex-col overflow-hidden`}>
      <div className={`p-4 border-b ${borderClass} ${bgClass} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Icon className={colorClass} size={18} />
          <h3 className={`font-bold ${colorClass}`}>{title}</h3>
        </div>
        {/* Count is always derived from items.length — never a separate counter */}
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold bg-white ${colorClass} shadow-sm`}>
          {items.length}
        </span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[400px] bg-gray-50/30">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8 font-medium">No guests here.</p>
        ) : items.map(guest => (
          <div key={guest.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
            <p className="font-bold text-gray-800 text-[14px]">{guest.name}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{guest.group}</span>
              <span className="text-[11px] text-gray-400">{relativeTime(guest.rsvpUpdatedAt)}</span>
            </div>

            {/* Hover Actions — move to a different status column */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-gray-100 shadow-sm flex gap-1">
              {title !== "Confirmed" && (
                <button
                  onClick={() => onStatusChange(guest.id, "Confirmed")}
                  title="Mark Confirmed"
                  className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                >
                  <CheckCircle2 size={16} />
                </button>
              )}
              {title !== "Pending" && (
                <button
                  onClick={() => onStatusChange(guest.id, "Pending")}
                  title="Mark Pending"
                  className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
                >
                  <Clock size={16} />
                </button>
              )}
              {title !== "Declined" && (
                <button
                  onClick={() => onStatusChange(guest.id, "Declined")}
                  title="Mark Declined"
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RSVPManagement() {
  // Single shared source of truth — same array as Guest List page
  const { guests, isLoading, updateRsvpStatus } = useGuests();

  // Search is intentionally page-local (each page may have different search terms)
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = searchTerm
    ? guests.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : guests;

  // Columns derived live — counts can never fall out of sync
  const pending   = filtered.filter(g => g.status === "Pending");
  const confirmed = filtered.filter(g => g.status === "Confirmed");
  const declined  = filtered.filter(g => g.status === "Declined");

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl relative h-[calc(100vh-100px)] flex flex-col">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">RSVP Management</h1>
          <p className="text-[#64748B] mt-2 text-[15px]">Quickly move and track guest responses.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="w-64 pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-full text-[14px] text-gray-600 focus:outline-none focus:border-[#FA2B56] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-2 text-[#FA2B56]" size={28} />
            <p className="text-sm font-medium">Loading guests…</p>
          </div>
        </div>
      ) : guests.length === 0 ? (
        /* Empty state */
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-lg font-medium mb-1">No guests yet</p>
            <p className="text-sm">Add guests on the Guest List page to see them here.</p>
          </div>
        </div>
      ) : (
        /* Kanban Board */
        <div className="flex gap-6 flex-1 min-h-0">
          <Column
            title="Pending"
            icon={Clock}
            items={pending}
            colorClass="text-amber-500"
            bgClass="bg-amber-50/50"
            borderClass="border-amber-100"
            onStatusChange={updateRsvpStatus}
          />
          <Column
            title="Confirmed"
            icon={CheckCircle2}
            items={confirmed}
            colorClass="text-emerald-500"
            bgClass="bg-emerald-50/50"
            borderClass="border-emerald-100"
            onStatusChange={updateRsvpStatus}
          />
          <Column
            title="Declined"
            icon={XCircle}
            items={declined}
            colorClass="text-rose-500"
            bgClass="bg-rose-50/50"
            borderClass="border-rose-100"
            onStatusChange={updateRsvpStatus}
          />
        </div>
      )}

    </div>
  );
}
