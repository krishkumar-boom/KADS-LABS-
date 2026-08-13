"use client"

import { Boxes, Cpu, Database, Layers, MessageSquare, Shield, Sparkles, Workflow, ArrowRight } from "lucide-react"
import Link from "next/link"
import MagneticButton from "@/app/components/MagneticButton"
import ScrollReveal from "@/components/home/ScrollReveal"
import PageShell from "@/components/layout/PageShell"
import MarketingShell from "@/components/layout/MarketingShell"


const PRODUCTS = [
  { icon: Sparkles,    name: "KADS AI Studio",    tag: "AI",       desc: "Build, train and deploy custom AI agents and LLM workflows without writing infrastructure code.", color: "#8B5CF6", badge: "Coming Soon" },
  { icon: Cpu,         name: "KADS CloudCore",    tag: "Cloud",    desc: "Multi-cloud orchestration layer that unifies AWS, Azure and GCP under one observable control plane.", color: "#1E6BFF" },
  { icon: Database,    name: "KADS DataHub",      tag: "Data",     desc: "Managed analytics warehouse with built-in BI dashboards, ETL and AI-powered insights.", color: "#0EA5E9" },
  { icon: MessageSquare, name: "KADS SendStack",  tag: "Comms",    desc: "Transactional email, SMS and push notification infrastructure with 99.99% deliverability.", color: "#10B981" },
  { icon: Layers,      name: "KADS FlowKit",      tag: "Automation", desc: "Low-code automation builder for enterprise workflows — connect SaaS tools, databases and AI in minutes.", color: "#F59E0B" },
  { icon: Shield,      name: "KADS SecureVault",  tag: "Security", desc: "Zero-trust identity, secrets management and audit logging platform for regulated industries.", color: "#EF4444", badge: "Beta" },
  { icon: Boxes,       name: "KADS Pulse CRM",    tag: "Sales",    desc: "AI-first CRM that auto-logs calls, drafts follow-ups and scores leads using your own playbook.", color: "#EC4899" },
  { icon: Workflow,    name: "KADS DevGrid",      tag: "DevOps",   desc: "Internal developer platform with ephemeral environments, CI/CD and preview deployments.", color: "#14B8A6" },
]

export default function ProductsPage() {
  return (
    <MarketingShell>
      <PageShell
        eyebrow="Products"
        title={<>Platforms <span className="text-premium-gradient glow-text">engineered</span> in-house.</>}
        subtitle="Opinionated, production-grade products that accelerate every engagement — available standalone or embedded into custom engagements."
        cta={
          <>
            <MagneticButton onClick={() => { window.location.href = "/contact" }}>
              Request Access <ArrowRight className="w-4 h-4 ml-1" />
            </MagneticButton>
            <MagneticButton variant="outline" onClick={() => { window.location.href = "/solutions" }}>
              Browse Solutions
            </MagneticButton>
          </>
        }
        crumbs={[{ label: "Products" }]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRODUCTS.map((p, i) => {
            const Icon = p.icon
            return (
              <ScrollReveal key={p.name} delay={i * 0.05}>
                <div className="group premium-card cinematic-card h-full relative overflow-hidden">
                  <div className="service-card-shine" />
                  <div className="relative z-10 flex items-start gap-5">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${p.color}18`, border: `1px solid ${p.color}35` }}>
                      <Icon className="w-7 h-7" style={{ color: p.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                        {p.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase"
                            style={{ color: p.color, background: `${p.color}15`, border: `1px solid ${p.color}30` }}>
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: p.color }}>
                        {p.tag}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{p.desc}</p>
                      <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-medium mt-4 transition-all duration-300 group-hover:gap-2" style={{ color: p.color }}>
                        Talk to product team <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </PageShell>
    </MarketingShell>
  )
}
