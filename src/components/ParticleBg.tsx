"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  size: number;
  type: "heart" | "petal" | "sparkle" | "ring" | "dot";
  drift: number;
  opacity: number;
};

const EMOJIS = {
  heart:   "❤️",
  petal:   "🌸",
  sparkle: "✨",
  ring:    "💍",
  dot:     "•",
};

const TYPES: Particle["type"][] = ["heart", "petal", "sparkle", "ring", "dot", "heart", "petal", "dot"];

export default function ParticleBg({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id:       i,
      left:     Math.random() * 100,
      top:      -(Math.random() * 20),
      duration: 8 + Math.random() * 12,
      delay:    Math.random() * 8,
      size:     10 + Math.random() * 18,
      type:     TYPES[Math.floor(Math.random() * TYPES.length)],
      drift:    (Math.random() - 0.5) * 60,
      opacity:  0.3 + Math.random() * 0.5,
    }));
    setParticles(generated);
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none"
          style={{
            left:              `${p.left}%`,
            top:               `${p.top}%`,
            fontSize:          `${p.size}px`,
            opacity:           p.opacity,
            animationName:     "falling",
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationFillMode: "both",
            filter:            p.type === "heart" ? "drop-shadow(0 0 4px rgba(250,43,86,0.4))" : "none",
          }}
        >
          {p.type === "dot" ? (
            <div
              style={{
                width:        `${p.size * 0.4}px`,
                height:       `${p.size * 0.4}px`,
                borderRadius: "50%",
                background:   "var(--theme-primary)",
                opacity:      0.4,
              }}
            />
          ) : (
            EMOJIS[p.type]
          )}
        </div>
      ))}
    </div>
  );
}
