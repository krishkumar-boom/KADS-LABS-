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

  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
          isDark
            ? "text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
            : "text-navy-900/70 border-navy-900/10 hover:bg-navy-900/5 hover:text-navy-900"
        } ${className}`}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
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
      className={`relative p-2 rounded-lg transition-colors border ${
        isDark
          ? "text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
          : "text-navy-900/70 border-navy-900/10 hover:bg-navy-900/5 hover:text-navy-900"
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
