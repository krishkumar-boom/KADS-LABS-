"use client"

import { Mail, Phone, MapPin, Clock, Rocket, ShieldCheck, UserCheck, Send, ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import MarketingShell from "@/components/layout/MarketingShell"
import ContactForm from "@/components/premium/ContactForm"

/**
 * Contact page (PDF p7, dark).
 * Split layout: left copy + world map dots + value props; right glass form.
 * 4 contact cards (Office, Email, Call, Hours) below.
 * Verified real contact info only — no fake numbers.
 */

const TRUST_POINTS = [
  { icon: Rocket,     title: "Quick Response",  desc: "We reply within 24 hours" },
  { icon: ShieldCheck,title: "Trusted Partner", desc: "Committed to quality and confidentiality" },
  { icon: UserCheck,  title: "Tailored Solutions", desc: "Solutions designed for your success" },
]

const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: "Our Office",
    lines: ["KADS LABS Headquarters", "Deoria, Uttar Pradesh", "India - 274408"],
    href: "https://maps.google.com/?q=Deoria+Uttar+Pradesh",
    color: "#33B5FF",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["hello@kadslabs.com", "support@kadslabs.com"],
    href: "mailto:hello@kadslabs.com",
    color: "#1E6BFF",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 89482 68643", "+91 75249 79551"],
    href: "tel:+918948268643",
    color: "#33B5FF",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Sat: 10:00 AM – 7:00 PM", "Sunday: Closed"],
    href: "#",
    color: "#1E6BFF",
  },
]

/** A decorative "world map" made of scattered dots + connection glow. */
function WorldMapDots() {
  // Pseudo-random deterministic positions that *roughly* look like continents
  const dots: [number, number, number][] = [
    // North America
    [12, 28, 2], [14, 30, 1.5], [16, 32, 2], [18, 28, 1.5], [20, 30, 2], [22, 33, 1.5],
    [15, 36, 2], [18, 38, 1.5], [22, 38, 2], [24, 34, 1.5], [20, 40, 2],
    // South America
    [28, 55, 2], [30, 60, 1.5], [32, 65, 2], [30, 70, 1.5], [28, 72, 2],
    // Europe
    [48, 25, 2], [50, 28, 1.5], [52, 26, 2], [54, 30, 1.5], [50, 32, 2], [55, 28, 1.5],
    // Africa
    [50, 45, 2], [52, 50, 1.5], [54, 55, 2], [50, 58, 1.5], [52, 65, 2],
    // Asia
    [62, 30, 2], [68, 32, 2], [72, 30, 2.5], [76, 35, 2], [80, 32, 2], [70, 40, 1.5],
    [78, 38, 2], [82, 42, 2], [86, 38, 2], [65, 45, 1.5], [72, 45, 2],
    [80, 46, 1.5],
    // India (highlighted)
    [72, 48, 3],
    // SE Asia / Oceania
    [84, 55, 2], [88, 58, 1.5], [86, 62, 2], [82, 68, 1.5]
  ]

  // Connection "cities" that glow and link
  const cities: [number, number, string][] = [
    [20, 35, "#33B5FF"],   // NA
    [50, 28, "#1E6BFF"],  // EU
    [72, 48, "#33B5FF"],  // India (HQ, extra bright)
    [82, 38, "#33B5FF"],  // Asia
    [52, 55, "#1E6BFF"],  // Africa
    [30, 65, "#33B5FF"],  // SA
  ]

  return (
    <svg viewBox="0 0 100 90" className="w-full h-full absolute inset-0" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="hqGlow" cx="72%" cy="48%" r="15%">
          <stop offset="0%" stopColor="#33B5FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#33B5FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {dots.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r * 0.18} fill="#33B5FF" fillOpacity="0.45" />
      ))}
      {/* Connection lines between cities */}
      {cities.map((c1, i) =>
        cities.slice(i + 1).map((c2, j) => {
          // Only draw lines to/from HQ (3rd city, index 2) or neighboring continents for a clean look
          if (i !== 2 && j + i + 1 !== 2) return null
          return (
            <line key={`${i}-${j}`} x1={c1[0]} y1={c1[1]} x2={c2[0]} y2={c2[1]}
              stroke="#33B5FF" strokeOpacity="0.25" strokeWidth="0.15" strokeDasharray="0.6 0.4" />
          )
        })
      )}
      {/* HQ glow */}
      <circle cx="72" cy="48" r="12" fill="url(#hqGlow)" />
      {cities.map(([x, y, c], i) => (
        <g key={`c-${i}`}>
          <circle cx={x} cy={y} r="0.9" fill={c} />
          <circle cx={x} cy={y} r="1.8" fill={c} fillOpacity="0.25">
            <animate attributeName="r" values="0.9;2.4;0.9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.45;0;0.45" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  )
}

export default function ContactPage() {
  return (
    <MarketingShell>
      <main className="relative min-h-screen overflow-hidden"
        style={{
          background: "radial-gradient(900px 500px at 20% 10%, rgba(30,107,255,0.14), transparent 60%), radial-gradient(700px 400px at 85% 0%, rgba(51,181,255,0.10), transparent 60%), linear-gradient(180deg, #050913 0%, #070F23 50%, #050913 100%)",
          color: "#fff"
        }}>

        {/* Grid bg */}
        <div aria-hidden className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#33B5FF 1px, transparent 1px), linear-gradient(90deg, #33B5FF 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }} />

        {/* ===== HERO + SPLIT LAYOUT ===== */}
        <section className="relative pt-28 pb-16 sm:pt-36">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

              {/* LEFT: Copy + world map */}
              <div className="lg:col-span-6 relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 mb-6">
                  <span className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(90deg, transparent, #33B5FF)" }} />
                  <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: "#33B5FF" }}>
                    Get in Touch
                  </span>
                  <span className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(90deg, #33B5FF, transparent)" }} />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
                  style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
                  Let's Build Something <span style={{ color: "#33B5FF" }}>Extraordinary</span> Together.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Have a project in mind or want to explore how we can help your
                  business grow? We'd love to hear from you. Let's turn your ideas
                  into impactful digital solutions.
                </motion.p>

                {/* Trust points */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  {TRUST_POINTS.map((t, i) => {
                    const T = t.icon
                    return (
                      <div key={t.title} className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: "linear-gradient(135deg, rgba(30,107,255,0.22), rgba(51,181,255,0.1))",
                            border: "1.5px solid rgba(51,181,255,0.4)",
                            transform: "rotate(45deg)"
                          }}>
                          <T className="w-5 h-5" style={{ transform: "rotate(-45deg)", color: "#33B5FF" }} />
                        </div>
                        <div className="pt-0.5">
                          <p className="text-sm font-bold text-white">{t.title}</p>
                          <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.6)" }}>{t.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </motion.div>

                {/* WhatsApp CTA */}
                <motion.a
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                  href="https://wa.me/917524979551?text=Hi%20KADS%20LABS%2C%20I%27d%20like%20to%20discuss%20a%20project."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.03] mb-8"
                  style={{
                    background: "linear-gradient(135deg, #25D366, #128C7E)",
                    boxShadow: "0 10px 24px rgba(37,211,102,0.35)"
                  }}>
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </motion.a>

                {/* World map */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
                  className="relative w-full h-[220px] sm:h-[260px] rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(11,23,41,0.4), rgba(7,15,35,0.6))",
                    border: "1px solid rgba(51,181,255,0.15)"
                  }}>
                  <WorldMapDots />
                </motion.div>
              </div>

              {/* RIGHT: Form */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                className="lg:col-span-6 relative"
              >
                <div className="relative rounded-2xl p-6 sm:p-8 lg:p-10"
                  style={{
                    background: "linear-gradient(145deg, rgba(11,23,41,0.85), rgba(7,15,35,0.9))",
                    border: "1.5px solid rgba(51,181,255,0.28)",
                    boxShadow: "0 25px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(30,107,255,0.08)",
                    backdropFilter: "blur(20px)"
                  }}>
                  {/* Corner glows */}
                  <div aria-hidden className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                       style={{ background: "radial-gradient(closest-side, rgba(30,107,255,0.35), transparent)" }} />
                  <div aria-hidden className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                       style={{ background: "radial-gradient(closest-side, rgba(51,181,255,0.25), transparent)" }} />

                  <div className="relative z-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 mb-2 text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Send Us a Message <Send className="w-6 h-6" style={{ color: "#33B5FF", transform: "rotate(-30deg)" }} />
                    </h2>
                    <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.65)" }}>
                      Fill out the form and our team will get back to you.
                    </p>
                    <ContactForm />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== 4 CONTACT CARDS ===== */}
        <section className="relative pb-24">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {CONTACT_CARDS.map((c, i) => {
                const C = c.icon
                const isExternal = c.href.startsWith("http") || c.href.startsWith("mailto") || c.href.startsWith("tel")
                const Tag = isExternal ? "a" : "div"
                return (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Tag
                      href={isExternal ? c.href : undefined}
                      target={isExternal && c.href.startsWith("http") ? "_blank" : undefined}
                      rel={isExternal && c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-4 p-5 sm:p-6 rounded-2xl transition-all hover:-translate-y-1 block"
                      style={{
                        background: "linear-gradient(145deg, rgba(11,23,41,0.75), rgba(7,15,35,0.85))",
                        border: `1px solid ${c.color}33`,
                        textDecoration: "none"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = `0 18px 40px -18px ${c.color}88, 0 0 0 1px ${c.color}55`
                      }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none" }}
                    >
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${c.color}33, ${c.color}11)`,
                          border: `1.5px solid ${c.color}66`,
                          boxShadow: `0 8px 20px -8px ${c.color}88`
                        }}>
                        <C className="w-6 h-6" style={{ color: c.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white mb-1">{c.title}</h3>
                        {c.lines.map((line, idx) => (
                          <p key={idx} className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </Tag>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  )
}
