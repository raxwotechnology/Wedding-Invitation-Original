"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Heart, ZoomIn, Mail } from "lucide-react";

/* ─── Photo data ───────────────────────────────────────────────────────── */
const PHOTOS = Array.from({ length: 58 }, (_, i) => ({
  url: `/wedding-photos/photo-${String(i + 1).padStart(2, "0")}.jpg`,
}));

/* ─── Falling rose petals background ──────────────────────────────────── */
function RosePetals() {
  const petals = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${(i * 6.1 + 3) % 100}%`,
      size: 10 + (i % 5) * 4,
      duration: 8 + (i % 7) * 2.5,
      delay: (i * 0.9) % 12,
      opacity: 0.25 + (i % 4) * 0.08,
      color: i % 3 === 0 ? "#e8b4b8" : i % 3 === 1 ? "#f9d4d4" : "#f5c6c6",
    }))
  , []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {petals.map(p => (
        <div
          key={p.id}
          className="absolute animate-petal"
          style={{
            left: p.left,
            top: "-40px",
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          {/* SVG rose petal shape */}
          <svg viewBox="0 0 24 24" fill={p.color}>
            <path d="M12 2 C12 2, 22 8, 20 16 C18 22, 6 22, 4 16 C2 8, 12 2, 12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─── Watercolor background ────────────────────────────────────────────── */
function CreamBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div style={{ position:"absolute", top:"-10%", left:"-10%", width:"55%", height:"55%",
        background:"radial-gradient(ellipse,rgba(210,185,150,0.18) 0%,transparent 70%)", borderRadius:"50%" }} />
      <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:"60%", height:"60%",
        background:"radial-gradient(ellipse,rgba(201,160,96,0.13) 0%,transparent 70%)", borderRadius:"50%" }} />
      <div style={{ position:"absolute", top:"40%", left:"-5%", width:"30%", height:"40%",
        background:"radial-gradient(ellipse,rgba(232,180,184,0.10) 0%,transparent 70%)", borderRadius:"50%" }} />
    </div>
  );
}

/* ─── Individual animated photo card ──────────────────────────────────── */
function PhotoCard({ photo, index, onClick }: { photo: { url: string }; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(index < 8);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (imgRef.current && (imgRef.current.complete || imgRef.current.naturalWidth > 0)) {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.01, rootMargin: "250px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  /* Fallback timer so photos are never stuck blank on mobile browsers */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  /* Stagger delay capped at 400ms so deep items don't wait too long */
  const delay = Math.min(index % 8, 7) * 60;

  return (
    <div
      ref={ref}
      className="photo-card relative cursor-pointer overflow-hidden rounded-2xl border border-white/60 bg-white/30 shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        animation: visible ? `photoReveal 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms both` : "none",
        aspectRatio: index % 5 === 2 ? "3/4" : index % 7 === 4 ? "4/3" : "1/1",
      }}
      onClick={onClick}
    >
      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 skeleton-shimmer rounded-2xl pointer-events-none" />
      )}

      <img
        ref={imgRef}
        src={photo.url}
        alt="Wedding Moment"
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ opacity: loaded ? 1 : 0.9, transition: "opacity 0.4s ease" }}
        loading={index < 6 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />

      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: "linear-gradient(135deg, rgba(154,117,64,0.35) 0%, rgba(0,0,0,0.45) 100%)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/70 backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <ZoomIn size={22} color="white" />
        </div>
      </div>

      {/* Golden corner accent */}
      <div
        className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(201,160,96,0.5) 0%, transparent 70%)",
          borderTopLeftRadius: "0.75rem",
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}

/* ─── Header with animated entrance ───────────────────────────────────── */
function GalleryHeader() {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div
      className="text-center mb-10 relative z-10"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(-24px)",
        transition: "opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}
    >
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-xl animate-gold-glow"
        style={{
          background: "linear-gradient(135deg, #C9A060, #E8C87A)",
          border: "2px solid rgba(255,255,255,0.6)",
        }}
      >
        <Camera size={28} color="white" />
      </div>

      <h1
        className="font-serif font-medium tracking-tight"
        style={{
          color: "#1E293B",
          fontSize: "clamp(2rem, 6vw, 3.2rem)",
          lineHeight: 1.1,
        }}
      >
        Wedding Photo Gallery
      </h1>

      {/* Gold shimmer subtitle */}
      <p
        className="mt-3 font-semibold tracking-widest uppercase text-xs sm:text-sm"
        style={{
          background: "linear-gradient(90deg, #9A7540, #C9A060, #E8C87A, #C9A060, #9A7540)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shimmer 3s linear infinite",
        }}
      >
        Rashmi &amp; Rashin &bull; 21st September 2026
      </p>

      <p className="text-xs text-stone-500 mt-2">
        Click any photograph to view full screen &nbsp;·&nbsp; Use arrow keys to navigate
      </p>

      {/* Animated gold divider */}
      <div className="flex items-center justify-center gap-3 mt-5 max-w-xs mx-auto">
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,160,96,0.5))" }} />
        <Heart size={14} className="animate-soft-pulse text-[#C9A060]" />
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(201,160,96,0.5))" }} />
      </div>
    </div>
  );
}

/* ─── Animated Lightbox ─────────────────────────────────────────────────── */
function Lightbox({
  index,
  total,
  url,
  onClose,
  onPrev,
  onNext,
}: {
  index: number; total: number; url: string;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-backdrop-in"
      style={{ background: "rgba(10,5,2,0.94)" }}
      onClick={onClose}
    >
      {/* Photo with open animation */}
      <div
        className="animate-lightbox-open relative max-h-[88vh] max-w-[90vw] flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={url}
          alt="Wedding photo"
          className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl"
          style={{ boxShadow: "0 0 0 1px rgba(201,160,96,0.2), 0 40px 80px -20px rgba(0,0,0,0.7)" }}
        />
        {/* Bottom gold glow line */}
        <div
          className="mt-3 w-1/3 h-0.5 rounded-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(201,160,96,0.6), transparent)" }}
        />
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all text-2xl font-light cursor-pointer z-20"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Prev — bouncing arrow */}
      <button
        onClick={e => { e.stopPropagation(); onPrev(); }}
        className="animate-arrow-left absolute left-3 sm:left-6 top-1/2 w-12 h-12 rounded-full text-white text-3xl font-bold flex items-center justify-center backdrop-blur-md border border-white/15 transition-all cursor-pointer"
        style={{ background: "rgba(255,255,255,0.08)" }}
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Next — bouncing arrow */}
      <button
        onClick={e => { e.stopPropagation(); onNext(); }}
        className="animate-arrow-right absolute right-3 sm:right-6 top-1/2 w-12 h-12 rounded-full text-white text-3xl font-bold flex items-center justify-center backdrop-blur-md border border-white/15 transition-all cursor-pointer"
        style={{ background: "rgba(255,255,255,0.08)" }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────── */
export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close   = useCallback(() => setLightbox(null), []);
  const prev    = useCallback(() => setLightbox(i => (i! - 1 + PHOTOS.length) % PHOTOS.length), []);
  const next    = useCallback(() => setLightbox(i => (i! + 1) % PHOTOS.length), []);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close, prev, next]);

  /* Lock scroll when lightbox is open */
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <main
      className="min-h-screen flex flex-col items-center py-10 px-4 relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #FBF7F0 0%, #F5EFE5 55%, #FAF4EB 100%)" }}
    >
      <CreamBg />
      <RosePetals />

      {/* Top nav */}
      <div className="fixed top-4 left-4 z-30 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            color: "#FFFFFF",
            background: "linear-gradient(135deg, #9A7540, #C9A060)",
            border: "1px solid rgba(201,160,96,0.4)",
            borderRadius: "999px",
            padding: "8px 18px",
            boxShadow: "0 6px 20px -4px rgba(201,160,96,0.45)",
          }}
        >
          <Mail size={15} /> Invitation
        </Link>
        <Link
          href="/details"
          className="flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-md transition-all hover:scale-105"
          style={{
            color: "#9A7540",
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(201,160,96,0.25)",
            borderRadius: "999px",
            padding: "8px 14px",
            backdropFilter: "blur(12px)",
          }}
        >
          Details
        </Link>
      </div>

      <div className="w-full max-w-5xl relative mt-16 pb-20" style={{ zIndex: 2 }}>

        <GalleryHeader />

        {/* Masonry-style photo grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
          {PHOTOS.map((photo, i) => (
            <div key={i} className="break-inside-avoid group">
              <PhotoCard photo={photo} index={i} onClick={() => setLightbox(i)} />
            </div>
          ))}
        </div>

        {/* Footer quote with animation */}
        <div
          className="mt-16 max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl text-center border shadow-lg"
          style={{
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(201,160,96,0.22)",
            boxShadow: "0 8px 40px -12px rgba(201,160,96,0.2)",
          }}
        >
          <Heart size={30} className="mx-auto mb-4 animate-soft-pulse" style={{ color: "#e8788a" }} />
          <p className="text-lg sm:text-xl font-serif italic text-stone-700 leading-relaxed">
            &ldquo;Thank you for being part of our special journey and blessing our new beginning.&rdquo;
          </p>
          <p
            className="mt-4 text-xs font-bold uppercase tracking-widest"
            style={{
              background: "linear-gradient(90deg, #9A7540, #C9A060, #E8C87A, #C9A060, #9A7540)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3.5s linear infinite",
            }}
          >
            — Rashmi &amp; Rashin —
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-7 py-3.5 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #9A7540, #C9A060)",
                boxShadow: "0 6px 20px -4px rgba(201,160,96,0.5)",
              }}
            >
              Open Wedding Invitation
            </Link>
            <Link
              href="/details"
              className="px-7 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1.5px solid rgba(201,160,96,0.35)",
                color: "#9A7540",
              }}
            >
              Wedding Details
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          index={lightbox}
          total={PHOTOS.length}
          url={PHOTOS[lightbox].url}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </main>
  );
}
