"use client"

import dynamic from "next/dynamic"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useMemo } from "react"
import { ArrowDown, ChevronRight, Sparkles } from "lucide-react"
import MagneticButton from "../components/MagneticButton"
import { useContent } from "../components/ContentProvider"
import HeroDashboard from "@/components/home/HeroDashboard"
import { useReducedMotion } from "@/lib/hooks/useReducedMotion"

// Lazy-load the WebGL shader (no SSR) so the initial bundle stays small.
const ShaderBackground = dynamic(
  () => import("@/components/three/ShaderBackground"),
  { ssr: false, loading: () => null }
)

// Stagger config for hero entrance
const STAGGER = 0.09          // 90ms per item
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Fade+rise helper variant generator
 */
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE }
})

export default function Hero() {
  const { content } = useContent()
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  // Parallax (disabled when reduced motion)
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Split headline into words so we can animate word-by-word
  const words = useMemo(() => {
    const raw = content.heroTitle || "Engineering the Future of Software"
    return raw.split(" ")
  }, [content.heroTitle])
  const lastWord = words[words.length - 1]
  const titleWords = words.slice(0, -1)

  const scrollToAbout = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[88svh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 sm:pb-16"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-[#070d1f] to-navy-950" />

      {/* WebGL flow-line shader — low opacity, subtle backdrop */}
      {!reduced && <ShaderBackground opacity={0.3} />}

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-[0.18] sm:opacity-25 pointer-events-none" />

      {/* Three ambient gradient orbs (drifting via CSS keyframes, transform only) */}
      {!reduced ? (
        <>
          {/* Electric blue orb */}
          <div
            aria-hidden="true"
            className="absolute top-[12%] left-[8%] w-[380px] h-[380px] sm:w-[560px] sm:h-[560px] rounded-full blur-3xl pointer-events-none will-change-transform animate-orb-drift-1"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0.12) 45%, transparent 70%)"
            }}
          />
          {/* Amethyst/purple orb */}
          <div
            aria-hidden="true"
            className="absolute bottom-[8%] right-[6%] w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] rounded-full blur-3xl pointer-events-none will-change-transform animate-orb-drift-2"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.30) 0%, rgba(168,85,247,0.10) 45%, transparent 70%)"
            }}
          />
          {/* Cyan orb */}
          <div
            aria-hidden="true"
            className="absolute top-[45%] right-[30%] w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl pointer-events-none will-change-transform animate-orb-drift-3"
            style={{
              background:
                "radial-gradient(circle, rgba(76,215,246,0.25) 0%, rgba(76,215,246,0.08) 45%, transparent 70%)"
            }}
          />
        </>
      ) : (
        // Static glow when reduced motion
        <div
          aria-hidden="true"
          className="absolute top-1/3 left-1/4 w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)"
          }}
        />
      )}

      {/* Scroll parallax container */}
      <motion.div
        style={reduced ? undefined : { y, opacity }}
        className="relative z-10 max-w-[1400px] mx-auto section-padding w-full"
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT: Copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              {...fadeUp(0.05)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-5 sm:mb-7"
              style={{
                border: "1px solid rgba(59,130,246,0.25)",
                background:
                  "linear-gradient(90deg, rgba(59,130,246,0.08), rgba(76,215,246,0.05))"
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
              </span>
              <span className="text-xs sm:text-sm text-white/80 tracking-wide">
                {content.heroSubtitle}
              </span>
            </motion.div>

            {/* Headline — word-by-word stagger */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5 sm:mb-7 text-balance">
              {titleWords.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * STAGGER, ease: EASE }}
                  className="inline-block mr-[0.28em] text-white"
                >
                  {w}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15 + titleWords.length * STAGGER,
                  ease: EASE
                }}
                className="inline-block text-gradient-blue"
              >
                {lastWord}
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              {...fadeUp(0.15 + words.length * STAGGER)}
              className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto lg:mx-0 mb-7 sm:mb-9 leading-relaxed"
            >
              {content.heroDescription}
            </motion.p>

            {/* CTA row */}
            <motion.div
              {...fadeUp(0.2 + words.length * STAGGER)}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8"
            >
              <MagneticButton
                href="#divisions"
                className="w-full sm:w-auto text-sm sm:text-base px-6 py-3"
                ariaLabel={content.heroCtaPrimary}
              >
                {content.heroCtaPrimary}
                <ChevronRight className="ml-2 w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                href="#contact"
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base px-6 py-3"
                ariaLabel={content.heroCtaSecondary}
              >
                {content.heroCtaSecondary}
              </MagneticButton>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              {...fadeUp(0.28 + words.length * STAGGER)}
              className="hidden sm:flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs sm:text-sm text-white/50"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric animate-pulse" />
                AI-First Development
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                Enterprise Architecture
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amethyst animate-pulse" />
                Global Delivery
              </span>
            </motion.div>
          </div>

          {/* RIGHT: Hero dashboard visual */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.45, ease: EASE }}
            className="relative flex items-center justify-center"
          >
            <HeroDashboard animate={!reduced} />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 1.1, duration: 0.5 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#about"
          onClick={scrollToAbout}
          className="flex flex-col items-center gap-1 sm:gap-2 text-white/40 hover:text-electric transition-colors"
          aria-label="Scroll to about section"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em]">
            Scroll
          </span>
          <motion.div
            animate={reduced ? undefined : { y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  )
}
