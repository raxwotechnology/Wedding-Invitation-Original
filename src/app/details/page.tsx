"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, ArrowLeft, Phone, Camera } from "lucide-react";
import FlipCountdown from "@/components/FlipCountdown";
import MediaGallery from "@/components/MediaGallery";
import { useEffect, useState, useMemo } from "react";

/* ─── Gold divider ───────────────────────────────────────────────────── */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 w-full">
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,160,96,0.4))" }} />
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z" fill="#C9A060" opacity="0.7" />
      </svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(201,160,96,0.4))" }} />
    </div>
  );
}

/* ─── Watercolor blobs ───────────────────────────────────────────────── */
function CreamBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div style={{ position:"absolute",top:"-10%",left:"-10%",width:"50%",height:"50%",background:"radial-gradient(ellipse,rgba(210,185,150,0.15) 0%,transparent 70%)",borderRadius:"50%" }} />
      <div style={{ position:"absolute",bottom:"-10%",right:"-10%",width:"55%",height:"55%",background:"radial-gradient(ellipse,rgba(201,160,96,0.10) 0%,transparent 70%)",borderRadius:"50%" }} />
      <div style={{ position:"absolute",top:"35%",right:"-5%",width:"30%",height:"40%",background:"radial-gradient(ellipse,rgba(201,160,96,0.08) 0%,transparent 70%)",borderRadius:"50%" }} />
    </div>
  );
}

/* ─── Animated info tile ─────────────────────────────────────────────── */
function InfoTile({ icon, label, value, link, linkText, delay = 0 }: { icon: React.ReactNode; label: string; value: string; link?: string; linkText?: string; delay?: number }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{
        background:   "rgba(255,255,255,0.65)",
        backdropFilter: "blur(12px)",
        border:       "1px solid rgba(201,160,96,0.15)",
        boxShadow:    "0 2px 16px -4px rgba(201,160,96,0.12)",
        opacity:      vis ? 1 : 0,
        transform:    vis ? "translateX(0)" : "translateX(-24px)",
        transition:   `opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg,rgba(201,160,96,0.12),rgba(232,200,122,0.1))", border: "1px solid rgba(201,160,96,0.2)" }}
      >
        {icon}
      </div>
      <div className="text-left min-w-0 flex-1">
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#9A8A6A", textTransform: "uppercase", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{value}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9A7540] hover:underline mt-1"
          >
            {linkText || "Open in Google Maps"} &rarr;
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function DetailsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    partnerOne:   "Rashmi",
    partnerTwo:   "Rashin",
    date:         "2026-09-21",
    venue:        "Wasala Banquets & Nature Resort",
    venueCity:    "",
    mapUrl:       "https://maps.app.goo.gl/HSCyyh3cX1pdinyb8?g_st=ic",
    detailsHeroUrl: "/wedding-photos/photo-32.jpg",
    rsvpPhone1:   "0772063903",
    rsvpName1:    "Rashin",
    rsvpPhone2:   "0753363903",
    rsvpName2:    "Rashmi",
  });

  const [isEventPast, setIsEventPast] = useState(false);
  const [revealed, setRevealed]       = useState(false);

  useEffect(() => {
    const reload = () => {
      try {
        const s = localStorage.getItem("wedding_settings");
        if (s) setProfile(p => ({ ...p, ...JSON.parse(s) }));
      } catch (_) {}
    };
    reload();
    window.addEventListener("settings-updated", reload);
    const onStorage = (e: StorageEvent) => { if (e.key === "wedding_settings") reload(); };
    window.addEventListener("storage", onStorage);
    const t = setTimeout(() => setRevealed(true), 100);
    return () => { window.removeEventListener("settings-updated", reload); window.removeEventListener("storage", onStorage); clearTimeout(t); };
  }, []);

  const eventDate = useMemo(() => {
    if (!profile.date) return new Date(9999, 0, 1);
    const [y, m, d] = profile.date.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0);
  }, [profile.date]);

  const formattedDate = useMemo(() => {
    try {
      const [y, m, d] = profile.date.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    } catch { return profile.date; }
  }, [profile.date]);

  const s = (d: number): React.CSSProperties => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.75s ease ${d}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  });

  return (
    <main
      className="min-h-screen flex flex-col items-center relative overflow-x-hidden pb-10"
      style={{ background: "linear-gradient(160deg, #F9F4ED 0%, #F5EFE5 50%, #F8F3EB 100%)" }}
    >
      <CreamBg />

      {/* Back to Wedding Invitation button */}
      <Link
        href="/"
        className="fixed top-5 left-4 flex items-center gap-1.5 text-sm font-semibold z-30 cursor-pointer shadow-md transition-all hover:scale-105"
        style={{
          color:         "#9A7540",
          background:    "rgba(255,255,255,0.92)",
          backdropFilter:"blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border:        "1px solid rgba(201,160,96,0.3)",
          borderRadius:  "999px",
          padding:       "8px 18px",
          boxShadow:     "0 4px 16px -4px rgba(201,160,96,0.25)",
        }}
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Invitation
      </Link>

      {/* Hero photo with decorative ring */}
      <div
        className="relative z-10 mt-14"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "scale(1) translateY(0)" : "scale(0.85) translateY(-10px)",
          transition: "opacity 0.9s ease 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}
      >
        <div className="relative" style={{ width: 130, height: 130 }}>
          {/* Spinning gold gradient ring */}
          <div
            className="absolute rounded-full"
            style={{
              inset: -6,
              background: "conic-gradient(from 0deg, #9A7540, #C9A060, #E8C87A, #D4AF37, #E8C87A, #C9A060, #9A7540)",
              animationName: "spinSlow",
              animationDuration: "6s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              borderRadius: "50%",
            }}
          />
          {/* Circular Photo Container */}
          <div className="absolute inset-0 bg-white rounded-full p-1 shadow-md overflow-hidden flex items-center justify-center">
            <img
              src={profile.detailsHeroUrl}
              alt="Rashmi & Rashin"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Pulsing glow under ring */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            animationName: "ringGlow",
            animationDuration: "2.5s",
            animationTimingFunction: "ease-out",
            animationIterationCount: "infinite",
            boxShadow: "0 0 0 0 rgba(201,160,96,0.4)",
          }}
        />
      </div>

      {/* Content card */}
      <div
        className="relative z-10 w-full max-w-md px-4 mt-7"
        style={s(300)}
      >
        {/* Names + tagline */}
        <div className="text-center mb-6">
          <h1
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize:   "clamp(2.4rem, 11vw, 3.2rem)",
              lineHeight: 1.1,
              background: "linear-gradient(90deg, #9A7540, #C9A060, #E8C87A, #D4AF37, #C9A060, #9A7540)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
              animationName:        "shimmer",
              animationDuration:    "4s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              filter: "drop-shadow(0 1px 4px rgba(201,160,96,0.18))",
            }}
          >
            {profile.partnerOne} &amp; {profile.partnerTwo}
          </h1>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", color: "#7A6A4A", marginTop: 6, textTransform: "uppercase" }}>
            Are Getting Married
          </p>
          <div className="mt-4 mb-2"><GoldDivider /></div>
        </div>

        {/* Info tiles */}
        <div className="space-y-3 mb-6">
          <InfoTile
            icon={<Calendar size={18} style={{ color: "#C9A060" }} />}
            label="Date"
            value={formattedDate}
            delay={450}
          />
          <InfoTile
            icon={<MapPin size={18} style={{ color: "#C9A060" }} />}
            label="Venue"
            value={`${profile.venue}${profile.venueCity ? ", " + profile.venueCity : ""}`}
            link={profile.mapUrl || "https://maps.app.goo.gl/HSCyyh3cX1pdinyb8?g_st=ic"}
            linkText="Open in Google Maps"
            delay={560}
          />
          <InfoTile
            icon={<Phone size={18} style={{ color: "#C9A060" }} />}
            label="RSVP"
            value={`${profile.rsvpName1}: ${profile.rsvpPhone1}  ·  ${profile.rsvpName2}: ${profile.rsvpPhone2}`}
            delay={670}
          />
        </div>

        {/* Flip countdown */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background:   "rgba(255,255,255,0.70)",
            backdropFilter: "blur(16px)",
            border:       "1px solid rgba(201,160,96,0.14)",
            boxShadow:    "0 4px 24px -8px rgba(201,160,96,0.15)",
            ...s(700),
          }}
        >
          <FlipCountdown eventDate={eventDate} onPastChange={setIsEventPast} />
        </div>

        {/* Gold divider */}
        <div style={s(780)} className="mb-6">
          <GoldDivider />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3" style={s(830)}>
          <Link
            href="/gallery"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-white text-[12px] font-bold tracking-[0.2em] uppercase shadow-md transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: "linear-gradient(90deg, #9A7540 0%, #C9A060 25%, #E8C87A 50%, #C9A060 75%, #9A7540 100%)",
              backgroundSize: "200% auto",
              animationName: "shimmer",
              animationDuration: "3.5s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              boxShadow: "0 8px 32px -8px rgba(201,160,96,0.55)",
            }}
          >
            <Camera size={16} /> Photo Gallery
          </Link>

          <Link
            href="/agenda-gallery"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-[12px] font-bold tracking-[0.18em] uppercase transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(201,160,96,0.35)",
              color: "#9A7540",
              boxShadow: "0 4px 16px -4px rgba(201,160,96,0.15)",
            }}
          >
            View Program Agenda
          </Link>
        </div>
      </div>

      {/* Embedded Media Gallery on Details Page */}
      <div className="w-full max-w-5xl mt-12 relative z-10 px-4">
        <MediaGallery />
      </div>
    </main>
  );
}
