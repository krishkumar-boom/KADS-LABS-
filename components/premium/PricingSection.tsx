"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { CheckCircle2, X, Sparkles, Phone } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import MagneticButton from "@/app/components/MagneticButton"
import { useLanguage } from "@/app/components/LanguageProvider"

interface Plan {
  name: string
  priceM: number
  priceY: number
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
  icon?: string
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    priceM: 4999,
    priceY: 4999 * 10,
    description: "Perfect for small businesses and startups getting started.",
    features: [
      "Up to 5 Projects",
      "Basic Support",
      "10GB Storage",
      "Standard Features"
    ],
    cta: "Get Started"
  },
  {
    name: "Growth",
    priceM: 9999,
    priceY: 9999 * 10,
    description: "For growing businesses that need more power and support.",
    features: [
      "Up to 15 Projects",
      "Priority Support",
      "50GB Storage",
      "Advanced Features"
    ],
    cta: "Get Started"
  },
  {
    name: "Business",
    priceM: 19999,
    priceY: 19999 * 10,
    description: "For established businesses with serious scale requirements.",
    features: [
      "Unlimited Projects",
      "24/7 Support",
      "200GB Storage",
      "All Advanced Features"
    ],
    highlighted: true,
    cta: "Get Started",
    icon: "Most Popular"
  },
  {
    name: "Enterprise",
    priceM: 49999,
    priceY: 49999 * 10,
    description: "For large organizations with custom requirements.",
    features: [
      "Custom Solutions",
      "Dedicated Support",
      "1TB+ Storage",
      "All Premium Features"
    ],
    cta: "Contact Sales"
  }
]

const formatINR = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${n.toLocaleString("en-IN")}`
}

export default function PricingSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const [yearly, setYearly] = useState(true)

  return (
    <section id="pricing" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      <div aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(30,107,255,0.1), transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-12">
          <span className="eyebrow-pill mb-5">
            {language === "hi" ? "प्राइसिंग" : "Pricing Plans"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>हर व्यवसाय के लिए <span className="text-brand-gradient">पारदर्शी मूल्य निर्धारण</span></>
            ) : (
              <>Simple, transparent pricing <span className="text-brand-gradient">for every business</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto mb-8">
            {language === "hi"
              ? "अपनी ज़रूरत के हिसाब से प्लान चुनें। किसी भी समय अपग्रेड या कैंसिल कर सकते हैं।"
              : "Choose the perfect plan that fits your needs. Scale as you grow."}
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full"
            style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
            <button onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? "text-white" : ""}`}
              style={{
                background: !yearly ? "var(--gradient-brand)" : "transparent",
                color: !yearly ? "white" : "var(--text-muted)",
                boxShadow: !yearly ? "0 4px 12px rgba(30,107,255,0.35)" : "none"
              }}>
              {language === "hi" ? "मासिक" : "Monthly"}
            </button>
            <button onClick={() => setYearly(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${yearly ? "text-white" : ""}`}
              style={{
                background: yearly ? "var(--gradient-brand)" : "transparent",
                color: yearly ? "white" : "var(--text-muted)",
                boxShadow: yearly ? "0 4px 12px rgba(30,107,255,0.35)" : "none"
              }}>
              {language === "hi" ? "वार्षिक" : "Yearly"}
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                style={{ background: "rgba(16,185,129,0.2)", color: "#10B981" }}>
                Save 20%
              </span>
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan, i) => {
            const price = yearly ? plan.priceY : plan.priceM
            const isHighlight = plan.highlighted
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22,1,0.36,1] }}
                className="relative rounded-2xl p-6 sm:p-7 flex flex-col"
                style={{
                  background: isHighlight
                    ? "linear-gradient(180deg, rgba(30,107,255,0.1) 0%, var(--bg-card) 40%)"
                    : "var(--bg-card)",
                  border: isHighlight ? "1.5px solid #1E6BFF" : "1px solid var(--border-subtle)",
                  boxShadow: isHighlight ? "0 20px 60px -10px rgba(30,107,255,0.3), 0 0 0 1px rgba(30,107,255,0.2)" : "var(--shadow-sm)",
                  transform: isHighlight ? "scale(1.02)" : "scale(1)"
                }}>
                {isHighlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                    style={{ background: "var(--gradient-brand)", color: "white", boxShadow: "0 4px 12px rgba(30,107,255,0.4)" }}>
                    <Sparkles className="w-3 h-3" /> {plan.icon}
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{plan.name}</h3>
                <p className="text-xs mb-5 leading-relaxed" style={{ color: "var(--text-muted)" }}>{plan.description}</p>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                      {formatINR(price)}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>/month</span>
                  </div>
                  {yearly && (
                    <p className="text-[10px] mt-1" style={{ color: "#10B981" }}>Billed yearly · Save 20%</p>
                  )}
                </div>

                <div className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#33B5FF" }} />
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <MagneticButton
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  variant={isHighlight ? "primary" : "outline"}
                  className={isHighlight ? "w-full justify-center" : "w-full justify-center"}
                  ariaLabel={plan.cta}
                >
                  {plan.cta === "Contact Sales" ? <><Phone className="w-4 h-4 mr-1" />{plan.cta}</> : plan.cta}
                </MagneticButton>
              </motion.div>
            )
          })}
        </div>

        <Reveal className="mt-12">
          <div className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{ border: "1px solid var(--border-subtle)" }}>
            <div>
              <h4 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {language === "hi" ? "कोई सेटअप शुल्क नहीं" : "No setup fees. No hidden charges."}
              </h4>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {language === "hi"
                  ? "किसी भी समय कैंसिल करें। 14 दिन की मनी-बैक गारंटी।"
                  : "Cancel anytime. 14-day money-back guarantee."}
              </p>
            </div>
            <div className="flex items-center gap-6">
              {[
                { t: "No Setup Fees", sub: "Get started instantly" },
                { t: "Cancel Anytime", sub: "No long-term contracts" },
                { t: "24/7 Support", sub: "We're here for you" },
                { t: "Secure & Reliable", sub: "Enterprise-grade security" }
              ].map(b => (
                <div key={b.t} className="hidden sm:block text-center">
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{b.t}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{b.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
