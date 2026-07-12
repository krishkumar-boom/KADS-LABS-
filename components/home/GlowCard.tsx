"use client"

import { motion } from "framer-motion"
import { ReactNode, useRef, useState } from "react"

interface GlowCardProps {
  children: ReactNode
  className?: string
  /** Accent color for the radial glow, e.g. "rgba(59,130,246,0.18)" */
  glowAccent?: string
  /** Accent color for the border on hover */
  borderAccent?: string
  onClick?: () => void
}

/**
 * GlowCard — card wrapper with a mouse-tracked radial gradient glow.
 * Updates CSS custom properties --mx/--my on mousemove. Border color brightens
 * on hover (200ms transition). GPU-friendly: uses background and border-color
 * changes only; no layout-affecting properties.
 */
export default function GlowCard({
  children,
  className = "",
  glowAccent = "rgba(59,130,246,0.18)",
  borderAccent = "rgba(59,130,246,0.45)",
  onClick
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty("--mx", `${x}px`)
    el.style.setProperty("--my", `${y}px`)
  }

  return (
    <motion.div
      ref={ref}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      style={{
        position: "relative",
        background: `
          radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), ${glowAccent}, transparent 60%),
          linear-gradient(180deg, rgba(30,41,59,0.55) 0%, rgba(15,23,42,0.7) 100%)
        `,
        border: `1px solid ${hover ? borderAccent : "rgba(255,255,255,0.08)"}`,
        borderRadius: "1rem",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        transition: "border-color 200ms ease, transform 300ms ease, box-shadow 300ms ease",
        boxShadow: hover
          ? `0 20px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px ${borderAccent}33, 0 0 50px -10px ${glowAccent}`
          : "0 10px 30px -15px rgba(0,0,0,0.5)",
        overflow: "hidden",
        cursor: onClick ? "pointer" : undefined,
        willChange: "transform"
      }}
      whileHover={onClick ? { y: -4 } : { y: -2 }}
    >
      {children}
    </motion.div>
  )
}
