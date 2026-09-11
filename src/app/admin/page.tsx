"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface Guest {
  id: string;
  name: string;
  phone: string;
  group: string;
  status: "Confirmed" | "Pending" | "Declined";
  table: string;
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  const getLocalGuests = (): Guest[] => {
    try {
      const stored = localStorage.getItem('wedding_guests_fallback');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
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
      console.warn("MongoDB fetch failed in dashboard, falling back to local storage");
      setGuests(getLocalGuests());
    }
    setIsLoading(false);
  };

  const total = guests.length;
  const confirmed = guests.filter(g => g.status === "Confirmed").length;
  const pending = guests.filter(g => g.status === "Pending").length;
  const declined = guests.filter(g => g.status === "Declined").length;

  const confirmedPct = total > 0 ? Math.round((confirmed / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;

  const metrics = [
    { label: "TOTAL GUEST", value: total, sub: "Registered Guests", color: "text-[#334155]", valueColor: "text-[#1E293B]" },
    { label: "CONFIRMED", value: confirmed, sub: "RSVP Confirmed", color: "text-[#10B981]", valueColor: "text-[#10B981]" },
    { label: "PENDING", value: pending, sub: "Awaiting Response", color: "text-[#F59E0B]", valueColor: "text-[#F59E0B]" },
    { label: "DECLINED", value: declined, sub: "Unable to Attend", color: "text-[#F43F5E]", valueColor: "text-[#F43F5E]" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-theme">
        <Loader2 size={40} className="animate-spin mb-4" />
        <p className="font-semibold text-gray-500">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-[#1e293b] font-medium tracking-tight">Wedding Dashboard</h1>
        <p className="text-[#64748B] mt-2 text-[15px]">Here's a live overview of your wedding guests.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white p-8 rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50 transition-transform hover:-translate-y-1">
            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider mb-4 bg-gray-50 ${metric.color}`}>
              {metric.label}
            </div>
            <div className={`text-6xl font-bold font-sans tracking-tight mb-2 ${metric.valueColor}`}>
              {metric.value}
            </div>
            <p className="text-[13px] text-gray-400 font-medium">
              {metric.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        
        {/* RSVP Overview Card */}
        <div className="bg-white p-8 rounded-[24px] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-gray-50">
          <h3 className="text-[17px] font-bold text-[#1e293b] mb-1">RSVP Overview</h3>
          <p className="text-[13px] text-gray-400 font-medium mb-8">Live Guest Response Status</p>
          
          <div className="flex flex-col md:flex-row items-center gap-12 ml-4">
            {/* Dynamic Donut Chart */}
            <div className="relative w-40 h-40 rounded-full flex items-center justify-center shrink-0" style={{
              background: total > 0 
                ? `conic-gradient(#10B981 0% ${confirmedPct}%, #F59E0B ${confirmedPct}% ${confirmedPct + pendingPct}%, #FCA5A5 ${confirmedPct + pendingPct}% 100%)`
                : `#f1f5f9`
            }}>
              <div className="w-[120px] h-[120px] bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-[28px] font-bold text-[#10B981]">{confirmedPct}%</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wider">Confirmed</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                <div>
                  <p className="font-semibold text-[14px] text-gray-700 leading-none">Confirmed</p>
                  <p className="text-[12px] text-gray-400 mt-1">{confirmed} guests</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                <div>
                  <p className="font-semibold text-[14px] text-gray-700 leading-none">Pending</p>
                  <p className="text-[12px] text-gray-400 mt-1">{pending} guests</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#FCA5A5]"></div>
                <div>
                  <p className="font-semibold text-[14px] text-gray-700 leading-none">Declined</p>
                  <p className="text-[12px] text-gray-400 mt-1">{declined} guests</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
