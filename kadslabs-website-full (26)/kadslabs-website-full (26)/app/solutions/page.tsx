"use client"

import {
  HeartPulse, GraduationCap, Landmark, ShoppingCart, Factory, Cloud,
  ArrowRight, CheckCircle2, MessageCircle, Users, Building2, TrendingUp, Globe
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import MarketingShell from "@/components/layout/MarketingShell"

/**
 * Solutions by Industry (PDF p3, light mode).
 * Six split-layout cards, each with:
 *   - Left: icon, title, description, checklist (real industry offering bullets)
 *   - Right: themed "image" panel using gradient + icon art (no fabricated imagery)
 *
 * NOTE: Stats row at bottom ("50+ industries", etc.) from the PDF is DESIGN-MOCK data.
 * Per user rules, we DO NOT show fake metrics — replaced with value-proposition chips.
 */
const INDUSTRIES = [
  {
    id: "healthcare",
    icon: HeartPulse,
    title: "Healthcare",
    desc: "Digital health solutions that improve patient care, streamline operations and ensure compliance.",
    bullets: [
      "Patient Management",
      "Telemedicine Solutions",
      "HIPAA Compliant Systems",
    ],
    accent: "#1E6BFF",
    bg: "linear-gradient(135deg, #0B2350 0%, #0E3A82 50%, #1E6BFF 100%)",
  },
  {
    id: "education",
    icon: GraduationCap,
    title: "Education",
    desc: "Smart learning platforms and school management systems that enhance learning experiences.",
    bullets: [
      "LMS & E-Learning",
      "Student Information System",
      "Online Exams & Assessment",
    ],
    accent: "#1E6BFF",
    bg: "linear-gradient(135deg, #0B2350 0%, #0E3A82 60%, #1E6BFF 100%)",
  },
  {
    id: "finance",
    icon: Landmark,
    title: "Financial Services",
    desc: "Secure, scalable and compliant solutions for banks, NBFCs and financial institutions.",
    bullets: [
      "Core Banking Solutions",
      "Loan Management Systems",
      "Fraud Detection & Risk Analytics",
    ],
    accent: "#1E6BFF",
    bg: "linear-gradient(135deg, #061A3D 0%, #0B2A5E 60%, #0E4A9E 100%)",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-Commerce",
    desc: "Powerful e-commerce platforms that deliver seamless shopping experiences and drive sales.",
    bullets: [
      "Custom E-Commerce Platforms",
      "Payment Gateway Integration",
      "Inventory & Order Management",
    ],
    accent: "#1E6BFF",
    bg: "linear-gradient(135deg, #1A0A2E 0%, #2B1258 60%, #4C2AA8 100%)",
  },
  {
    id: "manufacturing",
    icon: Factory,
    title: "Manufacturing",
    desc: "Industry 4.0 solutions that optimize production, reduce downtime and improve efficiency.",
    bullets: [
      "Production Management",
      "IoT & Equipment Monitoring",
      "Supply Chain Optimization",
    ],
    accent: "#1E6BFF",
    bg: "linear-gradient(135deg, #0A1628 0%, #122744 55%, #1E4A85 100%)",
  },
  {
    id: "cloud",
    icon: Cloud,
    title: "Cloud Migration",
    desc: "Migrate, modernize and manage your applications on the cloud securely and cost-effectively.",
    bullets: [
      "Cloud Strategy & Consulting",
      "Migration & Modernization",
      "Cloud Management & DevOps",
    ],
    accent: "#1E6BFF",
    bg: "linear-gradient(135deg, #05132E 0%, #0A2B66 55%, #1E6BFF 100%)",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const }
  })
}

export default function SolutionsPage() {
  return (
    <MarketingShell>
      <main className="light relative min-h-screen overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FAFBFE 0%, #F1F5FC 100%)",
          color: "var(--text-primary)"
        }}>

        {/* Decorative city skyline / bg */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-24 w-[620px] h-[620px] rounded-full opacity-40 blur-3xl"
               style={{ background: "radial-gradient(closest-side, rgba(30,107,255,0.25), transparent)" }} />
          {/* subtle dot world map on left */}
          <svg className="absolute top-24 -left-10 opacity-[0.08]" width="380" height="280" viewBox="0 0 380 280" fill="none">
            {Array.from({ length: 18 }).map((_, r) =>
              Array.from({ length: 26 }).map((_, c) => (
                <circle key={`${r}-${c}`} cx={20 + c * 14} cy={20 + r * 14} r="1.3" fill="#1E6BFF" />
              ))
            )}
          </svg>
        </div>

        {/* ===== HERO ===== */}
        <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-16">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(90deg, transparent, #1E6BFF)" }} />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: "#1E6BFF" }}>
                Solutions by Industry
              </span>
              <span className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(90deg, #1E6BFF, transparent)" }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
              style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
              Smart Solutions for <span style={{ color: "#1E6BFF" }}>Every Industry</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              We understand your industry. We build tailored digital solutions
              that solve real challenges and drive measurable growth.
            </motion.p>
          </div>
        </section>

        {/* ===== INDUSTRY SPLIT CARDS (3×2) ===== */}
        <section className="relative pb-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {INDUSTRIES.map((ind, i) => {
                const Icon = ind.icon
                return (
                  <motion.article
                    key={ind.id}
                    variants={fadeUp} initial="hidden" whileInView="show"
                    viewport={{ once: true, margin: "-60px" }} custom={i}
                    className="group relative rounded-2xl overflow-hidden flex flex-col lg:flex-row min-h-[290px] transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(15,23,42,0.08)",
                      boxShadow: "0 4px 20px rgba(16,24,40,0.06)"
                    }}>
                    {/* LEFT: Copy */}
                    <div className="relative z-10 flex-1 p-6 sm:p-7 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                             style={{
                               background: "linear-gradient(135deg, rgba(30,107,255,0.12), rgba(51,181,255,0.06))",
                               border: "1px solid rgba(30,107,255,0.18)"
                             }}>
                          <Icon className="w-6 h-6" style={{ color: "#1E6BFF" }} />
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: "#05070B", fontFamily: "'Space Grotesk', sans-serif" }}>
                          {ind.title}
                        </h3>
                      </div>

                      <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(5,7,11,0.65)" }}>
                        {ind.desc}
                      </p>

                      <ul className="space-y-2 mb-5">
                        {ind.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm" style={{ color: "rgba(5,7,11,0.78)" }}>
                            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#1E6BFF" }} />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href="/contact"
                         className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold w-fit transition-all group/link"
                         style={{ color: "#1E6BFF" }}>
                        Explore Solution <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>

                    {/* RIGHT: Visual panel (diagonal cut on desktop) */}
                    <div className="relative lg:w-[44%] min-h-[180px] lg:min-h-full overflow-hidden"
                         style={{
                           background: ind.bg,
                           clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0% 100%)"
                         }}>
                      {/* tech grid overlay */}
                      <div aria-hidden className="absolute inset-0 opacity-20"
                           style={{
                             backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                             backgroundSize: "28px 28px"
                           }} />
                      {/* glow */}
                      <div aria-hidden className="absolute inset-0"
                           style={{ background: "radial-gradient(circle at 30% 40%, rgba(51,181,255,0.45), transparent 60%)" }} />
                      {/* giant icon */}
                      <Icon className="absolute bottom-6 right-6 w-20 h-20 opacity-25" style={{ color: "#ffffff" }} strokeWidth={1.2} />
                      {/* circular arrow CTA on the seam */}
                      <div className="absolute top-1/2 -translate-y-1/2 left-[-22px] lg:left-[-22px] w-11 h-11 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-20"
                           style={{
                             background: "#1E6BFF",
                             boxShadow: "0 10px 24px rgba(30,107,255,0.45)"
                           }}>
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== BOTTOM VALUE-PROPS STRIP (replaces fake stat numbers) ===== */}
        <section className="relative pb-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 4px 24px rgba(16,24,40,0.05)"
              }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 w-full">
                {[
                  { icon: Users, label: "Tailored Strategy" },
                  { icon: Building2, label: "Enterprise-Ready" },
                  { icon: TrendingUp, label: "Growth Focused" },
                  { icon: Globe, label: "Global Delivery" },
                ].map(({ icon: I, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                         style={{
                           background: "linear-gradient(135deg, rgba(30,107,255,0.12), rgba(51,181,255,0.06))",
                           border: "1px solid rgba(30,107,255,0.18)"
                         }}>
                      <I className="w-5 h-5" style={{ color: "#1E6BFF" }} />
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#05070B" }}>{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 lg:border-l lg:pl-8 w-full lg:w-auto"
                   style={{ borderColor: "rgba(15,23,42,0.1)" }}>
                <div className="text-center lg:text-left">
                  <p className="text-sm font-semibold" style={{ color: "#05070B" }}>Don't see your industry?</p>
                  <p className="text-xs" style={{ color: "rgba(5,7,11,0.58)" }}>We build custom solutions for every business.</p>
                </div>
                <Link href="/contact"
                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white text-sm whitespace-nowrap transition-all hover:scale-[1.03]"
                   style={{
                     background: "linear-gradient(135deg, #1E6BFF 0%, #33B5FF 100%)",
                     boxShadow: "0 8px 20px rgba(30,107,255,0.35)"
                   }}>
                  Let's Talk <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </MarketingShell>
  )
}
