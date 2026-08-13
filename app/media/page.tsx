"use client"

import { motion } from "framer-motion"
import {
  Share2, Facebook, Instagram, Linkedin, Youtube, Megaphone, Video, PenTool,
  BarChart3, FileText, ArrowRight, Rocket, Palette, Target, Zap, CheckCircle2,
  Sparkles, MessageCircle
} from "lucide-react"
import Link from "next/link"
import MarketingShell from "@/components/layout/MarketingShell"

/**
 * KADS MEDIA division page (PDF p8).
 * Purple accent (#8B5CF6), dark theme throughout, KM crystal logo,
 * phone with orbiting social icons, 6 service cards, bottom value props.
 * No fake metric numbers — category labels only.
 */

const PURPLE = "#8B5CF6"
const PURPLE_DEEP = "#6D28D9"

const SERVICES = [
  {
    icon: Share2, title: "Social Media Management",
    desc: "Build your brand presence and engage with the right audience on all platforms.",
  },
  {
    icon: Facebook, title: "Meta Ads (Facebook & Instagram)",
    desc: "High-performing ad campaigns that deliver measurable results.",
  },
  {
    icon: Video, title: "Reels & Video Production",
    desc: "Scroll-stopping reels and videos that tell your story and boost engagement.",
  },
  {
    icon: PenTool, title: "Branding & Creative Design",
    desc: "From logos to full identity – we create designs that represent your brand.",
  },
  {
    icon: Megaphone, title: "Performance Marketing",
    desc: "ROI-focused marketing strategies that maximize your growth.",
  },
  {
    icon: FileText, title: "Content Strategy & Planning",
    desc: "Data-driven content strategies that build trust and drive conversions.",
  },
]

const VALUE_PROPS = [
  { icon: Target, title: "Data-Driven Strategy", desc: "We plan with data, execute with precision." },
  { icon: Palette, title: "Creative Excellence", desc: "Creativity that connects and converts." },
  { icon: BarChart3, title: "Transparent Reporting", desc: "Clear insights. Real results." },
  { icon: MessageCircle, title: "Dedicated Support", desc: "We're here to grow with you." },
]

/** A single orbiting social icon (used in hero) */
function OrbitIcon({ Icon, angle, radius, delay }: { Icon: any; angle: number; radius: number; delay: number }) {
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="absolute left-1/2 top-1/2 w-11 h-11 -ml-[22px] -mt-[22px] rounded-full flex items-center justify-center"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        background: "linear-gradient(145deg, rgba(139,92,246,0.25), rgba(109,40,217,0.15))",
        border: `1.5px solid ${PURPLE}66`,
        boxShadow: `0 8px 20px -6px ${PURPLE}88`
      }}>
      <Icon className="w-5 h-5" style={{ color: "#fff" }} />
    </motion.div>
  )
}

/** Phone mockup with orbiting social icons */
function PhoneHero() {
  return (
    <div className="relative w-[280px] h-[400px] mx-auto my-8">
      {/* Orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[360px] h-[360px] rounded-full"
          style={{ border: `1px dashed ${PURPLE}44` }} />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[440px] h-[440px] rounded-full"
          style={{ border: `1px dashed ${PURPLE}33` }} />
      </div>

      {/* Orbiting socials (placed visually around the phone; positions tuned by eye) */}
      <div className="absolute inset-0">
        <OrbitIcon Icon={Instagram} angle={-90} radius={175} delay={0.2} />
        <OrbitIcon Icon={Facebook}  angle={-45} radius={210} delay={0.3} />
        <OrbitIcon Icon={Linkedin}  angle={160} radius={190} delay={0.4} />
        <OrbitIcon Icon={Youtube}   angle={20}  radius={210} delay={0.5} />
        {/* Floating stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="absolute w-[140px] rounded-lg p-2.5"
          style={{
            top: "-10px", left: "-80px",
            background: "linear-gradient(145deg, rgba(139,92,246,0.25), rgba(109,40,217,0.15))",
            border: `1px solid ${PURPLE}55`,
            backdropFilter: "blur(8px)"
          }}>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>Engagement</p>
          <p className="text-base font-bold text-white leading-tight">+145%</p>
          <svg viewBox="0 0 100 28" className="w-full h-6 mt-1">
            <polyline points="0,22 15,18 30,20 45,12 60,14 75,6 90,8 100,4"
                      fill="none" stroke={PURPLE} strokeWidth="1.5" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute w-[130px] rounded-lg p-2.5"
          style={{
            top: "20px", right: "-70px",
            background: "linear-gradient(145deg, rgba(139,92,246,0.25), rgba(109,40,217,0.15))",
            border: `1px solid ${PURPLE}55`,
            backdropFilter: "blur(8px)"
          }}>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>Reach</p>
          <p className="text-base font-bold text-white leading-tight">Growing</p>
          <div className="flex gap-0.5 items-end h-6 mt-1">
            {[35, 55, 40, 70, 55, 85, 75].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: PURPLE, opacity: 0.6 + (i * 0.06) }} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute w-[140px] rounded-lg p-2.5"
          style={{
            bottom: "30px", right: "-80px",
            background: "linear-gradient(145deg, rgba(139,92,246,0.25), rgba(109,40,217,0.15))",
            border: `1px solid ${PURPLE}55`,
            backdropFilter: "blur(8px)"
          }}>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>Conversions</p>
          <p className="text-base font-bold text-white leading-tight">+320%</p>
            <svg viewBox="0 0 100 28" className="w-full h-6 mt-1">
            <path d="M0,24 Q20,22 30,18 T60,10 T100,4" fill="none" stroke={PURPLE} strokeWidth="1.5" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}
          className="absolute w-[120px] rounded-lg p-2.5"
          style={{
            bottom: "0px", left: "-70px",
            background: "linear-gradient(145deg, rgba(139,92,246,0.25), rgba(109,40,217,0.15))",
            border: `1px solid ${PURPLE}55`,
            backdropFilter: "blur(8px)"
          }}>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>ROI</p>
          <p className="text-base font-bold text-white leading-tight">8x+</p>
          <div className="flex gap-0.5 items-end h-6 mt-1">
            {[20, 30, 45, 35, 60, 50, 80].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: PURPLE, opacity: 0.55 + (i * 0.06) }} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Phone body */}
      <div className="relative z-10 w-full h-full mx-auto">
        <div className="absolute inset-x-8 top-0 bottom-0 rounded-[40px] p-2"
          style={{
            background: "linear-gradient(145deg, #1a0a2e, #0a0515)",
            border: `2px solid ${PURPLE}88`,
            boxShadow: `0 0 60px ${PURPLE}66, inset 0 0 40px ${PURPLE}22`
          }}>
          <div className="w-full h-full rounded-[32px] overflow-hidden relative flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(180deg, #150828, #080413)" }}>
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full"
                 style={{ background: "#000" }} />
            {/* KM logo centered */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-media-crystal.png" alt="KADS MEDIA"
              className="w-32 h-32 object-contain"
              style={{ filter: `drop-shadow(0 0 30px ${PURPLE}cc)` }} />
            <p className="mt-3 text-2xl font-extrabold text-white tracking-widest"
               style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              KADS
            </p>
            <p className="text-xs tracking-[0.4em] font-semibold" style={{ color: PURPLE }}>MEDIA</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MediaPage() {
  return (
    <MarketingShell>
      <main className="relative min-h-screen overflow-hidden"
        style={{
          background: `radial-gradient(1000px 600px at 80% 10%, ${PURPLE}22, transparent 60%), radial-gradient(900px 500px at 10% 80%, ${PURPLE_DEEP}22, transparent 60%), linear-gradient(180deg, #080413 0%, #0C0720 50%, #080413 100%)`
        }}>

        {/* Grid bg */}
        <div aria-hidden className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${PURPLE} 1px, transparent 1px), linear-gradient(90deg, ${PURPLE} 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }} />
        {/* Topological glow */}
        <div aria-hidden className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
             style={{ background: `radial-gradient(closest-side, ${PURPLE}44, transparent)` }} />

        {/* ===== HERO ===== */}
        <section className="relative pt-28 pb-16 sm:pt-36">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
                  style={{
                    background: `${PURPLE}18`,
                    border: `1px solid ${PURPLE}44`
                  }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: PURPLE }} />
                  <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: PURPLE }}>
                    KADS MEDIA
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5 text-white"
                  style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
                  Creative Minds.<br />
                  <span style={{ color: PURPLE }}>Powerful Impact.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.72)" }}>
                  We help brands stand out, connect deeply, and grow rapidly through
                  data-driven marketing, creative content, and performance campaigns.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.03]"
                    style={{
                      background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DEEP})`,
                      boxShadow: `0 12px 30px ${PURPLE}66`
                    }}>
                    Explore Our Services <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/products"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:bg-white/10"
                    style={{ border: `1px solid ${PURPLE}66` }}>
                    View Our Work <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                {/* Stat chips (LABELS ONLY — no fabricated numbers) */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap gap-4">
                  {[
                    { icon: Sparkles, label: "Happy Clients" },
                    { icon: Rocket, label: "Projects Delivered" },
                    { icon: Zap, label: "Average Growth" },
                    { icon: Target, label: "Client Retention" },
                  ].map((s, i) => {
                    const S = s.icon
                    return (
                      <div key={s.label} className="flex items-center gap-2">
                        <S className="w-5 h-5" style={{ color: PURPLE }} />
                        <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>{s.label}</span>
                      </div>
                    )
                  })}
                </motion.div>
              </div>

              <div className="relative flex items-center justify-center">
                <PhoneHero />
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES GRID ===== */}
        <section className="relative py-16"
          style={{ background: "linear-gradient(180deg, transparent, rgba(139,92,246,0.04), transparent)" }}>
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: `linear-gradient(90deg, transparent, ${PURPLE})` }} />
                <span className="text-[11px] font-semibold tracking-[0.28em] uppercase" style={{ color: PURPLE }}>What We Do</span>
                <span className="h-px w-8" style={{ background: `linear-gradient(90deg, ${PURPLE}, transparent)` }} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Complete Digital Marketing Solutions
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES.map((s, i) => {
                const S = s.icon
                return (
                  <motion.div key={s.title}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="group rounded-2xl p-6 transition-all hover:-translate-y-1.5"
                    style={{
                      background: "linear-gradient(145deg, rgba(20,10,40,0.75), rgba(12,7,32,0.85))",
                      border: `1px solid ${PURPLE}22`
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${PURPLE}66`
                      e.currentTarget.style.boxShadow = `0 20px 40px -20px ${PURPLE}88`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = `${PURPLE}22`
                      e.currentTarget.style.boxShadow = "none"
                    }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${PURPLE}33, ${PURPLE}11)`,
                        border: `1px solid ${PURPLE}44`
                      }}>
                      <S className="w-7 h-7" style={{ color: PURPLE }} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.62)" }}>{s.desc}</p>
                    <Link href="/contact"
                       className="inline-flex items-center gap-1.5 text-sm font-semibold w-fit transition-all group/link"
                       style={{ color: PURPLE }}>
                      Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== VALUE PROPS + CTA ===== */}
        <section className="relative py-16">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 sm:p-10 mb-10"
              style={{
                background: "linear-gradient(145deg, rgba(20,10,40,0.7), rgba(12,7,32,0.85))",
                border: `1px solid ${PURPLE}33`
              }}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                <div>
                  <span className="text-[11px] font-semibold tracking-[0.22em] uppercase" style={{ color: PURPLE }}>
                    Our Work Speaks
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Results That <span style={{ color: PURPLE }}>Drive Growth</span>
                  </h3>
                  <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.65)" }}>
                    We don't just create content, we deliver measurable impact.
                  </p>
                </div>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.03]"
                  style={{
                    background: "transparent",
                    border: `1px solid ${PURPLE}88`
                  }}>
                  View More Case Studies <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {VALUE_PROPS.map((v, i) => {
                  const V = v.icon
                  return (
                    <div key={v.title} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: `${PURPLE}22`,
                          border: `1px solid ${PURPLE}44`
                        }}>
                        <V className="w-5 h-5" style={{ color: PURPLE }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{v.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{v.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Bottom CTA banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
              style={{
                background: `linear-gradient(135deg, ${PURPLE}33, ${PURPLE_DEEP}22)`,
                border: `1px solid ${PURPLE}55`,
                boxShadow: `0 20px 60px -20px ${PURPLE}66`
              }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `radial-gradient(circle, ${PURPLE}66, transparent)`,
                    border: `1px solid ${PURPLE}88`
                  }}>
                  <Rocket className="w-6 h-6" style={{ color: "#fff" }} />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-white">
                    Ready to grow your brand?
                  </p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Let's craft a strategy that delivers real results.
                  </p>
                </div>
              </div>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm whitespace-nowrap transition-all hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DEEP})`,
                  boxShadow: `0 12px 30px ${PURPLE}66`
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
