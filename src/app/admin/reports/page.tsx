"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface Guest {
  id: string;
  name: string;
  phone: string;
  group: string;
  status: "Confirmed" | "Pending" | "Declined";
  table: string;
}

export default function ReportsAnalytics() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("All Time Analytics");

  useEffect(() => {
    fetchGuests();
  }, []);

  const getLocalGuests = (): Guest[] => {
    try {
      const stored = localStorage.getItem('wedding_guests_fallback');
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return [];
  };

  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/guests'));
      if (res.ok) {
        const data = await res.json();
        setGuests(data);
      } else {
        throw new Error("API Failed");
      }
    } catch (error) {
      console.warn("MongoDB fetch failed in reports, falling back to local storage");
      setGuests(getLocalGuests());
    }
    setIsLoading(false);
  };

  // Calculations
  const total = guests.length;
  const confirmed = guests.filter(g => g.status === "Confirmed").length;
  const pending = guests.filter(g => g.status === "Pending").length;
  const declined = guests.filter(g => g.status === "Declined").length;

  const confirmedPct = total > 0 ? Math.round((confirmed / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;
  const declinedPct = total > 0 ? Math.round((declined / total) * 100) : 0;

  // Group Calculations
  const family = guests.filter(g => g.group === "Family").length;
  const friends = guests.filter(g => g.group === "Friends").length;
  const colleague = guests.filter(g => g.group === "Colleague").length;
  const others = guests.filter(g => g.group === "Others").length;
  const maxGroup = Math.max(family, friends, colleague, others, 1); // Avoid div by zero

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FA2B56]">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-semibold text-gray-500">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">Reports & Analytics</h1>
          <p className="text-[#64748B] mt-2 text-[15px]">View live insights and reports about your wedding guests.</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-[200px] gap-3 bg-white border border-gray-200 px-6 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="truncate">{timeframe}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-[200px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden z-50 animate-fade-in">
              {["All Time Analytics", "This Month", "Last 7 Days", "Today"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setTimeframe(option);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-[13px] font-semibold transition-colors ${timeframe === option
                    ? "bg-rose-50 text-[#FA2B56]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Guests", value: total, color: "text-[#1E293B]" },
          { label: "Confirmed", value: confirmed, color: "text-[#10B981]" },
          { label: "Pending", value: pending, color: "text-[#F59E0B]" },
          { label: "Declined", value: declined, color: "text-[#F43F5E]" },
        ].map((metric) => (
          <div key={metric.label} className="bg-white p-8 rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col justify-between h-36">
            <p className="text-[13px] text-[#64748B] font-semibold">{metric.label}</p>
            <p className={`text-[42px] font-bold font-sans tracking-tight leading-none ${metric.color}`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">

        {/* Guest Status Chart */}
        <div className="bg-white p-8 rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50">
          <h3 className="text-[17px] font-bold text-[#1e293b] mb-10">Guest Status</h3>

          <div className="flex items-center gap-12">
            {/* Dynamic Donut Chart */}
            <div className="relative w-44 h-44 rounded-full flex items-center justify-center shrink-0" style={{
              background: total > 0
                ? `conic-gradient(#10B981 0% ${confirmedPct}%, #F59E0B ${confirmedPct}% ${confirmedPct + pendingPct}%, #F43F5E ${confirmedPct + pendingPct}% 100%)`
                : `#f1f5f9`
            }}>
              <div className="w-[124px] h-[124px] bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-[32px] font-bold text-[#1E293B]">{confirmedPct}%</span>
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Confirmed</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-6">
              {[
                { label: "Confirmed", val: `${confirmedPct}%`, count: confirmed, color: "bg-[#10B981]" },
                { label: "Pending", val: `${pendingPct}%`, count: pending, color: "bg-[#F59E0B]" },
                { label: "Declined", val: `${declinedPct}%`, count: declined, color: "bg-[#F43F5E]" }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between w-48">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                    <span className="text-[13px] font-medium text-[#64748B]">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[13px] font-bold text-[#1E293B] mr-2">{item.val}</span>
                    <span className="text-[11px] text-gray-400">({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guests by Group Bar Chart */}
        <div className="bg-white p-8 rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50">
          <h3 className="text-[17px] font-bold text-[#1e293b] mb-12">Guests by Group</h3>

          <div className="flex items-end justify-between h-44 px-4">
            {[
              { label: "Family", val: family, color: "bg-[#C44669]", height: `${(family / maxGroup) * 100}%` },
              { label: "Friends", val: friends, color: "bg-[#F26CA1]", height: `${(friends / maxGroup) * 100}%` },
              { label: "Colleague", val: colleague, color: "bg-[#F692A6]", height: `${(colleague / maxGroup) * 100}%` },
              { label: "Others", val: others, color: "bg-[#FCE6EB]", height: `${(others / maxGroup) * 100}%` },
            ].map(bar => (
              <div key={bar.label} className="flex flex-col items-center gap-3 w-16">
                <span className="text-[13px] font-bold text-[#1E293B]">{bar.val}</span>
                <div className={`w-full rounded-t-lg transition-all duration-1000 ${bar.color}`} style={{ height: bar.height, minHeight: '4px' }}></div>
                <span className="text-[12px] font-medium text-[#94A3B8]">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
