"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Bot, Cog, Code2, Layers, Globe, Smartphone, Palette, Brush, Cloud, Server, Network, Database, Shield, Link2, BarChart3, Building2 } from "lucide-react"
import { useLanguage } from "@/app/components/LanguageProvider"

const SERVICES = [
  { icon: Bot, title: "AI Development", desc: "Intelligent systems powered by cutting-edge machine learning models." },
  { icon: Cog, title: "AI Automation", desc: "Automate operations and streamline workflows with intelligent agents." },
  { icon: Code2, title: "Custom Software", desc: "Tailored software solutions built for your unique business needs." },
  { icon: Layers, title: "SaaS Development", desc: "Scalable multi-tenant SaaS platforms with subscription models." },
  { icon: Globe, title: "Website Development", desc: "Lightning-fast, SEO-optimized websites built with Next.js." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Native and cross-platform apps for iOS and Android." },
  { icon: Palette, title: "UI/UX Design", desc: "Beautiful, user-centered designs that create lasting impressions." },
  { icon: Brush, title: "Branding", desc: "Premium brand identity systems that define your market presence." },
  { icon: Cloud, title: "Cloud Solutions", desc: "Modern cloud infrastructure on AWS, Azure, and GCP." },
  { icon: Server, title: "DevOps", desc: "CI/CD pipelines and DevOps for speed, security, and scalability." },
  { icon: Network, title: "API Development", desc: "Robust REST and GraphQL APIs built for performance and scale." },
  { icon: Database, title: "CRM & ERP", desc: "Custom enterprise systems that unify your business operations." },
  { icon: Shield, title: "Cyber Security", desc: "Enterprise-grade security to protect your data and digital assets." },
  { icon: Link2, title: "Blockchain", desc: "Web3 and smart contract development for decentralized solutions." },
  { icon: BarChart3, title: "Data & Analytics", desc: "Turn data into actionable insights that drive smart decisions." },
  { icon: Building2, title: "Enterprise Solutions", desc: "End-to-end digital transformation for large organizations." }
]

export default function ServicesSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="services" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      {/* Decorative */}
      <div aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(30,107,255,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="eyebrow-pill mb-5"
          >
            {language === "hi" ? "हमारी सेवाएं" : "Our Services"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="section-heading mb-5"
          >
            {language === "hi" ? (
              <>आधुनिक व्यवसायों के लिए <span className="text-brand-gradient">एंड-टू-एंड डिजिटल समाधान</span></>
            ) : (
              <>End-to-End <span className="text-brand-gradient">Digital Solutions</span><br />for Modern Businesses</>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="section-subheading mx-auto text-center"
          >
            {language === "hi"
              ? "हम रणनीति, डिज़ाइन और तकनीक को मिलकर शक्तिशाली डिजिटल अनुभव बनाते हैं जो मापने योग्य परिणाम देते हैं।"
              : "We combine strategy, design, and technology to deliver powerful digital experiences that drive measurable results."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="group premium-card relative overflow-hidden cursor-pointer"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                {/* Hover gradient accent */}
                <div aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(30,107,255,0.08), transparent 60%)"
                  }}
                />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: "linear-gradient(135deg, rgba(30,107,255,0.15), rgba(51,181,255,0.1))",
                      border: "1px solid var(--border-default)"
                    }}
                    onMouseMove={e => {
                      const r = (e.currentTarget.parentElement?.parentElement as HTMLElement)?.getBoundingClientRect()
                      if (r) {
                        const card = e.currentTarget.closest(".premium-card") as HTMLElement
                        card?.style.setProperty("--mx", `${e.clientX - r.left}px`)
                        card?.style.setProperty("--my", `${e.clientY - r.top}px`)
                      }
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "#33B5FF" }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 transition-colors group-hover:text-brand-gradient"
                    style={{ color: "var(--text-primary)" }}>
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                    {service.desc}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300"
                    style={{ color: "#33B5FF" }}>
                    Learn more <ArrowRight className="w-4 h-4" />
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
