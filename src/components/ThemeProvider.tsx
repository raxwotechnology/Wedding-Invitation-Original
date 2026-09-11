"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyTheme = () => {
      try {
        const storedColor = localStorage.getItem("wedding_theme_color");
        if (storedColor) {
          document.documentElement.style.setProperty("--theme-primary", storedColor);
          document.documentElement.style.setProperty("--theme-primary-light", storedColor + "1A");
          document.documentElement.style.setProperty("--theme-primary-hover", storedColor + "E6");
        } else {
          // Default: Elegant Gold (matching invitation)
          document.documentElement.style.setProperty("--theme-primary", "#C9A060");
          document.documentElement.style.setProperty("--theme-primary-light", "#FBF6ED");
          document.documentElement.style.setProperty("--theme-primary-hover", "#A8813A");
        }
      } catch (_) {}
    };

    applyTheme();
    window.addEventListener("storage", applyTheme);
    window.addEventListener("theme-updated", applyTheme);
    return () => {
      window.removeEventListener("storage", applyTheme);
      window.removeEventListener("theme-updated", applyTheme);
    };
  }, []);

  return <>{children}</>;
}
