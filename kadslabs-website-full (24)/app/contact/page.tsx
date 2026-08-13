"use client"

import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import ContactForm from "@/components/premium/ContactForm"
import PageShell from "@/components/layout/PageShell"
import MarketingShell from "@/components/layout/MarketingShell"
import ScrollReveal from "@/components/home/ScrollReveal"


const CHANNELS = [
  { icon: Mail,      label: "Email",           value: "founderskadslabs@gmail.com", href: "mailto:founderskadslabs@gmail.com" },
  { icon: Phone,     label: "Phone",           value: "+91 75249 79551",             href: "tel:+917524979551" },
  { icon: MapPin,    label: "Headquarters",    value: "Tarkulwa, Deoria, Uttar Pradesh 274408, India", href: "https://maps.google.com/?q=Deoria+Uttar+Pradesh" },
  { icon: Clock,     label: "Response Time",   value: "Within 24 hours, Mon–Sat",     href: "#" },
  { icon: MessageSquare, label: "WhatsApp",    value: "Chat instantly",              href: "#", action: "whatsapp" },
]

export default function ContactPage() {
  return (
    <MarketingShell>
      <PageShell
        eyebrow="Contact"
        title={<>Let's build something <span className="text-brand-gradient glow-text">extraordinary.</span></>}
        subtitle="Tell us about your project — an engineer, not a sales rep, will respond within 24 hours."
        crumbs={[{ label: "Contact" }]}
      >
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8">
          {/* Left — channels */}
          <ScrollReveal>
            <div className="space-y-4">
              <div className="premium-card">
                <h3 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
                  How to reach us
                </h3>
                <div className="space-y-4">
                  {CHANNELS.map(c => {
                    const Icon = c.icon
                    const isWa = c.action === "whatsapp"
                    return (
                      <a
                        key={c.label}
                        href={isWa ? "https://wa.me/917524979551?text=Hi%20KADS%20LABS%2C%20I%27d%20like%20to%20discuss%20a%20project." : c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-4 p-3 -mx-3 rounded-xl transition-all hover:pl-4"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)" }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)" }}
                      >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(30,107,255,0.1)", border: "1px solid rgba(51,181,255,0.2)" }}>
                          <Icon className="w-4 h-4" style={{ color: "#33B5FF" }} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-0.5" style={{ color: "var(--text-subtle)" }}>{c.label}</div>
                          <div className="text-sm font-medium">{c.value}</div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>

              <div className="premium-card"
                style={{
                  background: "linear-gradient(135deg, rgba(30,107,255,0.12), rgba(51,181,255,0.06))",
                  border: "1px solid rgba(30,107,255,0.25)"
                }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Need a quote fast?</h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                  Use our dedicated quote builder for budget estimates and detailed proposals.
                </p>
                <MagneticButton onClick={() => location.href = "/quote"} variant="outline" className="w-full justify-center">
                  Request a Quote <ArrowRight className="w-4 h-4 ml-1" />
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — form */}
          <ScrollReveal delay={0.1}>
            <div className="premium-card" style={{ padding: 0, overflow: "hidden" }}>
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </PageShell>
    </MarketingShell>
  )
}
