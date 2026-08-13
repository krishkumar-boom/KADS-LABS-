"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "./ThemeProvider"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

/**
 * Performance-friendly cursor glow:
 * - Only activates on fine-pointer (mouse) devices, desktop width
 * - Uses rAF throttling to avoid excess setState
 * - Disabled in light mode (looks off) and when reduced-motion is on
 * - Direct DOM manipulation for 60fps smoothness
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const pos = useRef({ x: -500, y: -500, tx: -500, ty: -500 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Disable on touch / small screens / reduced motion / light mode
    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    const isDesktop = window.innerWidth >= 1024
    if (!isFinePointer || !isDesktop || reduced || resolvedTheme === "light") {
      setEnabled(false)
      return
    }
    setEnabled(true)
    document.documentElement.classList.add("cursor-glow-enabled")

    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX
      pos.current.ty = e.clientY
    }
    const onLeave = () => {
      pos.current.tx = -500; pos.current.ty = -500
    }

    const tick = () => {
      // Lerp toward target for smooth trailing
      pos.current.x += (pos.current.tx - pos.current.x) * 0.18
      pos.current.y += (pos.current.ty - pos.current.y) * 0.18
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${pos.current.x - 200}px, ${pos.current.y - 200}px, 0)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x - 3}px, ${pos.current.y - 3}px, 0)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseleave", onLeave)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.documentElement.classList.remove("cursor-glow-enabled")
    }
  }, [reduced, resolvedTheme])

  if (!enabled) return null

  return (
    <>
      {/* Soft glow trail */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          width: 400,
          height: 400,
          top: 0,
          left: 0,
          background:
            "radial-gradient(circle, rgba(30,107,255,0.14) 0%, rgba(51,181,255,0.06) 35%, transparent 70%)",
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />
      {/* Tiny precise dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: 6,
          height: 6,
          top: 0,
          left: 0,
          background: "#33B5FF",
          boxShadow: "0 0 12px rgba(51,181,255,0.8), 0 0 30px rgba(30,107,255,0.5)",
          willChange: "transform",
        }}
      />
    </>
  )
}
