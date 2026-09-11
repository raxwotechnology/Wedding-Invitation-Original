"use client";
import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set wedding date to Dec 14, 2026
    const targetDate = new Date("2026-12-14T16:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 sm:gap-8 justify-center items-center mt-12 bg-white/50 py-8 px-4 rounded-2xl shadow-sm border border-rose-100">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-4xl sm:text-5xl font-serif text-rose-700 font-medium">
            {item.value.toString().padStart(2, "0")}
          </span>
          <span className="text-xs sm:text-sm uppercase tracking-widest text-stone-500 mt-2">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
