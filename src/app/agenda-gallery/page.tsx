"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles, Utensils, Camera, Heart, Music, GlassWater, ZoomIn, Calendar } from "lucide-react";

/* ─── Gold divider ───────────────────────────────────────────────────── */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 w-full my-6">
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,160,96,0.4))" }} />
      <svg width="14" height="14" viewBox="0 0 16 16">
        <path d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z" fill="#C9A060" opacity="0.75" />
      </svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(201,160,96,0.4))" }} />
    </div>
  );
}

/* ─── Cream & Gold Watercolor Background ─────────────────────────────── */
function CreamBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(ellipse,rgba(210,185,150,0.16) 0%,transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "55%", height: "55%", background: "radial-gradient(ellipse,rgba(201,160,96,0.12) 0%,transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "35%", right: "-5%", width: "30%", height: "40%", background: "radial-gradient(ellipse,rgba(201,160,96,0.08) 0%,transparent 70%)", borderRadius: "50%" }} />
    </div>
  );
}

/* ─── Agenda data ───────────────────────────────────────────────────── */
const DEFAULT_AGENDA = [
  { time: "09:30 AM", title: "Groom & Bride Welcome Dancing", desc: "Traditional welcome dancing performance as bride & groom arrive", icon: Music },
  { time: "10:00 AM", title: "Hall Entrance", desc: "Grand entrance of the couple into Wasala Banquets & Nature Resort", icon: Sparkles },
  { time: "10:15 AM", title: "Oil Lamp Ceremony", desc: "Lighting of the traditional oil lamp for auspicious blessings", icon: Sparkles },
  { time: "10:20 AM - 10:30 AM", title: "Kirikala & Cake Cutting", desc: "Traditional milk rice (Kirikala) and ceremonial cake cutting", icon: Heart },
  { time: "10:40 AM", title: "Welcome Dance", desc: "Celebratory welcome dance performance by artists", icon: Music },
  { time: "10:50 AM", title: "Family Photos", desc: "Photography session with parents and immediate family", icon: Camera },
  { time: "11:00 AM", title: "Bar Open - Couple Toast", desc: "Bar open celebration & congratulatory toast with guests", icon: GlassWater },
  { time: "11:15 AM - 12:15 PM", title: "Group Photos", desc: "Photography session with relatives, friends & all guests", icon: Camera },
  { time: "12:15 PM", title: "Surprise Dance by Bride", desc: "Special surprise dance performance by the beautiful bride", icon: Music },
  { time: "12:30 PM", title: "Buffet Open", desc: "Exquisite wedding grand lunch buffet and refreshments", icon: Utensils },
  { time: "12:45 PM - 01:45 PM", title: "Going Away Dress Change", desc: "Bride & groom preparation for the going away celebration", icon: Clock },
  { time: "02:00 PM - 02:30 PM", title: "Going Away Photoshoot", desc: "Romantic photoshoot session for the newlyweds", icon: Camera },
  { time: "02:45 PM", title: "Going Away Welcome", desc: "Welcoming the newlyweds in their going away attire", icon: Sparkles },
  { time: "03:00 PM", title: "Dhol Event & DJ Dance Floor", desc: "Live energetic Dhol performance & DJ dance party", icon: Music },
  { time: "04:00 PM", title: "Farewell & Conclusion", desc: "Sending off the newlyweds with blessings, love & memories", icon: Heart },
];

/* ─── All 58 real wedding photos ─────────────────────────────────────── */
const GALLERY = Array.from({ length: 58 }, (_, i) => ({
  url: `/wedding-photos/photo-${String(i + 1).padStart(2, "0")}.jpg`,
  caption: `Wedding Moment ${i + 1}`,
}));

export default function AgendaGallery() {
  const [revealed, setRevealed] = useState(false);
  const [activeTab, setActiveTab] = useState<"agenda" | "gallery">("agenda");
  const [agendaList, setAgendaList] = useState(DEFAULT_AGENDA);
  const [lightbox, setLightbox] = useState<number | null>(null);

  /* Keyboard navigation for lightbox */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "ArrowRight") setLightbox((p) => (p! + 1) % GALLERY.length);
      if (e.key === "ArrowLeft")  setLightbox((p) => (p! - 1 + GALLERY.length) % GALLERY.length);
      if (e.key === "Escape")      setLightbox(null);
    },
    [lightbox]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  /* Lock body scroll when lightbox is open */
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
  }, [lightbox]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding_custom_agenda");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAgendaList(parsed.map((item: any) => ({
            ...item,
            icon: item.title?.toLowerCase().includes("lunch") || item.title?.toLowerCase().includes("buffet") || item.title?.toLowerCase().includes("food") ? Utensils
              : item.title?.toLowerCase().includes("music") || item.title?.toLowerCase().includes("dance") || item.title?.toLowerCase().includes("dj") || item.title?.toLowerCase().includes("dhol") ? Music
              : item.title?.toLowerCase().includes("photo") || item.title?.toLowerCase().includes("shoot") ? Camera
              : item.title?.toLowerCase().includes("bar") || item.title?.toLowerCase().includes("drink") || item.title?.toLowerCase().includes("toast") ? GlassWater
              : item.title?.toLowerCase().includes("cake") || item.title?.toLowerCase().includes("farewell") || item.title?.toLowerCase().includes("end") ? Heart
              : item.title?.toLowerCase().includes("lamp") || item.title?.toLowerCase().includes("entrance") || item.title?.toLowerCase().includes("welcome") ? Sparkles
              : Clock
          })));
        }
      }
    } catch (_) {}

    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center py-10 px-4 relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #F9F4ED 0%, #F5EFE5 50%, #F8F3EB 100%)" }}
    >
      <CreamBg />

      {/* Back button */}
      <Link
        href="/details"
        className="fixed top-5 left-4 flex items-center gap-1.5 text-sm font-semibold z-30 cursor-pointer"
        style={{
          color: "#9A7540",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(201,160,96,0.2)",
          borderRadius: "999px",
          padding: "8px 16px",
          boxShadow: "0 4px 16px -4px rgba(201,160,96,0.18)",
        }}
        aria-label="Go back"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Back
      </Link>

      <div
        className="w-full max-w-lg relative z-10 mt-12 pb-12"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 shadow-md"
            style={{
              background: "linear-gradient(135deg, rgba(201,160,96,0.15), rgba(232,200,122,0.1))",
              border: "1px solid rgba(201,160,96,0.25)",
            }}
          >
            <Clock size={24} style={{ color: "#C9A060" }} />
          </div>
          <h1
            className="text-3xl sm:text-4xl font-serif font-medium tracking-tight"
            style={{ color: "#1E293B" }}
          >
            Program &amp; Gallery
          </h1>
          <p className="mt-1.5 text-[14px]" style={{ color: "#9A8A6A" }}>
            Rashmi &amp; Rashin &bull; 21st September 2026
          </p>
          <GoldDivider />
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-8">
          <div
            className="p-1 rounded-full flex gap-1 shadow-sm border"
            style={{
              background: "rgba(255,255,255,0.7)",
              borderColor: "rgba(201,160,96,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <button
              onClick={() => setActiveTab("agenda")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === "agenda"
                  ? "text-white shadow-md"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              style={{
                background: activeTab === "agenda" ? "linear-gradient(135deg, #9A7540, #C9A060)" : "transparent",
              }}
            >
              <Calendar size={13} /> Event Timeline
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === "gallery"
                  ? "text-white shadow-md"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              style={{
                background: activeTab === "gallery" ? "linear-gradient(135deg, #9A7540, #C9A060)" : "transparent",
              }}
            >
              <Camera size={13} /> Photo Gallery
            </button>
          </div>
        </div>

        {/* TAB 1: AGENDA TIMELINE */}
        {activeTab === "agenda" && (
          <div className="relative pl-6 sm:pl-8 space-y-6">
            {/* Vertical timeline line */}
            <div
              className="absolute left-3 sm:left-4 top-4 bottom-4 w-0.5"
              style={{
                background: "linear-gradient(to bottom, #C9A060, #E8C87A, rgba(201,160,96,0.3))",
              }}
            />

            {agendaList.map((item, idx) => {
              const IconComponent = item.icon || Clock;
              return (
                <div
                  key={idx}
                  className="relative flex items-start gap-4 group"
                  style={{
                    animationName: "fadeInUp",
                    animationDuration: "0.5s",
                    animationDelay: `${idx * 80}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {/* Timeline icon node */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center -ml-[23px] sm:-ml-[27px] z-10 shadow-md shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: "linear-gradient(135deg, #FFFDF8, #FBF6ED)",
                      border: "2px solid #C9A060",
                    }}
                  >
                    <IconComponent size={14} style={{ color: "#9A7540" }} />
                  </div>

                  {/* Timeline card */}
                  <div
                    className="flex-1 p-4 rounded-2xl border transition-all duration-300 group-hover:shadow-md"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(12px)",
                      borderColor: "rgba(201,160,96,0.18)",
                      boxShadow: "0 4px 16px -4px rgba(201,160,96,0.10)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-[15px]" style={{ color: "#1E293B" }}>
                        {item.title}
                      </span>
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(201,160,96,0.12)",
                          color: "#9A7540",
                          border: "1px solid rgba(201,160,96,0.2)",
                        }}
                      >
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-500 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PHOTO GALLERY */}
        {activeTab === "gallery" && (
          <div className="space-y-4">
            <p className="text-center text-[12px] text-gray-400 mb-4">
              Click any photo to view full screen
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {GALLERY.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i)}
                  className="relative rounded-2xl overflow-hidden shadow-md group border border-white/60 cursor-pointer"
                  style={{
                    animationName: "zoomIn",
                    animationDuration: "0.5s",
                    animationDelay: `${Math.min(i, 12) * 60}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-44 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="text-white opacity-80" size={24} />
                  </div>
                </div>
              ))}
            </div>

            <div
              className="p-5 rounded-2xl text-center border mt-6"
              style={{
                background: "rgba(255,255,255,0.7)",
                borderColor: "rgba(201,160,96,0.2)",
              }}
            >
              <Camera size={22} className="mx-auto mb-2" style={{ color: "#C9A060" }} />
              <p className="text-xs font-bold text-gray-700">Capture the Joy</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Share your photos on social media with <span className="font-semibold text-[#9A7540]">#RashmiRashin2026</span>
              </p>
            </div>
          </div>
        )}

        {/* Bottom CTA navigation */}
        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/details"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-white text-[12px] font-bold tracking-widest uppercase shadow-md transition-all"
            style={{
              background: "linear-gradient(135deg, #9A7540, #C9A060)",
            }}
          >
            &larr; Back to Wedding Details
          </Link>
        </div>
      </div>

      {/* ── Lightbox Overlay ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.93)" }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={GALLERY[lightbox].url}
            alt={GALLERY[lightbox].caption}
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-5 text-white text-3xl font-light hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + GALLERY.length) % GALLERY.length); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full text-white text-2xl font-bold flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Previous photo"
          >
            ‹
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % GALLERY.length); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full text-white text-2xl font-bold flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Next photo"
          >
            ›
          </button>

          {/* Caption */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-xs tracking-wider opacity-60">
            {GALLERY[lightbox].caption}
          </div>
        </div>
      )}
    </main>
  );
}
