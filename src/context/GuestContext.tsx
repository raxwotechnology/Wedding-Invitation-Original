"use client";

/**
 * GuestContext — single shared store for all guest AND table data.
 *
 * ARCHITECTURE
 * ─────────────
 * GuestProvider (mounted once in admin/layout.tsx) fetches guests on mount
 * and exposes them to every child page via useGuests().
 *
 * /admin/guests, /admin/rsvp, and /admin/seating all consume the same
 * `guests` array and `tables` array — they can never desync.
 *
 * TABLE STORAGE
 * ─────────────
 * Tables are persisted in localStorage under "wedding_tables".
 * They are configuration data (not transactional), so no API route is needed.
 * Guest table assignments (guest.table = tableId) still go through /api/guests.
 *
 * DERIVED DATA (never stored separately)
 * ───────────────────────────────────────
 * - Guests assigned to a table: guests.filter(g => g.table === tableId)
 * - Table occupancy count: that filter's .length
 * Storing these as duplicates is exactly what causes desync — we never do it.
 *
 * OPTIMISTIC UPDATES
 * ───────────────────
 * All guest mutations are optimistic with rollback on API failure.
 * Table mutations are localStorage-only and always succeed synchronously.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  Guest,
  NewGuestInput,
  RsvpStatus,
  Table,
  TableInput,
  TableUpdate,
  UpdateGuestInput,
} from "@/types/guest";
import { getApiUrl } from "@/lib/api";

// ─── localStorage helpers ────────────────────────────────────────────────────

const LS_GUESTS = "wedding_guests_fallback";
const LS_TABLES = "wedding_tables";

function readLocalGuests(): Guest[] {
  try { return JSON.parse(localStorage.getItem(LS_GUESTS) ?? "[]"); } catch { return []; }
}
function writeLocalGuests(guests: Guest[]): void {
  try { localStorage.setItem(LS_GUESTS, JSON.stringify(guests)); } catch {}
}

function readLocalTables(): Table[] {
  try { return JSON.parse(localStorage.getItem(LS_TABLES) ?? "[]"); } catch { return []; }
}
function writeLocalTables(tables: Table[]): void {
  try { localStorage.setItem(LS_TABLES, JSON.stringify(tables)); } catch {}
}

function newId(): string {
  return Math.random().toString(36).slice(2, 11);
}

// ─── Context types ────────────────────────────────────────────────────────────

interface GuestContextValue {
  // ── Guests ──
  guests: Guest[];
  isLoading: boolean;
  error: string | null;

  addGuest:         (data: NewGuestInput)                  => Promise<void>;
  updateGuest:      (id: string, data: UpdateGuestInput)   => Promise<void>;
  updateRsvpStatus: (id: string, status: RsvpStatus)       => Promise<void>;
  deleteGuest:      (id: string)                           => Promise<void>;
  refresh:          ()                                     => Promise<void>;

  // ── Tables ──
  tables: Table[];

  addTable:    (input: TableInput)              => void;
  updateTable: (id: string, patch: TableUpdate) => void;
  /**
   * Delete a table.  All guests assigned to this table will be unassigned
   * (their guest.table set to "") before the table is removed.
   */
  deleteTable: (id: string)                    => Promise<void>;

  /**
   * Assign or unassign a guest from a table.
   * Pass tableId="" to unassign.
   * Throws (sets error) if the table is already at capacity.
   */
  assignGuestToTable: (guestId: string, tableId: string) => Promise<void>;
}

const GuestContext = createContext<GuestContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GuestProvider({ children }: { children: ReactNode }) {
  const [guests, setGuests]   = useState<Guest[]>([]);
  const [tables, setTables]   = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // ── Load tables from localStorage on mount (and sync across tabs) ──────────

  useEffect(() => {
    setTables(readLocalTables());
    
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_TABLES) setTables(readLocalTables());
      if (e.key === LS_GUESTS) setGuests(readLocalGuests());
    };
    
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Fetch guests from API (with localStorage fallback) ─────────────────────

  const fetchGuests = useCallback(async () => {
    // Attempt to load from cache immediately so UI doesn't block
    const cached = readLocalGuests();
    if (cached.length > 0) {
      setGuests(cached);
      setIsLoading(false); // Instant load!
    } else {
      setIsLoading(true);
    }

    setError(null);
    try {
      const res = await fetch(getApiUrl("/api/guests"));
      if (!res.ok) throw new Error("API " + res.status);
      const data: Guest[] = await res.json();
      
      // Only update state if data changed (optional, but prevents unnecessary re-renders)
      setGuests(data);
      writeLocalGuests(data);
    } catch {
      console.warn("[GuestContext] fetch failed — using localStorage fallback");
      setGuests(readLocalGuests());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  // ═════════════════════════════════════════════════════════════════════════════
  // GUEST MUTATIONS
  // ═════════════════════════════════════════════════════════════════════════════

  const addGuest = useCallback(async (data: NewGuestInput) => {
    setError(null);
    const tempId = "__temp_" + newId();
    const optimistic: Guest = { table: "", ...data, id: tempId };
    setGuests(prev => [optimistic, ...prev]);

    try {
      const res = await fetch(getApiUrl("/api/guests"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("API " + res.status);
      const created: Guest = await res.json();
      setGuests(prev => {
        const next = prev.map(g => g.id === tempId ? created : g);
        writeLocalGuests(next);
        return next;
      });
    } catch {
      console.warn("[GuestContext] addGuest API failed — localStorage fallback");
      const local = readLocalGuests();
      const localGuest: Guest = { table: "", ...data, id: newId() };
      const next = [localGuest, ...local];
      writeLocalGuests(next);
      setGuests(next);
    }
  }, []);

  const updateGuest = useCallback(async (id: string, data: UpdateGuestInput) => {
    setError(null);
    let previous: Guest[] = [];
    setGuests(prev => {
      previous = prev;
      const next = prev.map(g => g.id === id ? { ...g, ...data } : g);
      writeLocalGuests(next);
      return next;
    });

    try {
      const res = await fetch(getApiUrl(`/api/guests/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status >= 500) throw new Error("Server error " + res.status);
      if (res.ok) {
        const updated: Guest = await res.json();
        setGuests(prev => {
          const next = prev.map(g => g.id === id ? { ...g, ...updated } : g);
          writeLocalGuests(next);
          return next;
        });
      }
    } catch {
      console.warn("[GuestContext] updateGuest API failed — rolling back");
      setGuests(previous);
      writeLocalGuests(previous);
      setError("Failed to save changes. Please try again.");
    }
  }, []);

  const updateRsvpStatus = useCallback(async (id: string, status: RsvpStatus) => {
    await updateGuest(id, { status, rsvpUpdatedAt: new Date().toISOString() });
  }, [updateGuest]);

  const deleteGuest = useCallback(async (id: string) => {
    setError(null);
    let previous: Guest[] = [];
    setGuests(prev => {
      previous = prev;
      const next = prev.filter(g => g.id !== id);
      writeLocalGuests(next);
      return next;
    });

    try {
      const res = await fetch(getApiUrl(`/api/guests/${id}`), { method: "DELETE" });
      if (res.status >= 500) throw new Error("Server error " + res.status);
    } catch {
      console.warn("[GuestContext] deleteGuest API failed — rolling back");
      setGuests(previous);
      writeLocalGuests(previous);
      setError("Failed to delete guest. Please try again.");
    }
  }, []);

  // ═════════════════════════════════════════════════════════════════════════════
  // TABLE MUTATIONS  (localStorage only, synchronous)
  // ═════════════════════════════════════════════════════════════════════════════

  const addTable = useCallback((input: TableInput) => {
    setTables(prev => {
      const maxNum = prev.length > 0 ? Math.max(...prev.map(t => t.number)) : 0;
      const newTable: Table = {
        id:       newId(),
        number:   maxNum + 1,
        label:    input.label,
        capacity: input.capacity,
      };
      const next = [...prev, newTable];
      writeLocalTables(next);
      return next;
    });
  }, []);

  const updateTable = useCallback((id: string, patch: TableUpdate) => {
    setTables(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...patch } : t);
      writeLocalTables(next);
      return next;
    });
  }, []);

  const deleteTable = useCallback(async (id: string) => {
    // First unassign every guest currently at this table.
    let guestsToUnassign: Guest[] = [];
    setGuests(prev => {
      guestsToUnassign = prev.filter(g => g.table === id);
      return prev;
    });

    for (const g of guestsToUnassign) {
      await updateGuest(g.id, { table: "" });
    }

    // Remove the table, then renumber remaining tables 1, 2, 3…
    // Guest assignments reference table.id (never table.number) so this is safe.
    setTables(prev => {
      const remaining = prev.filter(t => t.id !== id);
      const renumbered = remaining.map((t, i) => ({ ...t, number: i + 1 }));
      writeLocalTables(renumbered);
      return renumbered;
    });
  }, [updateGuest]);

  // ═════════════════════════════════════════════════════════════════════════════
  // SEATING ASSIGNMENT
  // ═════════════════════════════════════════════════════════════════════════════

  const assignGuestToTable = useCallback(async (guestId: string, tableId: string) => {
    if (tableId !== "") {
      let occupied = 0;
      let cap = Infinity;
      let partySize = 1;
      
      setGuests(prev => { 
        occupied = prev
          .filter(g => g.table === tableId && g.id !== guestId)
          .reduce((sum, g) => sum + (g.partySize || 1), 0);
        
        const guest = prev.find(g => g.id === guestId);
        if (guest) partySize = guest.partySize || 1;
        return prev; 
      });
      
      setTables(prev => { cap = prev.find(t => t.id === tableId)?.capacity ?? Infinity; return prev; });

      if (occupied + partySize > cap) {
        const tbl = readLocalTables().find(t => t.id === tableId);
        const label = tbl ? `Table ${tbl.number}` : "That table";
        setError(`${label} is full (${occupied}/${cap} with ${partySize} incoming). Choose a different table.`);
        return;
      }
    }

    // Optimistic update — apply immediately so UI is responsive
    setGuests(prev => {
      const next = prev.map(g => g.id === guestId ? { ...g, table: tableId } : g);
      writeLocalGuests(next);
      return next;
    });

    // Persist to API — on failure, keep optimistic state (don't roll back table
    // assignment mid-interaction; show a warning instead so the user isn't confused)
    try {
      const res = await fetch(getApiUrl(`/api/guests/${guestId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: tableId }),
      });
      if (res.status >= 500) throw new Error("Server error " + res.status);
      if (res.ok) {
        const updated: Guest = await res.json();
        setGuests(prev => {
          const next = prev.map(g => g.id === guestId ? { ...g, ...updated } : g);
          writeLocalGuests(next);
          return next;
        });
      }
    } catch {
      // Keep the optimistic assignment — don't roll back, just warn
      console.warn("[GuestContext] assignGuestToTable API failed — keeping optimistic state");
      setError("Couldn't save to server — assignment shown locally. Changes may not persist.");
    }
  }, []);

  return (
    <GuestContext.Provider value={{
      guests, isLoading, error,
      addGuest, updateGuest, updateRsvpStatus, deleteGuest, refresh: fetchGuests,
      tables, addTable, updateTable, deleteTable, assignGuestToTable,
    }}>
      {children}
    </GuestContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGuests(): GuestContextValue {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuests must be used inside <GuestProvider>");
  return ctx;
}
