import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#05070B",
          900: "#08111F",
          800: "#0B1729",
          700: "#101E36",
          600: "#1B2C4A"
        },
        brand: {
          // New KADS LABS brand palette
          electric: "#1E6BFF",   // Primary Electric Blue
          neon: "#33B5FF",       // Neon Blue
          electricDark: "#1557D6",
          electricLight: "#5B9AFF",
          glow: "rgba(30,107,255,0.35)",
          neonGlow: "rgba(51,181,255,0.25)"
        },
        electric: {
          // Preserve backwards-compat aliases for existing code
          DEFAULT: "#1E6BFF",
          glow: "#33B5FF",
          light: "#5B9AFF",
          dark: "#1557D6"
        },
        cyan: {
          DEFAULT: "#33B5FF",
          glow: "#33B5FF"
        },
        amethyst: {
          DEFAULT: "#7C3AED",
          light: "#A78BFA",
          dark: "#5B21B6"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        display: [
          "Inter",
          "SF Pro Display",
          "system-ui",
          "-apple-system",
          "sans-serif"
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "ui-monospace",
          "Menlo",
          "monospace"
        ]
      },
      boxShadow: {
        "brand-sm": "0 2px 8px rgba(30,107,255,0.08)",
        "brand": "0 8px 30px rgba(30,107,255,0.12)",
        "brand-lg": "0 20px 60px -10px rgba(30,107,255,0.25)",
        "neon": "0 0 40px rgba(51,181,255,0.35)",
        "neon-lg": "0 0 80px rgba(51,181,255,0.25)",
        "glass-dark": "0 8px 32px rgba(0,0,0,0.4)",
        "card-light": "0 1px 3px rgba(16,24,40,0.06), 0 4px 12px rgba(16,24,40,0.04)"
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at center, rgba(30,107,255,0.15), transparent 60%)",
        "neon-radial": "radial-gradient(circle at center, rgba(51,181,255,0.12), transparent 60%)",
        "grid-light": "linear-gradient(rgba(30,107,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,255,0.04) 1px, transparent 1px)",
        "grid-dark": "linear-gradient(rgba(51,181,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(51,181,255,0.05) 1px, transparent 1px)"
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "orb-drift-1": "orb-drift-1 22s ease-in-out infinite",
        "orb-drift-2": "orb-drift-2 26s ease-in-out infinite",
        "orb-drift-3": "orb-drift-3 18s ease-in-out infinite",
        "spin-slow": "spin 30s linear infinite",
        "marquee": "marquee 30s linear infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" }
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.5" },
          "50%": { opacity: "1" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "orb-drift-1": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.08)" },
          "66%": { transform: "translate(-30px,25px) scale(0.95)" }
        },
        "orb-drift-2": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(-50px,35px) scale(1.05)" },
          "66%": { transform: "translate(35px,-20px) scale(0.98)" }
        },
        "orb-drift-3": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,40px) scale(1.1)" },
          "66%": { transform: "translate(-40px,-30px) scale(0.92)" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
}

export default config
