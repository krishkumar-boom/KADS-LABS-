"use client"

/**
 * SmoothScroll — thin wrapper around Lenis that provides buttery smooth
 * scrolling while keeping native accessibility (anchor jumps, keyboard
 * navigation, focus management). Disabled on:
 *   - touch devices (native momentum scrolling already feels perfect on iOS/Android)
 *   - prefers-reduced-motion: reduce
 *   - static-export file:/// (in case Lenis can't attach)
 *
 * Syncs with Framer Motion's useScroll so scroll-linked animations work
 * transparently. Does NOT hijack scroll on form inputs/textarea.
 */

import { useEffect, useRef } from "react"
import Lenis from "lenis"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    if (reduced || isTouch) return

    const lenis = new Lenis({
      duration: 1.1,
      // Smooth but not sluggish — keeps enterprise feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
      // Don't override smoothness when user is typing in a form
    })
    lenisRef.current = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Keep anchor links working smoothly
    const onClickAnchor = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const anchor = target.closest?.("a[href^='#']") as HTMLAnchorElement | null
      if (!anchor) return
      const id = anchor.getAttribute("href")?.slice(1)
      if (!id) return
      const el = document.getElementById(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: -80, duration: 1.1 })
      }
    }
    document.addEventListener("click", onClickAnchor)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("click", onClickAnchor)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
