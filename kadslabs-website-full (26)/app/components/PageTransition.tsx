"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

/**
 * PageTransition — wraps route children with a 150ms cross-fade between
 * navigation events using Framer Motion AnimatePresence.
 *
 * Respects prefers-reduced-motion: when set, no transition is applied.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  if (reduced) return <>{children}</>

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
