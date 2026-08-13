"use client"

import { ArrowRight, Heart, GraduationCap, Landmark, ShoppingBag, Factory, Truck, Building2, Plane, Cpu, Radio, Briefcase, Film } from "lucide-react"
import Link from "next/link"
import MagneticButton from "@/app/components/MagneticButton"
import ScrollReveal from "@/components/home/ScrollReveal"
import PageShell from "@/components/layout/PageShell"
import MarketingShell from "@/components/layout/MarketingShell"


const INDUSTRIES = [
  { icon: Heart,        name: "Healthcare",       desc: "HIPAA-aligned platforms, telehealth, clinical AI and medical device software.", color: "#EF4444" },
  { icon: GraduationCap,name: "Education",        desc: "Learning management, AI tutors, admissions automation and institutional analytics.", color: "#10B981" },
  { icon: Landmark,     name: "Financial Services", desc: "Core banking, payments, lending, KYC, fraud and regtech — SOC-ready.", color: "#F59E0B" },
  { icon: ShoppingBag,  name: "Retail & D2C",     desc: "Headless commerce, personalisation AI and omnichannel experiences at scale.", color: "#EC4899" },
  { icon: Factory,      name: "Manufacturing",    desc: "Industrial IoT, digital twins, predictive maintenance and smart factories.", color: "#6366F1" },
  { icon: Truck,        name: "Logistics",        desc: "Fleet telemetry, warehouse automation, route AI and supply-chain visibility.", color: "#0EA5E9" },
  { icon: Building2,    name: "Real Estate",      desc: "PropTech platforms, CRM, tenant portals and property intelligence.", color: "#14B8A6" },
  { icon: Plane,        name: "Aviation",         desc: "Booking systems, operations software and crew-management platforms.", color: "#33B5FF" },
  { icon: Film,         name: "Media & Entertainment", desc: "Streaming, content CMS, rights management and creator tooling.", color: "#A78BFA" },
  { icon: Radio,        name: "Telecom",          desc: "OSS/BSS, network analytics and customer-experience platforms.", color: "#F97316" },
  { icon: Cpu,          name: "SaaS & Software",  desc: "Multi-tenant platforms, PLG growth tooling and AI-native products.", color: "#1E6BFF" },
  { icon: Briefcase,    name: "Professional Services", desc: "Client portals, delivery automation and knowledge management for firms.", color: "#8B5CF6" },
]

export default function IndustriesPage() {
  return (
    <MarketingShell>
      <PageShell
        eyebrow="Industries"
        title={<>Deep expertise across <span className="text-brand-gradient glow-text">12+ sectors.</span></>}
        subtitle="We don't ship generic software. Every engagement is staffed with engineers who understand the regulatory, operational and commercial realities of your industry."
        cta={
          <>
            <MagneticButton onClick={() => { window.location.href = "/contact" }}>
              Discuss Your Industry <ArrowRight className="w-4 h-4 ml-1" />
            </MagneticButton>
            <MagneticButton variant="outline" onClick={() => { window.location.href = "/solutions" }}>
              Explore Solutions
            </MagneticButton>
          </>
        }
        crumbs={[{ label: "Industries" }]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ind.icon
            return (
              <ScrollReveal key={ind.name} delay={i * 0.035}>
                <Link href="/contact" className="block premium-card cinematic-card group h-full relative overflow-hidden">
                  <div className="service-card-shine" />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${ind.color}15`, border: `1px solid ${ind.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color: ind.color }} />
                    </div>
                    <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{ind.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{ind.desc}</p>
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
