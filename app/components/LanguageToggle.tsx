"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { useLanguage } from "./LanguageProvider"

interface LanguageToggleProps {
  className?: string
}

export default function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { language, toggleLanguage, t } = useLanguage()
  const isHindi = language === "hi"

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
        isHindi
          ? "text-electric-light border-electric/30 bg-electric/10"
          : "text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
      } ${className}`}
      aria-label={t("language.switch")}
      title={t("language.switch")}
    >
      <Globe className="w-4 h-4" />
      <span className="hidden sm:inline">{isHindi ? "हिंदी" : "EN"}</span>
    </button>
  )
}
