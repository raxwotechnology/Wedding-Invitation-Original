"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Camera,
  Heart,
  ZoomIn,
  Mail,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUp,
  Share2,
  Info,
  Maximize2
} from "lucide-react";

/* ─── Photo data ───────────────────────────────────────────────────────── */
const PHOTOS = Array.from({ length: 58 }, (_, i) => ({
  id: i + 1,
  url: `/wedding-photos/photo-${String(i + 1).padStart(2, "0")}.jpg`,
  title: `Moment ${String(i + 1).padStart(2, "0")}`,
}));

/* ─── Falling rose petals background ──────────────────────────────────── */
function RosePetals() {
  const petals = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${(i * 4.7 + 2) % 100}%`,
      size: 9 + (i % 6) * 3.5,
      duration: 7 + (i % 7) * 2,
      delay: (i * 0.7) % 10,
      opacity: 0.22 + (i % 4) * 0.08,
      color: i % 3 === 0 ? "#f0b8bd" : i % 3 === 1 ? "#fae2e2" : "#f7cfcf",
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
          <svg viewBox="0 0 24 24" fill={p.color}>
            <path d="M12 2 C12 2, 22 8, 20 16 C18 22, 6 22, 4 16 C2 8, 12 2, 12 2Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ─── Luxury Watercolor & Warm Ambient Glows ───────────────────────────── */
function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Top warm gold aura */}
      <div style={{
        position: "absolute", top: "-15%", left: "15%", right: "15%", height: "45%",
        background: "radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, rgba(201,160,96,0.06) 50%, transparent 75%)",
        borderRadius: "50%",
      }} />
      {/* Side soft rose blush */}
      <div style={{
        position: "absolute", top: "35%", right: "-10%", width: "45%", height: "45%",
        background: "radial-gradient(ellipse, rgba(240,184,189,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: "-10%", left: "-10%", width: "50%", height: "45%",
        background: "radial-gradient(ellipse, rgba(201,160,96,0.10) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
    </div>
  );
}

/* ─── Individual Photo Card with Luxury Aesthetics ────────────────────── */
function PhotoCard({
  photo,
  index,
  onClick,
  isLiked,
  onToggleLike
}: {
  photo: { id: number; url: string; title: string };
  index: number;
  onClick: () => void;
  isLiked: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="photo-card group relative aspect-square overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-900/10 bg-white/60 shadow-md cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-amber-400/50 active:scale-95"
      style={{
        boxShadow: "0 4px 20px -4px rgba(201,160,96,0.18), 0 2px 8px rgba(0,0,0,0.04)",
      }}
      onClick={onClick}
    >
      {/* Skeleton shimmer before image loads */}
      {!loaded && (
        <div className="absolute inset-0 skeleton-shimmer rounded-2xl sm:rounded-3xl pointer-events-none z-0" />
      )}

      {/* Main Image */}
      <img
        src={photo.url}
        alt={`Wedding Moment ${photo.id}`}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        style={{
          opacity: loaded ? 1 : 0.85,
          transition: "opacity 0.4s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
        loading={index < 8 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />

      {/* Gold Top-Left Corner Accent */}
      <div
        className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-10 opacity-75 group-hover:opacity-100 transition-opacity"
        style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.7) 0%, transparent 70%)",
          borderTopLeftRadius: "1rem",
        }}
      />

      {/* Top Right: Photo Index Badge */}
      <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-amber-900 shadow-md backdrop-blur-md"
          style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(201,160,96,0.4)" }}
        >
          #{String(photo.id).padStart(2, "0")}
        </span>
      </div>

      {/* Bottom Floating Like & Zoom Button on Hover */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(15,10,5,0.7) 0%, rgba(15,10,5,0.15) 50%, transparent 100%)",
        }}
      >
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={onToggleLike}
            className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-125 shadow-md"
            style={{
              background: isLiked ? "rgba(225,29,72,0.9)" : "rgba(255,255,255,0.8)",
              color: isLiked ? "#FFFFFF" : "#E11D48",
            }}
            aria-label="Like photo"
          >
            <Heart size={14} className={isLiked ? "fill-white" : "fill-rose-500"} />
          </button>
        </div>

        <div className="flex items-center justify-between text-white pointer-events-auto">
          <span className="text-[11px] font-medium tracking-wider text-amber-100/90 drop-shadow">
            View Photo
          </span>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/60 backdrop-blur-md shadow-md"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <ZoomIn size={15} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Luxury Gallery Header ───────────────────────────────────────────── */
function GalleryHeader({ activeFilter, onSelectFilter }: { activeFilter: string; onSelectFilter: (f: string) => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 60); return () => clearTimeout(t); }, []);

  const filters = [
    { id: "all", label: "All Photos", count: 58 },
    { id: "ceremony", label: "Highlights", count: 20 },
    { id: "couples", label: "Portraits", count: 20 },
    { id: "evening", label: "Celebration", count: 18 },
  ];

  return (
    <div
      className="text-center mb-10 relative z-10"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
      }}
    >
      {/* Royal R&R Badge */}
      <div className="inline-flex items-center justify-center mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl animate-gold-glow relative"
          style={{
            background: "linear-gradient(135deg, #FAF4EB 0%, #F3E7D3 100%)",
            border: "2px solid #C9A060",
          }}
        >
          <svg width="46" height="46" viewBox="0 0 90 90" fill="none" className="absolute inset-0 m-auto">
            <circle cx="45" cy="45" r="42" stroke="#C9A060" strokeWidth="1.2" fill="none" />
            <circle cx="45" cy="45" r="36" stroke="#C9A060" strokeWidth="0.5" fill="none" strokeDasharray="2 3" />
          </svg>
          <span
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: "1.7rem",
              color: "#9A7540",
              marginTop: "-2px",
            }}
          >
            R&amp;R
          </span>
        </div>
      </div>

      {/* Script Name */}
      <h2
        className="text-2xl sm:text-3xl font-normal mb-1"
        style={{
          fontFamily: "'Great Vibes', cursive",
          color: "#9A7540",
          textShadow: "0 2px 10px rgba(201,160,96,0.25)",
        }}
      >
        Rashmi &amp; Rashin
      </h2>

      {/* Main Title */}
      <h1
        className="font-serif font-medium tracking-tight text-stone-800"
        style={{
          fontSize: "clamp(2rem, 6vw, 3.2rem)",
          lineHeight: 1.15,
        }}
      >
        Wedding Photo Gallery
      </h1>

      {/* Gold Shimmer Date & Venue */}
      <p
        className="mt-2.5 font-bold tracking-[0.2em] uppercase text-[11px] sm:text-xs"
        style={{
          background: "linear-gradient(90deg, #9A7540 0%, #C9A060 25%, #E8C87A 50%, #C9A060 75%, #9A7540 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animationName: "shimmer",
          animationDuration: "3.5s",
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        MONDAY · 21ST SEPTEMBER 2026 · WASALA BANQUETS
      </p>

      {/* Decorative Flourish Divider */}
      <div className="flex items-center justify-center gap-3 mt-4 max-w-xs mx-auto">
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,160,96,0.6))" }} />
        <Sparkles size={13} className="text-[#C9A060] animate-soft-pulse" />
        <Heart size={14} className="animate-soft-pulse text-[#C9A060]" />
        <Sparkles size={13} className="text-[#C9A060] animate-soft-pulse" />
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(201,160,96,0.6))" }} />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => onSelectFilter(f.id)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
            style={{
              background: activeFilter === f.id
                ? "linear-gradient(135deg, #9A7540, #C9A060)"
                : "rgba(255,255,255,0.85)",
              color: activeFilter === f.id ? "#FFFFFF" : "#785B30",
              border: activeFilter === f.id
                ? "1px solid rgba(201,160,96,0.8)"
                : "1px solid rgba(201,160,96,0.25)",
              boxShadow: activeFilter === f.id
                ? "0 4px 14px -2px rgba(201,160,96,0.45)"
                : "0 2px 6px rgba(0,0,0,0.03)",
            }}
          >
            {f.label} <span className="opacity-75 text-[10px] ml-1">({f.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Ultra-Luxury Fullscreen Lightbox ────────────────────────────────── */
function Lightbox({
  index,
  total,
  photos,
  onClose,
  onSelect,
  onPrev,
  onNext,
}: {
  index: number;
  total: number;
  photos: { id: number; url: string; title: string }[];
  onClose: () => void;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const activePhoto = photos[index];

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) onNext();
    if (isRightSwipe) onPrev();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/94 backdrop-blur-2xl animate-backdrop-in select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="w-full flex items-center justify-between px-4 sm:px-8 py-4 z-20"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-normal text-xl sm:text-2xl text-amber-200"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Rashmi &amp; Rashin
          </span>
          <span className="text-white/40 text-xs hidden sm:inline">|</span>
          <span className="text-xs font-semibold tracking-widest uppercase text-amber-100/70 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            {index + 1} / {total}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-all border border-white/10 cursor-pointer shadow-lg active:scale-90"
          aria-label="Close photo"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 w-full flex items-center justify-center px-4 py-2"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={e => e.stopPropagation()}
      >
        {/* Navigation Arrow Left */}
        <button
          onClick={onPrev}
          className="absolute left-3 sm:left-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-amber-200 bg-black/40 hover:bg-black/70 border border-amber-400/30 backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          aria-label="Previous photo"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Current Image */}
        <div className="animate-lightbox-open relative max-h-[72vh] max-w-[92vw] sm:max-w-[85vw] flex flex-col items-center">
          <img
            key={activePhoto.url}
            src={activePhoto.url}
            alt="Wedding photograph"
            className="max-h-[70vh] max-w-full object-contain rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-400/20"
            style={{
              boxShadow: "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px rgba(201,160,96,0.15)",
            }}
          />
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={onNext}
          className="absolute right-3 sm:right-6 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-amber-200 bg-black/40 hover:bg-black/70 border border-amber-400/30 backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          aria-label="Next photo"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Bottom Thumbnail Strip & Caption */}
      <div
        className="w-full pb-5 pt-2 px-4 flex flex-col items-center z-20 bg-gradient-to-t from-black/80 to-transparent"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-[11px] sm:text-xs text-amber-100/70 tracking-widest uppercase font-semibold mb-3">
          Wedding Moments · Wasala Banquets &amp; Nature Resort
        </p>

        {/* Thumbnails Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-4 scrollbar-none">
          {photos.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => onSelect(idx)}
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 border cursor-pointer"
              style={{
                borderColor: idx === index ? "#D4AF37" : "rgba(255,255,255,0.2)",
                transform: idx === index ? "scale(1.12)" : "scale(0.95)",
                opacity: idx === index ? 1 : 0.45,
                boxShadow: idx === index ? "0 0 14px rgba(212,175,55,0.6)" : "none",
              }}
            >
              <img src={p.url} alt={`Thumb ${p.id}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Gallery Page ───────────────────────────────────────────────── */
export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<number[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* Load likes from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wedding_liked_photos");
      if (saved) setLikedPhotos(JSON.parse(saved));
    } catch (_) {}
  }, []);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem("wedding_liked_photos", JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
  };

  /* Scroll to top listener */
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Filter photos */
  const displayedPhotos = useMemo(() => {
    if (activeFilter === "ceremony") return PHOTOS.slice(0, 20);
    if (activeFilter === "couples") return PHOTOS.slice(20, 40);
    if (activeFilter === "evening") return PHOTOS.slice(40);
    return PHOTOS;
  }, [activeFilter]);

  const close   = useCallback(() => setLightbox(null), []);
  const prev    = useCallback(() => setLightbox(i => (i! - 1 + displayedPhotos.length) % displayedPhotos.length), [displayedPhotos.length]);
  const next    = useCallback(() => setLightbox(i => (i! + 1) % displayedPhotos.length), [displayedPhotos.length]);
  const select  = useCallback((idx: number) => setLightbox(idx), []);

  /* Keyboard Navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close, prev, next]);

  /* Lock scroll when lightbox is active */
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center py-8 px-3 sm:px-6 relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #FBF7F0 0%, #F5EFE5 45%, #FAF4EB 80%, #F6EFE3 100%)" }}
    >
      <AmbientBackground />
      <RosePetals />

      {/* Floating Top Navigation Pill */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold cursor-pointer shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            color: "#FFFFFF",
            background: "linear-gradient(135deg, #9A7540, #C9A060)",
            border: "1px solid rgba(201,160,96,0.5)",
            borderRadius: "999px",
            padding: "8px 18px",
            boxShadow: "0 6px 20px -4px rgba(201,160,96,0.45)",
          }}
        >
          <Mail size={15} /> Invitation
        </Link>
        <Link
          href="/agenda-gallery"
          className="flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-md transition-all hover:scale-105"
          style={{
            color: "#9A7540",
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(201,160,96,0.3)",
            borderRadius: "999px",
            padding: "8px 14px",
            backdropFilter: "blur(12px)",
          }}
        >
          <Calendar size={13} /> Agenda
        </Link>
        <Link
          href="/details"
          className="flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-md transition-all hover:scale-105"
          style={{
            color: "#9A7540",
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(201,160,96,0.3)",
            borderRadius: "999px",
            padding: "8px 14px",
            backdropFilter: "blur(12px)",
          }}
        >
          Details
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl relative mt-16 pb-24" style={{ zIndex: 2 }}>
        <GalleryHeader activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

        {/* Responsive High-End Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
          {displayedPhotos.map((photo, i) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={i}
              onClick={() => setLightbox(i)}
              isLiked={likedPhotos.includes(photo.id)}
              onToggleLike={(e) => toggleLike(photo.id, e)}
            />
          ))}
        </div>

        {/* Footer Royal Card */}
        <div
          className="mt-20 max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl text-center border shadow-xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(253,249,242,0.85) 100%)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(201,160,96,0.3)",
            boxShadow: "0 12px 48px -12px rgba(201,160,96,0.25)",
          }}
        >
          {/* Subtle floral watermark */}
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center border border-[#C9A060]/40 shadow-inner bg-amber-50/50">
            <Heart size={24} className="text-[#C9A060] animate-soft-pulse fill-[#C9A060]/20" />
          </div>

          <p className="text-lg sm:text-2xl font-serif italic text-stone-700 leading-relaxed">
            &ldquo;Thank you for being part of our special journey and blessing our new beginning with your presence and love.&rdquo;
          </p>

          <p
            className="mt-5 text-xs font-bold uppercase tracking-[0.25em]"
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

          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/"
              className="px-8 py-3.5 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #9A7540, #C9A060)",
                boxShadow: "0 6px 20px -4px rgba(201,160,96,0.5)",
              }}
            >
              Open Wedding Invitation
            </Link>
            <Link
              href="/agenda-gallery"
              className="px-8 py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all hover:scale-105 shadow-sm"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1.5px solid rgba(201,160,96,0.4)",
                color: "#9A7540",
              }}
            >
              Program Agenda
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-90 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #9A7540, #C9A060)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 6px 20px rgba(201,160,96,0.4)",
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Interactive Lightbox */}
      {lightbox !== null && (
        <Lightbox
          index={lightbox}
          total={displayedPhotos.length}
          photos={displayedPhotos}
          onClose={close}
          onSelect={select}
          onPrev={prev}
          onNext={next}
        />
      )}
    </main>
  );
}
