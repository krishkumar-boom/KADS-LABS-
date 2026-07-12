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
  as?: "div" | "section" | "article" | "li" | "header" | "footer"
}

/**
 * Global scroll-reveal wrapper.
 * - Triggers once at 20% visibility (amount: 0.2).
 * - Fades + translates up (GPU-friendly transform/opacity only).
 * - Respects prefers-reduced-motion (renders at rest, no animation).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 12,
  as = "div"
}: RevealProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return createElement(as, { className }, children)
  }

  const MotionTag = motion[as] as typeof motion.div

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
