"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Target, Eye, Sparkles, Rocket, Award, Shield, Zap, Users } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const VALUES = [
  { icon: Sparkles, title: "Innovation First", desc: "Cutting-edge AI-native engineering that keeps you ahead of the curve." },
  { icon: Shield, title: "Enterprise Security", desc: "Zero-trust architecture, SOC 2 ready, end-to-end encryption." },
  { icon: Rocket, title: "Lightning Fast", desc: "Sub-100ms response times, optimized Core Web Vitals globally." },
  { icon: Award, title: "Award-Winning Design", desc: "Pixel-perfect UI that meets Apple and Linear design standards." },
  { icon: Zap, title: "AI-Native Stack", desc: "Every product ships with AI capabilities built-in, not bolted on." },
  { icon: Users, title: "Global Team", desc: "50+ expert engineers serving clients across 20+ countries." }
]

export default function AboutSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="about" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <Reveal>
            <span className="eyebrow-pill mb-5">
              <Sparkles className="w-3 h-3" /> {language === "hi" ? "हमारे बारे में" : "About KADS LABS"}
            </span>
            <h2 className="section-heading mb-6">
              {language === "hi" ? (
                <>अगली पीढ़ी के <span className="text-brand-gradient">डिजिटल उत्पाद</span> बनाना</>
              ) : (
                <>Building the next generation of <span className="text-brand-gradient">digital products</span></>
              )}
            </h2>
            <p className="text-lg mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              KADS LABS is a global enterprise technology company that builds AI-powered products, SaaS platforms, and transformative digital solutions for ambitious businesses.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
              We combine world-class engineering with premium design to deliver software that doesn't just work — it defines categories. From startups to Fortune 500 companies, we partner with visionary teams to turn complex challenges into elegant solutions.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-5">
                <Target className="w-6 h-6 mb-3" style={{ color: "#33B5FF" }} />
                <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  {language === "hi" ? "हमारा मिशन" : "Our Mission"}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  To empower businesses with intelligent technology that drives real transformation.
                </p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <Eye className="w-6 h-6 mb-3" style={{ color: "#1E6BFF" }} />
                <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  {language === "hi" ? "हमारा विज़न" : "Our Vision"}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  To be the global leader in AI-native enterprise software and premium digital experiences.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="glass rounded-3xl p-2" style={{ boxShadow: "var(--shadow-brand)" }}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(30,107,255,0.15), rgba(51,181,255,0.05))",
                    border: "1px solid var(--border-default)"
                  }}>
                  {/* Decorative abstract graphic */}
                  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="w-[300px] h-[300px] rounded-full"
                      style={{
                        border: "1px dashed rgba(51,181,255,0.3)",
                        boxShadow: "inset 0 0 60px rgba(30,107,255,0.2)"
                      }}
                    />
                    <div className="absolute w-[200px] h-[200px] rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(30,107,255,0.4) 0%, rgba(51,181,255,0.2) 50%, transparent 70%)",
                        filter: "blur(30px)"
                      }}
                    />
                    <div className="absolute text-center">
                      <div className="text-6xl sm:text-7xl font-bold text-brand-gradient mb-2">5+</div>
                      <div className="text-sm uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Years of Excellence</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating accent card */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: 30 }}
                animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-4 max-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Available Now</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  24/7 Global Support
                </p>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* Values grid */}
        <Reveal>
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              {language === "hi" ? "हम क्यों अलग हैं" : "Why companies choose KADS LABS"}
            </h3>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map((v, i) => {
            const Icon = v.icon
            return (
              <Reveal key={v.title} delay={i * 0.06} y={16}>
                <div className="premium-card h-full">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(30,107,255,0.1)", border: "1px solid rgba(30,107,255,0.2)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#33B5FF" }} />
                  </div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{v.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
