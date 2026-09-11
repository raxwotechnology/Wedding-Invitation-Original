"use client";

import { useEffect, useRef, useState } from "react";

interface FlipDigitProps {
  value: number;
  label: string;
  max?: number;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function FlipDigit({ value, label }: FlipDigitProps) {
  const [current, setCurrent]   = useState(value);
  const [prev, setPrev]         = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      setPrev(prevRef.current);
      setFlipping(true);
      const t = setTimeout(() => {
        setCurrent(value);
        setFlipping(false);
        prevRef.current = value;
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value]);

  const displayCurrent = pad(current);
  const displayPrev    = pad(prev);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Flip card */}
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 select-none" style={{ perspective: "400px" }}>
        {/* Background card (always current) */}
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #FBF6ED 100%)",
            boxShadow: "0 8px 32px -8px rgba(201,160,96,0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
            border: "1px solid rgba(201,160,96,0.12)",
          }}
        >
          <span
            className="font-bold text-3xl sm:text-4xl"
            style={{ color: "#1E293B", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
          >
            {displayCurrent}
          </span>
        </div>

        {/* Top half — previous value, flips away */}
        {flipping && (
          <div
            className="absolute top-0 left-0 right-0 h-1/2 rounded-t-xl overflow-hidden z-10"
            style={{
              background: "linear-gradient(135deg, #fff 0%, #fff5f7 100%)",
              boxShadow: "0 -2px 8px -2px rgba(0,0,0,0.05)",
              border: "1px solid rgba(250,43,86,0.1)",
              borderBottom: "1px solid rgba(250,43,86,0.06)",
              transformOrigin: "bottom center",
              animation: "flipTop 0.3s ease-in forwards",
            }}
          >
            <div className="h-full flex items-end justify-center pb-0 overflow-hidden">
              <span
                className="font-bold text-3xl sm:text-4xl"
                style={{ color: "#1E293B", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", transform: "translateY(50%)" }}
              >
                {displayPrev}
              </span>
            </div>
          </div>
        )}

        {/* Bottom half — new value, flips in */}
        {flipping && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-xl overflow-hidden z-10"
            style={{
              background: "linear-gradient(135deg, #fff5f7 0%, #fff 100%)",
              border: "1px solid rgba(250,43,86,0.1)",
              borderTop: "none",
              transformOrigin: "top center",
              animation: "flipBottom 0.3s ease-out 0.15s forwards",
            }}
          >
            <div className="h-full flex items-start justify-center pt-0 overflow-hidden">
              <span
                className="font-bold text-3xl sm:text-4xl"
                style={{ color: "#1E293B", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", transform: "translateY(-50%)" }}
              >
                {displayCurrent}
              </span>
            </div>
          </div>
        )}

        {/* Center divider line */}
        <div
          className="absolute left-0 right-0 z-20 pointer-events-none"
          style={{ top: "50%", height: "1px", background: "rgba(250,43,86,0.12)" }}
        />
      </div>

      {/* Label */}
      <span
        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: "#C9A060" }}
      >
        {label}
      </span>
    </div>
  );
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculate(eventDate: Date): Countdown {
  const diffMs = eventDate.getTime() - Date.now();
  if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  const totalSecs = Math.floor(diffMs / 1000);
  const days    = Math.floor(totalSecs / (60 * 60 * 24));
  const hours   = Math.floor((totalSecs % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSecs % (60 * 60)) / 60);
  const seconds = totalSecs % 60;
  return { days, hours, minutes, seconds, isPast: false };
}

interface FlipCountdownProps {
  eventDate: Date;
  onPastChange?: (isPast: boolean) => void;
}

export default function FlipCountdown({ eventDate, onPastChange }: FlipCountdownProps) {
  const [cd, setCd] = useState<Countdown>(() => calculate(eventDate));

  useEffect(() => {
    const tick = () => {
      const updated = calculate(eventDate);
      setCd(updated);
      onPastChange?.(updated.isPast);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [eventDate, onPastChange]);

  if (cd.isPast) {
    return (
      <div className="flex flex-col items-center py-6 gap-3">
        <div className="text-5xl animate-heartbeat">💒</div>
        <p className="text-xl font-bold" style={{ color: "var(--theme-primary)" }}>
          They&apos;re married! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">
        Countdown to the big day
      </p>
      <div className="flex items-start justify-center gap-3 sm:gap-5">
        <FlipDigit value={cd.days}    label="Days" />
        <div className="text-2xl sm:text-3xl font-bold text-gray-200 mt-4 sm:mt-5 select-none">:</div>
        <FlipDigit value={cd.hours}   label="Hours" />
        <div className="text-2xl sm:text-3xl font-bold text-gray-200 mt-4 sm:mt-5 select-none">:</div>
        <FlipDigit value={cd.minutes} label="Min" />
        <div className="text-2xl sm:text-3xl font-bold text-gray-200 mt-4 sm:mt-5 select-none">:</div>
        <FlipDigit value={cd.seconds} label="Sec" />
      </div>
    </div>
  );
}
