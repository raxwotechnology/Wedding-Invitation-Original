"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, ArrowLeft, Loader2, AlertCircle,
  Users, RefreshCw, CheckCircle2, XCircle, Sparkles, Check
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TableEntry  { id: string; number: number; label?: string; }
interface LocalGuest  { id: string; name: string; title?: string; group: string; status?: string; table: string; }
interface SeatResult  { id?: string; displayName: string; group: string; rsvpStatus?: string; tableId: string; }
interface ResolvedResult { id?: string; displayName: string; group: string; rsvpStatus?: string; tableId: string; tableLabel: string | null; }

type PageState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error";  message: string }
  | { kind: "none" }
  | { kind: "multi";  results: ResolvedResult[] }
  | { kind: "single"; result:  ResolvedResult };

// ─── Local storage ────────────────────────────────────────────────────────────

function readLocalTables(): TableEntry[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("wedding_tables") ?? "[]"); } catch { return []; }
}
function readLocalGuests(): LocalGuest[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("wedding_guests_fallback") ?? "[]"); } catch { return []; }
}
function writeLocalGuestStatus(id: string, status: string): void {
  try {
    const guests = readLocalGuests();
    const next = guests.map(g => g.id === id ? { ...g, status } : g);
    localStorage.setItem("wedding_guests_fallback", JSON.stringify(next));
  } catch {}
}
function resolveTable(tableId: string, tables: TableEntry[]): string | null {
  if (!tableId) return null;
  const t = tables.find(t => t.id === tableId);
  if (!t) return null;
  return t.label ? `Table ${t.number} — ${t.label}` : `Table ${t.number}`;
}

// ─── Confetti burst ───────────────────────────────────────────────────────────

const CONFETTI_COLORS = ["#C9A060","#E8C87A","#D4AF37","#9A7540","#F5DEB3","#DAA520","#FFD700","#B8860B"];

function ConfettiBurst({ active }: { active: boolean }) {
  const pieces = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: 36 }).map((_, i) => ({
      id: i, left: 5 + Math.random() * 90,
      dur: 1.2 + Math.random() * 1.2, delay: Math.random() * 0.45,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 7, rot: Math.random() * 360,
    }));
  }, [active]);

  if (!active || pieces.length === 0) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, top: "-8px",
          width: p.size, height: p.size,
          background: p.color,
          transform: `rotate(${p.rot}deg)`,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Guest chip ───────────────────────────────────────────────────────────────

const GOLD_SHADES = ["#9A7540","#B8960C","#C9A060","#A07830","#8B7536"];
function getInitials(name: string) { return name.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase(); }

function GuestChip({ guest, delay, onClick }: { guest: LocalGuest; delay: number; onClick: () => void }) {
  const [vis, setVis] = useState(false);
  const color = GOLD_SHADES[(guest.group?.length ?? 0) % GOLD_SHADES.length];
  const display = guest.title ? `${guest.title} ${guest.name}` : guest.name;
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <button onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border active:scale-95"
      style={{
        background: `rgba(201,160,96,0.08)`, borderColor: `rgba(201,160,96,0.22)`,
        opacity: vis ? 1 : 0, transform: vis ? "translateY(0) scale(1)" : "translateY(8px) scale(0.9)",
        transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,160,96,0.16)")}
      onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,160,96,0.08)")}
    >
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
        style={{ background: `linear-gradient(135deg, ${color}, #E8C87A)` }}>
        {getInitials(guest.name)}
      </div>
      <span className="text-[12px] font-semibold" style={{ color: "#9A7540" }}>{display}</span>
    </button>
  );
}

// ─── Gold divider ─────────────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 w-full">
      <div style={{ flex:1, height:1, background:"linear-gradient(to right,transparent,rgba(201,160,96,0.4))" }} />
      <svg width="14" height="14" viewBox="0 0 16 16">
        <path d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z" fill="#C9A060" opacity="0.7" />
      </svg>
      <div style={{ flex:1, height:1, background:"linear-gradient(to left,transparent,rgba(201,160,96,0.4))" }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FindYourSeat() {
  const router = useRouter();

  const [query,        setQuery]        = useState("");
  const [state,        setState]        = useState<PageState>({ kind: "idle" });
  const [tables,       setTables]       = useState<TableEntry[]>([]);
  const [localGuests,  setLocalGuests]  = useState<LocalGuest[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confetti,     setConfetti]     = useState(false);
  const [revealed,     setRevealed]     = useState(false);
  const [focused,      setFocused]      = useState(false);
  const [isUpdatingRsvp, setIsUpdatingRsvp] = useState(false);
  const [rsvpToast,    setRsvpToast]    = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTables(readLocalTables());
    setLocalGuests(readLocalGuests());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wedding_tables") setTables(readLocalTables());
      if (e.key === "wedding_guests_fallback") setLocalGuests(readLocalGuests());
    };
    window.addEventListener("storage", onStorage);
    const t = setTimeout(() => setRevealed(true), 100);
    return () => { window.removeEventListener("storage", onStorage); clearTimeout(t); };
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return localGuests
      .filter(g => g.name.toLowerCase().includes(q))
      .map(g => ({ name: g.name, display: g.title ? `${g.title} ${g.name}` : g.name }))
      .filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i)
      .slice(0, 6);
  }, [query, localGuests]);

  function searchLocal(q: string): SeatResult[] {
    const lower = q.toLowerCase();
    return localGuests
      .filter(g => g.name.toLowerCase().includes(lower))
      .map(g => ({
        id: g.id,
        displayName: g.title ? `${g.title} ${g.name}` : g.name,
        group: g.group,
        rsvpStatus: g.status ?? "Pending",
        tableId: g.table ?? ""
      }));
  }

  const resolveAndSetState = (results: SeatResult[], currentTables: TableEntry[]) => {
    const resolved: ResolvedResult[] = results.map(r => ({
      ...r,
      tableLabel: resolveTable(r.tableId, currentTables),
      rsvpStatus: r.rsvpStatus || "Pending"
    }));
    if (resolved.length === 0) setState({ kind: "none" });
    else if (resolved.length === 1) {
      setState({ kind: "single", result: resolved[0] });
      setConfetti(true); setTimeout(() => setConfetti(false), 2200);
    }
    else setState({ kind: "multi", results: resolved });
  };

  const doSearch = useCallback(async (sq: string) => {
    const q = sq.trim();
    if (!q || q.length < 2) return;
    setShowDropdown(false); setState({ kind: "loading" });
    const ct = readLocalTables(); setTables(ct);
    try {
      const res = await fetch(getApiUrl(`/api/find-seat?name=${encodeURIComponent(q)}`), { cache: "no-store" });
      if (res.status >= 500) throw new Error("api_unavailable");
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error ?? `HTTP ${res.status}`); }
      const data: { results: SeatResult[] } = await res.json();
      const raw = data.results ?? [];
      if (raw.length === 0) { const local = searchLocal(q); if (local.length > 0) { resolveAndSetState(local, ct); return; } setState({ kind: "none" }); return; }
      resolveAndSetState(raw, ct);
    } catch (err: any) {
      const local = searchLocal(q);
      if (local.length > 0) { resolveAndSetState(local, ct); return; }
      if (err.message === "api_unavailable") setState({ kind: "none" });
      else setState({ kind: "error", message: err.message ?? "Something went wrong." });
    }
  }, [localGuests]); // eslint-disable-line

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); doSearch(query); };
  const selectSuggestion = (name: string) => { setQuery(name); setShowDropdown(false); doSearch(name); };
  const selectResult = (r: ResolvedResult) => { setState({ kind: "single", result: r }); setConfetti(true); setTimeout(() => setConfetti(false), 2200); };
  const reset = () => { setQuery(""); setState({ kind: "idle" }); setShowDropdown(false); setConfetti(false); setTimeout(() => inputRef.current?.focus(), 50); };

  // ── RSVP Inline Update ─────────────────────────────────────────────────────
  const handleUpdateRsvp = async (newStatus: "Confirmed" | "Declined") => {
    if (state.kind !== "single" || !state.result) return;
    setIsUpdatingRsvp(true);

    const guestId = state.result.id;
    if (guestId) {
      try {
        await fetch(getApiUrl(`/api/guests/${guestId}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, rsvpUpdatedAt: new Date().toISOString() }),
        });
      } catch (_) {}
      writeLocalGuestStatus(guestId, newStatus);
      setLocalGuests(readLocalGuests());
    }

    setState({
      kind: "single",
      result: {
        ...state.result,
        rsvpStatus: newStatus
      }
    });

    setIsUpdatingRsvp(false);
    setRsvpToast(newStatus === "Confirmed" ? "🎉 You're attending! Response recorded." : "RSVP recorded. We'll miss you!");
    setTimeout(() => setRsvpToast(null), 4000);
  };

  const s = (d: number): React.CSSProperties => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${d}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-8 relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #F9F4ED 0%, #F5EFE5 50%, #F8F3EB 100%)" }}
    >
      {/* Toast */}
      {rsvpToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1e293b] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium animate-fade-in border border-gray-700">
          <Sparkles size={16} className="text-[#C9A060]" />
          {rsvpToast}
        </div>
      )}

      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position:"absolute",top:"-8%",left:"-8%",width:"45%",height:"40%",background:"radial-gradient(ellipse,rgba(210,185,150,0.14) 0%,transparent 70%)",borderRadius:"50%" }} />
        <div style={{ position:"absolute",bottom:"-8%",right:"-8%",width:"50%",height:"45%",background:"radial-gradient(ellipse,rgba(201,160,96,0.09) 0%,transparent 70%)",borderRadius:"50%" }} />
      </div>

      {/* Back */}
      <button onClick={() => router.back()}
        className="fixed top-5 left-4 flex items-center gap-1.5 text-sm font-semibold z-30 cursor-pointer"
        style={{ color:"#9A7540", background:"rgba(255,255,255,0.85)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:"1px solid rgba(201,160,96,0.2)", borderRadius:"999px", padding:"8px 16px", boxShadow:"0 4px 16px -4px rgba(201,160,96,0.18)" }}
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Back
      </button>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[440px] mt-16 pb-10">

        {/* Header */}
        <div className="text-center mb-8" style={s(100)}>
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute w-20 h-20 rounded-full" style={{ background:"rgba(201,160,96,0.08)", animationName:"ringGlow", animationDuration:"2.5s", animationTimingFunction:"ease-out", animationIterationCount:"infinite" }} />
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,rgba(201,160,96,0.12),rgba(232,200,122,0.08))", border:"1px solid rgba(201,160,96,0.20)", boxShadow:"0 8px 32px -8px rgba(201,160,96,0.25)" }}>
              <MapPin size={28} strokeWidth={1.5} style={{ color:"#C9A060" }} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight" style={{ color:"#1E293B" }}>
            Find Your Seat
          </h1>
          <p className="mt-2 text-[14px] sm:text-[15px]" style={{ color:"#9A8A6A" }}>
            Search your name to find your table and confirm attendance ✨
          </p>
          <div className="mt-5"><GoldDivider /></div>
        </div>

        {/* Guest chips removed per user request */}

        {/* Search form */}
        <div className="relative mb-5" style={s(280)}>
          <form onSubmit={handleSubmit}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-colors" size={20}
              style={{ color: focused ? "#C9A060" : "#C8B89A" }} />
            <input ref={inputRef} type="text" autoComplete="off" value={query}
              onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => { setShowDropdown(true); setFocused(true); }}
              onBlur={() => { setTimeout(() => setShowDropdown(false), 150); setFocused(false); }}
              placeholder="Enter your full name…"
              disabled={state.kind === "loading"}
              className="w-full pl-14 pr-28 py-4 rounded-2xl text-[15px] placeholder:text-gray-300 focus:outline-none transition-all disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)", color: "#1A1A1A",
                border: `2px solid ${focused ? "#C9A060" : "rgba(201,160,96,0.18)"}`,
                boxShadow: focused ? "0 0 0 4px rgba(201,160,96,0.10), 0 4px 24px -8px rgba(0,0,0,0.06)" : "0 4px 24px -8px rgba(0,0,0,0.05)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
            <button type="submit" disabled={query.trim().length < 2 || state.kind === "loading"}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-white text-[11px] font-bold uppercase tracking-wider transition-opacity disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #9A7540, #C9A060)", boxShadow: "0 2px 8px rgba(201,160,96,0.35)" }}>
              Search
            </button>
          </form>

          {/* Dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50"
              style={{ background:"rgba(255,255,255,0.97)", backdropFilter:"blur(20px)", border:"1px solid rgba(201,160,96,0.15)", boxShadow:"0 16px 48px -12px rgba(0,0,0,0.10)", animationName:"slideUp", animationDuration:"0.2s", animationFillMode:"both" }}>
              {suggestions.map((s, i) => (
                <button key={i} onMouseDown={() => selectSuggestion(s.name)}
                  className="w-full px-5 py-3.5 text-left text-[14px] font-medium border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                  style={{ color:"#3A3A3A" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,160,96,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <Search size={14} style={{ color:"#C9A060", opacity:0.5 }} />
                  {s.display}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading */}
        {state.kind === "loading" && (
          <div className="flex flex-col items-center py-14 gap-4" style={{ animationName:"fadeIn", animationDuration:"0.3s", animationFillMode:"both" }}>
            <div className="relative">
              <div className="w-16 h-16 rounded-full" style={{ background:"linear-gradient(135deg, #9A7540, #E8C87A)", animationName:"spinSlow", animationDuration:"1.2s", animationTimingFunction:"linear", animationIterationCount:"infinite", opacity:0.2 }} />
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ animationName:"heartbeat", animationDuration:"1s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }}>
                <Sparkles size={28} className="text-[#C9A060]" />
              </div>
            </div>
            <p className="text-sm font-medium" style={{ color:"#9A8A6A" }}>Searching guest list…</p>
          </div>
        )}

        {/* Error */}
        {state.kind === "error" && (
          <div className="flex items-start gap-3 rounded-2xl px-5 py-4 text-sm"
            style={{ background:"#FFFBF0", border:"1px solid rgba(201,160,96,0.3)", color:"#7A5C10", animationName:"slideUp", animationDuration:"0.3s", animationFillMode:"both" }}>
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-0.5">Something went wrong</p>
              <p className="text-xs opacity-80">{state.message}</p>
            </div>
            <button onClick={() => doSearch(query)} className="shrink-0 flex items-center gap-1 text-xs font-bold hover:underline">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* No match */}
        {state.kind === "none" && (
          <div className="text-center py-10 rounded-3xl"
            style={{ background:"rgba(255,255,255,0.82)", backdropFilter:"blur(16px)", border:"1px solid rgba(201,160,96,0.12)", boxShadow:"0 4px 24px -8px rgba(201,160,96,0.10)", animationName:"zoomIn", animationDuration:"0.4s", animationFillMode:"both" }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-[#F9F4ED] border border-[#E8C87A]/30">
              <Search size={28} className="text-[#C9A060]" />
            </div>
            <p className="font-bold text-lg mb-2" style={{ color:"#1A1A1A" }}>Name not found</p>
            <p className="text-sm leading-relaxed px-6" style={{ color:"#7A7A6A" }}>
              We couldn&apos;t find &ldquo;<span className="font-semibold" style={{ color:"#3A3A3A" }}>{query.trim()}</span>&rdquo;.
              <br />Please check the spelling or ask the hosts.
            </p>
            <button onClick={reset} className="mt-6 px-6 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background:"linear-gradient(135deg, #9A7540, #C9A060)", boxShadow:"0 4px 16px -4px rgba(201,160,96,0.45)" }}>
              Try again
            </button>
          </div>
        )}

        {/* Multiple matches */}
        {state.kind === "multi" && (
          <div className="rounded-3xl overflow-hidden"
            style={{ background:"rgba(255,255,255,0.88)", backdropFilter:"blur(20px)", border:"1px solid rgba(201,160,96,0.12)", boxShadow:"0 8px 40px -12px rgba(201,160,96,0.15)", animationName:"slideUp", animationDuration:"0.4s", animationFillMode:"both" }}>
            <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor:"rgba(201,160,96,0.1)" }}>
              <Users size={14} style={{ color:"#B8A070" }} />
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color:"#B8A070" }}>
                {state.results.length} guests found — tap yours
              </p>
            </div>
            <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor:"rgba(201,160,96,0.07)" }}>
              {state.results.map((r, i) => (
                <button key={i} onClick={() => selectResult(r)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left group"
                  style={{ animationName:"slideInLeft", animationDuration:"0.3s", animationDelay:`${i*60}ms`, animationFillMode:"both" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,160,96,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      style={{ background:"linear-gradient(135deg, #9A7540, #C9A060)" }}>
                      {getInitials(r.displayName)}
                    </div>
                    <div>
                      <p className="font-semibold text-[14px] leading-tight" style={{ color:"#1A1A1A" }}>{r.displayName}</p>
                      <p className="text-xs font-medium mt-0.5" style={{ color:"#9A8A6A" }}>{r.group}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:"#C9A060" }}>
                    Select →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── SUCCESS card ── */}
        {state.kind === "single" && (
          <div className="relative rounded-3xl overflow-hidden"
            style={{ background:"rgba(255,255,255,0.95)", backdropFilter:"blur(24px)", border:"1px solid rgba(201,160,96,0.18)", boxShadow:"0 16px 64px -16px rgba(201,160,96,0.30)", animationName:"zoomIn", animationDuration:"0.5s", animationFillMode:"both" }}>
            <ConfettiBurst active={confetti} />

            {/* Gold shimmer top bar */}
            <div className="h-1.5 w-full" style={{
              background: "linear-gradient(90deg, #9A7540, #C9A060, #E8C87A, #D4AF37, #E8C87A, #C9A060, #9A7540)",
              backgroundSize: "200% auto",
              animationName: "shimmer", animationDuration: "2.5s",
              animationTimingFunction: "linear", animationIterationCount: "infinite",
            }} />

            <div className="p-8 text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6"
                style={{ background:"rgba(201,160,96,0.08)", border:"1px solid rgba(201,160,96,0.22)" }}>
                <MapPin size={11} style={{ color:"#C9A060" }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color:"#9A7540" }}>
                  Assigned Table
                </span>
              </div>

              {state.result.tableLabel ? (
                <>
                  {/* Big number */}
                  <div className="relative inline-block mb-3"
                    style={{ animationName:"zoomIn", animationDuration:"0.6s", animationDelay:"0.2s", animationFillMode:"both" }}>
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background:"radial-gradient(circle,rgba(201,160,96,0.12) 0%,transparent 70%)", transform:"scale(1.5)" }} />
                    <p className="font-bold leading-none"
                      style={{ fontSize:"clamp(72px,20vw,100px)", color:"#1A1A1A", fontVariantNumeric:"tabular-nums", letterSpacing:"-0.04em", textShadow:"0 4px 24px rgba(201,160,96,0.18)" }}>
                      {state.result.tableLabel.replace(/^Table (\d+).*/, "$1")}
                    </p>
                  </div>

                  {state.result.tableLabel.includes("—") && (
                    <p className="text-sm font-semibold -mt-2 mb-3" style={{ color:"#9A8A6A" }}>
                      {state.result.tableLabel.split("—")[1].trim()}
                    </p>
                  )}

                  {/* Divider */}
                  <div className="my-5"><GoldDivider /></div>

                  {/* Guest details */}
                  <div style={{ animationName:"fadeInUp", animationDuration:"0.5s", animationDelay:"0.35s", animationFillMode:"both" }}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3"
                      style={{ background:"linear-gradient(135deg, #9A7540, #C9A060)", boxShadow:"0 4px 16px -4px rgba(201,160,96,0.45)" }}>
                      {getInitials(state.result.displayName)}
                    </div>
                    <p className="font-bold text-xl leading-snug" style={{ color:"#1A1A1A" }}>{state.result.displayName}</p>
                    {state.result.group && (
                      <p className="text-sm font-medium mt-1" style={{ color:"#9A8A6A" }}>{state.result.group}</p>
                    )}
                  </div>

                  {/* ── RSVP Attendance Confirmation Block ── */}
                  <div className="mt-6 p-4 rounded-2xl border bg-amber-50/30 text-left" style={{ borderColor: "rgba(201,160,96,0.25)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Will you attend?</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        state.result.rsvpStatus === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : state.result.rsvpStatus === "Declined"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {state.result.rsvpStatus === "Confirmed" ? "Attending ✓" : state.result.rsvpStatus === "Declined" ? "Not Attending ✗" : "Pending response"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateRsvp("Confirmed")}
                        disabled={isUpdatingRsvp}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          state.result.rsvpStatus === "Confirmed"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-emerald-400 hover:text-emerald-700"
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        I Will Attend
                      </button>

                      <button
                        onClick={() => handleUpdateRsvp("Declined")}
                        disabled={isUpdatingRsvp}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          state.result.rsvpStatus === "Declined"
                            ? "bg-gray-700 text-white shadow-md shadow-gray-200"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        <XCircle size={14} />
                        Can&apos;t Make It
                      </button>
                    </div>
                  </div>

                  {/* Tip */}
                  <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background:"rgba(201,160,96,0.06)", border:"1px solid rgba(201,160,96,0.15)" }}>
                    <MapPin size={10} style={{ color:"#C9A060" }} />
                    <p className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color:"#B8A070" }}>
                      Please show this at the entrance
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <p className="text-5xl mb-4" style={{ animationName:"heartbeat", animationDuration:"1.5s", animationTimingFunction:"ease-in-out", animationIterationCount:"infinite" }}>
                    💛
                  </p>
                  <p className="font-bold text-xl mb-3" style={{ color:"#1A1A1A" }}>{state.result.displayName}</p>
                  <p className="text-sm leading-relaxed" style={{ color:"#C9A060" }}>
                    Your seat is being finalised.
                    <br />Please check with the hosts at the entrance.
                  </p>

                  {/* RSVP Confirmation for unassigned guests too */}
                  <div className="mt-6 p-4 rounded-2xl border bg-amber-50/30 text-left" style={{ borderColor: "rgba(201,160,96,0.25)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Confirm Attendance</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateRsvp("Confirmed")}
                        disabled={isUpdatingRsvp}
                        className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white shadow-md"
                      >
                        I Will Attend
                      </button>
                      <button
                        onClick={() => handleUpdateRsvp("Declined")}
                        disabled={isUpdatingRsvp}
                        className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-gray-600 text-white shadow-md"
                      >
                        Can&apos;t Make It
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 pb-7">
              <button onClick={reset}
                className="w-full py-3 rounded-xl text-sm font-bold transition-colors"
                style={{ border:"1px solid rgba(201,160,96,0.2)", color:"#9A8A6A" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,160,96,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                🔍 Search again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
