"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

interface ThemeToggleProps {
  className?: string
  variant?: "icon" | "button"
}

export default function ThemeToggle({ className = "", variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const baseStyle = {
    color: "var(--text-secondary)",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border-subtle)",
  } as React.CSSProperties

  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${className}`}
        style={baseStyle}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "var(--border-strong)"
          e.currentTarget.style.color = "var(--text-primary)"
          e.currentTarget.style.boxShadow = "var(--shadow-brand)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "var(--border-subtle)"
          e.currentTarget.style.color = "var(--text-secondary)"
          e.currentTarget.style.boxShadow = "none"
        }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ y: -10, opacity: 0, rotate: -30 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 10, opacity: 0, rotate: 30 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </motion.div>
        </AnimatePresence>
        <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={baseStyle}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--border-strong)"
        e.currentTarget.style.color = "var(--brand-neon)"
        e.currentTarget.style.boxShadow = "0 0 20px rgba(30,107,255,0.2)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border-subtle)"
        e.currentTarget.style.color = "var(--text-secondary)"
        e.currentTarget.style.boxShadow = "none"
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isDark ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
