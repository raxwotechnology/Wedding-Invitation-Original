"use client";

import { useEffect, useState } from "react";

type Piece = {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  size: number;
  type: "heart" | "petal" | "sparkle" | "ring";
  sway: number;
};

const TYPES: Piece["type"][] = ["heart", "petal", "sparkle", "heart", "petal", "heart"];

export default function FallingHearts({ count = 30 }: { count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }).map((_, i) => ({
        id:       i,
        left:     Math.random() * 100,
        top:      -(Math.random() * 10),
        duration: 7 + Math.random() * 11,
        delay:    Math.random() * 7,
        size:     10 + Math.random() * 18,
        type:     TYPES[Math.floor(Math.random() * TYPES.length)],
        sway:     (Math.random() - 0.5) * 40,
      }))
    );
  }, [count]);

  if (pieces.length === 0) return null;

  const renderShape = (type: Piece["type"], size: number) => {
    switch (type) {
      case "heart":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="#e11d48">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case "petal":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="#f472b6">
            <path d="M12 2 C12 2, 22 8, 20 16 C18 22, 6 22, 4 16 C2 8, 12 2, 12 2Z" />
          </svg>
        );
      case "sparkle":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="#fbbf24">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6z" />
          </svg>
        );
      case "ring":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
            <circle cx="12" cy="12" r="8" />
            <polygon points="12,2 14,5 10,5" fill="#f59e0b" stroke="none" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute select-none"
          style={{
            left:                    `${p.left}%`,
            top:                     `${p.top}%`,
            opacity:                 0.35 + Math.random() * 0.35,
            animationName:           "falling",
            animationDuration:       `${p.duration}s`,
            animationDelay:          `${p.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {renderShape(p.type, p.size)}
        </div>
      ))}
    </div>
  );
}
