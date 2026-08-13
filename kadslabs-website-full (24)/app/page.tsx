"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight, Brain, Building2, Cloud, Cpu, Layers, Factory, GraduationCap,
  Heart, ShoppingBag, Landmark, Briefcase, Sparkles, MessageSquare, Users
} from "lucide-react"
import LoadingScreen from "./components/LoadingScreen"
import ScrollProgress from "./components/ScrollProgress"
import CursorGlow from "./components/CursorGlow"
import PremiumNavbar from "@/components/premium/PremiumNavbar"
import PremiumHero from "@/components/premium/PremiumHero"
import MagneticButton from "./components/MagneticButton"
import ParticleBackground from "./components/ParticleBackground"
import MetadataUpdater from "./components/MetadataUpdater"
import PWARegister from "./components/PWARegister"
import ErrorBoundary from "./components/ErrorBoundary"
import FloatingWhatsApp from "./components/FloatingWhatsApp"
import PremiumFooter from "@/components/premium/PremiumFooter"
import PremiumFAQ from "@/components/premium/PremiumFAQ"
import NewsletterBanner from "@/components/premium/NewsletterBanner"
import TrustSection from "@/components/premium/TrustSection"
import { trackEvent } from "./components/admin/AnalyticsPanel"
import dynamic from "next/dynamic"
import ScrollReveal from "@/components/home/ScrollReveal"

// Heavy sections lazy-loaded
const ContactForm = dynamic(() => import("@/components/premium/ContactForm"), { loading: () => null })
const TeamSection = dynamic(() => import("@/components/premium/TeamSection"), { loading: () => null })
const DashboardPreview = dynamic(() => import("@/components/premium/DashboardPreview"), { loading: () => null })

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return
    trackEvent("page_view", { path: window.location.pathname, referrer: document.referrer })
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <ErrorBoundary>
      <main id="main-content" tabIndex={-1} className="relative min-h-screen outline-none" style={{ background: "var(--bg-primary)" }}>
        <LoadingScreen />
        <ScrollProgress />
        <CursorGlow />
        <PremiumNavbar />
        <ParticleBackground />
        <MetadataUpdater />
        <PWARegister />

        {/* Cinematic Hero */}
        <PremiumHero />
        <TrustSection />

        {/* ======== PREVIEW: Services ======== */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(30,107,255,0.1), transparent 70%)" }}
          />
          <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
            <ScrollReveal className="text-center mb-14">
              <span className="eyebrow-pill mb-5 inline-flex">What we do</span>
              <h2 className="section-heading mb-5">
                A full-stack <span className="text-brand-gradient glow-text">engineering</span> partner.
              </h2>
              <p className="section-subheading mx-auto text-center">
                From AI strategy to production deployments, we build every layer of modern digital products.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              {[
                { icon: Brain,      label: "AI / ML",          color: "#A78BFA" },
                { icon: Layers,     label: "SaaS",             color: "#33B5FF" },
                { icon: Building2,  label: "Enterprise",       color: "#1E6BFF" },
                { icon: Cloud,      label: "Cloud",            color: "#0EA5E9" },
                { icon: Cpu,        label: "Mobile Apps",      color: "#10B981" },
                { icon: Briefcase,  label: "Digital Marketing",color: "#F59E0B" },
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <ScrollReveal key={s.label} delay={i * 0.05}>
                    <Link href="/services" className="premium-card cinematic-card group flex flex-col items-center text-center p-5 h-full">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                        style={{ background: `${s.color}18`, border: `1px solid ${s.color}35` }}>
                        <Icon className="w-5 h-5" style={{ color: s.color }} />
                      </div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.label}</div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>

            <div className="flex justify-center">
              <MagneticButton variant="outline" onClick={() => location.href = "/services"} ariaLabel="Explore all services">
                Explore all 18 services <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* ======== PREVIEW: Solutions / Industries ======== */}
        <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
          <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <span className="eyebrow-pill mb-5 inline-flex">Solutions by industry</span>
                <h2 className="section-heading mb-6">
                  Built for <span className="text-premium-gradient glow-text">your sector.</span>
                </h2>
                <p className="section-subheading mb-8">
                  Reference architectures for regulated and high-growth industries — deploy in weeks, not quarters.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: Heart,        label: "Healthcare",         color: "#EF4444" },
                    { icon: GraduationCap,label: "Education",          color: "#10B981" },
                    { icon: Landmark,     label: "Financial Services", color: "#F59E0B" },
                    { icon: ShoppingBag,  label: "E-Commerce",         color: "#EC4899" },
                    { icon: Factory,      label: "Manufacturing",      color: "#6366F1" },
                    { icon: Cloud,        label: "Cloud Migration",    color: "#33B5FF" },
                  ].map(i => {
                    const Icon = i.icon
                    return (
                      <Link href="/industries" key={i.label}
                        className="group flex items-center gap-3 p-3 rounded-xl transition-all hover:pl-4"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = "var(--text-primary)"
                          e.currentTarget.style.background = "var(--bg-tertiary)"
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = "var(--text-secondary)"
                          e.currentTarget.style.background = "transparent"
                        }}>
                        <Icon className="w-4 h-4 shrink-0" style={{ color: i.color }} />
                        <span className="text-sm font-medium">{i.label}</span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: i.color }} />
                      </Link>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3">
                  <MagneticButton onClick={() => location.href = "/solutions"} ariaLabel="Explore solutions">
                    Solutions <ArrowRight className="w-4 h-4 ml-1" />
                  </MagneticButton>
                  <MagneticButton variant="outline" onClick={() => location.href = "/industries"} ariaLabel="All industries">
                    All industries
                  </MagneticButton>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="premium-card cinematic-card p-8 relative overflow-hidden">
                  <div aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(500px circle at 0% 0%, rgba(30,107,255,0.1), transparent 60%)" }} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: "linear-gradient(135deg, #1E6BFF, #33B5FF)" }}>
                      <Sparkles className="w-6 h-6" style={{ color: "white" }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                      AI-native by default
                    </h3>
                    <p className="mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      Every platform we ship ships with AI capabilities built-in — from intelligent search and
                      document understanding to predictive analytics and agentic automation.
                    </p>
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#33B5FF" }}>
                      Explore our product platforms <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ======== PREVIEW: Platform / Dashboard ======== */}
        <DashboardPreview />

        {/* ======== About/Team preview ======== */}
        <section className="relative py-24 sm:py-32">
          <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
              <ScrollReveal>
                <span className="eyebrow-pill mb-5 inline-flex">Who we are</span>
                <h2 className="section-heading mb-6">
                  Senior engineers. <span className="text-brand-gradient glow-text">Zero bureaucracy.</span>
                </h2>
                <p className="section-subheading mb-8">
                  KADS LABS is an MSME-registered Indian technology company building AI-native software
                  for clients across India, the US, UK, Canada and Australia. We keep teams small, senior,
                  and deeply aligned with your outcomes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <MagneticButton variant="outline" onClick={() => location.href = "/about"} ariaLabel="About us">
                    Our story <ArrowRight className="w-4 h-4 ml-1" />
                  </MagneticButton>
                  <MagneticButton variant="outline" onClick={() => location.href = "/careers"} ariaLabel="Careers">
                    Open roles
                  </MagneticButton>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Users, label: "Senior Team", desc: "Small, senior-only engineering pods." },
                    { icon: Building2, label: "MSME Registered", desc: "Govt. of India certified." },
                    { icon: Sparkles, label: "AI-Native", desc: "Every product ships with AI built-in." },
                    { icon: MessageSquare, label: "24h Response", desc: "Engineers reply, not sales reps." },
                  ].map(f => {
                    const Icon = f.icon
                    return (
                      <div key={f.label} className="premium-card p-5 cinematic-card">
                        <Icon className="w-5 h-5 mb-3" style={{ color: "#33B5FF" }} />
                        <div className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{f.label}</div>
                        <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</div>
                      </div>
                    )
                  })}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <TeamSection />

        {/* ======== Careers preview CTA ======== */}
        <section className="relative py-20" style={{ background: "var(--bg-secondary)" }}>
          <div className="max-w-[1400px] mx-auto section-padding text-center">
            <ScrollReveal>
              <span className="eyebrow-pill mb-5 inline-flex">Careers</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.02em] mb-5" style={{ color: "var(--text-primary)" }}>
                Build the future <span className="text-brand-gradient">with us.</span>
              </h2>
              <p className="max-w-xl mx-auto mb-7" style={{ color: "var(--text-secondary)" }}>
                We're hiring engineers, designers and marketers who refuse to ship ordinary work.
              </p>
              <MagneticButton onClick={() => location.href = "/careers"} ariaLabel="View open positions">
                View Open Positions <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>
            </ScrollReveal>
          </div>
        </section>

        {/* ======== FAQ ======== */}
        <PremiumFAQ />

        {/* ======== Contact ======== */}
        <section id="contact-form" className="relative">
          <ContactForm />
        </section>

        <NewsletterBanner />
        <PremiumFooter />

        <FloatingWhatsApp />
      </main>
    </ErrorBoundary>
  )
}
