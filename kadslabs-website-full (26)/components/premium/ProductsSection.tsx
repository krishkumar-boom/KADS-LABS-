"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Brain, LayoutDashboard, MessageSquare, Workflow, ArrowUpRight } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const PRODUCTS = [
  {
    icon: Brain,
    name: "KADS AI Studio",
    tagline: "Enterprise AI Workbench",
    desc: "Build, deploy, and monitor AI agents at scale. No ML team required.",
    color: "#1E6BFF",
    badge: "Flagship"
  },
  {
    icon: LayoutDashboard,
    name: "KADS Cloud",
    tagline: "Enterprise SaaS Platform",
    desc: "The fastest way to launch production SaaS products with built-in auth, billing, and analytics.",
    color: "#33B5FF"
  },
  {
    icon: MessageSquare,
    name: "KADS Engage",
    tagline: "Customer Intelligence",
    desc: "AI-powered customer engagement platform with multi-channel outreach and analytics.",
    color: "#8B5CF6"
  },
  {
    icon: Workflow,
    name: "KADS Flow",
    tagline: "Automation Engine",
    desc: "Visual workflow automation that connects every tool in your stack — no code required.",
    color: "#10B981"
  }
]

export default function ProductsSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="products" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            {language === "hi" ? "प्रोडक्ट्स" : "Products"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>हमारे <span className="text-brand-gradient">सॉफ्टवेयर प्रोडक्ट्स</span></>
            ) : (
              <>Software products <span className="text-brand-gradient">we've built</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "आधुनिक व्यवसायों के लिए निर्मित शक्तिशाली SaaS टूल्स।"
              : "Powerful SaaS tools built for modern enterprises, used by thousands of teams worldwide."}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {PRODUCTS.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group premium-card relative overflow-hidden cursor-pointer h-full"
              >
                <div aria-hidden="true"
                  className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle, ${p.color}60, transparent 70%)` }}
                />
                <div className="relative z-10 flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                    <Icon className="w-7 h-7" style={{ color: p.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                      {p.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "linear-gradient(135deg, #1E6BFF, #33B5FF)", color: "white" }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium mb-2" style={{ color: p.color }}>{p.tagline}</p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{p.desc}</p>
                    <div className="flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
                      style={{ color: p.color }}>
                      {language === "hi" ? "और जानें" : "Learn more"} <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
