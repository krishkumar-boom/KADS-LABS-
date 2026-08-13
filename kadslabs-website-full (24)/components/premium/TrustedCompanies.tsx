"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "@/app/components/LanguageProvider"
import { Code2, Brain, Cloud, Smartphone, Globe, Megaphone, BarChart3, Database, ShieldCheck, Cpu, Palette, Rocket } from "lucide-react"

// Honest capability marquee instead of fake client names
const CAPABILITIES_EN = [
  { icon: Brain, label: "AI Solutions" },
  { icon: Code2, label: "Enterprise Software" },
  { icon: Cloud, label: "SaaS Development" },
  { icon: Smartphone, label: "Mobile Apps" },
  { icon: Globe, label: "Web Development" },
  { icon: Megaphone, label: "Digital Marketing" },
  { icon: BarChart3, label: "Performance Ads" },
  { icon: Database, label: "Scalable Systems" },
  { icon: ShieldCheck, label: "Secure by Design" },
  { icon: Cpu, label: "Edge & Cloud" },
  { icon: Palette, label: "Brand & Design" },
  { icon: Rocket, label: "Rapid Delivery" }
]

const CAPABILITIES_HI = [
  { icon: Brain, label: "AI समाधान" },
  { icon: Code2, label: "एंटरप्राइज़ सॉफ्टवेयर" },
  { icon: Cloud, label: "SaaS डेवलपमेंट" },
  { icon: Smartphone, label: "मोबाइल ऐप्स" },
  { icon: Globe, label: "वेब डेवलपमेंट" },
  { icon: Megaphone, label: "डिजिटल मार्केटिंग" },
  { icon: BarChart3, label: "परफॉर्मेंस ऐड्स" },
  { icon: Database, label: "स्केलेबल सिस्टम" },
  { icon: ShieldCheck, label: "सुरक्षित डिज़ाइन" },
  { icon: Cpu, label: "एज और क्लाउड" },
  { icon: Palette, label: "ब्रांड और डिज़ाइन" },
  { icon: Rocket, label: "तेज़ डिलीवरी" }
]

export default function TrustedCompanies() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const items = language === "hi" ? CAPABILITIES_HI : CAPABILITIES_EN

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
          {language === "hi" ? "हम क्या बनाते हैं" : "What we build"}
        </motion.p>

        <div className="relative overflow-hidden mask-fade-edges">
          <motion.div
            className="flex gap-6 whitespace-nowrap no-scrollbar"
            initial={{ x: 0 }}
            animate={inView ? { x: "-50%" } : { x: 0 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...items, ...items].map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all duration-300"
                  style={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(30,107,255,0.3)"
                    e.currentTarget.style.color = "var(--brand-neon)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)"
                    e.currentTarget.style.color = "var(--text-secondary)"
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#33B5FF" }} />
                  <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
