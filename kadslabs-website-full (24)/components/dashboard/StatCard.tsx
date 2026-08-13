"use client"

import { motion } from "framer-motion"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  change?: string
  trend?: "up" | "down" | "neutral"
  accent?: string
  children?: ReactNode
}

export default function StatCard({ label, value, icon: Icon, change, trend = "neutral", accent = "#1E6BFF", children }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="premium-card relative overflow-hidden"
    >
      <div aria-hidden="true"
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-40 pointer-events-none"
        style={{ background: accent }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
             style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold ${
            trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-400" : ""
          }`} style={{ color: trend === "neutral" ? "var(--text-muted)" : undefined }}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
      {children}
    </motion.div>
  )
}
