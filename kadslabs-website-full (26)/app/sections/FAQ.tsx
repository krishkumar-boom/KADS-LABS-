"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import { useContent } from "../components/ContentProvider"

export default function FAQ() {
  const { siteData } = useContent()
  const faqs = siteData.faqs.slice().sort((a, b) => a.order - b.order)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-[1000px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">FAQ</span>
          <h2 className="section-heading mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Find answers to common questions about our services, process, and partnership approach.</p>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <AnimatedSection key={faq.id} delay={index * 0.05}>
              <div className="premium-card rounded-xl overflow-hidden glow-border">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4 text-electric" />
                    </div>
                    <span className="font-semibold text-base sm:text-lg pr-4 text-left">{faq.question}</span>
                  </div>
                  <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0" aria-hidden="true">
                    <ChevronDown className="w-5 h-5 text-electric" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div id={`faq-answer-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[72px]">
                        <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
