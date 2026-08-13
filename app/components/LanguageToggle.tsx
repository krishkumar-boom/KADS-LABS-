"use client"

import { Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "./LanguageProvider"

interface LanguageToggleProps {
  className?: string
}

export default function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { language, toggleLanguage } = useLanguage()
  const isHindi = language === "hi"

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={{
        color: isHindi ? "var(--brand-neon)" : "var(--text-secondary)",
        background: isHindi ? "rgba(30,107,255,0.1)" : "var(--bg-tertiary)",
        border: `1px solid ${isHindi ? "var(--border-strong)" : "var(--border-subtle)"}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "var(--border-strong)"
        e.currentTarget.style.color = "var(--brand-neon)"
        e.currentTarget.style.boxShadow = "0 0 20px rgba(30,107,255,0.2)"
      }}
      onMouseLeave={e => {
        if (!isHindi) {
          e.currentTarget.style.borderColor = "var(--border-subtle)"
          e.currentTarget.style.color = "var(--text-secondary)"
        }
        e.currentTarget.style.boxShadow = "none"
      }}
      aria-label="Toggle language"
      title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
    >
      <Globe className="w-4 h-4" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={language}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 6, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="hidden sm:inline"
        >
          {isHindi ? "हिंदी" : "EN"}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
