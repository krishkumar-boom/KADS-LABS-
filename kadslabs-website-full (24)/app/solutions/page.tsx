"use client"

import { Brain, Building2, Cloud, Database, Heart, GraduationCap, ShoppingBag, Truck, Factory, Landmark, ArrowRight, Cpu, Radio, Workflow } from "lucide-react"
import Link from "next/link"
import MagneticButton from "@/app/components/MagneticButton"
import ScrollReveal from "@/components/home/ScrollReveal"
import PageShell from "@/components/layout/PageShell"
import MarketingShell from "@/components/layout/MarketingShell"


const SOLUTIONS = [
  { icon: Heart,          title: "Healthcare",           desc: "HIPAA-aligned telehealth, patient portals, clinical AI assistants and claims automation.",                                  color: "#EF4444", tag: "HealthTech" },
  { icon: GraduationCap,  title: "Education",            desc: "Learning platforms, AI tutors, exam proctoring, LMS integrations and institutional analytics.",                              color: "#10B981", tag: "EdTech" },
  { icon: Landmark,       title: "Fintech & Banking",    desc: "Secure payment systems, lending platforms, KYC automation, fraud detection and regulatory reporting.",                       color: "#F59E0B", tag: "FinTech" },
  { icon: ShoppingBag,    title: "E-Commerce",           desc: "Headless storefronts, recommendation engines, inventory AI and conversion optimisation at global scale.",                    color: "#EC4899", tag: "Retail" },
  { icon: Factory,        title: "Manufacturing",        desc: "Industrial IoT, predictive maintenance, MES integration and digital twins for factories and supply chains.",                 color: "#6366F1", tag: "Industry 4.0" },
  { icon: Truck,          title: "Logistics",            desc: "Real-time tracking, route optimisation AI, warehouse automation and fleet management systems.",                            color: "#0EA5E9", tag: "Supply Chain" },
  { icon: Building2,      title: "Real Estate",          desc: "Listing platforms, CRM, property intelligence, valuation models and tenant portals.",                                       color: "#14B8A6", tag: "PropTech" },
  { icon: Cloud,          title: "Cloud Transformation", desc: "Lift-and-shift migration, Kubernetes, serverless, FinOps and SRE for AWS / Azure / Google Cloud.",                          color: "#33B5FF", tag: "Cloud" },
  { icon: Database,       title: "Data Platforms",       desc: "Data lakes, warehouses, ETL pipelines, BI dashboards and LLM-powered knowledge search.",                                    color: "#8B5CF6", tag: "Data" },
  { icon: Cpu,            title: "AI Platforms",         desc: "Custom LLM integrations, RAG, AI agents, model serving infrastructure and MLOps pipelines.",                                 color: "#A78BFA", tag: "AI" },
  { icon: Radio,          title: "SaaS Products",        desc: "Multi-tenant SaaS foundations: auth, billing, RBAC, analytics, observability and growth tooling.",                          color: "#1E6BFF", tag: "SaaS" },
  { icon: Workflow,       title: "Automation",           desc: "Zapier/Make-style workflow builders tailored to your business, plus RPA for legacy systems.",                               color: "#F97316", tag: "Automation" },
]

export default function SolutionsPage() {
  return (
    <MarketingShell>
      <PageShell
        eyebrow="Solutions"
        title={<>AI-native solutions for <span className="text-brand-gradient glow-text">every industry.</span></>}
        subtitle="Battle-tested reference architectures that compress a 12-month digital roadmap into weeks of deployment — built on KADS LABS' enterprise platform."
        cta={
          <>
            <MagneticButton onClick={() => { window.location.href = "/contact" }}>
              Request a Demo <ArrowRight className="w-4 h-4 ml-1" />
            </MagneticButton>
            <MagneticButton variant="outline" onClick={() => { window.location.href = "/services" }}>
              See All Services
            </MagneticButton>
          </>
        }
        crumbs={[{ label: "Solutions" }]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOLUTIONS.map((s, i) => {
            const Icon = s.icon
            return (
              <ScrollReveal key={s.title} delay={i * 0.04}>
                <Link href="/contact" className="block premium-card cinematic-card h-full group relative overflow-hidden">
                  <div className="service-card-shine" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                        <Icon className="w-6 h-6" style={{ color: s.color }} />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full tracking-wider uppercase"
                        style={{ color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
                    <div className="inline-flex items-center gap-1 text-sm font-medium mt-5 transition-all duration-300 group-hover:gap-2" style={{ color: s.color }}>
                      Explore solution <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </PageShell>
    </MarketingShell>
  )
}
