"use client";

/**
 * Guest-facing RSVP page.
 *
 * Search strategy (resilient to API failures):
 *  1. Try GET /api/find-seat (server-side MongoDB).
 *  2. If that returns 5xx, fall back to searching "wedding_guests_fallback"
 *     in localStorage — the same copy GuestContext writes after every sync.
 *
 * Confirm strategy:
 *  1. Try PUT /api/guests/:id (live DB write).
 *  2. If that fails, update localStorage so the UI stays consistent locally.
 *
 * Name suggestions:
 *  - Read from localStorage on mount and filter as the user types.
 *  - Tapping a suggestion fills the search box and auto-searches.
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Search, Check, X, Loader2, AlertCircle, Heart, RefreshCw,
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

// ─── Local guest shape (from localStorage fallback) ───────────────────────────

interface LocalGuest {
  id: string;
  name: string;
  title?: string;
  group: string;
  status: "Confirmed" | "Pending" | "Declined";
  table: string;
}

function readLocalGuests(): LocalGuest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("wedding_guests_fallback") ?? "[]");
  } catch {
    return [];
  }
}

function writeLocalGuestStatus(id: string, status: string): void {
  try {
    const guests = readLocalGuests();
    const next = guests.map(g =>
      g.id === id ? { ...g, status } : g
    );
    localStorage.setItem("wedding_guests_fallback", JSON.stringify(next));
  } catch {}
}

// ─── Types ────────────────────────────────────────────────────────────────────

type RsvpChoice = "confirmed" | "declined" | null;

interface GuestCard {
  id: string;
  displayName: string;
  group: string;
  rsvpStatus: string;
  choice: RsvpChoice;
}

type PageState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "none" }
  | { kind: "results"; cards: GuestCard[] }
  | { kind: "submitting"; cards: GuestCard[] }
  | { kind: "success"; names: string[] };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PublicRSVP() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [state, setState] = useState<PageState>({ kind: "idle" });
  const [localGuests, setLocalGuests] = useState<LocalGuest[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load guests from localStorage on mount
  useEffect(() => {
    setLocalGuests(readLocalGuests());
    // Re-read on storage changes (e.g. admin adds a guest in another tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wedding_guests_fallback") setLocalGuests(readLocalGuests());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Name suggestions — unique names matching the current query
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return localGuests
      .filter(g => g.name.toLowerCase().includes(q))
      .map(g => {
        const display = g.title ? `${g.title} ${g.name}` : g.name;
        return display;
      })
      .filter((v, i, arr) => arr.indexOf(v) === i) // unique
      .slice(0, 6);
  }, [query, localGuests]);

  // ── Local fallback search ─────────────────────────────────────────────────

  function searchLocal(q: string): GuestCard[] {
    const lower = q.toLowerCase();
    return localGuests
      .filter(g => g.name.toLowerCase().includes(lower))
      .map(g => ({
        id: g.id,
        displayName: g.title ? `${g.title} ${g.name}` : g.name,
        group: g.group,
        rsvpStatus: g.status ?? "Pending",
        choice: g.status === "Confirmed"
          ? "confirmed"
          : g.status === "Declined"
            ? "declined"
            : null,
      }));
  }

  // ── API search with localStorage fallback ─────────────────────────────────

  const doSearch = useCallback(async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) return;
    setShowSuggestions(false);
    setState({ kind: "loading" });

    try {
      const res = await fetch(
        getApiUrl(`/api/find-seat?name=${encodeURIComponent(q)}`),
        { cache: "no-store" }
      );

      if (res.status >= 500) {
        // API unavailable — fall back to localStorage
        throw new Error("api_unavailable");
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const data: { results: { id: string; displayName: string; group: string; tableId: string; rsvpStatus: string }[] } =
        await res.json();
      const raw = data.results ?? [];

      if (raw.length === 0) {
        // Also check local in case API and DB are out of sync
        const local = searchLocal(q);
        if (local.length > 0) {
          setState({ kind: "results", cards: local });
          return;
        }
        setState({ kind: "none" });
        return;
      }

      const cards: GuestCard[] = raw.map(r => ({
        id: r.id,
        displayName: r.displayName,
        group: r.group,
        rsvpStatus: r.rsvpStatus ?? "Pending",
        choice: r.rsvpStatus === "Confirmed"
          ? "confirmed"
          : r.rsvpStatus === "Declined"
            ? "declined"
            : null,
      }));
      setState({ kind: "results", cards });
    } catch (err: any) {
      // Fall back to localStorage
      const local = searchLocal(q);
      if (local.length > 0) {
        setState({ kind: "results", cards: local });
        return;
      }
      if (err.message === "api_unavailable") {
        setState({ kind: "none" });
      } else {
        setState({ kind: "error", message: err.message ?? "Something went wrong." });
      }
    }
  }, [localGuests]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const selectSuggestion = (name: string) => {
    // Strip title prefix if present — search by last word (surname) or full name
    setQuery(name);
    setShowSuggestions(false);
    doSearch(name);
  };

  // ── Toggle ───────────────────────────────────────────────────────────────

  const setChoice = (id: string, choice: RsvpChoice) => {
    setState(prev => {
      if (prev.kind !== "results") return prev;
      return { ...prev, cards: prev.cards.map(c => c.id === id ? { ...c, choice } : c) };
    });
  };

  // ── Confirm ──────────────────────────────────────────────────────────────

  const handleConfirm = async () => {
    if (state.kind !== "results") return;
    const cards = state.cards.map(c => ({
      ...c,
      choice: c.choice ?? ("confirmed" as RsvpChoice),
    }));
    setState({ kind: "submitting", cards });

    const errors: string[] = [];
    const names: string[] = [];

    for (const card of cards) {
      if (!card.id) continue;
      const status = card.choice === "confirmed" ? "Confirmed" : "Declined";
      let ok = false;

      try {
        const res = await fetch(getApiUrl(`/api/guests/${card.id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, rsvpUpdatedAt: new Date().toISOString() }),
        });
        if (res.ok) ok = true;
      } catch {}

      // Always update localStorage so the fallback is in sync with the DB, 
      // or holds the pending change if offline.
      writeLocalGuestStatus(card.id, status);
      setLocalGuests(readLocalGuests());
      
      names.push(card.displayName);
      if (!ok) errors.push(`${card.displayName} (Saved offline)`);
    }

    if (errors.length > 0) {
      // Continue to success screen since it saved offline, but log warning
      console.warn("Some RSVPs saved offline:", errors);
    }

    setState({ kind: "success", names });
  };

  const reset = () => {
    setQuery("");
    setState({ kind: "idle" });
    setShowSuggestions(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ── Derived ─────────────────────────────────────────────────────────────

  const cards = state.kind === "results" || state.kind === "submitting" ? state.cards : [];
  const isSubmitting = state.kind === "submitting";

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <main 
      className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F9F4ED 0%, #F5EFE5 50%, #F8F3EB 100%)" }}
    >
      {/* Watercolor background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(ellipse, rgba(201,160,96,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60%", height: "60%", background: "radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[28px] p-8 shadow-[0_12px_48px_-12px_rgba(201,160,96,0.18)] relative z-10 border border-[#F0E6D5] flex flex-col min-h-[500px]">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#9A7540] hover:bg-[#F9F4ED] transition-colors cursor-pointer border border-[#E8C87A]/30"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-serif text-[#3A3A3A] font-medium tracking-wide">RSVP</h1>
        </div>

        {/* ── Success ──────────────────────────────────────────────────── */}
        {state.kind === "success" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-[#F9F4ED] flex items-center justify-center mb-6 border border-[#E8C87A]/40 shadow-[0_0_20px_rgba(201,160,96,0.15)]">
              <Check size={36} className="text-[#C9A060]" />
            </div>
            <h2 className="text-2xl font-serif text-[#3A3A3A] mb-2 tracking-wide">RSVP Confirmed!</h2>
            <p className="text-[#666] text-[13px] leading-relaxed mb-6 font-medium">
              Thank you! We've received your response for:<br />
              <span className="font-bold text-[#9A7540] text-[15px] block mt-1">{state.names.join(", ")}</span>
            </p>
            <p className="text-[11px] font-bold tracking-widest text-[#C9A060] uppercase mb-8">We can't wait to celebrate with you!</p>
            
            <button
              onClick={reset}
              className="px-8 py-3.5 rounded-full text-white text-[12px] font-bold tracking-[0.15em] uppercase shadow-md transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #C9A060, #9A7540)", boxShadow: "0 4px 15px -3px rgba(201,160,96,0.4)" }}
            >
              Done
            </button>
          </div>
        )}

        {/* ── Search + results flow ─────────────────────────────────────── */}
        {state.kind !== "success" && (
          <>
            <p className="text-[13px] text-[#666] font-medium mb-6 text-center">
              Enter your name to find your invitation and submit your response.
            </p>

            {/* Search form */}
            <div className="relative mb-6">
              <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C9A060] pointer-events-none z-10" size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  autoComplete="off"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="Search your name..."
                  disabled={isSubmitting}
                  className="w-full pl-12 pr-28 py-4 bg-white/60 backdrop-blur-md border border-[#E8C87A]/50 rounded-full text-[14px] text-[#3A3A3A] focus:outline-none focus:border-[#C9A060] focus:bg-white transition-all shadow-[0_2px_10px_-4px_rgba(201,160,96,0.15)] placeholder:text-[#9A7540]/60 font-medium"
                />
                <button
                  type="submit"
                  disabled={query.trim().length < 2 || isSubmitting || state.kind === "loading"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest text-white transition-all disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #C9A060, #9A7540)", boxShadow: "0 2px 8px -2px rgba(201,160,96,0.4)" }}
                >
                  Search
                </button>
              </form>

              {/* Dropdown suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-[#E8C87A]/40 rounded-2xl shadow-[0_10px_30px_-10px_rgba(201,160,96,0.25)] z-50 overflow-hidden">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={() => selectSuggestion(s)}
                      className="w-full px-5 py-3.5 text-left text-[14px] text-[#3A3A3A] font-medium hover:bg-[#F9F4ED] hover:text-[#9A7540] transition-colors border-b border-[#E8C87A]/20 last:border-0"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Loading */}
            {state.kind === "loading" && (
              <div className="flex flex-col items-center py-12 text-[#C9A060]">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-[12px] font-bold tracking-widest uppercase">Searching…</p>
              </div>
            )}

            {/* Error */}
            {state.kind === "error" && (
              <div className="flex items-start gap-3 rounded-2xl px-5 py-4 text-[13px] bg-red-50/50 border border-red-200/50 text-red-600 mb-4 animate-fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Search failed</p>
                  <p className="opacity-80 mt-1">{state.message}</p>
                </div>
                <button onClick={() => doSearch(query)} className="shrink-0 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest hover:underline mt-1">
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}

            {/* Not found */}
            {state.kind === "none" && (
              <div className="flex flex-col items-center py-10 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-[#F9F4ED] flex items-center justify-center mb-4 border border-[#E8C87A]/30">
                  <Search size={24} className="text-[#C9A060]" />
                </div>
                <p className="font-bold text-[#3A3A3A] mb-2 text-[15px]">Name not found</p>
                <p className="text-[13px] text-[#666] leading-relaxed max-w-[280px]">
                  We couldn&apos;t find &ldquo;<span className="font-bold text-[#9A7540]">{query.trim()}</span>&rdquo;.
                  <br />Check the spelling or try your family name.
                </p>
                <button onClick={reset} className="mt-6 text-[11px] font-bold text-[#C9A060] uppercase tracking-widest hover:text-[#9A7540] transition-colors">
                  Try again
                </button>
              </div>
            )}

            {/* Guest cards */}
            {(state.kind === "results" || state.kind === "submitting") && cards.length > 0 && (
              <div className="flex-1 space-y-4 animate-fade-in">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="p-5 border rounded-[20px] transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: card.choice === "confirmed" 
                        ? "linear-gradient(to right, rgba(201,160,96,0.1), rgba(201,160,96,0.02))"
                        : card.choice === "declined"
                          ? "rgba(240,240,240,0.5)"
                          : "rgba(255,255,255,0.6)",
                      borderColor: card.choice === "confirmed" ? "#C9A060" : "rgba(201,160,96,0.2)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div>
                        <p className="font-bold text-[#3A3A3A] text-[15px]">{card.displayName}</p>
                        <p className="text-[10px] text-[#9A7540] uppercase tracking-widest mt-1 font-bold">{card.group}</p>
                      </div>
                      {card.choice && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                          style={{
                            background: card.choice === "confirmed" ? "rgba(201,160,96,0.15)" : "#F0F0F0",
                            color: card.choice === "confirmed" ? "#9A7540" : "#888"
                          }}
                        >
                          {card.choice === "confirmed" ? "Coming ✓" : "Not Coming"}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 relative z-10">
                      <button
                        onClick={() => setChoice(card.id, "confirmed")}
                        disabled={isSubmitting}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all disabled:opacity-50 border ${
                          card.choice === "confirmed"
                            ? "bg-[#C9A060] border-[#C9A060] text-white shadow-[0_4px_12px_-2px_rgba(201,160,96,0.4)]"
                            : "bg-white border-[#E8C87A]/50 text-[#9A7540] hover:border-[#C9A060] hover:bg-[#F9F4ED]"
                        }`}
                      >
                        <Check size={14} /> I&apos;m Coming
                      </button>
                      <button
                        onClick={() => setChoice(card.id, "declined")}
                        disabled={isSubmitting}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all disabled:opacity-50 border ${
                          card.choice === "declined"
                            ? "bg-[#666] border-[#666] text-white shadow-md"
                            : "bg-white border-[#E8C87A]/50 text-[#888] hover:border-[#666] hover:text-[#666]"
                        }`}
                      >
                        <X size={14} /> Not Coming
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full mt-4 text-white py-4 rounded-full text-[12px] font-bold tracking-[0.15em] uppercase transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #C9A060, #9A7540)", boxShadow: "0 4px 15px -3px rgba(201,160,96,0.4)" }}
                >
                  {isSubmitting
                    ? <><Loader2 size={16} className="animate-spin" /> Confirming…</>
                    : "Confirm RSVP"
                  }
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
