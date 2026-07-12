"use client"

import { ReactNode } from "react"
import Reveal from "@/components/home/Reveal"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * AnimatedSection (legacy) — kept for backwards compatibility with all existing
 * pages. Now delegates to the global <Reveal> wrapper so all sections share
 * the same reveal timing, visibility threshold (20%), and reduced-motion
 * handling.
 */
export default function AnimatedSection({
  children,
  className = "",
  delay = 0
}: AnimatedSectionProps) {
  return (
    <Reveal className={className} delay={delay} y={24}>
      {children}
    </Reveal>
  )
}
