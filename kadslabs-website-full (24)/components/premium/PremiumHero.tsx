"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import {
  ArrowRight, Sparkles, Shield, Code2, Brain, Cloud, Smartphone, Globe, Zap, Cpu,
  Activity
} from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"
import { useTheme } from "@/app/components/ThemeProvider"
import { useMouseParallax } from "@/lib/hooks/useMouseParallax"
import dynamic from "next/dynamic"

// Lazy-load heavy visuals so hero text paints instantly.
const ShaderBackground = dynamic(
  () => import("@/components/three/ShaderBackground"),
  { ssr: false, loading: () => null }
)
// Hero AI Core: 2D canvas fallback instantly paints; 3D R3F scene loads on idle.
import HeroAICore from "@/components/home/HeroAICore"

// Floating capability chips (desktop only, positioned around the AI Core)
const FLOATING_CHIPS = [
  { icon: Brain,      label: "AI / ML",   color: "#8B5CF6", x: "4%",  y: "10%", delay: 0,   parallax: 0.5 },
  { icon: Cloud,      label: "Cloud",     color: "#1E6BFF", x: "88%", y: "14%", delay: 1.2, parallax: 0.7 },
  { icon: Smartphone, label: "Mobile",    color: "#10B981", x: "2%",  y: "68%", delay: 2.1, parallax: 0.4 },
  { icon: Code2,      label: "SaaS",      color: "#F59E0B", x: "90%", y: "60%", delay: 0.8, parallax: 0.6 },
  { icon: Globe,      label: "Web",       color: "#EC4899", x: "12%", y: "40%", delay: 1.7, parallax: 0.35 },
  { icon: Cpu,        label: "Edge",      color: "#0EA5E9", x: "82%", y: "84%", delay: 2.8, parallax: 0.55 }
]

export default function PremiumHero() {
  const reduced = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const sectionRef = useRef<HTMLElement>(null)
  const coreWrapRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Desktop mouse parallax on floating chips
  useMouseParallax(coreWrapRef, isDark ? 0.8 : 1)

  // Mouse spotlight over the hero
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false })
  useEffect(() => {
    const el = mouseRef.current; if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, active: true })
    }
    const onLeave = () => setSpot(s => ({ ...s, active: false }))
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave) }
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className={`relative min-h-[96svh] flex items-center justify-center overflow-hidden pt-28 pb-20 ${!isDark ? "hero-mesh-light" : ""}`}
      style={{
        background: isDark
          ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,107,255,0.14) 0%, transparent 60%), var(--bg-primary)"
          : "var(--bg-primary)"
      }}
    >
      {/* Noise texture overlay (premium film grain) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
      />

      {/* DARK mode ambient orbs */}
      {!reduced && isDark && (
        <>
          <div aria-hidden="true"
            className="absolute top-[8%] left-[5%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-3xl pointer-events-none animate-orb-drift-1"
            style={{ background: "radial-gradient(circle, rgba(30,107,255,0.35) 0%, rgba(30,107,255,0.1) 45%, transparent 70%)" }}
          />
          <div aria-hidden="true"
            className="absolute bottom-[5%] right-[5%] w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] rounded-full blur-3xl pointer-events-none animate-orb-drift-2"
            style={{ background: "radial-gradient(circle, rgba(51,181,255,0.28) 0%, rgba(51,181,255,0.08) 45%, transparent 70%)" }}
          />
          <div aria-hidden="true"
            className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none animate-orb-drift-3"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)" }}
          />
        </>
      )}

      {/* LIGHT mode animated blob orbs */}
      {!reduced && !isDark && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute blob-float rounded-full blur-3xl"
            style={{ top: "-10%", left: "-5%", width: 520, height: 520,
              background: "radial-gradient(circle, rgba(30,107,255,0.2) 0%, rgba(30,107,255,0.06) 40%, transparent 70%)" }} />
          <div className="absolute blob-float-2 rounded-full blur-3xl"
            style={{ bottom: "-5%", right: "-5%", width: 460, height: 460,
              background: "radial-gradient(circle, rgba(14,165,233,0.17) 0%, rgba(14,165,233,0.05) 45%, transparent 70%)" }} />
          <div className="absolute blob-float-3 rounded-full blur-3xl"
            style={{ top: "40%", right: "30%", width: 340, height: 340,
              background: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, transparent 65%)" }} />
        </div>
      )}

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-dark pointer-events-none" style={{ opacity: isDark ? 0.5 : 0.35 }} />

      {/* Vignette at edges for cinematic feel */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          opacity: isDark ? 0.5 : 0.15
        }}
      />

      {/* Shader backdrop at low opacity — dark only for performance */}
      {!reduced && isDark && <ShaderBackground opacity={0.22} />}

      {/* Mouse spotlight */}
      <div ref={mouseRef} aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: spot.active
            ? `radial-gradient(600px circle at ${spot.x}% ${spot.y}%, ${isDark ? "rgba(30,107,255,0.1)" : "rgba(30,107,255,0.14)"}, transparent 50%)`
            : "transparent",
          opacity: spot.active ? 1 : 0
        }}
      />

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="relative z-10 max-w-[1440px] mx-auto section-padding w-full"
      >
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* LEFT — Copy */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="eyebrow-pill mb-7 backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: "#33B5FF" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#33B5FF" }} />
              </span>
              {isDark ? "The Operating System of the Future" : "KADS LABS — Global Technology"}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[92px] font-bold tracking-[-0.04em] leading-[0.95] mb-5 text-balance"
              style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
            >
              Building<br />
              <span className="text-premium-gradient glow-text">Smarter Solutions.</span>
            </motion.h1>

            {/* Supporting brand line */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg sm:text-xl lg:text-2xl font-semibold mb-7 tracking-[-0.015em]"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                letterSpacing: "-0.01em"
              }}
            >
              Engineering the <span style={{ color: "#33B5FF" }}>intelligent future.</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-base sm:text-lg lg:text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-[1.7]"
              style={{ color: "var(--text-muted)" }}
            >
              KADS LABS builds AI-native platforms, enterprise SaaS, and mission-critical
              cloud infrastructure for the companies defining tomorrow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-12"
            >
              <MagneticButton
                onClick={() => scrollTo("contact-form")}
                className="btn-primary w-full sm:w-auto text-[0.95rem] px-8"
                ariaLabel="Start Your Project"
              >
                Start Your Project <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>
              <MagneticButton
                onClick={() => scrollTo("services")}
                variant="outline"
                className="w-full sm:w-auto text-[0.95rem] px-8"
                ariaLabel="Explore Services"
              >
                Explore Services
              </MagneticButton>
            </motion.div>

            {/* Capability highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="pt-7 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: "var(--text-subtle)" }}>
                Capabilities
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {[
                  "Enterprise Software",
                  "AI Solutions",
                  "SaaS Development",
                  "Cloud Architecture",
                  "Mobile Apps",
                  "Scalable Systems"
                ].map((cap, i) => (
                  <motion.span
                    key={cap}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.06 }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                    style={{
                      background: isDark ? "rgba(30,107,255,0.08)" : "rgba(30,107,255,0.06)",
                      border: `1px solid ${isDark ? "rgba(30,107,255,0.18)" : "rgba(30,107,255,0.2)"}`,
                      color: "var(--text-secondary)",
                      boxShadow: isDark ? undefined : "0 2px 8px rgba(30,107,255,0.06)"
                    }}>
                    {cap}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Cinematic AI Core visual */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center order-1 lg:order-2 min-h-[420px] sm:min-h-[540px]"
          >
            {/* Floating capability chips */}
            {!reduced && FLOATING_CHIPS.map((chip, i) => {
              const Icon = chip.icon
              return (
                <motion.div
                  key={chip.label}
                  data-parallax={chip.parallax}
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.55 + chip.delay, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden md:flex absolute items-center gap-2 px-3.5 py-2 rounded-xl z-20 pointer-events-none"
                  style={{
                    left: chip.x, top: chip.y,
                    background: isDark ? "rgba(8,17,31,0.72)" : "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: `1px solid ${isDark ? "rgba(51,181,255,0.22)" : "rgba(15,23,42,0.08)"}`,
                    boxShadow: isDark
                      ? `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${chip.color}22`
                      : `0 8px 28px ${chip.color}22, 0 2px 8px rgba(16,24,40,0.06)`,
                    animation: `float ${5 + (i % 3)}s ease-in-out ${chip.delay}s infinite`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: chip.color }} />
                  <span className="text-xs font-semibold" style={{ color: isDark ? "#E6F0FF" : "#05070B" }}>{chip.label}</span>
                </motion.div>
              )
            })}

            {/* Outer conic glow — "energy ring" */}
            {!reduced && (
              <div aria-hidden="true"
                className="absolute w-[460px] h-[460px] sm:w-[640px] sm:h-[640px] rounded-full pointer-events-none"
                style={{
                  background: isDark
                    ? "conic-gradient(from 0deg, transparent 0%, rgba(30,107,255,0.1) 15%, rgba(51,181,255,0.35) 30%, transparent 45%, transparent 55%, rgba(124,58,237,0.2) 75%, transparent 90%)"
                    : "conic-gradient(from 0deg, transparent, rgba(30,107,255,0.2), transparent 40%, rgba(124,58,237,0.14), transparent 70%, rgba(14,165,233,0.2), transparent)",
                  filter: "blur(6px)",
                  animation: "spin 30s linear infinite"
                }}
              />
            )}

            {/* Rotating dashed tech rings */}
            {!reduced && (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                  className="absolute w-[400px] h-[400px] sm:w-[540px] sm:h-[540px] rounded-full pointer-events-none"
                  style={{ border: `1px dashed ${isDark ? "rgba(51,181,255,0.2)" : "rgba(30,107,255,0.22)"}` }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                  className="absolute w-[330px] h-[330px] sm:w-[450px] sm:h-[450px] rounded-full pointer-events-none"
                  style={{ border: `1px solid ${isDark ? "rgba(30,107,255,0.15)" : "rgba(30,107,255,0.18)"}` }}
                />
                {/* Tick marks around the outer ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                  className="absolute w-[400px] h-[400px] sm:w-[540px] sm:h-[540px] pointer-events-none"
                >
                  {[...Array(36)].map((_, i) => {
                    const isMajor = i % 6 === 0
                    const radius = 270 // px
                    const isSmall = typeof window !== "undefined" && window.innerWidth < 640
                    const r = isSmall ? 200 : radius
                    return (
                      <div key={i}
                        className="absolute top-0 left-1/2 -translate-x-1/2"
                        style={{
                          width: isMajor ? 1.5 : 1,
                          height: isMajor ? 12 : 6,
                          background: isMajor
                            ? (isDark ? "rgba(51,181,255,0.7)" : "rgba(30,107,255,0.55)")
                            : (isDark ? "rgba(51,181,255,0.22)" : "rgba(30,107,255,0.22)"),
                          transformOrigin: `50% ${r}px`,
                          transform: `rotate(${i * 10}deg)`,
                          borderRadius: 1
                        }}
                      />
                    )
                  })}
                </motion.div>
              </>
            )}

            {/* AI Core — 3D R3F cinematic centrepiece (2D canvas fallback loads instantly, 3D loads on idle) */}
            <div ref={coreWrapRef} className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] z-10">
              <HeroAICore className="w-full h-full" />

              {/* Floating info chips around the core */}
              {!reduced && (
                <>
                  <motion.div
                    animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
                    className="absolute -top-2 right-0 px-3 py-1.5 rounded-xl text-xs font-semibold z-20 flex items-center gap-1.5"
                    style={{
                      background: isDark ? "rgba(8,17,31,0.75)" : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: `1px solid ${isDark ? "rgba(51,181,255,0.28)" : "rgba(30,107,255,0.18)"}`,
                      color: "#33B5FF",
                      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(30,107,255,0.12)"
                    }}
                  >
                    <Sparkles className="w-3 h-3" /> AI-Powered
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 -left-4 px-3 py-1.5 rounded-xl text-xs font-semibold z-20 flex items-center gap-1.5"
                    style={{
                      background: isDark ? "rgba(8,17,31,0.75)" : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: `1px solid ${isDark ? "rgba(30,107,255,0.28)" : "rgba(30,107,255,0.18)"}`,
                      color: "#1E6BFF",
                      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(30,107,255,0.12)"
                    }}
                  >
                    <Shield className="w-3 h-3" /> Enterprise-Grade
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 4.5, repeat: Infinity, delay: 1.8 }}
                    className="absolute top-[18%] -left-6 px-3 py-1.5 rounded-xl text-xs font-semibold z-20 flex items-center gap-1.5"
                    style={{
                      background: isDark ? "rgba(8,17,31,0.75)" : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: `1px solid ${isDark ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.2)"}`,
                      color: "#10B981",
                      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(16,185,129,0.1)"
                    }}
                  >
                    <Zap className="w-3 h-3" /> Lightning Fast
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 5.5, repeat: Infinity, delay: 2.4 }}
                    className="absolute top-[45%] -right-8 px-3 py-1.5 rounded-xl text-xs font-semibold z-20 flex items-center gap-1.5"
                    style={{
                      background: isDark ? "rgba(8,17,31,0.75)" : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: `1px solid ${isDark ? "rgba(167,139,250,0.28)" : "rgba(124,58,237,0.2)"}`,
                      color: "#A78BFA",
                      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(124,58,237,0.1)"
                    }}
                  >
                    <Activity className="w-3 h-3" /> Realtime
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -5, 0], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 4.8, repeat: Infinity, delay: 3 }}
                    className="absolute bottom-[18%] -right-4 px-3 py-1.5 rounded-xl text-xs font-semibold z-20 flex items-center gap-1.5"
                    style={{
                      background: isDark ? "rgba(8,17,31,0.75)" : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: `1px solid ${isDark ? "rgba(14,165,233,0.28)" : "rgba(14,165,233,0.2)"}`,
                      color: "#0EA5E9",
                      boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(14,165,233,0.1)"
                    }}
                  >
                    <Cloud className="w-3 h-3" /> Cloud-Native
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
