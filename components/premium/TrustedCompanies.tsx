"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "@/app/components/LanguageProvider"

// Wordmark-like clients rendered via SVG/text so we don't ship real logos
const CLIENTS = [
  "FinEdge", "CloudScale", "MedCare", "PropVision", "LearnSpace",
  "StyleNest", "RetailMax", "FoodHub", "EduReach", "TechNova",
  "GlobalCorp", "HealthPlus"
]

export default function TrustedCompanies() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative py-16 sm:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto section-padding">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-medium tracking-[0.25em] uppercase mb-10"
          style={{ color: "var(--text-subtle)" }}
        >
          {language === "hi" ? "नवोन्मेषी कंपनियों द्वारा विश्वसनीय" : "Trusted by innovative companies"}
        </motion.p>

        <div className="relative overflow-hidden mask-fade-edges">
          <motion.div
            className="flex gap-14 whitespace-nowrap no-scrollbar"
            initial={{ x: 0 }}
            animate={inView ? { x: "-50%" } : { x: 0 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...CLIENTS, ...CLIENTS].map((name, i) => (
              <div
                key={i}
                className="text-xl sm:text-2xl font-semibold tracking-tight transition-colors duration-300 hover:opacity-100"
                style={{ color: "var(--text-muted)", opacity: 0.6 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-neon)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
