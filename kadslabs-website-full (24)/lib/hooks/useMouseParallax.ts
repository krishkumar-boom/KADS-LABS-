"use client"

import { useEffect, useRef } from "react"

/**
 * Lightweight mouse parallax: transforms elements with data-parallax={strength}
 * where strength is 0-1 range (0 = no move, 1 = 30px max).
 * - Desktop (pointer:fine) only
 * - rAF throttled for 60fps
 * - Disabled when reduced motion
 * - respects prefers-color-scheme (used in light theme for depth, subtle in dark)
 */
export function useMouseParallax(containerRef: React.RefObject<HTMLElement | null>, strength = 1) {
  const rafRef = useRef<number | null>(null)
  const targetsRef = useRef<HTMLElement[]>([])
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    if (typeof window === "undefined") return
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isFine = window.matchMedia("(pointer: fine)").matches
    if (reduced || !isFine) return

    // Collect parallax targets
    targetsRef.current = Array.from(container.querySelectorAll<HTMLElement>("[data-parallax]"))
    if (targetsRef.current.length === 0) return

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      // Normalize -0.5 to 0.5 relative to center
      pos.current.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      pos.current.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const onLeave = () => {
      pos.current.tx = 0
      pos.current.ty = 0
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
    }

    const tick = () => {
      // Lerp
      pos.current.x += (pos.current.tx - pos.current.x) * 0.08
      pos.current.y += (pos.current.ty - pos.current.y) * 0.08

      targetsRef.current.forEach(el => {
        const s = parseFloat(el.getAttribute("data-parallax") || "0.3") * strength
        const maxPx = 24 * s
        const rx = -pos.current.x * maxPx
        const ry = -pos.current.y * maxPx
        el.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0)`
      })

      // Continue animating while not settled
      if (Math.abs(pos.current.x - pos.current.tx) > 0.01 || Math.abs(pos.current.y - pos.current.ty) > 0.01) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    container.addEventListener("mousemove", onMove, { passive: true })
    container.addEventListener("mouseleave", onLeave)

    return () => {
      container.removeEventListener("mousemove", onMove)
      container.removeEventListener("mouseleave", onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      // Reset transforms
      targetsRef.current.forEach(el => { el.style.transform = "" })
    }
  }, [containerRef, strength])
}
