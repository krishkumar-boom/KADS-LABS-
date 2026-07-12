"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Brain, Bot, Workflow, MessageSquareCode, Sparkles, Zap, ArrowUpRight } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const SOLUTIONS = [
  {
    icon: Brain,
    title: "Custom AI Models",
    desc: "Fine-tuned LLMs and custom models trained on your data for domain-specific intelligence."
  },
  {
    icon: Bot,
    title: "AI Agents",
    desc: "Autonomous AI agents that handle complex multi-step tasks without human intervention."
  },
  {
    icon: Workflow,
    title: "RAG Systems",
    desc: "Retrieval-augmented generation that grounds AI responses in your company knowledge."
  },
  {
    icon: MessageSquareCode,
    title: "Conversational AI",
    desc: "Intelligent chatbots and voice agents with natural, human-like interactions."
  },
  {
    icon: Sparkles,
    title: "Generative AI",
    desc: "Content generation, image synthesis, and creative AI tools for your business."
  },
  {
    icon: Zap,
    title: "AI Automation",
    desc: "End-to-end workflow automation powered by intelligent decision-making systems."
  }
]

export default function AISolutions() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="ai-solutions" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
      <div aria-hidden="true"
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(30,107,255,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            <Sparkles className="w-3 h-3" /> {language === "hi" ? "AI समाधान" : "AI Solutions"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>AI के साथ <span className="text-brand-gradient">अपने व्यवसाय को बदलें</span></>
            ) : (
              <>Transform your business with <span className="text-brand-gradient">AI-native solutions</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "कस्टम AI मॉडल्स से लेकर बुद्धिमान एजेंट्स तक — हम एंड-टू-एंड AI समाधान प्रदान करते हैं।"
              : "From custom models to intelligent agents — we build AI solutions that deliver measurable business outcomes."}
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22,1,0.36,1] }}
                className="group premium-card cursor-pointer relative overflow-hidden"
              >
                <div aria-hidden="true"
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle, rgba(51,181,255,0.4), transparent 70%)" }}
                />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: "linear-gradient(135deg, rgba(30,107,255,0.2), rgba(51,181,255,0.1))", border: "1px solid rgba(30,107,255,0.25)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#33B5FF" }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                  <div className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                    style={{ color: "#33B5FF" }}>
                    Explore <ArrowUpRight className="w-4 h-4" />
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
