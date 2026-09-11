"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

/* ─── Wedding details (defaults match the uploaded invitation) ─────── */
const DEFAULT_PROFILE = {
  partnerOne:    "Rashmi",
  partnerTwo:    "Rashin",
  date:          "2026-09-21",
  dayOfWeek:     "MONDAY",
  venue:         "TRANQUIL HOTEL &\nBANQUET HALL",
  venueCity:     "WELIWERIYA",
  timeFrom:      "10.00 A.M.",
  groomParents:  "MR. SUSANTHA & MRS. ANOMA",
  brideParents:  "MR. WIKUM & MRS. INOKA",
  rsvpLine:      "RASHIN - 0772063903  |  RASHMI - 0753363903",
};

/* ─── R & R SVG Monogram ────────────────────────────────────────────── */
function RRMonogram({ visible }: { visible: boolean }) {
  return (
    <div
      className="flex flex-col items-center mb-5"
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "scale(1) translateY(0)" : "scale(0.7) translateY(-10px)",
        transition: "opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
      }}
    >
      <div className="relative" style={{ width: 90, height: 90 }}>
        {/* Outer circle */}
        <svg
          width="90" height="90" viewBox="0 0 90 90" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          {/* Outer ring */}
          <circle cx="45" cy="45" r="42" stroke="#C9A060" strokeWidth="1.3" fill="none" />
          {/* Inner dashed ring */}
          <circle cx="45" cy="45" r="36" stroke="#C9A060" strokeWidth="0.5" fill="none" strokeDasharray="2.5 4" />
          {/* Leaf left */}
          <path d="M27 74 C24 65, 30 60, 35 66 C32 73, 27 76, 27 74Z" fill="#7D9E5A" opacity="0.75" />
          <path d="M22 70 C20 62, 27 57, 31 63 C27 70, 22 73, 22 70Z" fill="#6B8A4B" opacity="0.65" />
          {/* Leaf right */}
          <path d="M63 74 C66 65, 60 60, 55 66 C58 73, 63 76, 63 74Z" fill="#7D9E5A" opacity="0.75" />
          <path d="M68 70 C70 62, 63 57, 59 63 C63 70, 68 73, 68 70Z" fill="#6B8A4B" opacity="0.65" />
          {/* Bottom connector arc */}
          <path d="M35 78 Q45 72 55 78" stroke="#C9A060" strokeWidth="0.9" fill="none" opacity="0.85" />
          {/* Small dots on arc */}
          <circle cx="35" cy="78" r="1.2" fill="#C9A060" opacity="0.7" />
          <circle cx="55" cy="78" r="1.2" fill="#C9A060" opacity="0.7" />
        </svg>

        {/* R & R text overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily:   "'Great Vibes', cursive",
            fontSize:     "1.9rem",
            color:        "#C9A060",
            letterSpacing: "0.03em",
            marginTop:    "-4px",
          }}
        >
          R&amp;R
        </div>
      </div>
    </div>
  );
}

/* ─── Gold sparkle side lines ───────────────────────────────────────── */
function GoldSideAccent({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none"
      style={{ [isLeft ? "left" : "right"]: 0, width: 18, zIndex: 2 }}
    >
      {/* Main gold gradient line */}
      <div
        className="absolute"
        style={{
          [isLeft ? "left" : "right"]: 5,
          top: "12%",
          bottom: "12%",
          width: 1.5,
          background: "linear-gradient(to bottom, transparent, #D4AF37 20%, #E8C87A 50%, #D4AF37 80%, transparent)",
          opacity: 0.55,
        }}
      />
      {/* Sparkle dots */}
      {[18, 30, 45, 58, 70, 82].map((pct, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            [isLeft ? "left" : "right"]: 3 + (i % 2) * 4,
            top: `${pct}%`,
            width:      3 + (i % 3),
            height:     3 + (i % 3),
            background: "#D4AF37",
            opacity:    0.3 + (i % 4) * 0.08,
            boxShadow:  "0 0 5px 1px rgba(212,175,55,0.35)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Watercolor blob background ─────────────────────────────────────── */
function WatercolorBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Top-center warm blob */}
      <div style={{
        position: "absolute", top: "-5%", left: "20%", right: "20%",
        height: "35%",
        background: "radial-gradient(ellipse, rgba(210,185,150,0.18) 0%, rgba(210,185,150,0.08) 50%, transparent 80%)",
        borderRadius: "50%",
      }} />
      {/* Right-side blob */}
      <div style={{
        position: "absolute", top: "30%", right: "-10%",
        width: "40%", height: "40%",
        background: "radial-gradient(ellipse, rgba(201,160,96,0.10) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      {/* Bottom-left blob */}
      <div style={{
        position: "absolute", bottom: "-5%", left: "-5%",
        width: "50%", height: "35%",
        background: "radial-gradient(ellipse, rgba(210,185,150,0.14) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
    </div>
  );
}

/* ─── SVG Floral corner ──────────────────────────────────────────────── */
function FloralCornerTopLeft({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute top-0 left-0 pointer-events-none"
      style={{
        width: 220, height: 220,
        zIndex: 3,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0) scale(1)" : "translate(-20px,-20px) scale(0.9)",
        transition: "opacity 1s ease 0.1s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}
    >
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ─ Big white rose (main) ─ */}
        <ellipse cx="72" cy="55" rx="34" ry="42" fill="rgba(255,255,255,0.90)" />
        <ellipse cx="48" cy="72" rx="28" ry="36" fill="rgba(255,253,248,0.86)" transform="rotate(-25 48 72)" />
        <ellipse cx="96" cy="68" rx="28" ry="36" fill="rgba(255,253,248,0.86)" transform="rotate(20 96 68)" />
        <ellipse cx="55" cy="94" rx="24" ry="30" fill="rgba(255,251,244,0.82)" transform="rotate(10 55 94)" />
        <ellipse cx="88" cy="90" rx="24" ry="30" fill="rgba(255,251,244,0.82)" transform="rotate(-15 88 90)" />
        <ellipse cx="70" cy="82" rx="14" ry="18" fill="rgba(255,248,232,0.94)" />
        <circle  cx="70" cy="78" r="8"  fill="rgba(255,238,200,0.88)" />
        <circle  cx="70" cy="78" r="4"  fill="rgba(255,225,170,0.80)" />

        {/* ─ Small flower (top right area) ─ */}
        {[0,60,120,180,240,300].map((a,i) => (
          <ellipse key={i}
            cx={145 + 14*Math.cos(a*Math.PI/180)}
            cy={35  + 14*Math.sin(a*Math.PI/180)}
            rx="7" ry="13"
            fill={`rgba(255,255,255,${0.82 - i*0.02})`}
            transform={`rotate(${a} ${145+14*Math.cos(a*Math.PI/180)} ${35+14*Math.sin(a*Math.PI/180)})`}
          />
        ))}
        <circle cx="145" cy="35" r="5" fill="rgba(255,232,180,0.90)" />

        {/* ─ Leaves ─ */}
        <path d="M20 110 C5 90, 0 75, 8 62 C10 80, 20 98, 32 108Z" fill="rgba(95,135,75,0.62)" />
        <path d="M35 120 C18 108, 12 125, 5 118 C14 128, 30 135, 44 124Z" fill="rgba(105,145,80,0.55)" />
        <path d="M100 18 C118 8, 125 24, 138 14 C126 28, 112 33, 100 22Z" fill="rgba(95,135,75,0.58)" />
        <path d="M148 55 C162 40, 170 58, 182 50 C172 65, 158 68, 148 58Z" fill="rgba(105,145,80,0.50)" />

        {/* ─ Gold branch stems ─ */}
        <path d="M95 55 C120 38, 150 22, 175 8"  stroke="#C9A060" strokeWidth="1.1" fill="none" opacity="0.55" />
        <path d="M112 72 C138 60, 162 44, 188 28" stroke="#C9A060" strokeWidth="0.8" fill="none" opacity="0.42" />
        <path d="M78 100 C90 120, 92 140, 85 160" stroke="#C9A060" strokeWidth="0.8" fill="none" opacity="0.40" />
        <path d="M60 115 C50 135, 38 148, 22 158" stroke="#C9A060" strokeWidth="0.7" fill="none" opacity="0.38" />

        {/* ─ Gold sparkle dots ─ */}
        {[[128,52],[150,32],[165,60],[180,38],[158,78],[135,72],[98,128],[84,142],[105,155],[120,145],[70,165],[52,150]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={1.4+i*0.1} fill="#D4AF37" opacity={0.38+i*0.03} />
        ))}

        {/* ─ Small bud / accent flower ─ */}
        {[0,72,144,216,288].map((a,i) => (
          <ellipse key={i}
            cx={93 + 10*Math.cos(a*Math.PI/180)}
            cy={135 + 10*Math.sin(a*Math.PI/180)}
            rx="5" ry="9"
            fill="rgba(255,255,255,0.80)"
            transform={`rotate(${a} ${93+10*Math.cos(a*Math.PI/180)} ${135+10*Math.sin(a*Math.PI/180)})`}
          />
        ))}
        <circle cx="93" cy="135" r="4" fill="rgba(255,230,175,0.88)" />
      </svg>
    </div>
  );
}

function FloralCornerBottomRight({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute bottom-0 right-0 pointer-events-none"
      style={{
        width: 220, height: 220,
        zIndex: 3,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0) scale(1)" : "translate(20px,20px) scale(0.9)",
        transition: "opacity 1s ease 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s",
      }}
    >
      {/* Mirror + rotate the top-left flower */}
      <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(180deg) scaleX(-1)" }}>
        <ellipse cx="72" cy="55" rx="34" ry="42" fill="rgba(255,255,255,0.90)" />
        <ellipse cx="48" cy="72" rx="28" ry="36" fill="rgba(255,253,248,0.86)" transform="rotate(-25 48 72)" />
        <ellipse cx="96" cy="68" rx="28" ry="36" fill="rgba(255,253,248,0.86)" transform="rotate(20 96 68)" />
        <ellipse cx="55" cy="94" rx="24" ry="30" fill="rgba(255,251,244,0.82)" transform="rotate(10 55 94)" />
        <ellipse cx="88" cy="90" rx="24" ry="30" fill="rgba(255,251,244,0.82)" transform="rotate(-15 88 90)" />
        <ellipse cx="70" cy="82" rx="14" ry="18" fill="rgba(255,248,232,0.94)" />
        <circle  cx="70" cy="78" r="8"  fill="rgba(255,238,200,0.88)" />
        <circle  cx="70" cy="78" r="4"  fill="rgba(255,225,170,0.80)" />
        {[0,60,120,180,240,300].map((a,i) => (
          <ellipse key={i}
            cx={145 + 14*Math.cos(a*Math.PI/180)}
            cy={35  + 14*Math.sin(a*Math.PI/180)}
            rx="7" ry="13"
            fill={`rgba(255,255,255,${0.82-i*0.02})`}
            transform={`rotate(${a} ${145+14*Math.cos(a*Math.PI/180)} ${35+14*Math.sin(a*Math.PI/180)})`}
          />
        ))}
        <circle cx="145" cy="35" r="5" fill="rgba(255,232,180,0.90)" />
        <path d="M20 110 C5 90, 0 75, 8 62 C10 80, 20 98, 32 108Z" fill="rgba(95,135,75,0.62)" />
        <path d="M35 120 C18 108, 12 125, 5 118 C14 128, 30 135, 44 124Z" fill="rgba(105,145,80,0.55)" />
        <path d="M100 18 C118 8, 125 24, 138 14 C126 28, 112 33, 100 22Z" fill="rgba(95,135,75,0.58)" />
        <path d="M148 55 C162 40, 170 58, 182 50 C172 65, 158 68, 148 58Z" fill="rgba(105,145,80,0.50)" />
        <path d="M95 55 C120 38, 150 22, 175 8"  stroke="#C9A060" strokeWidth="1.1" fill="none" opacity="0.55" />
        <path d="M112 72 C138 60, 162 44, 188 28" stroke="#C9A060" strokeWidth="0.8" fill="none" opacity="0.42" />
        <path d="M78 100 C90 120, 92 140, 85 160" stroke="#C9A060" strokeWidth="0.8" fill="none" opacity="0.40" />
        {[[128,52],[150,32],[165,60],[180,38],[158,78],[135,72],[98,128],[84,142],[105,155],[120,145]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={1.4+i*0.1} fill="#D4AF37" opacity={0.38+i*0.03} />
        ))}
        {[0,72,144,216,288].map((a,i) => (
          <ellipse key={i}
            cx={93 + 10*Math.cos(a*Math.PI/180)}
            cy={135 + 10*Math.sin(a*Math.PI/180)}
            rx="5" ry="9"
            fill="rgba(255,255,255,0.80)"
            transform={`rotate(${a} ${93+10*Math.cos(a*Math.PI/180)} ${135+10*Math.sin(a*Math.PI/180)})`}
          />
        ))}
        <circle cx="93" cy="135" r="4" fill="rgba(255,230,175,0.88)" />
      </svg>
    </div>
  );
}

function LandingPageContent() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [visible, setVisible] = useState(false);
  const searchParams = useSearchParams();
  const guestName = searchParams?.get("to") || searchParams?.get("guest") || null;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(prev => ({
          ...prev,
          partnerOne: parsed.partnerOne ?? prev.partnerOne,
          partnerTwo: parsed.partnerTwo ?? prev.partnerTwo,
          date:       parsed.date       ?? prev.date,
          venue:      parsed.venue      ?? prev.venue,
        }));
      }
    } catch (_) {}
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Stagger helper */
  const s = (delay: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  /* Date display */
  const dateNum = (() => {
    try {
      const [, m, d] = profile.date.split("-").map(Number);
      const months = ["","JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
      const ordinals = ["","ST","ND","RD"];
      const ord = d <= 3 ? ordinals[d] : "TH";
      return { day: d, month: months[m] ?? "", ordinal: ord };
    } catch { return { day: 21, month: "SEPTEMBER", ordinal: "ST" }; }
  })();

  return (
    <main
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F9F4ED 0%, #F5EFE5 40%, #F8F3EB 70%, #F6F0E7 100%)" }}
    >
      {/* Watercolor texture */}
      <WatercolorBg />

      {/* Gold side accents */}
      <GoldSideAccent side="left" />
      <GoldSideAccent side="right" />

      {/* Floral corners */}
      <FloralCornerTopLeft visible={visible} />
      <FloralCornerBottomRight visible={visible} />

      {/* ── Main invitation content ── */}
      <div
        className="relative z-10 w-full max-w-[400px] flex flex-col items-center text-center px-10 pt-16 pb-10"
        style={{ minHeight: "100vh" }}
      >
        {/* Monogram */}
        <RRMonogram visible={visible} />

        {/* Parents block */}
        <div style={s(300)} className="mb-1">
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#1A1A1A" }}>
            {profile.groomParents}
          </p>
          <p style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: "0.12em", color: "#4A4A4A", margin: "4px 0" }}>
            TOGETHER WITH
          </p>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: "#1A1A1A" }}>
            {profile.brideParents}
          </p>

          <p style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: "0.12em", color: "#4A4A4A", marginTop: 5 }}>
            WARMLY REQUEST THE PRESENCE OF
          </p>
          <p style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: "0.12em", color: "#4A4A4A", marginTop: 2 }}>
            MR &amp; MRS / MRS / MR / MISS / FAMILY
          </p>

          {guestName && (
            <div className="mt-6 mb-2 relative">
              <p style={{ 
                fontFamily: "'Great Vibes', cursive", 
                fontSize: "2.4rem", 
                color: "#1A1A1A",
                lineHeight: 1.2,
                textShadow: "0 2px 8px rgba(201,160,96,0.15)",
              }}>
                {guestName}
              </p>
            </div>
          )}
        </div>

        {/* Dotted separator */}
        <div style={{ ...s(430), width: "100%", margin: "14px 0" }}>
          <div style={{
            borderTop: "1.5px dashed rgba(44,44,44,0.22)",
            width: "100%",
          }} />
        </div>

        {/* "To celebrate..." */}
        <p style={{ ...s(480), fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", color: "#3A3A3A", marginBottom: 10 }}>
          {guestName ? "TO CELEBRATE THE MARRIAGE OF THEIR BELOVED CHILDREN" : "TO CELEBRATE THE MARRIAGE OF THEIR BELOVED CHILDREN"}
        </p>

        {/* ── Couple names (GOLD SHIMMER) ── */}
        <div style={{ ...s(560), margin: "6px 0 10px" }}>
          <h1
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize:   "clamp(3.2rem, 14vw, 4.2rem)",
              lineHeight: 1.15,
              background: "linear-gradient(90deg, #9A7540 0%, #C9A060 20%, #E8C87A 40%, #D4AF37 55%, #E8C87A 70%, #C9A060 85%, #9A7540 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animationName: "shimmer",
              animationDuration: "4s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              filter: "drop-shadow(0 2px 8px rgba(201,160,96,0.25))",
            }}
          >
            {profile.partnerOne} &amp; {profile.partnerTwo}
          </h1>
        </div>

        {/* ── Date block ── */}
        <div style={{ ...s(660), width: "100%", margin: "10px 0" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em", color: "#1A1A1A" }}>
            ON {profile.dayOfWeek}
          </p>

          <div className="flex items-center justify-center gap-3 mt-2 mb-1">
            {/* Left line + month */}
            <div className="flex items-center gap-2 flex-1 justify-end">
               <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "#2A2A2A" }}>
                {dateNum.month}
              </span>
              <div style={{ flex: 1, maxWidth: 40, height: 1, background: "#1A1A1A", opacity: 0.4 }} />
            </div>

            {/* Big date number */}
            <div className="text-center" style={{ minWidth: 56 }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#2A2A2A", display: "block", lineHeight: 1 }}>
                {dateNum.ordinal}
              </span>
              <span style={{ fontSize: "clamp(2.8rem,12vw,3.6rem)", fontWeight: 800, color: "#1A1A1A", lineHeight: 1, letterSpacing: "-0.03em", display: "block" }}>
                {dateNum.day}
              </span>
            </div>

            {/* Right line + year */}
            <div className="flex items-center gap-2 flex-1 justify-start">
              <div style={{ flex: 1, maxWidth: 40, height: 1, background: "#1A1A1A", opacity: 0.4 }} />
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "#2A2A2A" }}>
                2026
              </span>
            </div>
          </div>
        </div>

        {/* ── Venue ── */}
        <div style={{ ...s(750), margin: "10px 0" }}>
          <p style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.22em", color: "#4A4A4A", marginBottom: 6 }}>
            AT
          </p>
          <p style={{
            fontSize: "clamp(12px,3.5vw,15px)",
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "#1A1A1A",
            lineHeight: 1.35,
            whiteSpace: "pre-line",
          }}>
            {profile.venue}
          </p>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", color: "#3A3A3A", marginTop: 5 }}>
            {profile.venueCity}
          </p>
          <p style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: "0.14em", color: "#4A4A4A", marginTop: 5 }}>
            FROM {profile.timeFrom} TO ONWARDS
          </p>
        </div>

        {/* Thin separator */}
        <div style={{ ...s(820), width: "80%", margin: "14px auto" }}>
          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(44,44,44,0.18), transparent)" }} />
        </div>

        {/* ── RSVP ── */}
        <div style={s(870)}>
          <p style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.28em", color: "#4A4A4A", marginBottom: 5 }}>
            RSVP
          </p>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.09em", color: "#2A2A2A" }}>
            {profile.rsvpLine}
          </p>
        </div>

        {/* ── Digital-only action buttons ── */}
        <div style={{ ...s(960), width: "100%", marginTop: 22 }}>
          <Link
            href="/details"
            className="block w-full py-4 rounded-full text-center text-white text-[11px] font-bold tracking-[0.2em] uppercase mb-3 overflow-hidden relative"
            style={{
              background: "linear-gradient(90deg, #9A7540 0%, #C9A060 25%, #E8C87A 50%, #C9A060 75%, #9A7540 100%)",
              backgroundSize: "200% auto",
              animationName: "shimmer",
              animationDuration: "3.5s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              boxShadow: "0 8px 32px -8px rgba(201,160,96,0.55), 0 2px 8px rgba(201,160,96,0.20)",
              letterSpacing: "0.18em",
            }}
          >
            Open Full Invitation ✉️
          </Link>

          <Link
            href={`/find-my-seat${guestName ? `?q=${encodeURIComponent(guestName)}` : ''}`}
            className="block w-full py-3.5 rounded-full text-center text-[11px] font-bold tracking-[0.18em] uppercase mb-2"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(201,160,96,0.35)",
              color: "#9A7540",
              boxShadow: "0 4px 16px -4px rgba(201,160,96,0.18)",
            }}
          >
            📍 Find My Seat
          </Link>

          <Link
            href="/agenda-gallery"
            className="block w-full py-2.5 text-center text-[11px] font-semibold text-gray-500 hover:text-gray-800 underline underline-offset-4"
          >
            🗓️ View Program Agenda &amp; Gallery &rarr;
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#F9F4ED" }} />}>
      <LandingPageContent />
    </Suspense>
  );
}
