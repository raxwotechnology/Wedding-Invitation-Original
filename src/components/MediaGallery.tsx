"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ZoomIn, Camera, Heart } from "lucide-react";
import Link from "next/link";

const photos = Array.from({ length: 58 }, (_, i) => ({
  url: `/wedding-photos/photo-${String(i + 1).padStart(2, "0")}.jpg`,
}));

/* ─── Individually animated card with IntersectionObserver ─────────────── */
function AnimatedPhotoCard({
  url,
  index,
  onClick,
}: {
  url: string;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(index < 6);
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "250px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  /* Fallback timer */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const delay = Math.min(index % 6, 5) * 60;

  return (
    <div
      ref={ref}
      className="photo-card group relative aspect-square overflow-hidden rounded-xl cursor-pointer border border-white/50"
      style={{
        opacity: visible ? 1 : 0,
        animation: visible
          ? `photoReveal 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms both`
          : "none",
        background: "rgba(255,255,255,0.5)",
      }}
      onClick={onClick}
    >
      {/* Skeleton loader */}
      {!loaded && <div className="absolute inset-0 skeleton-shimmer pointer-events-none" />}

      <img
        ref={imgRef}
        src={url}
        alt="Wedding photo"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ opacity: loaded ? 1 : 0.9, transition: "opacity 0.45s ease" }}
        loading={index < 6 ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(154,117,64,0.3) 0%, rgba(0,0,0,0.4) 100%)",
        }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-white/70 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <ZoomIn size={18} color="white" />
        </div>
      </div>

      {/* Top-left gold shimmer accent */}
      <div
        className="absolute top-0 left-0 w-7 h-7 pointer-events-none rounded-tl-xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(201,160,96,0.45) 0%, transparent 70%)",
          opacity: 0,
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}

/* ─── Lightbox ─────────────────────────────────────────────────────────── */
function Lightbox({
  index,
  total,
  url,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  total: number;
  url: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-backdrop-in"
      style={{ background: "rgba(8,4,2,0.94)" }}
      onClick={onClose}
    >
      <img
        src={url}
        alt="Wedding photo"
        className="animate-lightbox-open max-h-[85vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl"
        style={{ boxShadow: "0 0 0 1px rgba(201,160,96,0.18), 0 40px 80px -20px rgba(0,0,0,0.8)" }}
        onClick={e => e.stopPropagation()}
      />

      <button
        onClick={onClose}
        className="absolute top-4 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all text-2xl font-light cursor-pointer z-20"
        aria-label="Close"
      >
        ✕
      </button>

      <button
        onClick={e => { e.stopPropagation(); onPrev(); }}
        className="animate-arrow-left absolute left-3 sm:left-6 top-1/2 w-12 h-12 rounded-full text-white text-3xl font-bold flex items-center justify-center border border-white/15 cursor-pointer"
        style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
        aria-label="Previous"
      >
        ‹
      </button>

      <button
        onClick={e => { e.stopPropagation(); onNext(); }}
        className="animate-arrow-right absolute right-3 sm:right-6 top-1/2 w-12 h-12 rounded-full text-white text-3xl font-bold flex items-center justify-center border border-white/15 cursor-pointer"
        style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}

/* ─── Main export ──────────────────────────────────────────────────────── */
export default function MediaGallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev  = useCallback(() => setLightbox(i => (i! - 1 + photos.length) % photos.length), []);
  const next  = useCallback(() => setLightbox(i => (i! + 1) % photos.length), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")     close();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <section className="py-16 px-4 rounded-3xl" style={{ background: "rgba(249,244,237,0.7)" }}>
      <div className="max-w-6xl mx-auto text-center">

        {/* Section heading with shimmer */}
        <h3
          className="text-3xl sm:text-4xl font-serif mb-3"
          style={{ color: "#1E293B" }}
        >
          Moments of Love
        </h3>
        <p
          className="font-semibold text-xs tracking-widest uppercase mb-2"
          style={{
            background: "linear-gradient(90deg, #9A7540, #C9A060, #E8C87A, #C9A060, #9A7540)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 3s linear infinite",
          }}
        >
          Rashmi &amp; Rashin &bull; 2026
        </p>
        <p className="text-stone-500 font-light text-sm mb-10">
          A glimpse into our beautiful journey together — click any photo to view full screen.
        </p>

        {/* Animated divider */}
        <div className="flex items-center justify-center gap-3 mb-10 max-w-xs mx-auto">
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,160,96,0.5))" }} />
          <Heart size={14} className="animate-soft-pulse text-[#C9A060]" />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(201,160,96,0.5))" }} />
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <AnimatedPhotoCard
              key={i}
              url={photo.url}
              index={i}
              onClick={() => setLightbox(i)}
            />
          ))}
        </div>

        {/* View full gallery button */}
        <div className="mt-10">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-bold tracking-wider uppercase shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #9A7540, #C9A060)",
              boxShadow: "0 6px 24px -4px rgba(201,160,96,0.5)",
              animation: "shimmer 3s linear infinite",
              backgroundSize: "200% auto",
            }}
          >
            <Camera size={16} /> View Full Gallery
          </Link>
        </div>

        {/* Quote block */}
        <div
          className="mt-16 max-w-2xl mx-auto p-8 sm:p-10 border rounded-3xl relative"
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(201,160,96,0.18)",
            boxShadow: "0 8px 32px -8px rgba(201,160,96,0.15)",
          }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-md animate-soft-pulse"
            style={{ background: "linear-gradient(135deg, #fde8ea, #ffd0d5)" }}>
            ♥
          </div>
          <p className="text-lg md:text-xl font-serif italic text-stone-700 leading-relaxed">
            &ldquo;Thank you to all our friends and family for your endless love and support. We are incredibly excited to share this new chapter of our lives with you.&rdquo;
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
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          index={lightbox}
          total={photos.length}
          url={photos[lightbox].url}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}
