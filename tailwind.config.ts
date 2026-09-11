import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        cursive: ['"Great Vibes"', 'cursive'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        theme: {
          DEFAULT: "var(--theme-primary)",
          light: "var(--theme-primary-light)",
          hover: "var(--theme-primary-hover)",
        }
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        zoomIn: {
          '0%':   { opacity: '0', transform: 'scale(0.5)' },
          '70%':  { opacity: '1', transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%':      { transform: 'translateY(-16px) rotate(2deg)' },
          '66%':      { transform: 'translateY(-8px) rotate(-2deg)' },
        },
        floatSway: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%':      { transform: 'translateY(-12px) translateX(6px)' },
          '75%':      { transform: 'translateY(-6px) translateX(-6px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px -5px var(--theme-primary)' },
          '50%':      { boxShadow: '0 0 40px 5px var(--theme-primary), 0 0 80px 10px rgba(250, 43, 86, 0.3)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%':      { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%':      { transform: 'scale(1.15)' },
          '28%':      { transform: 'scale(1)' },
          '42%':      { transform: 'scale(1.1)' },
          '70%':      { transform: 'scale(1)' },
        },
        ringGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(250, 43, 86, 0.4)' },
          '50%':      { boxShadow: '0 0 0 20px rgba(250, 43, 86, 0)' },
        },
        confettiFall: {
          '0%':   { transform: 'translateY(-20px) rotateZ(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotateZ(720deg)', opacity: '0' },
        },
        falling: {
          '0%':   { transform: 'translateY(-10vh) rotate(0deg) translateX(0)', opacity: '0.8' },
          '30%':  { transform: 'translateY(30vh) rotate(120deg) translateX(20px)', opacity: '0.6' },
          '70%':  { transform: 'translateY(70vh) rotate(240deg) translateX(-15px)', opacity: '0.4' },
          '100%': { transform: 'translateY(110vh) rotate(360deg) translateX(10px)', opacity: '0' },
        },
        spinSlow: {
          'from': { transform: 'rotate(0deg)' },
          'to':   { transform: 'rotate(360deg)' },
        },
        starBurst: {
          '0%':   { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%':  { opacity: '1', transform: 'scale(1.2) rotate(180deg)' },
          '100%': { opacity: '0', transform: 'scale(0.8) rotate(360deg)' },
        },
      },
      animation: {
        'fade-in':        'fadeIn 0.6s ease-in-out both',
        'fade-in-up':     'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'slide-up':       'slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-left':  'slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'zoom-in':        'zoomIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'float':          'float 4s ease-in-out infinite',
        'float-sway':     'floatSway 5s ease-in-out infinite',
        'shimmer':        'shimmer 2.5s linear infinite',
        'pulse-glow':     'pulseGlow 2s ease-in-out infinite',
        'sparkle':        'sparkle 1.5s ease-in-out infinite',
        'heartbeat':      'heartbeat 1.2s ease-in-out infinite',
        'ring-glow':      'ringGlow 2s ease-out infinite',
        'confetti-fall':  'confettiFall linear forwards',
        'falling':        'falling linear infinite',
        'spin-slow':      'spinSlow 8s linear infinite',
        'star-burst':     'starBurst 2s ease-in-out infinite',
      },
      boxShadow: {
        'rose-glow':   '0 0 30px -5px rgba(250, 43, 86, 0.4)',
        'rose-glow-lg':'0 0 60px -5px rgba(250, 43, 86, 0.3)',
        'card':        '0 20px 60px -15px rgba(0, 0, 0, 0.08)',
        'card-rose':   '0 20px 60px -15px rgba(250, 43, 86, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
