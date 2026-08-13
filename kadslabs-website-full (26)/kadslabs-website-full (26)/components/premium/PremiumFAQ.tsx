"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { useInView } from "framer-motion"
import { useContent } from "@/app/components/ContentProvider"
import { useLanguage } from "@/app/components/LanguageProvider"
import Reveal from "@/components/home/Reveal"

export default function PremiumFAQ() {
  const { siteData } = useContent()
  const { language } = useLanguage()
  const faqs = siteData.faqs.slice().sort((a, b) => a.order - b.order)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="faq" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-[900px] mx-auto section-padding">
        <Reveal className="text-center mb-14">
          <span className="eyebrow-pill mb-5">FAQ</span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>अक्सर पूछे जाने वाले <span className="text-brand-gradient">सवाल</span></>
            ) : (
              <>Frequently asked <span className="text-brand-gradient">questions</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "हमारी सेवाओं, प्रक्रिया और साझेदारी के बारे में सामान्य प्रश्नों के उत्तर पाएं।"
              : "Find answers to common questions about our services, process, and partnership approach."}
          </p>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const open = openIndex === index
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="rounded-2xl overflow-hidden transition-all"
                style={{
                  background: open ? "var(--bg-tertiary)" : "var(--bg-card)",
                  border: open ? "1px solid var(--border-strong)" : "1px solid var(--border-subtle)",
                  boxShadow: open ? "var(--shadow-brand)" : "none"
                }}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
                  aria-expanded={open}
                >
                  <span className="font-semibold text-base sm:text-lg pr-4"
                    style={{ color: "var(--text-primary)" }}>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: open ? 180 : 0, background: open ? "var(--gradient-brand)" : "var(--bg-tertiary)" }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ border: "1px solid var(--border-default)" }}
                  >
                    <ChevronDown className="w-4 h-4" style={{ color: open ? "white" : "var(--text-muted)" }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-0">
                        <p className="leading-relaxed text-[15px]" style={{ color: "var(--text-secondary)" }}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
