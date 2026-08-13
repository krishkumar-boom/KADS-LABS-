"use client"

import {
  Brain, Cloud, Code2, Smartphone, Globe, CloudRain, BarChart3, Cog,
  Shield, Network, ArrowRight, Rocket, Phone
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import MarketingShell from "@/components/layout/MarketingShell"

/**
 * 10 high-level service categories as shown on PDF p2.
 * Each category maps to real services we deliver (no fabricated data).
 * The "Learn More" anchor jumps to the on-page detail section for that category.
 */
const SERVICE_CATEGORIES = [
  {
    id: "ai",
    icon: Brain,
    title: "AI / ML Solutions",
    desc: "Smart AI solutions to solve complex problems and drive growth.",
    color: "#1E6BFF",
  },
  {
    id: "saas",
    icon: Cloud,
    title: "SaaS Development",
    desc: "Scalable, secure and modern SaaS products built for performance.",
    color: "#1E6BFF",
  },
  {
    id: "enterprise",
    icon: Code2,
    title: "Enterprise Software",
    desc: "Custom enterprise software for your unique business needs.",
    color: "#1E6BFF",
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "High-performance mobile apps for iOS and Android platforms.",
    color: "#1E6BFF",
  },
  {
    id: "web",
    icon: Globe,
    title: "Web Development",
    desc: "Fast, responsive and modern web applications that engage users.",
    color: "#1E6BFF",
  },
  {
    id: "cloud",
    icon: CloudRain,
    title: "Cloud Architecture",
    desc: "Secure, scalable and cost-effective cloud solutions.",
    color: "#1E6BFF",
  },
  {
    id: "marketing",
    icon: BarChart3,
    title: "Digital Marketing",
    desc: "Data-driven marketing strategies that deliver real results.",
    color: "#1E6BFF",
  },
  {
    id: "automation",
    icon: Cog,
    title: "Automation",
    desc: "Automate workflows and improve productivity across your business.",
    color: "#1E6BFF",
  },
  {
    id: "security",
    icon: Shield,
    title: "Cybersecurity",
    desc: "Protect your business with advanced security and compliance.",
    color: "#1E6BFF",
  },
  {
    id: "api",
    icon: Network,
    title: "API & Integrations",
    desc: "Robust APIs and seamless integrations to extend your capabilities.",
    color: "#1E6BFF",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const }
  })
}

export default function ServicesPage() {
  return (
    <MarketingShell>
      <main className="light relative min-h-screen"
        style={{
          background: "linear-gradient(180deg, #FAFBFE 0%, #F3F6FC 100%)",
          color: "var(--text-primary)"
        }}>

        {/* Decorative bg blobs matching PDF top-right cubes area */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
               style={{ background: "radial-gradient(closest-side, rgba(30,107,255,0.25), transparent)" }} />
          <div className="absolute top-10 left-0 w-[380px] h-[380px] rounded-full opacity-30 blur-3xl"
               style={{ background: "radial-gradient(closest-side, rgba(51,181,255,0.2), transparent)" }} />
        </div>

        {/* ===== HERO ===== */}
        <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-20">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 text-center">
            <motion.div
              initial="hidden" animate="show"
              className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(90deg, transparent, #1E6BFF)" }} />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: "#1E6BFF" }}>
                What We Do
              </span>
              <span className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(90deg, #1E6BFF, transparent)" }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
              style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
              Powerful Services. <span style={{ color: "#1E6BFF" }}>Real Results.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
              We build intelligent digital solutions that help businesses automate,
              scale, and lead in the modern world.
            </motion.p>
          </div>
        </section>

        {/* ===== 5×2 GRID ===== */}
        <section className="relative pb-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
              {SERVICE_CATEGORIES.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={s.id}
                    id={s.id}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    custom={i}
                    className="group relative rounded-2xl p-6 h-full flex flex-col transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(15,23,42,0.08)",
                      boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.05)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(30,107,255,0.18), 0 0 0 1px rgba(30,107,255,0.25)"
                      e.currentTarget.style.borderColor = "rgba(30,107,255,0.35)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.05)"
                      e.currentTarget.style.borderColor = "rgba(15,23,42,0.08)"
                    }}>
                    {/* Icon tile */}
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: "linear-gradient(135deg, rgba(30,107,255,0.12), rgba(51,181,255,0.06))",
                        border: "1px solid rgba(30,107,255,0.18)"
                      }}>
                      <Icon className="w-7 h-7" style={{ color: "#1E6BFF" }} />
                    </div>

                    <h3 className="text-lg font-bold mb-2" style={{ color: "#05070B", fontFamily: "'Space Grotesk', sans-serif" }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "rgba(5,7,11,0.62)" }}>
                      {s.desc}
                    </p>

                    <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto w-fit transition-all gap-1 group/link"
                       style={{ color: "#1E6BFF" }}>
                      Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== DARK CTA STRIP ===== */}
        <section className="relative pb-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-2xl px-6 sm:px-10 lg:px-14 py-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-6"
              style={{
                background: "linear-gradient(135deg, #05070B 0%, #08111F 60%, #0B1729 100%)",
                border: "1px solid rgba(51,181,255,0.14)",
                boxShadow: "0 30px 70px -20px rgba(0,0,0,0.5)"
              }}>
              {/* Decorative crystal glow left */}
              <div aria-hidden className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full opacity-70 blur-3xl pointer-events-none"
                   style={{ background: "radial-gradient(closest-side, rgba(30,107,255,0.45), transparent)" }} />
              <div aria-hidden className="absolute right-10 top-0 w-40 h-40 rounded-full opacity-60 blur-3xl pointer-events-none"
                   style={{ background: "radial-gradient(closest-side, rgba(51,181,255,0.35), transparent)" }} />

              {/* KL crystal badge */}
              <div className="relative z-10 hidden md:flex items-center justify-center w-24 h-24 shrink-0">
                <div className="absolute inset-0 rounded-full animate-pulse"
                     style={{ background: "radial-gradient(circle, rgba(30,107,255,0.5), transparent 70%)" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-crystal.png" alt="KADS LABS" className="relative w-20 h-20 object-contain drop-shadow-[0_0_24px_rgba(30,107,255,0.5)]" />
              </div>

              <div className="relative z-10 flex-1 text-center lg:text-left">
                <p className="text-sm sm:text-base font-medium mb-2" style={{ color: "rgba(255,255,255,0.72)" }}>
                  Ready to Transform Your Business?
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.02em] leading-tight mb-2 text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Let's Build Something Amazing Together.
                </h2>
                <p className="text-sm sm:text-base max-w-2xl" style={{ color: "rgba(255,255,255,0.65)" }}>
                  From idea to execution, we're here to turn your vision into powerful digital solutions.
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/contact"
                   className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm sm:text-base transition-all hover:scale-[1.03]"
                   style={{
                     background: "linear-gradient(135deg, #1E6BFF 0%, #33B5FF 100%)",
                     boxShadow: "0 12px 30px rgba(30,107,255,0.45)"
                   }}>
                  Start a Project <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:+918948268643"
                   className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm sm:text-base transition-all hover:bg-white/10"
                   style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
                  <Phone className="w-4 h-4" /> Schedule a Call
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </MarketingShell>
  )
}
