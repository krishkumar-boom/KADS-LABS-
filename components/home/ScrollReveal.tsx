"use client"

/**
 * ScrollReveal — wraps children in a Framer Motion element that fades and
 * rises into view as the user scrolls. Use this to give every section that
 * cinematic "storytelling" entrance without duplicating animation props.
 *
 * Usage:
 *   <ScrollReveal>
 *     <h2>...</h2>
 *   </ScrollReveal>
 *
 *   <ScrollReveal delay={0.1} y={24} as="section" className="...">
 *     ...
 *   </ScrollReveal>
 *
 * Automatically disables itself when prefers-reduced-motion is set.
 */

import { motion, useReducedMotion } from "framer-motion"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  once?: boolean
  amount?: number
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  scale?: number
}

export default function ScrollReveal({
  children,
  delay = 0,
  y = 32,
  duration = 0.8,
  once = true,
  amount = 0.25,
  className,
  as,
  scale = 1,
}: Props) {
  const reduce = useReducedMotion()

  const MotionTag = as ? (motion as any)[as as string] : motion.div
  const initial = reduce ? { opacity: 1 } : { opacity: 0, y, scale: scale === 1 ? 1 : scale }
  const whileInView = reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }

  return (
    <MotionTag
      initial={initial}
      whileInView={whileInView}
      viewport={{ once, amount }}
      transition={{
        duration: reduce ? 0 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
