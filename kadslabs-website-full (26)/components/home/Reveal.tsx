"use client"

import { motion, useReducedMotion } from "framer-motion"
import { createElement, ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  className?: string
  /** stagger delay in seconds */
  delay?: number
  /** override the y-distance */
  y?: number
  /** element to render — defaults to div */
  as?: "div" | "section" | "article" | "li" | "header" | "footer" | "ul" | "h2" | "h3" | "p"
  /** if true, use a softer blur-in */
  blur?: boolean
}

/**
 * Global scroll-reveal wrapper.
 * - Fades + translates up (GPU-friendly transform/opacity only).
 * - Respects prefers-reduced-motion (renders at rest, no animation).
 * - Triggers once at 20% visibility.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  as = "div",
  blur = false
}: RevealProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return createElement(as, { className }, children)
  }

  const MotionTag = motion[as] as typeof motion.div

  return (
    <MotionTag
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
