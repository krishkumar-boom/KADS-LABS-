"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Shield, Scale, Clock, Award, CheckCircle2, ArrowRight, Building2 } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import MagneticButton from "@/app/components/MagneticButton"
import { useLanguage } from "@/app/components/LanguageProvider"

const FEATURES = [
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 Type II, GDPR, HIPAA ready. End-to-end encryption and zero-trust architecture." },
  { icon: Scale, title: "Infinite Scale", desc: "Built for millions of users on cloud-native infrastructure with auto-scaling." },
  { icon: Clock, title: "99.99% Uptime SLA", desc: "Multi-region deployments with active failover and 24/7 monitoring." },
  { icon: Award, title: "Dedicated Support", desc: "24/7 dedicated engineering support with sub-15min response SLA." }
]

const CHECKLIST = [
  "Dedicated account manager",
  "Custom SLAs & contracts",
  "On-premise deployment options",
  "Security compliance audits",
  "Priority feature development",
  "Training & onboarding"
]

export default function EnterpriseSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section id="enterprise" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(30,107,255,0.08), transparent 70%)"
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="eyebrow-pill mb-5">
              <Building2 className="w-3 h-3" /> {language === "hi" ? "एंटरप्राइज़" : "Enterprise"}
            </span>
            <h2 className="section-heading mb-6">
              {language === "hi" ? (
                <>बड़े संगठनों के लिए <span className="text-brand-gradient">एंटरप्राइज़-ग्रेड समाधान</span></>
              ) : (
                <>Built for the <span className="text-brand-gradient">world's most demanding enterprises</span></>
              )}
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {language === "hi"
                ? "सुरक्षा, स्केल और विश्वसनीयता के साथ — हम बड़े संगठनों के लिए मिशन-क्रिटिकल सॉफ्टवेयर बनाते हैं।"
                : "Security, compliance, scale, and dedicated support — we partner with large organizations to deliver mission-critical software."}
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-8">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(30,107,255,0.1)", border: "1px solid rgba(30,107,255,0.2)" }}>
                      <Icon className="w-5 h-5" style={{ color: "#33B5FF" }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{f.title}</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <MagneticButton onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary">
                {language === "hi" ? "एंटरप्राइज़ बिक्री से संपर्क करें" : "Talk to Enterprise Sales"} <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden"
              style={{ boxShadow: "var(--shadow-brand)" }}>
              <div aria-hidden="true"
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(30,107,255,0.3), transparent 70%)" }}
              />
              <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {language === "hi" ? "एंटरप्राइज़ प्लान में शामिल:" : "Enterprise includes:"}
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                {language === "hi" ? "सब कुछ जो बड़े स्तर पर चाहिए।" : "Everything you need at scale."}
              </p>
              <div className="space-y-3 mb-8">
                {CHECKLIST.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
                    className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "#33B5FF" }} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item}</span>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                <div>
                  <div className="text-2xl font-bold text-brand-gradient">99.99%</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Uptime SLA</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-gradient">15min</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Response Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-gradient">SOC 2</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Compliant</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
