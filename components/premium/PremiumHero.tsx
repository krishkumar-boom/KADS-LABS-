"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { ArrowRight, Sparkles, Play, CheckCircle2, Building2, Globe, Users, Shield } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import SafeImage from "@/app/components/SafeImage"
import { useCountUp } from "@/lib/hooks/useCountUp"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"
import dynamic from "next/dynamic"

// Lazy-load the shader for hero backdrop
const ShaderBackground = dynamic(
  () => import("@/components/three/ShaderBackground"),
  { ssr: false, loading: () => null }
)

const STATS = [
  { icon: Building2, value: 250, suffix: "+", label: "Projects Delivered" },
  { icon: CheckCircle2, value: 98, suffix: "%", label: "Client Satisfaction", decimals: 0 },
  { icon: Globe, value: 20, suffix: "+", label: "Countries Served" },
  { icon: Users, value: 50, suffix: "+", label: "Expert Engineers" }
]

function StatItem({ stat, delay, reduced }: { stat: typeof STATS[0]; delay: number; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (reduced) { setInView(true); return }
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.3 })
    io.observe(el); return () => io.disconnect()
  }, [reduced])
  const n = useCountUp({ end: stat.value, start: inView, duration: 1800, easing: "ease-out", decimals: (stat as any).decimals ?? 0 })
  const Icon = stat.icon
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
           style={{ background: "rgba(30,107,255,0.1)", border: "1px solid rgba(30,107,255,0.2)" }}>
        <Icon className="w-5 h-5" style={{ color: "#33B5FF" }} />
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
          {Math.round(n)}{stat.suffix}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
      </div>
    </motion.div>
  )
}

export default function PremiumHero() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const mouseRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

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

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[92svh] flex items-center justify-center overflow-hidden pt-28 pb-20"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,107,255,0.12) 0%, transparent 60%), var(--bg-primary)" }}
    >
      {/* Ambient gradient orbs */}
      {!reduced && (
        <>
          <div aria-hidden="true"
            className="absolute top-[8%] left-[5%] w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] rounded-full blur-3xl pointer-events-none animate-orb-drift-1"
            style={{ background: "radial-gradient(circle, rgba(30,107,255,0.35) 0%, rgba(30,107,255,0.1) 45%, transparent 70%)" }}
          />
          <div aria-hidden="true"
            className="absolute bottom-[5%] right-[5%] w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] rounded-full blur-3xl pointer-events-none animate-orb-drift-2"
            style={{ background: "radial-gradient(circle, rgba(51,181,255,0.25) 0%, rgba(51,181,255,0.08) 45%, transparent 70%)" }}
          />
        </>
      )}

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-dark pointer-events-none" style={{ opacity: 0.5 }} />

      {/* Shader backdrop at low opacity */}
      {!reduced && <ShaderBackground opacity={0.15} />}

      {/* Mouse spotlight */}
      <div
        ref={mouseRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: spot.active
            ? `radial-gradient(600px circle at ${spot.x}% ${spot.y}%, rgba(30,107,255,0.08), transparent 50%)`
            : "transparent",
          opacity: spot.active ? 1 : 0
        }}
      />

      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="relative z-10 max-w-[1400px] mx-auto section-padding w-full"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT — Copy */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="eyebrow-pill mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: "#33B5FF" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#33B5FF" }} />
              </span>
              KADS LABS Global Enterprise
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22,1,0.36,1] }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[80px] font-bold tracking-[-0.03em] leading-[1.02] mb-6 text-balance"
              style={{ color: "var(--text-primary)" }}
            >
              Innovate Today.<br />
              <span className="text-brand-gradient glow-text">Transform Tomorrow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              We build next-gen digital products, enterprise software, and intelligent solutions that drive growth and transformation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10"
            >
              <MagneticButton
                onClick={() => scrollTo("services")}
                className="btn-primary w-full sm:w-auto text-[0.95rem] px-7"
                ariaLabel="Explore Solutions"
              >
                Explore Solutions <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>
              <MagneticButton
                onClick={() => scrollTo("contact")}
                variant="outline"
                className="w-full sm:w-auto text-[0.95rem] px-7"
                ariaLabel="Book a Demo"
              >
                <Play className="w-4 h-4 mr-1 fill-current" /> Book a Demo
              </MagneticButton>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 pt-6 border-t"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {STATS.map((s, i) => (
                <StatItem key={s.label} stat={s} delay={0.7 + i * 0.08} reduced={reduced} />
              ))}
            </motion.div>
          </div>

          {/* RIGHT — 3D Logo Visual */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22,1,0.36,1] }}
            className="relative flex items-center justify-center order-1 lg:order-2"
          >
            {/* Outer glow rings */}
            <div aria-hidden="true" className="absolute w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full pointer-events-none"
                 style={{ background: "conic-gradient(from 0deg, transparent, rgba(30,107,255,0.15), transparent 30%, transparent 60%, rgba(51,181,255,0.15), transparent)" }} />

            {/* Rotating tech ring */}
            {!reduced && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none"
                style={{ border: "1px dashed rgba(51,181,255,0.15)" }}
              />
            )}
            {!reduced && (
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full pointer-events-none"
                style={{ border: "1px solid rgba(30,107,255,0.12)" }}
              />
            )}

            {/* Main logo with holographic platform */}
            <div className="relative w-[300px] h-[340px] sm:w-[400px] sm:h-[440px] flex items-center justify-center">
              {/* Glow base */}
              <div aria-hidden="true"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[240px] h-[60px] sm:w-[320px] sm:h-[80px] rounded-full blur-2xl"
                style={{ background: "radial-gradient(ellipse, rgba(30,107,255,0.5) 0%, rgba(51,181,255,0.25) 40%, transparent 70%)" }}
              />
              {/* Platform disc */}
              <div aria-hidden="true"
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] rounded-full"
                style={{
                  background: "radial-gradient(ellipse at center top, rgba(30,107,255,0.25) 0%, rgba(8,17,31,0.9) 60%, transparent 80%)",
                  border: "1px solid rgba(51,181,255,0.2)"
                }}
              />
              {/* Rotating inner ring */}
              {!reduced && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full"
                  style={{ border: "1px dashed rgba(51,181,255,0.3)" }}
                />
              )}

              {/* The diamond K logo — floating */}
              <motion.div
                animate={reduced ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] z-10"
                style={{ filter: "drop-shadow(0 20px 60px rgba(30,107,255,0.4)) drop-shadow(0 0 80px rgba(51,181,255,0.3))" }}
              >
                <SafeImage
                  src="./logo.png"
                  alt="KADS LABS"
                  fill
                  containerClassName="w-full h-full"
                  className="object-contain"
                  priority
                />
              </motion.div>

              {/* Floating tech chips */}
              {!reduced && (
                <>
                  <motion.div
                    animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-4 right-0 px-3 py-1.5 rounded-lg glass text-xs font-medium"
                    style={{ color: "#33B5FF" }}
                  >
                    <Sparkles className="w-3 h-3 inline mr-1" /> AI-Powered
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-24 left-0 px-3 py-1.5 rounded-lg glass text-xs font-medium"
                    style={{ color: "#1E6BFF" }}
                  >
                    <Shield className="w-3 h-3 inline mr-1" /> Enterprise-Grade
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
