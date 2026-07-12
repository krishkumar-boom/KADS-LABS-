"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const PROJECTS = [
  {
    title: "AI Customer Intelligence Platform",
    category: "AI / SaaS",
    desc: "Enterprise AI platform that analyzes millions of customer interactions in real-time, reducing churn by 40%.",
    tags: ["Next.js", "OpenAI", "PostgreSQL", "Vector DB"],
    gradient: "from-blue-600 to-cyan-600",
    large: true
  },
  {
    title: "FinTech Neo-Banking App",
    category: "Mobile / FinTech",
    desc: "Full neobanking mobile app with UPI, cards, investments, and AI-powered budgeting.",
    tags: ["React Native", "Node.js", "AWS"],
    gradient: "from-indigo-600 to-blue-700"
  },
  {
    title: "Healthcare Management Suite",
    category: "Enterprise",
    desc: "Hospital management platform serving 50+ clinics with 99.99% uptime.",
    tags: ["Next.js", "Supabase", "HIPAA"],
    gradient: "from-cyan-600 to-blue-600"
  },
  {
    title: "E-Commerce Marketplace",
    category: "Web / E-Commerce",
    desc: "Scaled marketplace platform processing 10K+ daily transactions with sub-second page loads.",
    tags: ["Next.js", "Stripe", "Redis"],
    gradient: "from-blue-700 to-indigo-800",
    large: true
  },
  {
    title: "AI Content Studio",
    category: "AI / Media",
    desc: "Generative AI content creation platform used by 500+ brands.",
    tags: ["LLM", "React", "Python"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Logistics & Fleet Dashboard",
    category: "Dashboard",
    desc: "Real-time GPS tracking and fleet management for a national logistics company.",
    tags: ["WebSockets", "Maps", "Node.js"],
    gradient: "from-slate-700 to-blue-900"
  }
]

export default function PortfolioSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })
  const [hover, setHover] = useState<number | null>(null)

  return (
    <section id="portfolio" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            {language === "hi" ? "पोर्टफोलियो" : "Our Work"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>हमारे <span className="text-brand-gradient">प्रीमियम प्रोजेक्ट्स</span></>
            ) : (
              <>Featured <span className="text-brand-gradient">Case Studies</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "ऐसे प्रोजेक्ट्स जिन्होंने व्यवसायों को बदल दिया।"
              : "A selection of products and platforms we've engineered for ambitious teams."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={`group relative cursor-pointer rounded-2xl overflow-hidden ${p.large ? "lg:col-span-2" : ""}`}
              style={{
                aspectRatio: p.large ? "16/10" : "4/3",
                border: "1px solid var(--border-default)",
                background: "var(--bg-card)"
              }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {/* Grid texture */}
              <div className="absolute inset-0 bg-grid-dark opacity-30" />
              {/* Decorative shapes */}
              <div aria-hidden="true"
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity"
                style={{ background: "radial-gradient(circle, rgba(51,181,255,0.5) 0%, transparent 70%)" }}
              />

              <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-end">
                <span className="inline-block self-start px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-3"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                  {p.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                  {p.title}
                </h3>
                <p className="text-sm text-white/70 mb-4 max-w-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {p.desc}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    {p.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-1 rounded-md bg-white/10 text-white/80 backdrop-blur-sm">{t}</span>
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
