"use client"

/**
 * HeroAICore — progressive-enhancement wrapper for the cinematic 3D AI core.
 *
 * 1. Instantly paints the 2D canvas fallback so the user sees the hero visual
 *    on first frame (zero JS waterfall).
 * 2. After first idle, swaps in the React Three Fiber scene (fades over 700ms).
 * 3. 3D is completely skipped on: reduced-motion, small touch devices (phones),
 *    SSR, and during static export (r3f is imported dynamically so the heavy
 *    bundle doesn't land on those devices).
 */

import { Suspense, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

// 2D canvas fallback (instant, tiny)
import AICoreVisual from "./AICoreVisual"

// 3D scene (chunked, loaded on idle)
const AICoreScene = dynamic(() => import("@/components/three/AICoreScene"), {
  ssr: false,
  loading: () => null,
})

export default function HeroAICore({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion()
  const [enable3D, setEnable3D] = useState(false)

  useEffect(() => {
    if (reduced) return
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    const isSmall = window.innerWidth < 768
    if (isTouch && isSmall) return // low-end phone → 2D fallback is plenty
    const idle = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 150))
    const handle = idle(() => setEnable3D(true))
    return () => {
      if ((window as any).cancelIdleCallback) (window as any).cancelIdleCallback(handle)
      else clearTimeout(handle)
    }
  }, [reduced])

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* 2D fallback (always there) */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: enable3D ? 0 : 1, zIndex: 2 }}
      >
        <AICoreVisual className="w-full h-full" />
      </div>
      {/* 3D scene (fades in when loaded) */}
      {enable3D && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ zIndex: 3 }}
        >
          <Suspense fallback={null}>
            <AICoreScene />
          </Suspense>
        </div>
      )}
    </div>
  )
}
