"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";

/* ─── Wedding Splash / Entrance Animation ───────────────────────────── */
function WeddingSplash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const doneRef = useRef(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    const t3 = setTimeout(() => {
      if (!doneRef.current) { doneRef.current = true; onDone(); }
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const dismiss = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("exit");
    setTimeout(onDone, 650);
  };

  const isExiting = phase === "exit";

  /* Floating petal seeds */
  const petals = [
    { left: "8%",  delay: 0,    dur: 3.2, size: 13, rot: 25 },
    { left: "18%", delay: 0.4,  dur: 2.8, size: 10, rot: -15 },
    { left: "30%", delay: 0.15, dur: 3.5, size: 15, rot: 40 },
    { left: "45%", delay: 0.7,  dur: 3.0, size: 11, rot: -30 },
    { left: "58%", delay: 0.3,  dur: 2.6, size: 14, rot: 20 },
    { left: "70%", delay: 0.55, dur: 3.3, size: 10, rot: -45 },
    { left: "80%", delay: 0.1,  dur: 2.9, size: 13, rot: 35 },
    { left: "90%", delay: 0.8,  dur: 3.1, size: 9,  rot: -20 },
    { left: "25%", delay: 1.0,  dur: 2.7, size: 12, rot: 50 },
    { left: "62%", delay: 1.2,  dur: 3.4, size: 11, rot: -10 },
  ];

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #FAF6EF 0%, #F5EDE0 40%, #F9F3E8 70%, #F6EFE2 100%)",
        overflow: "hidden",
        cursor: "pointer",
        /* curtain swipe upward on exit */
        transform: isExiting ? "translateY(-100%)" : "translateY(0)",
        transition: isExiting ? "transform 0.7s cubic-bezier(0.4,0,0.2,1)" : "none",
      }}
    >
      {/* ── Floating petals ── */}
      {petals.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-30px",
            left: p.left,
            width: p.size,
            height: p.size * 1.5,
            background: `rgba(255,${200 + (i % 3) * 18},${180 + (i % 4) * 12},0.82)`,
            borderRadius: "50% 40% 50% 30%",
            opacity: 0,
            animation: `splashPetalFall ${p.dur}s ease-in ${p.delay}s 1 forwards`,
            transform: `rotate(${p.rot}deg)`,
            boxShadow: "0 2px 6px rgba(201,100,80,0.18)",
          }}
        />
      ))}

      {/* ── Gold sparkle dots (static) ── */}
      {[[12,20],[88,15],[6,70],[93,65],[50,8],[20,88],[78,85]].map(([l,t],i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${l}%`, top: `${t}%`,
          width: 3 + (i % 3),
          height: 3 + (i % 3),
          borderRadius: "50%",
          background: "#D4AF37",
          opacity: 0.35 + (i % 4) * 0.08,
          boxShadow: "0 0 6px 2px rgba(212,175,55,0.30)",
          animation: `splashSparkle ${1.5 + (i % 3) * 0.4}s ease-in-out ${i * 0.2}s infinite alternate`,
        }} />
      ))}

      {/* ── Floral accent top-left (tiny) ── */}
      <svg width="160" height="160" viewBox="0 0 220 220" fill="none"
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.85 }}>
        <ellipse cx="72" cy="55" rx="34" ry="42" fill="rgba(255,255,255,0.92)" />
        <ellipse cx="48" cy="72" rx="28" ry="36" fill="rgba(255,253,248,0.88)" transform="rotate(-25 48 72)" />
        <ellipse cx="96" cy="68" rx="28" ry="36" fill="rgba(255,253,248,0.88)" transform="rotate(20 96 68)" />
        <ellipse cx="70" cy="82" rx="14" ry="18" fill="rgba(255,248,232,0.96)" />
        <circle cx="70" cy="78" r="8" fill="rgba(255,238,200,0.90)" />
        <circle cx="70" cy="78" r="4" fill="rgba(255,225,170,0.82)" />
        <path d="M20 110 C5 90, 0 75, 8 62 C10 80, 20 98, 32 108Z" fill="rgba(95,135,75,0.60)" />
        <path d="M100 18 C118 8, 125 24, 138 14 C126 28, 112 33, 100 22Z" fill="rgba(95,135,75,0.55)" />
        <path d="M95 55 C120 38, 150 22, 175 8" stroke="#C9A060" strokeWidth="1.1" fill="none" opacity="0.55" />
      </svg>

      {/* ── Floral accent bottom-right (tiny, mirrored) ── */}
      <svg width="160" height="160" viewBox="0 0 220 220" fill="none"
        style={{ position: "absolute", bottom: 0, right: 0, opacity: 0.85, transform: "rotate(180deg) scaleX(-1)" }}>
        <ellipse cx="72" cy="55" rx="34" ry="42" fill="rgba(255,255,255,0.92)" />
        <ellipse cx="48" cy="72" rx="28" ry="36" fill="rgba(255,253,248,0.88)" transform="rotate(-25 48 72)" />
        <ellipse cx="96" cy="68" rx="28" ry="36" fill="rgba(255,253,248,0.88)" transform="rotate(20 96 68)" />
        <ellipse cx="70" cy="82" rx="14" ry="18" fill="rgba(255,248,232,0.96)" />
        <circle cx="70" cy="78" r="8" fill="rgba(255,238,200,0.90)" />
        <circle cx="70" cy="78" r="4" fill="rgba(255,225,170,0.82)" />
        <path d="M20 110 C5 90, 0 75, 8 62 C10 80, 20 98, 32 108Z" fill="rgba(95,135,75,0.60)" />
        <path d="M100 18 C118 8, 125 24, 138 14 C126 28, 112 33, 100 22Z" fill="rgba(95,135,75,0.55)" />
        <path d="M95 55 C120 38, 150 22, 175 8" stroke="#C9A060" strokeWidth="1.1" fill="none" opacity="0.55" />
      </svg>

      {/* ── Gold left & right side lines ── */}
      <div style={{
        position: "absolute", left: 14, top: "15%", bottom: "15%", width: 1.5,
        background: "linear-gradient(to bottom, transparent, #D4AF37 20%, #E8C87A 50%, #D4AF37 80%, transparent)",
        opacity: 0.5,
      }} />
      <div style={{
        position: "absolute", right: 14, top: "15%", bottom: "15%", width: 1.5,
        background: "linear-gradient(to bottom, transparent, #D4AF37 20%, #E8C87A 50%, #D4AF37 80%, transparent)",
        opacity: 0.5,
      }} />

      {/* ── Center content ── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "0 32px",
        opacity: phase === "enter" ? 0 : 1,
        transform: phase === "enter" ? "translateY(24px) scale(0.96)" : "translateY(0) scale(1)",
        transition: "opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
      }}>
        {/* R & R monogram ring */}
        <div style={{ position: "relative", width: 96, height: 96, marginBottom: 18 }}>
          <svg width="96" height="96" viewBox="0 0 90 90" fill="none" style={{ position: "absolute", inset: 0 }}>
            <circle cx="45" cy="45" r="42" stroke="#C9A060" strokeWidth="1.5" fill="none" />
            <circle cx="45" cy="45" r="36" stroke="#C9A060" strokeWidth="0.6" fill="none" strokeDasharray="2.5 4" />
            <path d="M27 74 C24 65, 30 60, 35 66 C32 73, 27 76, 27 74Z" fill="#7D9E5A" opacity="0.7" />
            <path d="M63 74 C66 65, 60 60, 55 66 C58 73, 63 76, 63 74Z" fill="#7D9E5A" opacity="0.7" />
            <path d="M35 78 Q45 72 55 78" stroke="#C9A060" strokeWidth="1" fill="none" opacity="0.8" />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Great Vibes', cursive", fontSize: "2rem", color: "#C9A060",
            marginTop: "-4px",
            animation: "splashSparkle 2.5s ease-in-out infinite alternate",
          }}>
            R&amp;R
          </div>
        </div>

        {/* Couple names — gold shimmer */}
        <h1 style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "clamp(2.8rem, 12vw, 4rem)",
          lineHeight: 1.2,
          background: "linear-gradient(90deg, #9A7540 0%, #C9A060 20%, #E8C87A 40%, #D4AF37 55%, #E8C87A 70%, #C9A060 85%, #9A7540 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animationName: "shimmer",
          animationDuration: "3s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          filter: "drop-shadow(0 3px 12px rgba(201,160,96,0.30))",
          marginBottom: 10,
        }}>
          Rashmi &amp; Rashin
        </h1>

        {/* Gold lace divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 260, margin: "6px 0 14px" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #C9A060)" }} />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" fill="#C9A060" opacity="0.7" />
            <circle cx="10" cy="10" r="6" stroke="#C9A060" strokeWidth="0.7" fill="none" opacity="0.5" />
            <circle cx="4"  cy="4"  r="1.5" fill="#D4AF37" opacity="0.55" />
            <circle cx="16" cy="4"  r="1.5" fill="#D4AF37" opacity="0.55" />
            <circle cx="4"  cy="16" r="1.5" fill="#D4AF37" opacity="0.55" />
            <circle cx="16" cy="16" r="1.5" fill="#D4AF37" opacity="0.55" />
          </svg>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #C9A060)" }} />
        </div>

        {/* Date & venue */}
        <p style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.22em",
          color: "#3A3A3A", marginBottom: 4,
        }}>
          MONDAY · 21ST SEPTEMBER 2026
        </p>
        <p style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
          color: "#1A1A1A", lineHeight: 1.5,
        }}>
          WASALA BANQUETS &amp; NATURE RESORT
        </p>

        {/* Tap hint */}
        <p style={{
          fontSize: "9.5px", letterSpacing: "0.18em", color: "#9A7540",
          marginTop: 28, opacity: 0.7, animation: "splashSparkle 1.8s ease-in-out 1.5s infinite alternate",
        }}>
          TAP TO ENTER
        </p>
      </div>

      {/* Keyframes injected inline */}
      <style>{`
        @keyframes splashPetalFall {
          0%   { opacity: 0;   transform: translateY(0) rotate(var(--r, 20deg)) scale(1); }
          10%  { opacity: 0.9; }
          90%  { opacity: 0.7; }
          100% { opacity: 0;   transform: translateY(110vh) rotate(calc(var(--r, 20deg) + 180deg)) scale(0.8); }
        }
        @keyframes splashSparkle {
          from { opacity: 0.35; transform: scale(0.95); }
          to   { opacity: 0.85; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

/* ─── Wedding details (defaults match the uploaded invitation) ─────── */
const DEFAULT_PROFILE = {
  partnerOne:    "Rashmi",
  partnerTwo:    "Rashin",
  date:          "2026-09-21",
  dayOfWeek:     "MONDAY",
  venue:         "WASALA BANQUETS &\nNATURE RESORT",
  venueCity:     "",
  mapLink:       "https://maps.app.goo.gl/HSCyyh3cX1pdinyb8?g_st=ic",
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
  const [showSplash, setShowSplash] = useState(true);
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
    <>
      {showSplash && <WeddingSplash onDone={() => setShowSplash(false)} />}
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
        className="relative z-10 w-full max-w-[400px] flex flex-col items-center text-center px-10 pt-16 pb-24"
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
          {profile.venueCity && (
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", color: "#3A3A3A", marginTop: 4 }}>
              {profile.venueCity}
            </p>
          )}
          <p style={{ fontSize: "10.5px", fontWeight: 500, letterSpacing: "0.14em", color: "#4A4A4A", marginTop: 5 }}>
            FROM {profile.timeFrom} TO ONWARDS
          </p>

          <a
            href={profile.mapLink || "https://maps.app.goo.gl/HSCyyh3cX1pdinyb8?g_st=ic"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-full text-[10.5px] font-bold tracking-wider uppercase transition-all hover:scale-105 shadow-sm"
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(201,160,96,0.35)",
              color: "#9A7540",
            }}
          >
            <MapPin size={12} /> View Location on Map &rarr;
          </a>
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
            Open Full Invitation
          </Link>

          <Link
            href="/gallery"
            className="block w-full py-3.5 rounded-full text-center text-[11px] font-bold tracking-[0.18em] uppercase mb-2 shadow-sm"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(201,160,96,0.5)",
              color: "#9A7540",
              boxShadow: "0 4px 16px -4px rgba(201,160,96,0.22)",
            }}
          >
            Photo Gallery
          </Link>

          <Link
            href="/agenda-gallery"
            className="block w-full py-3.5 rounded-full text-center text-[11px] font-bold tracking-[0.18em] uppercase mb-4 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(201,160,96,0.38)",
              color: "#9A7540",
              boxShadow: "0 4px 16px -4px rgba(201,160,96,0.16)",
            }}
          >
            View Program Agenda
          </Link>
        </div>

      </div>

      </main>
    </>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#F9F4ED" }} />}>
      <LandingPageContent />
    </Suspense>
  );
}
