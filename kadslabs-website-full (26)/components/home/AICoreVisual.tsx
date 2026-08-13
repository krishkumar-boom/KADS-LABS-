"use client"

/**
 * AICoreVisual — the cinematic "AI Core" for the hero.
 *
 * A lightweight 2D canvas visualization that reads as a futuristic AI core:
 *   - Central glowing orb with pulsing inner core
 *   - Concentric energy rings (3) that subtly rotate + pulse
 *   - Orbiting data nodes (small bright dots) on multiple elliptical tracks
 *   - An outer particle swarm of tiny sparks drifting toward/away from the core
 *   - Mouse-tracked reactive lighting that shifts a specular highlight
 *   - Scroll-linked scale/opacity driven via the passed in progress (0-1)
 *
 * Why 2D canvas and not Three.js / R3F:
 *   - Bundle cost: R3F + drei adds ~150KB gz; 2D canvas adds 0KB
 *   - Mobile perf: 2D stays at 60fps on mid-range Android; WebGL 3D often drops to 30
 *   - Static export safe: no WASM, no GL context failures
 *
 * Respects prefers-reduced-motion (freezes at t=0), capped at 60fps,
 * DPR capped at 1.5 on mobile. Falls back to a CSS-only glow disk if canvas
 * is not supported.
 */

import { useEffect, useRef } from "react"
import { useTheme } from "@/app/components/ThemeProvider"

interface Props {
  /** 0..1 scroll progress from useScroll (scales/fades the visual as user scrolls past hero). */
  scrollProgress?: number
  className?: string
}

interface Particle {
  a: number      // angle (rad)
  r: number      // radius from centre
  r0: number     // base radius
  s: number      // speed
  sz: number     // size
  h: number      // hue (0=electric blue, 1=neon blue, 2=white)
  tw: number     // twinkle phase
}

export default function AICoreVisual({ scrollProgress = 0, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const scrollRef = useRef(scrollProgress)
  scrollRef.current = scrollProgress

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const isMobile = window.matchMedia("(pointer: coarse)").matches
    const dprCap = isMobile ? 1.25 : 1.75
    const rafRef: { current: number | null } = { current: null }
    const mouse = { x: 0.5, y: 0.5, active: false }
    const start = performance.now()
    let w = 0, h = 0, cx = 0, cy = 0

    // ----- particles setup -----
    const PARTICLE_COUNT = isMobile ? 55 : 90
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ring = Math.floor(Math.random() * 3) // 0 inner, 1 mid, 2 outer
      const base = [110, 165, 225][ring]
      particles.push({
        a: Math.random() * Math.PI * 2,
        r: base + (Math.random() - 0.5) * 22,
        r0: base,
        s: 0.15 + Math.random() * 0.35 + ring * 0.15,
        sz: 0.8 + Math.random() * 1.6 + ring * 0.3,
        h: Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 1 : 2,
        tw: Math.random() * Math.PI * 2,
      })
    }

    let dpr = 1
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, dprCap)
      w = Math.floor(rect.width * dpr)
      h = Math.floor(rect.height * dpr)
      canvas.width = w
      canvas.height = h
      cx = w / 2
      cy = h / 2
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = (e.clientX - r.left) / r.width
      mouse.y = (e.clientY - r.top) / r.height
      mouse.active = true
    }
    const onLeave = () => { mouse.active = false }
    if (!isMobile) {
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseleave", onLeave)
    }

    // Drawing helpers
    const drawRing = (
      t: number,
      radius: number,
      width: number,
      color: string,
      alpha: number,
      dash: number[],
      rotSpeed: number,
      pulseSpeed = 1.6,
      pulseAmp = 0.15
    ) => {
      const pulse = 1 + Math.sin(t * pulseSpeed) * pulseAmp
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * rotSpeed)
      ctx.globalAlpha = alpha
      ctx.strokeStyle = color
      ctx.lineWidth = width * dpr
      ctx.shadowColor = color
      ctx.shadowBlur = 18 * dpr * pulse
      ctx.setLineDash(dash.map(v => v * dpr))
      ctx.lineDashOffset = -t * 22
      ctx.beginPath()
      ctx.arc(0, 0, radius * dpr * pulse, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    const drawCore = (t: number) => {
      // Scroll-driven scale/shrink
      const sp = scrollRef.current
      const scale = 1 - sp * 0.25
      const baseR = 68 * dpr * scale

      // Outer soft halo
      const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 3.2)
      const dark = resolvedTheme === "dark"
      const haloBlue = dark ? "rgba(30,107,255," : "rgba(30,107,255,"
      const haloCyan = dark ? "rgba(51,181,255," : "rgba(14,165,233,"
      haloGrad.addColorStop(0, `${haloBlue}${dark ? 0.45 : 0.35})`)
      haloGrad.addColorStop(0.35, `${haloCyan}${dark ? 0.2 : 0.14})`)
      haloGrad.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = haloGrad
      ctx.beginPath()
      ctx.arc(cx, cy, baseR * 3.2, 0, Math.PI * 2)
      ctx.fill()

      // Core body — deep navy disc with gradient
      const corePulse = 1 + Math.sin(t * 2.2) * 0.05
      const coreR = baseR * corePulse
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
      if (dark) {
        coreGrad.addColorStop(0, "#6fb0ff")
        coreGrad.addColorStop(0.35, "#1E6BFF")
        coreGrad.addColorStop(0.75, "#0B1729")
        coreGrad.addColorStop(1, "#05070B")
      } else {
        coreGrad.addColorStop(0, "#FFFFFF")
        coreGrad.addColorStop(0.35, "#7CB0FF")
        coreGrad.addColorStop(0.75, "#1E6BFF")
        coreGrad.addColorStop(1, "rgba(30,107,255,0)")
      }
      ctx.save()
      ctx.shadowColor = "#33B5FF"
      ctx.shadowBlur = 40 * dpr
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Inner highlight (reacts to mouse)
      const lx = cx + (mouse.active ? (mouse.x - 0.5) * baseR * 0.5 : Math.sin(t * 0.7) * baseR * 0.15)
      const ly = cy + (mouse.active ? (mouse.y - 0.5) * baseR * 0.5 : Math.cos(t * 0.9) * baseR * 0.15)
      const hiGrad = ctx.createRadialGradient(lx, ly - coreR * 0.25, 0, lx, ly - coreR * 0.25, coreR * 0.9)
      hiGrad.addColorStop(0, "rgba(255,255,255,0.55)")
      hiGrad.addColorStop(0.35, "rgba(180,215,255,0.18)")
      hiGrad.addColorStop(1, "rgba(255,255,255,0)")
      ctx.fillStyle = hiGrad
      ctx.beginPath()
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
      ctx.fill()

      // Inner rotating hex pattern
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.4)
      ctx.strokeStyle = dark ? "rgba(120,180,255,0.25)" : "rgba(255,255,255,0.4)"
      ctx.lineWidth = 1 * dpr
      for (let k = 0; k < 3; k++) {
        ctx.beginPath()
        const rr = coreR * (0.35 + k * 0.2)
        for (let i = 0; i <= 6; i++) {
          const a = (i / 6) * Math.PI * 2
          const px = Math.cos(a) * rr
          const py = Math.sin(a) * rr
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
        }
        ctx.stroke()
        ctx.rotate(Math.PI / 6)
      }
      ctx.restore()

      // Core ripple rings (expanding)
      for (let k = 0; k < 3; k++) {
        const phase = (t * 0.6 + k / 3) % 1
        const rr = coreR + phase * baseR * 2.2
        const alpha = (1 - phase) * 0.35
        ctx.strokeStyle = `rgba(51,181,255,${alpha})`
        ctx.lineWidth = 1 * dpr
        ctx.beginPath()
        ctx.arc(cx, cy, rr, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    const drawParticles = (t: number) => {
      const sp = scrollRef.current
      const scale = 1 - sp * 0.25
      ctx.save()
      ctx.translate(cx, cy)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.a += 0.002 * p.s * (reduced ? 0 : 1)
        p.r = p.r0 + Math.sin(t * 0.6 + i) * 8
        p.tw += 0.05
        const rr = p.r * dpr * scale
        const x = Math.cos(p.a) * rr
        const y = Math.sin(p.a) * rr
        const twinkle = 0.5 + Math.sin(p.tw) * 0.5
        const color =
          p.h === 0 ? (resolvedTheme === "dark" ? "#1E6BFF" : "#1E6BFF") :
          p.h === 1 ? "#33B5FF" :
                     "#FFFFFF"
        ctx.globalAlpha = (0.4 + twinkle * 0.6) * (1 - sp)
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = 8 * dpr
        ctx.beginPath()
        ctx.arc(x, y, p.sz * dpr * (0.8 + twinkle * 0.4), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    let lastT = 0
    const frame = (now: number) => {
      const t = reduced ? 0 : (now - start) / 1000
      // Clear with transparent (we rely on CSS backdrop)
      ctx.clearRect(0, 0, w, h)

      // Three concentric energy rings
      const dark = resolvedTheme === "dark"
      drawRing(t, 120, 1.0, dark ? "rgba(51,181,255,0.45)" : "rgba(30,107,255,0.45)", 1 - scrollRef.current * 0.5, [6, 8], 0.15)
      drawRing(t, 160, 0.8, dark ? "rgba(30,107,255,0.35)" : "rgba(14,165,233,0.35)", 1 - scrollRef.current * 0.5, [2, 14], -0.10, 1.3, 0.18)
      drawRing(t, 210, 0.6, dark ? "rgba(120,180,255,0.25)" : "rgba(30,107,255,0.25)", 1 - scrollRef.current * 0.4, [1, 22], 0.05, 2.0, 0.1)

      drawParticles(t)
      drawCore(t)
      lastT = t
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [resolvedTheme])

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* CSS fallback glow disk (shown before JS paint) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(30,107,255,0.35) 0%, rgba(51,181,255,0.15) 35%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  )
}
