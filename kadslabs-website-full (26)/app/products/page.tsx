"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard, HeartPulse, GraduationCap, ShoppingCart, Cloud,
  ArrowRight, Search, ShieldCheck, Rocket, PlugZap, BarChart3, MessageCircle
} from "lucide-react"
import Link from "next/link"
import MarketingShell from "@/components/layout/MarketingShell"

/**
 * Products page (PDF p5, dark).
 * Enterprise-grade product platforms with colored accent per category.
 * No fabricated revenue/project numbers — "mockup" is a stylized abstract dashboard UI, not fake data.
 */
type Product = {
  id: string
  icon: any
  name: string
  category: string
  desc: string
  color: string
  tag: string
  features: string[]
}

const PRODUCTS: Product[] = [
  {
    id: "enterprise",
    icon: LayoutDashboard,
    name: "Enterprise Solution Platform",
    category: "Enterprise",
    desc: "A unified platform to manage operations, customers, teams, projects, billing and analytics.",
    color: "#A855F7", // purple
    tag: "Enterprise",
    features: ["Role Based Access", "Real-time Analytics", "Multi-tenant"],
  },
  {
    id: "healthcare",
    icon: HeartPulse,
    name: "Healthcare Management System",
    category: "Healthcare",
    desc: "Smart and secure healthcare platform to streamline patient care, appointments and clinic operations.",
    color: "#1E6BFF", // blue
    tag: "Healthcare",
    features: ["Patient Management", "Appointments", "e-Prescriptions"],
  },
  {
    id: "education",
    icon: GraduationCap,
    name: "Education Management System",
    category: "Education",
    desc: "Complete school/college management system for better learning and administration.",
    color: "#10B981", // green
    tag: "Education",
    features: ["LMS", "Exams & Results", "Student Portal"],
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    name: "E-Commerce Platform",
    category: "E-Commerce",
    desc: "Scalable e-commerce solution to build, manage and grow your online business.",
    color: "#F59E0B", // orange
    tag: "E-Commerce",
    features: ["Product Management", "Payments", "Analytics"],
  },
  {
    id: "cloudops",
    icon: Cloud,
    name: "Cloud Management Platform",
    category: "Cloud",
    desc: "Manage, monitor and optimize your cloud infrastructure with ease.",
    color: "#33B5FF", // cyan
    tag: "CloudOps",
    features: ["Cloud Monitoring", "Auto Scaling", "Cost Optimization"],
  },
]

const CATEGORIES = ["All Products", "Enterprise", "Healthcare", "Education", "E-Commerce", "Cloud"]

const VALUE_PROPS = [
  { icon: ShieldCheck, title: "Secure & Reliable", desc: "Enterprise-grade security and 99.9% uptime guarantee." },
  { icon: Rocket, title: "Scalable & Flexible", desc: "Built to scale with your business needs and future growth." },
  { icon: PlugZap, title: "Seamless Integration", desc: "Easy integration with third-party tools, APIs, and existing workflows." },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Make data-driven decisions with powerful real-time insights." },
]

/** Abstract "mockup" window drawn entirely in CSS/SVG (no fake data values shown) */
function ProductMockup({ product }: { product: Product }) {
  const { color } = product
  const isMobile = product.id === "healthcare" || product.id === "ecommerce"
  return (
    <div className="relative h-[220px] w-full overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.25) 100%)",
        borderBottom: `1px solid ${color}33`,
      }}>
      {/* Grid overlay */}
      <div aria-hidden className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(${color}40 1px, transparent 1px), linear-gradient(90deg, ${color}40 1px, transparent 1px)`,
          backgroundSize: "22px 22px"
        }} />
      {/* Glow orb */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 40%, ${color}33, transparent 60%)` }} />

      {isMobile ? (
        // Phone-shaped mockup
        <div className="relative z-10 w-[120px] h-[200px] rounded-[24px] p-2"
          style={{
            background: "linear-gradient(180deg, #0B1729, #05070B)",
            border: `2px solid ${color}66`,
            boxShadow: `0 20px 40px -10px ${color}55, inset 0 0 30px ${color}22`
          }}>
          <div className="w-full h-full rounded-[18px] overflow-hidden flex flex-col"
            style={{ background: "rgba(5,7,11,0.85)" }}>
            <div className="h-5 flex items-center justify-center">
              <div className="w-12 h-1 rounded-full" style={{ background: `${color}88` }} />
            </div>
            <div className="flex-1 p-2 space-y-1.5">
              <div className="h-5 rounded" style={{ background: `${color}44` }} />
              <div className="grid grid-cols-3 gap-1 pt-1">
                <div className="h-8 rounded" style={{ background: `${color}33` }} />
                <div className="h-8 rounded" style={{ background: `${color}28` }} />
                <div className="h-8 rounded" style={{ background: `${color}40` }} />
              </div>
              <div className="h-12 rounded mt-1" style={{ background: `linear-gradient(90deg, ${color}55, ${color}22)` }} />
              <div className="space-y-1 pt-1">
                <div className="h-2 rounded-full" style={{ background: `${color}33`, width: "80%" }} />
                <div className="h-2 rounded-full" style={{ background: `${color}22`, width: "60%" }} />
                <div className="h-2 rounded-full" style={{ background: `${color}33`, width: "70%" }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Browser/dashboard mockup
        <div className="relative z-10 w-[90%] h-[168px] rounded-lg overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #0B1729, #05070B)",
            border: `1px solid ${color}44`,
            boxShadow: `0 15px 40px -10px ${color}44`
          }}>
          {/* Top bar */}
          <div className="h-5 flex items-center gap-1 px-2" style={{ background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${color}33` }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
          </div>
          <div className="p-2.5 flex gap-2 h-[calc(100%-20px)]">
            {/* Sidebar strip */}
            <div className="w-6 h-full flex flex-col gap-1.5 pt-1 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-full h-2 rounded" style={{ background: i === 0 ? `${color}99` : `${color}22` }} />
              ))}
            </div>
            {/* Main content */}
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex gap-1.5">
                <div className="h-8 rounded flex-1" style={{ background: `${color}33` }} />
                <div className="h-8 rounded flex-1" style={{ background: `${color}22` }} />
                <div className="h-8 rounded flex-1" style={{ background: `${color}28` }} />
              </div>
              {/* Chart */}
              <div className="flex-1 rounded flex items-end gap-1 px-1 pb-1" style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                {[30, 50, 40, 65, 55, 75, 60, 85, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t"
                    style={{ height: `${h}%`, background: `linear-gradient(180deg, ${color}CC, ${color}55)` }} />
                ))}
              </div>
              <div className="flex gap-1.5">
                <div className="h-6 rounded flex-1" style={{ background: `${color}22` }} />
                <div className="h-6 rounded flex-1" style={{ background: `${color}18` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  const [active, setActive] = useState("All Products")
  const [q, setQ] = useState("")

  const filtered = PRODUCTS.filter(p => {
    const catOk = active === "All Products" || p.category === active
    const qOk = !q.trim() || (p.name + p.desc + p.category).toLowerCase().includes(q.toLowerCase())
    return catOk && qOk
  })

  return (
    <MarketingShell>
      <main className="relative min-h-screen overflow-hidden"
        style={{
          background: "radial-gradient(900px 500px at 20% 0%, rgba(30,107,255,0.14), transparent 60%), radial-gradient(700px 400px at 90% 10%, rgba(168,85,247,0.10), transparent 60%), #05070B",
          color: "#fff"
        }}>

        {/* Grid bg */}
        <div aria-hidden className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(#33B5FF 1px, transparent 1px), linear-gradient(90deg, #33B5FF 1px, transparent 1px)",
            backgroundSize: "56px 56px"
          }} />

        {/* ===== HERO ===== */}
        <section className="relative pt-28 pb-10 sm:pt-36 sm:pb-14">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(90deg, transparent, #33B5FF)" }} />
              <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: "#33B5FF" }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "#33B5FF", boxShadow: "0 0 8px #33B5FF" }} />
                Our Products &amp; Solutions
              </span>
              <span className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(90deg, #33B5FF, transparent)" }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5"
              style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
              Powerful Platforms. <span style={{ color: "#33B5FF" }}>Measurable Impact.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              Enterprise-grade products and platforms designed to solve real-world
              problems and accelerate business growth.
            </motion.p>

            {/* Filter + search bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="inline-flex p-1 rounded-xl"
                style={{ background: "rgba(11,23,41,0.75)", border: "1px solid rgba(51,181,255,0.18)" }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setActive(c)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
                    style={{
                      background: active === c ? "linear-gradient(135deg, #1E6BFF, #33B5FF)" : "transparent",
                      color: active === c ? "#fff" : "rgba(255,255,255,0.65)",
                      boxShadow: active === c ? "0 6px 16px rgba(30,107,255,0.4)" : "none"
                    }}>
                    {c === "All Products" && <span className="mr-1.5">▦</span>}
                    {c === "By Category" && <span className="mr-1.5">▤</span>}
                    {c}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.45)" }} />
                <input value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm text-white placeholder:text-white/40 outline-none transition-all"
                  style={{
                    background: "rgba(11,23,41,0.75)",
                    border: "1px solid rgba(51,181,255,0.18)"
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(51,181,255,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)" }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(51,181,255,0.18)"; e.currentTarget.style.boxShadow = "none" }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== PRODUCT GRID ===== */}
        <section className="relative pb-20">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Our Product Platforms
              </h2>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{filtered.length} platform{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {filtered.map((p, i) => {
                const Icon = p.icon
                return (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1.5"
                    style={{
                      background: "linear-gradient(180deg, rgba(11,23,41,0.9), rgba(5,7,11,0.95))",
                      border: `1px solid ${p.color}33`,
                      boxShadow: `0 10px 30px -10px ${p.color}33`
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = `0 25px 50px -15px ${p.color}66, 0 0 0 1px ${p.color}55`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = `0 10px 30px -10px ${p.color}33`
                    }}>
                    <ProductMockup product={p} />

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{
                            background: `${p.color}22`,
                            border: `1px solid ${p.color}44`
                          }}>
                          <Icon className="w-5 h-5" style={{ color: p.color }} />
                        </div>
                        <h3 className="text-base font-bold flex-1 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {p.name}
                        </h3>
                      </div>

                      <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: "rgba(255,255,255,0.62)" }}>
                        {p.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.features.map(f => (
                          <span key={f} className="text-[10px] font-semibold px-2 py-1 rounded-md"
                            style={{
                              color: p.color,
                              background: `${p.color}18`,
                              border: `1px solid ${p.color}33`
                            }}>{f}</span>
                        ))}
                      </div>

                      <Link href="/contact"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold w-fit transition-all group/link"
                        style={{ color: p.color }}>
                        Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </motion.article>
                )
              })}

              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 rounded-xl"
                  style={{ background: "rgba(11,23,41,0.5)", border: "1px solid rgba(51,181,255,0.15)" }}>
                  <p className="text-white/70">No products match your search.</p>
                </div>
              )}
            </div>

            {/* Value props + custom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="mt-14 rounded-2xl overflow-hidden flex flex-col lg:flex-row"
              style={{
                background: "linear-gradient(135deg, rgba(11,23,41,0.85), rgba(8,17,31,0.95))",
                border: "1px solid rgba(51,181,255,0.2)"
              }}>
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                {VALUE_PROPS.map(v => {
                  const V = v.icon
                  return (
                    <div key={v.title} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(30,107,255,0.18)",
                          border: "1px solid rgba(51,181,255,0.3)"
                        }}>
                        <V className="w-5 h-5" style={{ color: "#33B5FF" }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{v.title}</p>
                        <p className="text-xs leading-relaxed mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{v.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="relative p-6 sm:p-8 lg:w-[360px] shrink-0 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(30,107,255,0.18), rgba(51,181,255,0.08))",
                  borderLeft: "1px solid rgba(51,181,255,0.25)"
                }}>
                <div aria-hidden className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                     style={{ background: "radial-gradient(closest-side, rgba(30,107,255,0.5), transparent)" }} />
                {/* Network dots decoration */}
                <svg className="absolute right-4 top-4 opacity-40" width="160" height="120" viewBox="0 0 160 120" fill="none">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <circle key={i} cx={20 + (i*17) % 140} cy={20 + (i*23) % 90} r="2" fill="#33B5FF" />
                  ))}
                  <line x1="30" y1="30" x2="120" y2="60" stroke="#33B5FF" strokeOpacity="0.4" strokeWidth="0.5" />
                  <line x1="60" y1="80" x2="130" y2="30" stroke="#33B5FF" strokeOpacity="0.4" strokeWidth="0.5" />
                </svg>
                <h3 className="relative z-10 text-lg sm:text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Have a Unique Requirement?
                </h3>
                <p className="relative z-10 text-sm mb-5" style={{ color: "rgba(255,255,255,0.7)" }}>
                  We build custom solutions tailored to your business needs.
                </p>
                <Link href="/contact"
                  className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.03]"
                  style={{
                    background: "linear-gradient(135deg, #1E6BFF, #33B5FF)",
                    boxShadow: "0 10px 24px rgba(30,107,255,0.45)"
                  }}>
                  Request a Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </MarketingShell>
  )
}
