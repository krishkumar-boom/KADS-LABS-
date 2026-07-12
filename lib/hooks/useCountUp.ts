"use client"

import { useEffect, useRef, useState } from "react"

interface UseCountUpOptions {
  /** target end value */
  end: number
  /** whether to start counting (set true when in viewport) */
  start?: boolean
  /** duration in ms */
  duration?: number
  /** easing function: `ease-out` cubic by default, `spring` applies overshoot */
  easing?: "ease-out" | "spring"
  /** number of decimals to render */
  decimals?: number
}

/**
 * Lightweight count-up hook. Ramps from 0 -> end over `duration` using rAF.
 * Respects prefers-reduced-motion by snapping to the target value instantly.
 */
export function useCountUp({
  end,
  start = true,
  duration = 1200,
  easing = "ease-out",
  decimals = 0
}: UseCountUpOptions): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReduced) {
      setValue(end)
      return
    }

    const startTime = performance.now()

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    // Gentle spring approximation (fast rise, small overshoot, settle)
    const spring = (t: number) => {
      const s = 1.70158 + 1
      return t === 1
        ? 1
        : 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)
    }

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = easing === "spring" ? spring(t) : easeOutCubic(t)
      const current = end * eased
      setValue(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(end)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [start, end, duration, easing, decimals])

  return value
}
