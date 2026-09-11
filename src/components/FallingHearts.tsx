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

  const GLYPHS: Record<Piece["type"], string> = {
    heart:   "❤️",
    petal:   "🌸",
    sparkle: "✨",
    ring:    "💍",
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
            fontSize:                `${p.size}px`,
            opacity:                 0.35 + Math.random() * 0.35,
            animationName:           "falling",
            animationDuration:       `${p.duration}s`,
            animationDelay:          `${p.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationFillMode:       "both",
            filter:
              p.type === "heart"
                ? "drop-shadow(0 0 4px rgba(250,43,86,0.4))"
                : "none",
          }}
        >
          {GLYPHS[p.type]}
        </div>
      ))}
    </div>
  );
}
