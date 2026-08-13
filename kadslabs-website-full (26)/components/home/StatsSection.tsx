"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useCountUp } from "@/lib/hooks/useCountUp"
import Reveal from "./Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

interface Stat {
  value: number
  suffix?: string
  label: string
  hiLabel: string
  /** optional duration override in ms */
  duration?: number
  decimals?: number
}

function StatCell({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const n = useCountUp({
    end: stat.value,
    start: inView,
    duration: stat.duration ?? 1600,
    easing: "ease-out",
    decimals: stat.decimals ?? 0
  })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-center px-4 py-2"
    >
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient tabular-nums">
        {stat.decimals ? n.toFixed(stat.decimals) : Math.round(n).toLocaleString()}
        {stat.suffix ?? ""}
      </div>
      <p className="mt-2 text-xs sm:text-sm text-white/55 tracking-wide">
        {stat.label}
      </p>
    </motion.div>
  )
}

export default function StatsSection() {
  const { language } = useLanguage()

  const stats: Stat[] = [
    { value: 150, suffix: "+", label: "Projects Delivered", hiLabel: "पूर्ण प्रोजेक्ट्स", duration: 1400 },
    { value: 80,  suffix: "+", label: "Happy Clients", hiLabel: "संतुष्ट ग्राहक", duration: 1500 },
    { value: 12,  suffix: "",  label: "Countries Served", hiLabel: "सेवित देश", duration: 1200 },
    { value: 8,   suffix: "+", label: "Years Experience", hiLabel: "वर्षों का अनुभव", duration: 1100 }
  ]

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-[#060c1e]" />
      <div className="relative z-10 max-w-[1200px] mx-auto section-padding">
        <Reveal>
          <div
            className="relative rounded-2xl p-6 sm:p-10 lg:p-12 overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(30,41,59,0.55) 0%, rgba(15,23,42,0.7) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow:
                "0 30px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.08)"
            }}
          >
            {/* subtle inner glow */}
            <div
              aria-hidden="true"
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)"
              }}
            />
            <div className="relative grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
              {stats.map((s, i) => (
                <StatCell key={s.label} stat={s} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
