"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function BackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const userMutedRef = useRef(false);

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || userMutedRef.current) return;

    audio.volume = 0.55;
    audio
      .play()
      .then(() => {
        setPlaying(true);
      })
      .catch(() => {
        // Autoplay may be restricted until first user interaction
        setPlaying(false);
      });
  }, []);

  useEffect(() => {
    // 1. Attempt immediate playback on page open
    attemptPlay();

    // 2. Fallback: Start playback on earliest user micro-interaction
    const handleInteraction = () => {
      if (!userMutedRef.current) {
        attemptPlay();
      }
    };

    const events = ["click", "touchstart", "scroll", "pointerdown", "keydown"];
    events.forEach(ev => window.addEventListener(ev, handleInteraction, { passive: true, once: true }));

    return () => {
      events.forEach(ev => window.removeEventListener(ev, handleInteraction));
    };
  }, [attemptPlay]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      userMutedRef.current = true; // User explicitly muted
    } else {
      userMutedRef.current = false; // User explicitly unmuted
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(console.warn);
    }
  };

  return (
    <>
      {/* Wedding background romantic music */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/music/wedding.mp3"
      />

      {/* Floating music controller badge */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center">
        <button
          onClick={toggle}
          title={playing ? "Mute Music" : "Play Wedding Music"}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border"
          style={{
            background: playing
              ? "linear-gradient(135deg, #9A7540, #C9A060)"
              : "rgba(255, 255, 255, 0.95)",
            borderColor: "rgba(201, 160, 96, 0.4)",
            color: playing ? "#FFFFFF" : "#9A7540",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: playing
              ? "0 8px 24px -4px rgba(201,160,96,0.6)"
              : "0 4px 20px -2px rgba(0,0,0,0.12)",
          }}
          aria-label={playing ? "Mute music" : "Play music"}
        >
          {playing ? (
            <>
              <Volume2 size={18} className="animate-pulse" />
              <span className="text-xs font-bold tracking-wide pr-1">Mute Music</span>
              {/* Animated sound equalizer bars */}
              <span className="flex items-end gap-0.5 h-3 ml-0.5">
                <span className="w-0.5 bg-white rounded-full animate-soundbar-1 h-3" />
                <span className="w-0.5 bg-white rounded-full animate-soundbar-2 h-2" />
                <span className="w-0.5 bg-white rounded-full animate-soundbar-3 h-3.5" />
              </span>
            </>
          ) : (
            <>
              <VolumeX size={18} style={{ color: "#9A7540" }} />
              <span className="text-xs font-bold tracking-wide text-[#9A7540] pr-1">Play Music</span>
            </>
          )}
        </button>
      </div>

      <style jsx global>{`
        @keyframes soundbar1 {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        @keyframes soundbar2 {
          0%, 100% { height: 12px; }
          50% { height: 5px; }
        }
        @keyframes soundbar3 {
          0%, 100% { height: 7px; }
          50% { height: 14px; }
        }
        .animate-soundbar-1 { animation: soundbar1 0.8s ease-in-out infinite; }
        .animate-soundbar-2 { animation: soundbar2 0.6s ease-in-out infinite; }
        .animate-soundbar-3 { animation: soundbar3 0.9s ease-in-out infinite; }
      `}</style>
    </>
  );
}
