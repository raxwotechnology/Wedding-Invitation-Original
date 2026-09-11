"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { WeddingCouple } from "@/types/navigation";

// ---------------------------------------------------------------------------
// Defaults — used on first visit before anything is saved
// ---------------------------------------------------------------------------

const DEFAULTS: WeddingCouple = {
  partnerA: "Vishmi",
  partnerB: "Sanjana",
};

const LS_KEY = "wedding_settings";

/** Read the couple names from localStorage, falling back to defaults. */
function readFromStorage(): WeddingCouple {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      partnerA: parsed.partnerOne || DEFAULTS.partnerA,
      partnerB: parsed.partnerTwo || DEFAULTS.partnerB,
    };
  } catch {
    return DEFAULTS;
  }
}

/** Persist just the name fields back into the existing wedding_settings blob. */
function writeToStorage(couple: WeddingCouple): void {
  try {
    const existing = JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        ...existing,
        partnerOne: couple.partnerA,
        partnerTwo: couple.partnerB,
      })
    );
    // Allow non-React consumers (e.g. ThemeProvider) to react if needed
    window.dispatchEvent(new Event("wedding-names-updated"));
  } catch {
    // Silently ignore storage errors (e.g. private browsing quota)
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CoupleContextValue {
  /** Current couple names consumed by the sidebar. */
  couple: WeddingCouple;
  /**
   * Update both names at once.
   * Immediately re-renders all consumers and persists to localStorage.
   * Swap the body of this function for an API call when a backend is ready.
   */
  setCouple: (next: WeddingCouple) => void;
}

const CoupleContext = createContext<CoupleContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CoupleProvider({ children }: { children: ReactNode }) {
  const [couple, setCoupleState] = useState<WeddingCouple>(readFromStorage);

  const setCouple = useCallback((next: WeddingCouple) => {
    setCoupleState(next);
    writeToStorage(next);
  }, []);

  return (
    <CoupleContext.Provider value={{ couple, setCouple }}>
      {children}
    </CoupleContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns `{ couple, setCouple }` from the nearest `CoupleProvider`.
 * Throws if used outside a provider so mis-wiring is caught at dev-time.
 */
export function useCouple(): CoupleContextValue {
  const ctx = useContext(CoupleContext);
  if (!ctx) {
    throw new Error("useCouple must be used within a <CoupleProvider>");
  }
  return ctx;
}
