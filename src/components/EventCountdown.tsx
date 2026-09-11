"use client";

/**
 * EventCountdown
 *
 * Accepts a single `eventDate` prop (a JS Date object) and renders a live
 * Days / Hrs / Min countdown that updates every 60 seconds automatically.
 *
 * TIME-ZONE APPROACH: The eventDate is constructed from the stored date string
 * (e.g. "2026-12-18") at midnight in the USER'S LOCAL time zone.  The
 * calculation is `eventDate.getTime() - Date.now()`, which is also local.
 * Both sides use the same reference frame so no explicit tz conversion needed.
 *
 * PAST-DATE HANDLING: If the event has already occurred the component shows
 * "They're married! ??" and signals the caller via onPastChange so the RSVP
 * button can be hidden/disabled.
 */

import { useEffect, useState } from "react";

interface EventCountdownProps {
  eventDate: Date;
  /** Called on mount and whenever past/future state flips. */
  onPastChange?: (isPast: boolean) => void;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
}

function calculate(eventDate: Date): Countdown {
  const diffMs = eventDate.getTime() - Date.now();
  if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, isPast: true };
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days    = Math.floor(totalMinutes / (60 * 24));
  const hours   = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes, isPast: false };
}

export default function EventCountdown({ eventDate, onPastChange }: EventCountdownProps) {
  const [cd, setCd] = useState<Countdown>(() => calculate(eventDate));

  useEffect(() => {
    const fresh = calculate(eventDate);
    setCd(fresh);
    onPastChange?.(fresh.isPast);

    // Refresh every 60 s — matches the displayed granularity (minutes).
    const id = setInterval(() => {
      const updated = calculate(eventDate);
      setCd(updated);
      onPastChange?.(updated.isPast);
    }, 60_000);

    return () => clearInterval(id);
  }, [eventDate, onPastChange]);

  if (cd.isPast) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="text-lg font-bold text-[#FA2B56]">
          They&apos;re married! ??
        </span>
      </div>
    );
  }

  // Preserves the exact visual structure from the original hardcoded block.
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div className="text-center">
        <span className="block text-2xl font-bold text-[#1E293B]">{cd.days}</span>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Days</span>
      </div>
      <span className="text-2xl text-gray-300 font-light" aria-hidden="true">:</span>
      <div className="text-center">
        <span className="block text-2xl font-bold text-[#1E293B]">{cd.hours}</span>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Hrs</span>
      </div>
      <span className="text-2xl text-gray-300 font-light" aria-hidden="true">:</span>
      <div className="text-center">
        <span className="block text-2xl font-bold text-[#1E293B]">{cd.minutes}</span>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Min</span>
      </div>
    </div>
  );
}
