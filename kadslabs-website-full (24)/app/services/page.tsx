"use client"

import {
  Bot, Cog, Code2, Layers, Globe, Smartphone, Palette, Brush, Cloud, Server, Network,
  Database, Shield, Link2, BarChart3, Building2, ArrowRight, Brain, Megaphone, LineChart, Workflow
} from "lucide-react"
import Link from "next/link"
import MagneticButton from "@/app/components/MagneticButton"
import ScrollReveal from "@/components/home/ScrollReveal"
import PageShell from "@/components/layout/PageShell"
import MarketingShell from "@/components/layout/MarketingShell"


const SERVICES = [
  { icon: Brain,       title: "AI Development",       desc: "Custom machine learning, LLMs, computer vision and intelligent agents integrated into your product.",            color: "#8B5CF6" },
  { icon: Cog,         title: "AI Automation",        desc: "Intelligent workflows, RPA, and AI agents that replace repetitive work across operations.",                       color: "#A78BFA" },
  { icon: Code2,       title: "Custom Software",      desc: "Bespoke software engineered for your exact business rules, workflows and compliance needs.",                         color: "#1E6BFF" },
  { icon: Layers,      title: "SaaS Development",     desc: "Multi-tenant SaaS platforms with billing, auth, analytics, observability and global scale.",                        color: "#33B5FF" },
  { icon: Globe,       title: "Web Applications",     desc: "Modern, lightning-fast web apps built with Next.js, React and TypeScript — accessible everywhere.",                color: "#EC4899" },
  { icon: Smartphone,  title: "Mobile Apps",          desc: "Native iOS/Android and cross-platform Flutter/React Native apps with offline-first design.",                       color: "#10B981" },
  { icon: Palette,     title: "UI/UX Design",         desc: "Product design systems, user research, prototyping and high-fidelity interfaces that convert.",                    color: "#F59E0B" },
  { icon: Brush,       title: "Branding",             desc: "Identity systems, visual language, and brand experiences that set you apart in a crowded market.",                 color: "#EF4444" },
  { icon: Cloud,       title: "Cloud Solutions",      desc: "AWS, Azure and GCP architecture, migration, Kubernetes, serverless and FinOps optimisation.",                      color: "#0EA5E9" },
  { icon: Server,      title: "DevOps & SRE",         desc: "CI/CD pipelines, infrastructure as code, monitoring, incident response and 24/7 reliability engineering.",         color: "#14B8A6" },
  { icon: Network,     title: "API Development",      desc: "REST & GraphQL APIs built for scale, with versioning, auth, rate limiting and developer docs.",                   color: "#6366F1" },
  { icon: Database,    title: "CRM & ERP",            desc: "Tailored CRM, ERP and line-of-business systems that unify sales, operations and finance.",                        color: "#06B6D4" },
  { icon: Shield,      title: "Cybersecurity",        desc: "Zero-trust architecture, SOC2/ISO-ready controls, penetration testing and incident response.",                    color: "#EF4444" },
  { icon: Workflow,    title: "Digital Transformation", desc: "End-to-end modernisation of legacy systems for enterprises moving to AI-native stacks.",                        color: "#8B5CF6" },
  { icon: BarChart3,   title: "Data & Analytics",     desc: "Dashboards, warehouses, ETL and ML pipelines that turn raw data into revenue-driving decisions.",                 color: "#10B981" },
  { icon: Building2,   title: "Enterprise Software",  desc: "Mission-critical systems for large organisations: procurement, HRMS, supply-chain and industry-specific tools.",    color: "#33B5FF" },
  { icon: Megaphone,   title: "Digital Marketing",    desc: "Performance marketing, SEO, content production and paid campaigns that compound pipeline.",                       color: "#F59E0B" },
  { icon: LineChart,   title: "Performance Ads",      desc: "Meta, Google and LinkedIn ads engineered for ROAS — not impressions — with granular attribution.",                 color: "#EF4444" },
]

export default function ServicesPage() {
  return (
    <MarketingShell>
      <PageShell
        eyebrow="Our Services"
        title={<>End-to-end <span className="text-brand-gradient glow-text">engineering</span> for modern enterprises.</>}
        subtitle="From AI strategy to production rollout, KADS LABS delivers every layer of the modern technology stack — engineered to scale, secured by design, and ready for revenue."
        accent="#1E6BFF"
        cta={
          <>
            <MagneticButton onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}>
              Start a Project <ArrowRight className="w-4 h-4 ml-1" />
            </MagneticButton>
            <MagneticButton variant="outline" onClick={() => { window.location.href = "/contact" }}>
              Talk to Sales
            </MagneticButton>
          </>
        }
        crumbs={[{ label: "Services" }]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <ScrollReveal key={s.title} delay={i * 0.04}>
                <div className="group premium-card cinematic-card relative overflow-hidden h-full">
                  <div aria-hidden="true" className="service-card-shine" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${s.color}25, ${s.color}12)`,
                        border: `1px solid ${s.color}30`
                      }}>
                      <Icon className="w-6 h-6" style={{ color: s.color }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                      {s.desc}
                    </p>
                    <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" style={{ color: s.color }}>
                      Discuss a project <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* CTA strip */}
        <ScrollReveal delay={0.2} className="mt-24">
          <div className="relative premium-card overflow-hidden p-10 sm:p-14 text-center">
            <div aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(600px circle at 50% 0%, rgba(30,107,255,0.15), transparent 60%)" }}
            />
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-4" style={{ color: "var(--text-primary)" }}>
                Not sure which service fits?
              </h3>
              <p className="max-w-xl mx-auto mb-7" style={{ color: "var(--text-secondary)" }}>
                Book a free 30-minute discovery call. We'll map your goals to the right stack, team, and timeline.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <MagneticButton onClick={() => { window.location.href = "/contact" }}>
                  Book a Discovery Call <ArrowRight className="w-4 h-4 ml-1" />
                </MagneticButton>
                <MagneticButton variant="outline" onClick={() => { window.location.href = "/solutions" }}>
                  Explore Solutions
                </MagneticButton>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </PageShell>
    </MarketingShell>
  )
}
