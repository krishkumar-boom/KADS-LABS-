"use client"

import { useEffect, useState } from "react"

/**
 * Returns true when the user has requested reduced motion.
 * SSR-safe: starts as `true` (no animation) until we can read the media query on the client.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener?.("change", onChange)
    return () => mql.removeEventListener?.("change", onChange)
  }, [])

  return reduced
}
