"use client"

import { Target, Eye, Sparkles, Rocket, Shield, Zap, Building2, Globe2, ArrowRight } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import ScrollReveal from "@/components/home/ScrollReveal"
import PageShell from "@/components/layout/PageShell"
import MarketingShell from "@/components/layout/MarketingShell"


const VALUES = [
  { icon: Sparkles,  title: "Innovation First",       desc: "We ship cutting-edge AI-native engineering — not trendy demos. Production first." },
  { icon: Shield,    title: "Enterprise Security",   desc: "Zero-trust architecture, SOC-ready practices, end-to-end encryption on every project." },
  { icon: Rocket,    title: "Shipping Velocity",     desc: "Small senior teams, tight feedback loops, CI/CD from day one. You see progress weekly." },
  { icon: Zap,       title: "AI-Native Stack",       desc: "AI isn't bolted on — it's baked into products, processes and delivery." },
  { icon: Building2, title: "MSME Registered",       desc: "Udyam-registered Indian enterprise — Govt. of India certified for global delivery." },
  { icon: Globe2,    title: "Global Delivery",       desc: "Engineers, designers and marketers serving clients across India, US, UK, Canada and Australia." },
]

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageShell
        eyebrow="About KADS LABS"
        title={<>We are <span className="text-brand-gradient glow-text">engineers</span>, building the future.</>}
        subtitle="KADS LABS is an enterprise technology company headquartered in India, delivering AI-native software, cloud platforms, and mission-critical digital products to companies that refuse to look ordinary."
        cta={
          <>
            <MagneticButton onClick={() => { window.location.href = "/careers" }}>
              Join Our Team <ArrowRight className="w-4 h-4 ml-1" />
            </MagneticButton>
            <MagneticButton variant="outline" onClick={() => { window.location.href = "/contact" }}>
              Get in Touch
            </MagneticButton>
          </>
        }
        crumbs={[{ label: "About" }]}
      >
        {/* Mission / Vision */}
        <div className="grid md:grid-cols-2 gap-5 mb-24">
          <ScrollReveal>
            <div className="premium-card h-full">
              <Target className="w-8 h-8 mb-4" style={{ color: "#33B5FF" }} />
              <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Mission</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                To make world-class engineering accessible to every ambitious company —
                from early-stage founders to global enterprises — by combining AI-native
                technology, rigorous craftsmanship and honest delivery.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="premium-card h-full">
              <Eye className="w-8 h-8 mb-4" style={{ color: "#1E6BFF" }} />
              <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Vision</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                To be the operating system of the future — a single engineering partner
                that companies trust with their AI roadmap, cloud infrastructure, SaaS
                platforms and digital experiences for the next decade.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Values */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="eyebrow-pill mb-5 inline-flex">What we stand for</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>
              Engineering principles
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {VALUES.map((v, i) => {
            const Icon = v.icon
            return (
              <ScrollReveal key={v.title} delay={i * 0.05}>
                <div className="premium-card cinematic-card h-full">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: "rgba(30,107,255,0.1)", border: "1px solid rgba(51,181,255,0.2)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#33B5FF" }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Philosophy strip */}
        <ScrollReveal>
          <div className="relative premium-card p-10 sm:p-14 text-center overflow-hidden">
            <div aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(700px circle at 50% 0%, rgba(30,107,255,0.14), transparent 60%)" }}
            />
            <div className="relative z-10">
              <Sparkles className="w-8 h-8 mx-auto mb-4" style={{ color: "#33B5FF" }} />
              <p className="text-xl sm:text-2xl font-medium max-w-3xl mx-auto leading-relaxed" style={{ color: "var(--text-primary)" }}>
                "We don't sell websites. We engineer the digital backbone of the companies that will define the next decade."
              </p>
              <p className="text-xs uppercase tracking-[0.2em] mt-6" style={{ color: "var(--text-subtle)" }}>
                — KADS LABS Engineering Philosophy
              </p>
            </div>
          </div>
        </ScrollReveal>
      </PageShell>
    </MarketingShell>
  )
}
