"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Reveal from "./Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

/** Placeholder client logos rendered as crisp SVG wordmarks so we don't ship images. */
const CLIENTS = [
  { id: "fin-edge", label: "FinEdge", color: "#93C5FD" },
  { id: "style-nest", label: "StyleNest", color: "#C4B5FD" },
  { id: "prop-vision", label: "PropVision", color: "#67E8F9" },
  { id: "cloud-scale", label: "CloudScale", color: "#93C5FD" },
  { id: "learn-space", label: "LearnSpace", color: "#C4B5FD" },
  { id: "med-care", label: "MedCare", color: "#67E8F9" }
]

export default function TrustedBy() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      ref={ref}
      className="relative py-14 sm:py-16 overflow-hidden border-y border-white/5"
    >
      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" />
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal>
          <p className="text-center text-[11px] sm:text-xs uppercase tracking-[0.28em] text-white/40 mb-8 sm:mb-10">
            {language === "hi"
              ? "12 देशों में महत्वाकांक्षी टीमों द्वारा विश्वसनीय"
              : "Trusted by ambitious teams across 12 countries"}
          </p>
        </Reveal>

        <div className="relative overflow-hidden">
          {/* Edge fades for marquee feel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-navy-950 to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-navy-950 to-transparent z-10"
          />
          <motion.div
            className="flex items-center justify-center gap-x-10 sm:gap-x-16 flex-wrap"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {CLIENTS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/45 hover:text-white/80 transition-colors select-none"
                aria-label={c.label}
              >
                <span
                  className="text-lg sm:text-xl font-semibold tracking-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {c.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
