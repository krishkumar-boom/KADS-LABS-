"use client"

import { motion } from "framer-motion"
import {
  Brain, Code2, Cloud, Smartphone, Shield, Cog, Database, Network,
  BarChart3, Server, Layout, Terminal, Bot, Boxes, Github, Workflow,
  ArrowRight, PlayCircle, Rocket
} from "lucide-react"
import Link from "next/link"

/**
 * Technology Ecosystem — dark section matching PDF p4.
 * Central KL crystal hex with 8 surrounding hexagonal nodes connected by glowing lines.
 * Right-side "Our Tech Stack" panel with 6 categories.
 *
 * NOTE: Bottom metric row ("50+ Technologies", "300+ Projects", "99.9% Uptime", etc.)
 * is design-mock / aspirational copy. We show *category* labels without fabricated counts.
 */

const HEX_NODES = [
  { id: "ai",      icon: Brain,    label: "AI / ML",      desc: "Intelligent Solutions for Smarter Decisions", angle: -90 },
  { id: "saas",    icon: Boxes,    label: "SaaS",         desc: "Scalable SaaS Products for Every Business",  angle: -45 },
  { id: "cloud",   icon: Cloud,    label: "Cloud",        desc: "Cloud-Native Solutions & Infrastructure",     angle:   0 },
  { id: "mobile",  icon: Smartphone, label: "Mobile",     desc: "Cross-Platform Mobile Applications",          angle:  45 },
  { id: "security",icon: Shield,   label: "Security",     desc: "Advanced Security for Enterprise Protection", angle:  90 },
  { id: "auto",    icon: Cog,      label: "Automation",   desc: "Process Automation for Higher Efficiency",    angle: 135 },
  { id: "data",    icon: Database, label: "Data",         desc: "Data Engineering, Analytics & Insights",      angle: 180 },
  { id: "apis",    icon: Network,  label: "APIs",         desc: "Robust APIs for Seamless Integration",        angle: 225 },
]

const TECH_STACK = [
  {
    icon: Layout, title: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    icon: Server, title: "Backend",
    items: ["Node.js", "Python", "NestJS", "Express.js"],
  },
  {
    icon: Database, title: "Database",
    items: ["PostgreSQL", "MongoDB", "Redis"],
  },
  {
    icon: Cloud, title: "Cloud",
    items: ["AWS", "Google Cloud", "Azure", "Supabase"],
  },
  {
    icon: Github, title: "DevOps",
    items: ["Docker", "Kubernetes", "CI/CD", "GitHub Actions"],
  },
  {
    icon: Bot, title: "AI / Data",
    items: ["TensorFlow", "PyTorch", "LangChain", "OpenAI"],
  },
]

const VALUE_PROPS = [
  { icon: Brain,    title: "AI-Powered Intelligence", desc: "Machine Learning, Deep Learning, NLP and Computer Vision solutions." },
  { icon: Cloud,    title: "Cloud-Native Architecture", desc: "Scalable, secure and resilient applications built on modern cloud platforms." },
  { icon: Shield,   title: "Secure & Compliant", desc: "Enterprise-grade security with compliance to global standards." },
  { icon: Workflow, title: "Built for Performance", desc: "High-performance systems designed for speed, reliability and scale." },
]

function HexNode({ angle, icon: Icon, label, desc, delay }: any) {
  // Position on a circle of radius R (in %)
  const R = 42
  const rad = (angle * Math.PI) / 180
  const x = 50 + R * Math.cos(rad)
  const y = 50 + R * Math.sin(rad)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 text-center group"
      style={{ left: `${x}%`, top: `${y}%`, width: "120px" }}>
      {/* Hexagon */}
      <div className="relative mx-auto w-[82px] h-[94px] mb-2 transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(30,107,255,0.45)]">
          <defs>
            <linearGradient id={`hexgrad-${label}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(30,107,255,0.25)" />
              <stop offset="100%" stopColor="rgba(51,181,255,0.08)" />
            </linearGradient>
          </defs>
          <polygon points="50,2 96,28 96,86 50,112 4,86 4,28"
                   fill={`url(#hexgrad-${label})`}
                   stroke="rgba(51,181,255,0.55)" strokeWidth="1.5" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-8 h-8" style={{ color: "#33B5FF" }} strokeWidth={1.5} />
        </div>
      </div>
      <p className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{label}</p>
      <p className="text-[11px] leading-tight mt-0.5 max-w-[130px] mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>{desc}</p>
    </motion.div>
  )
}

export default function TechEcosystem() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        background: "radial-gradient(1100px 600px at 30% 20%, rgba(30,107,255,0.10), transparent 60%), radial-gradient(900px 500px at 80% 80%, rgba(51,181,255,0.08), transparent 60%), #05070B"
      }}>

      {/* Grid bg */}
      <div aria-hidden className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(rgba(51,181,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(51,181,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* Top grid: copy + hex + tech stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

          {/* LEFT: Copy */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase mb-5"
                style={{
                  background: "rgba(30,107,255,0.12)",
                  border: "1px solid rgba(30,107,255,0.35)",
                  color: "#33B5FF"
                }}>
                Our Technology Ecosystem
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5 text-white"
                style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
                Technology That <br /><span style={{ color: "#33B5FF" }}>Powers Innovation</span>
              </h2>
              <p className="text-lg font-medium mb-3" style={{ color: "rgba(255,255,255,0.85)" }}>
                Integrated. Intelligent. Impactful.
              </p>
              <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.62)" }}>
                Our technology ecosystem brings together cutting-edge tools and
                frameworks to build scalable, secure and future-ready solutions.
              </p>

              {/* Value props list */}
              <ul className="space-y-4 mb-8">
                {VALUE_PROPS.map((v, i) => {
                  const V = v.icon
                  return (
                    <motion.li key={v.title}
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                      className="flex items-start gap-3 pb-3"
                      style={{ borderBottom: i < VALUE_PROPS.length - 1 ? "1px dashed rgba(51,181,255,0.15)" : "none" }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: "linear-gradient(135deg, rgba(30,107,255,0.22), rgba(51,181,255,0.08))",
                          border: "1px solid rgba(51,181,255,0.3)"
                        }}>
                        <V className="w-5 h-5" style={{ color: "#33B5FF" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{v.title}</p>
                        <p className="text-xs leading-relaxed mt-0.5" style={{ color: "rgba(255,255,255,0.58)" }}>{v.desc}</p>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>

              <Link href="/technologies"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.03]"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(51,181,255,0.4)",
                  boxShadow: "0 0 24px rgba(51,181,255,0.15)"
                }}>
                <PlayCircle className="w-4 h-4" style={{ color: "#33B5FF" }} /> Explore Our Technology
              </Link>
            </motion.div>
          </div>

          {/* CENTER: Hex galaxy */}
          <div className="lg:col-span-6">
            <div className="relative w-full mx-auto" style={{ aspectRatio: "1 / 1", maxWidth: "620px" }}>
              {/* Orbit rings */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
                <defs>
                  <radialGradient id="orbitGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="70%" stopColor="rgba(30,107,255,0)" />
                    <stop offset="100%" stopColor="rgba(51,181,255,0.35)" />
                  </radialGradient>
                </defs>
                <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(51,181,255,0.18)" strokeWidth="1" strokeDasharray="3 4" />
                <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(51,181,255,0.25)" strokeWidth="1" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(30,107,255,0.4)" strokeWidth="1" />
                {/* Connection lines from center to each node */}
                {HEX_NODES.map((n) => {
                  const R = 160
                  const rad = (n.angle * Math.PI) / 180
                  const x = 200 + R * Math.cos(rad)
                  const y = 200 + R * Math.sin(rad)
                  return (
                    <line key={`line-${n.id}`} x1="200" y1="200" x2={x} y2={y}
                      stroke="rgba(51,181,255,0.35)" strokeWidth="1" strokeDasharray="2 4" />
                  )
                })}
                {/* Glow dots at intersections */}
                {HEX_NODES.map((n, i) => {
                  const R = 160
                  const rad = (n.angle * Math.PI) / 180
                  const x = 200 + R * Math.cos(rad)
                  const y = 200 + R * Math.sin(rad)
                  return <circle key={`dot-${n.id}`} cx={x} cy={y} r="4" fill="#33B5FF" style={{ filter: "drop-shadow(0 0 8px #33B5FF)" }} />
                })}
              </svg>

              {/* Nodes */}
              <div className="absolute inset-0">
                {HEX_NODES.map((n, i) => (
                  <HexNode key={n.id} {...n} delay={0.15 + i * 0.06} />
                ))}
              </div>

              {/* CENTER: KL crystal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                {/* Outer glow rings */}
                <div className="absolute inset-0 -m-8 rounded-full animate-pulse"
                     style={{ background: "radial-gradient(circle, rgba(30,107,255,0.45), transparent 65%)" }} />
                <div className="relative w-[130px] h-[130px] flex items-center justify-center">
                  {/* Hex bezel */}
                  <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full" style={{ filter: "drop-shadow(0 0 24px rgba(30,107,255,0.7))" }}>
                    <defs>
                      <linearGradient id="centerHex" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1E6BFF" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#33B5FF" stopOpacity="0.15" />
                      </linearGradient>
                    </defs>
                    <polygon points="50,2 96,28 96,86 50,112 4,86 4,28"
                             fill="url(#centerHex)"
                             stroke="#33B5FF" strokeWidth="2" />
                  </svg>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-crystal.png" alt="KADS LABS"
                       className="relative w-16 h-16 object-contain"
                       style={{ filter: "drop-shadow(0 0 18px rgba(30,107,255,0.8))" }} />
                </div>
                <p className="mt-2 text-xl font-extrabold tracking-wider text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  KADS
                </p>
                <p className="text-[10px] tracking-[0.3em] text-[#33B5FF] -mt-0.5">—— LABS ——</p>
                <p className="text-[11px] font-semibold mt-1" style={{ color: "#33B5FF" }}>INNOVATION AT CORE</p>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: Tech Stack panel */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl p-6 sm:p-7"
              style={{
                background: "linear-gradient(135deg, rgba(11,23,41,0.7), rgba(8,17,31,0.85))",
                border: "1px solid rgba(51,181,255,0.22)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,107,255,0.08)"
              }}>
              <h3 className="text-xl font-bold mb-5" style={{
                color: "#33B5FF",
                fontFamily: "'Space Grotesk', sans-serif"
              }}>Our Tech Stack</h3>

              <div className="space-y-4">
                {TECH_STACK.map((cat, i) => {
                  const C = cat.icon
                  return (
                    <motion.div key={cat.title}
                      initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.25 + i * 0.06 }}
                      className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(30,107,255,0.15)",
                          border: "1px solid rgba(30,107,255,0.25)"
                        }}>
                        <C className="w-5 h-5" style={{ color: "#33B5FF" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{cat.title}</p>
                        <p className="text-xs leading-relaxed mt-0.5" style={{ color: "rgba(255,255,255,0.58)" }}>
                          {cat.items.join(", ")}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom value strip (NO fake counts — category labels only) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-5 gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(11,23,41,0.65), rgba(8,17,31,0.75))",
            border: "1px solid rgba(51,181,255,0.18)",
            backdropFilter: "blur(12px)"
          }}>
          {[
            { icon: Terminal, label: "Technologies Integrated", desc: "To Deliver Excellence" },
            { icon: Boxes, label: "Projects Powered", desc: "By Our Ecosystem" },
            { icon: BarChart3, label: "Uptime, Scalability &", desc: "High Availability" },
            { icon: Shield, label: "Security & Compliance", desc: "Guaranteed" },
            { icon: Rocket, label: "Future-Ready", desc: "Continuously Evolving" },
          ].map((item, i) => {
            const I = item.icon
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(30,107,255,0.15)",
                    border: "1px solid rgba(30,107,255,0.28)"
                  }}>
                  <I className="w-5 h-5" style={{ color: "#33B5FF" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>{item.desc}</p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}


