"use client"

import { motion } from "framer-motion"
import {
  Cloud, Brain, Code2, Smartphone, Network, Building2, Shield, Zap, Rocket,
  ArrowRight, Atom, Server, Database, Github, Box, Terminal
} from "lucide-react"
import Link from "next/link"
import MarketingShell from "@/components/layout/MarketingShell"

/**
 * KADS TECHNOLOGIES division page (PDF p9).
 * Cyan-blue accent (#33B5FF / #0EA5E9), dark theme, central KT crystal on
 * glowing circuit/CPU base with orbiting service labels, 7 service cards,
 * tech stack chip row, bottom CTA.
 * NO fabricated metric numbers — category labels only.
 */

const CYAN = "#33B5FF"
const BLUE = "#1E6BFF"

const SERVICES = [
  { icon: Cloud,       title: "SaaS Development",      desc: "End-to-end SaaS product development with multi-tenant architecture." },
  { icon: Brain,       title: "AI / ML Solutions",     desc: "Intelligent AI solutions that automate processes and drive growth." },
  { icon: Code2,       title: "Web Applications",      desc: "Modern, responsive, and high-performance web applications." },
  { icon: Smartphone,  title: "Mobile Applications",   desc: "Cross-platform mobile apps for iOS and Android with great UX." },
  { icon: Cloud,       title: "Cloud & DevOps",        desc: "Cloud migration, DevOps automation, and infrastructure management." },
  { icon: Network,     title: "APIs & Integrations",   desc: "Seamless API development and third-party system integrations." },
  { icon: Building2,   title: "Enterprise Solutions",  desc: "Custom enterprise solutions to streamline operations and productivity." },
]

const CAPABILITIES = [
  { icon: Shield,  title: "Secure & Scalable",       desc: "Enterprise-grade security and scalability." },
  { icon: Code2,   title: "Innovative Solutions",    desc: "AI-powered, modern solutions built for the future." },
  { icon: Zap,     title: "Performance Driven",      desc: "High-performance apps for maximum impact." },
  { icon: Cloud,   title: "Cloud Native",            desc: "Built on cloud for agility and reliability." },
]

const TECH_STACK = [
  { label: "React",      icon: Atom,      color: "#61DAFB" },
  { label: "Next.js",    icon: Box,       color: "#FFFFFF" },
  { label: "TypeScript", icon: Code2,     color: "#3178C6" },
  { label: "Node.js",    icon: Server,    color: "#8CC84B" },
  { label: "Python",     icon: Terminal,  color: "#FFD43B" },
  { label: "PostgreSQL", icon: Database,  color: "#336791" },
  { label: "MongoDB",    icon: Database,  color: "#47A248" },
  { label: "AWS",        icon: Cloud,     color: "#FF9900" },
  { label: "Docker",     icon: Github,    color: "#2496ED" },
  { label: "Kubernetes", icon: Server,    color: "#326CE5" },
]

/** Glowing circuit "pedestal" for KT crystal with floating service labels. */
function KTCircuit() {
  // Service label positions around the KT core
  const satellites: { icon: any; label: string; angle: number; radius: number }[] = [
    { icon: Brain,      label: "AI / ML",           angle: -110, radius: 200 },
    { icon: Cloud,      label: "Cloud Solutions",   angle: -25,  radius: 220 },
    { icon: Code2,      label: "Web Development",   angle: -150, radius: 175 },
    { icon: Network,    label: "APIs & Integrations", angle: 15, radius: 205 },
    { icon: Smartphone, label: "Mobile Development", angle: -180, radius: 180 },
    { icon: Cloud,      label: "SaaS Development",  angle: -5,   radius: 250 },
  ]

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center">
      {/* Circuit board base */}
      <svg viewBox="0 0 500 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="circuitBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.05" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.6" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow behind crystal */}
        <ellipse cx="250" cy="200" rx="180" ry="160" fill="url(#coreGlow)" />

        {/* Circuit traces - CPU base */}
        <g stroke={CYAN} strokeOpacity="0.4" strokeWidth="1" fill="none">
          {/* CPU pads */}
          <rect x="180" y="270" width="140" height="40" rx="4" fill={`${CYAN}08`} stroke={CYAN} strokeOpacity="0.6" />
          {/* Pins */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`pin-${i}`} x1={190 + i * 14} y1="270" x2={190 + i * 14} y2="250" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`pinb-${i}`} x1={190 + i * 14} y1="310" x2={190 + i * 14} y2="330" />
          ))}
          {/* Traces going out */}
          <path d="M180,290 L100,290 L80,260 L40,260" />
          <path d="M320,290 L400,290 L430,260 L470,260" />
          <path d="M250,270 L250,220 L180,220 L180,180" />
          <path d="M250,270 L250,220 L320,220 L320,180" />
          <path d="M140,290 L140,340 L200,340 L200,380" />
          <path d="M360,290 L360,340 L300,340 L300,380" />

          {/* Node dots along traces */}
          {[
            [40, 260], [80, 260], [180, 180], [320, 180],
            [470, 260], [430, 260], [200, 380], [300, 380],
            [100, 290], [400, 290], [140, 340], [360, 340]
          ].map(([x, y], i) => (
            <g key={`node-${i}`}>
              <circle cx={x} cy={y} r="5" fill={CYAN} fillOpacity="0.25" stroke={CYAN} strokeOpacity="0.7" />
              <circle cx={x} cy={y} r="2.5" fill={CYAN}>
                <animate attributeName="opacity" values="0.4;1;0.4" dur={`${1.5 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </g>

        {/* Orbital rings */}
        <circle cx="250" cy="200" r="140" fill="none" stroke={CYAN} strokeOpacity="0.2" strokeDasharray="4 6" />
        <circle cx="250" cy="200" r="180" fill="none" stroke={BLUE} strokeOpacity="0.18" strokeDasharray="2 4" />
      </svg>

      {/* KT Crystal Core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center"
          style={{
            transform: "translateY(-20px)",
            filter: `drop-shadow(0 0 40px ${CYAN}bb)`
          }}>
          {/* Rotating glow hex */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0">
            <svg viewBox="0 0 100 115" className="w-full h-full">
              <polygon points="50,2 96,28 96,86 50,112 4,86 4,28"
                fill="none" stroke={CYAN} strokeWidth="1" strokeOpacity="0.5" />
            </svg>
          </motion.div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-tech-crystal.png" alt="KADS TECHNOLOGIES"
            className="relative w-24 h-24 sm:w-32 sm:h-32 object-contain" />
        </div>
        <p className="text-center mt-2 text-2xl sm:text-3xl font-extrabold tracking-widest text-white"
           style={{ fontFamily: "'Space Grotesk', sans-serif", transform: "translateY(-20px)" }}>
          KT
        </p>
      </motion.div>

      {/* Satellite service chips */}
      {satellites.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180
        const x = Math.cos(rad) * s.radius * 0.5
        const y = Math.sin(rad) * s.radius * 0.5
        const S = s.icon
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
            className="absolute left-1/2 top-1/2 flex items-center gap-2 px-3 py-2 rounded-lg text-white text-xs sm:text-sm font-semibold whitespace-nowrap"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              background: "linear-gradient(145deg, rgba(11,23,41,0.9), rgba(7,15,35,0.9))",
              border: `1px solid ${CYAN}55`,
              boxShadow: `0 8px 22px -8px ${CYAN}88`,
              backdropFilter: "blur(8px)"
            }}>
            <S className="w-4 h-4" style={{ color: CYAN }} />
            {s.label}
          </motion.div>
        )
      })}
    </div>
  )
}

export default function TechnologiesPage() {
  return (
    <MarketingShell>
      <main className="relative min-h-screen overflow-hidden"
        style={{
          background: `radial-gradient(1000px 600px at 60% 10%, ${CYAN}22, transparent 60%), radial-gradient(900px 500px at 10% 80%, ${BLUE}22, transparent 60%), linear-gradient(180deg, #050913 0%, #070F23 50%, #050913 100%)`
        }}>

        {/* Grid bg */}
        <div aria-hidden className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${CYAN} 1px, transparent 1px), linear-gradient(90deg, ${CYAN} 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }} />

        {/* ===== HERO ===== */}
        <section className="relative pt-28 pb-10 sm:pt-36">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
                  style={{
                    background: `${CYAN}18`,
                    border: `1px solid ${CYAN}44`
                  }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: CYAN }} />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: CYAN }}>
                    KADS TECHNOLOGIES
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5 text-white"
                  style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
                  Engineering Tomorrow.<br />
                  <span style={{ color: CYAN }}>Today.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
                  We build scalable, secure, and future-ready digital solutions powered
                  by cutting-edge technologies and innovation.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.03]"
                    style={{
                      background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
                      boxShadow: `0 12px 30px ${BLUE}66`
                    }}>
                    Explore Our Services <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/products"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:bg-white/10"
                    style={{ border: `1px solid ${CYAN}55` }}>
                    View Our Work <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                {/* Capability chips */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-2 gap-3">
                  {CAPABILITIES.map((c, i) => {
                    const C = c.icon
                    return (
                      <div key={c.title} className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: `${CYAN}18`,
                            border: `1px solid ${CYAN}44`
                          }}>
                          <C className="w-5 h-5" style={{ color: CYAN }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white leading-tight">{c.title}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.58)" }}>{c.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              </div>

              <div className="relative">
                <KTCircuit />
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES GRID ===== */}
        <section className="relative py-16">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: `linear-gradient(90deg, transparent, ${CYAN})` }} />
                <span className="text-[11px] font-semibold tracking-[0.28em] uppercase" style={{ color: CYAN }}>What We Build</span>
                <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${CYAN}, transparent)` }} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Powerful Solutions for Modern Businesses
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {SERVICES.map((s, i) => {
                const S = s.icon
                return (
                  <motion.div key={s.title}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group rounded-2xl p-5 transition-all hover:-translate-y-1.5 text-center flex flex-col items-center"
                    style={{
                      background: "linear-gradient(145deg, rgba(11,23,41,0.75), rgba(7,15,35,0.85))",
                      border: `1px solid ${CYAN}22`
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${CYAN}66`
                      e.currentTarget.style.boxShadow = `0 20px 40px -20px ${CYAN}88`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = `${CYAN}22`
                      e.currentTarget.style.boxShadow = "none"
                    }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${CYAN}22, ${BLUE}11)`,
                        border: `1px solid ${CYAN}44`
                      }}>
                      <S className="w-6 h-6" style={{ color: CYAN }} />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {s.title}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.58)" }}>{s.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== TECH STACK ROW ===== */}
        <section className="relative py-12">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl p-6 sm:p-8 mb-10"
              style={{
                background: "linear-gradient(145deg, rgba(11,23,41,0.65), rgba(7,15,35,0.8))",
                border: `1px solid ${CYAN}22`
              }}>
              <div className="text-center mb-6">
                <span className="text-[11px] font-semibold tracking-[0.28em] uppercase" style={{ color: CYAN }}>
                  Technology Stack
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {TECH_STACK.map((t, i) => {
                  const T = t.icon
                  return (
                    <motion.div key={t.label}
                      initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${t.color}33`
                      }}>
                      <T className="w-5 h-5" style={{ color: t.color }} />
                      <span className="text-sm font-semibold text-white">{t.label}</span>
                    </motion.div>
                  )
                })}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.35, delay: TECH_STACK.length * 0.05 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${CYAN}44`
                  }}>
                  <span className="text-sm font-semibold" style={{ color: CYAN }}>+ More</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Bottom CTA banner */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
              style={{
                background: `linear-gradient(135deg, ${BLUE}22, ${CYAN}15)`,
                border: `1px solid ${CYAN}44`,
                boxShadow: `0 20px 60px -20px ${CYAN}66`
              }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `radial-gradient(circle, ${CYAN}66, transparent)`,
                    border: `1px solid ${CYAN}88`,
                    boxShadow: `0 0 30px ${CYAN}44`
                  }}>
                  <Rocket className="w-6 h-6" style={{ color: "#fff" }} />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    Have an Idea? Let's Build Something Amazing Together!
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    We turn your ideas into powerful digital solutions.
                  </p>
                </div>
              </div>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm whitespace-nowrap transition-all hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(135deg, ${BLUE}, ${CYAN})`,
                  boxShadow: `0 12px 30px ${BLUE}66`
                }}>
                Start a Project <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </MarketingShell>
  )
}
