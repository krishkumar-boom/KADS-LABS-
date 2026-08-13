"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Target, Eye, Sparkles, Rocket, Shield, Zap, Building2, Brain, Cloud, Code, LineChart, Megaphone, Smartphone, Globe2 } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useTheme } from "@/app/components/ThemeProvider"

// Core capabilities (replaces fake "5+ Years" counter)
const CAPABILITIES = [
  { icon: Building2, label: "Enterprise Software" },
  { icon: Brain, label: "AI Solutions" },
  { icon: Cloud, label: "SaaS Development" },
  { icon: Smartphone, label: "Mobile Apps" },
  { icon: Code, label: "Web Development" },
  { icon: Megaphone, label: "Digital Marketing" },
  { icon: LineChart, label: "Performance Ads" },
  { icon: Globe2, label: "Scalable Systems" }
]

const VALUES = [
  { icon: Sparkles, title: "Innovation First", desc: "Cutting-edge AI-native engineering that keeps you ahead of the curve." },
  { icon: Shield, title: "Enterprise Security", desc: "Zero-trust architecture, SOC-ready practices, end-to-end encryption." },
  { icon: Rocket, title: "Lightning Fast", desc: "Sub-100ms response times, optimized Core Web Vitals globally." },
  { icon: Building2, title: "MSME Registered", desc: "Udyam-registered Indian enterprise — Govt. of India certified." },
  { icon: Zap, title: "AI-Native Stack", desc: "Every product ships with AI capabilities built-in, not bolted on." },
  { icon: Globe2, title: "Global Delivery", desc: "Engineers and marketers serving clients across multiple countries." }
]

export default function AboutSection() {
  const { language } = useLanguage()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="about" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Theme-aware ambient backdrop */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(30,107,255,0.06), transparent 60%)"
              : "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(30,107,255,0.08), transparent 60%)"
          }}
        />
        <div className="absolute inset-0 bg-grid-dark opacity-[0.25]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
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
              KADS LABS is an <strong>MSME-registered Indian enterprise</strong> building AI-powered software, SaaS platforms, mobile apps, and high-performance digital marketing campaigns for growing businesses.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
              We combine world-class engineering with premium design to deliver solutions that don't just work — they scale. From ambitious startups to established enterprises, we partner with teams that refuse to look ordinary.
            </p>

            {/* Capabilities chips (replaces 5+ years badge) */}
            <div className="pt-6 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--text-subtle)" }}>
                {language === "hi" ? "हमारी क्षमताएं" : "Core Capabilities"}
              </p>
              <div className="flex flex-wrap gap-2">
                {CAPABILITIES.map((cap, i) => {
                  const Icon = cap.icon
                  return (
                    <motion.span
                      key={cap.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                      className="chip gap-1.5 cursor-default"
                    >
                      <Icon className="w-3 h-3" style={{ color: "#33B5FF" }} />
                      {cap.label}
                    </motion.span>
                  )
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="glass rounded-3xl p-2" style={{ boxShadow: "var(--shadow-brand)" }}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(30,107,255,0.18), rgba(51,181,255,0.06))"
                      : "linear-gradient(135deg, rgba(30,107,255,0.1), rgba(51,181,255,0.04))",
                    border: "1px solid var(--border-default)"
                  }}>

                  {/* Animated decorative core */}
                  <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                    {/* Multiple rotating rings */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      className="w-[320px] h-[320px] rounded-full absolute"
                      style={{ border: "1px dashed rgba(51,181,255,0.25)" }}
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                      className="w-[240px] h-[240px] rounded-full absolute"
                      style={{ border: `1px solid ${isDark ? "rgba(30,107,255,0.3)" : "rgba(30,107,255,0.2)"}` }}
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                      className="w-[160px] h-[160px] rounded-full absolute"
                      style={{ border: "1px dashed rgba(51,181,255,0.4)" }}
                    />
                    {/* Core glow */}
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute w-[140px] h-[140px] rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(30,107,255,0.5) 0%, rgba(51,181,255,0.2) 50%, transparent 70%)",
                        filter: "blur(20px)"
                      }}
                    />
                    {/* Center logo mark */}
                    <div className="absolute w-[90px] h-[90px] rounded-2xl flex items-center justify-center"
                      style={{
                        background: isDark ? "rgba(5,7,11,0.8)" : "rgba(255,255,255,0.9)",
                        border: "1px solid var(--border-strong)",
                        boxShadow: "0 20px 60px rgba(30,107,255,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
                        backdropFilter: "blur(12px)"
                      }}>
                      <div className="font-black text-2xl tracking-tight text-brand-gradient">K</div>
                    </div>

                    {/* Orbiting dots */}
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                      <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                        className="absolute w-[240px] h-[240px]"
                        style={{ transformOrigin: "center" }}
                      >
                        <div className="absolute w-2 h-2 rounded-full -top-1 left-1/2 -translate-x-1/2"
                          style={{
                            background: "var(--gradient-brand)",
                            boxShadow: "0 0 12px rgba(51,181,255,0.7)"
                          }} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating MSME badge */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 30 }}
                animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 glass-strong rounded-2xl p-4 max-w-[220px]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #FF9933, #138808)", color: "white" }}>
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
                    Govt. of India
                  </span>
                </div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>MSME Registered</p>
                <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                  UDYAM-UP-21-0061122
                </p>
              </motion.div>

              {/* Available badge */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: 30 }}
                animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-4 max-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    {language === "hi" ? "अभी उपलब्ध" : "Available Now"}
                  </span>
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {language === "hi" ? "नए प्रोजेक्ट ले रहे हैं" : "Taking new projects"}
                </p>
              </motion.div>
            </div>
          </Reveal>
        </div>

        {/* Values grid (Why choose us) */}
        <Reveal>
          <div className="text-center mb-12">
            <span className="eyebrow-pill mb-4">
              <Shield className="w-3 h-3 inline mr-1" />
              {language === "hi" ? "हम क्यों अलग हैं" : "Why companies trust us"}
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
              {language === "hi" ? (
                <>एंटरप्राइज़-ग्रेड <span className="text-brand-gradient">इंजीनियरिंग</span></>
              ) : (
                <>Enterprise-grade <span className="text-brand-gradient">engineering</span></>
              )}
            </h3>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map((v, i) => {
            const Icon = v.icon
            return (
              <Reveal key={v.title} delay={i * 0.06} y={16}>
                <motion.div
                  className="premium-card h-full"
                  whileHover={inView ? { y: -6 } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: "rgba(30,107,255,0.1)", border: "1px solid rgba(30,107,255,0.2)" }}>
                    <Icon className="w-6 h-6" style={{ color: "#33B5FF" }} />
                  </div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{v.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
