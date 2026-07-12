"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const TECHS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "Supabase",
  "Firebase", "Docker", "AWS", "Azure", "OpenAI", "Gemini",
  "PostgreSQL", "MongoDB", "Redis", "GraphQL", "Tailwind CSS", "Framer Motion"
]

export default function TechnologiesSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="technologies" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      <div aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px]"
        style={{ background: "radial-gradient(ellipse, rgba(30,107,255,0.12), transparent 70%)" }}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-14">
          <span className="eyebrow-pill mb-5">
            {language === "hi" ? "टेक्नोलॉजी" : "Technology Stack"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>आधुनिक टूल्स, <span className="text-brand-gradient">सिद्ध परिणाम</span></>
            ) : (
              <>Built with the <span className="text-brand-gradient">best-in-class stack</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "हम हर प्रोजेक्ट में सबसे आधुनिक और स्केलेबल तकनीकों का उपयोग करते हैं।"
              : "We use battle-tested, scalable technologies that ship production-grade software from day one."}
          </p>
        </Reveal>

        <Reveal>
          <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 30% 20%, rgba(30,107,255,0.08), transparent 50%), radial-gradient(circle at 70% 80%, rgba(51,181,255,0.08), transparent 50%)" }}
            />
            <div className="relative flex flex-wrap justify-center gap-3">
              {TECHS.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-default transition-all"
                  style={{
                    background: "rgba(30,107,255,0.06)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)"
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
