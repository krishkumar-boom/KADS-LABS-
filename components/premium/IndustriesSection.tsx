"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Building2, GraduationCap, HeartPulse, ShoppingBag, UtensilsCrossed, Home, Rocket, UserCircle, Truck, Landmark, Film, Cpu } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const INDUSTRIES = [
  { icon: Building2, name: "FinTech", color: "#1E6BFF" },
  { icon: GraduationCap, name: "Education", color: "#33B5FF" },
  { icon: HeartPulse, name: "Healthcare", color: "#10B981" },
  { icon: ShoppingBag, name: "E-Commerce", color: "#F59E0B" },
  { icon: UtensilsCrossed, name: "Restaurants", color: "#EF4444" },
  { icon: Home, name: "Real Estate", color: "#8B5CF6" },
  { icon: Rocket, name: "Startups", color: "#33B5FF" },
  { icon: UserCircle, name: "Creators", color: "#EC4899" },
  { icon: Truck, name: "Logistics", color: "#06B6D4" },
  { icon: Landmark, name: "Government", color: "#1E40AF" },
  { icon: Film, name: "Media & Entertainment", color: "#A855F7" },
  { icon: Cpu, name: "Technology", color: "#1E6BFF" }
]

export default function IndustriesSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="industries" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}>
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            {language === "hi" ? "उद्योग" : "Industries We Serve"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>विभिन्न क्षेत्रों में <span className="text-brand-gradient">विशेषज्ञता</span></>
            ) : (
              <>Expertise across <span className="text-brand-gradient">diverse industries</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "हम स्वास्थ्य से लेकर फिनटेक, शिक्षा से लेकर एंटरप्राइज़ तक — हर उद्योग के लिए अनुकूलित समाधान प्रदान करते हैं।"
              : "From healthcare to fintech, education to enterprise — we deliver solutions tailored to industry-specific challenges."}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon
            return (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card rounded-2xl p-5 text-center group cursor-pointer"
              >
                <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${ind.color}18`, border: `1px solid ${ind.color}30` }}>
                  <Icon className="w-6 h-6" style={{ color: ind.color }} />
                </div>
                <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{ind.name}</h4>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
