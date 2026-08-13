"use client"

import { motion } from "framer-motion"
import { ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Sparkles, Building2, Globe, ShieldCheck } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import SafeImage from "@/app/components/SafeImage"
import { useLanguage } from "@/app/components/LanguageProvider"
import NewsletterSubscribe from "./NewsletterSubscribe"
import { ThreadsIcon } from "@/lib/custom-icons"
import Link from "next/link"

const SOCIALS = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/kadslabs" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/kadslabs" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/kadslabs.ceo" },
  { icon: Twitter, label: "X", href: "https://x.com/kadslabs" },
  { icon: ThreadsIcon, label: "Threads", href: "https://www.threads.com/@kadslabs" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@kadslabs" }
]

// Official footer links per spec
const QUICK_LINKS_EN = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Careers", href: "#careers" },
  { label: "Sitemap", href: "/sitemap.xml" }
]
const QUICK_LINKS_HI = [
  { label: "गोपनीयता नीति", href: "#" },
  { label: "सेवा की शर्तें", href: "#" },
  { label: "कुकीज़", href: "#" },
  { label: "करियर", href: "#careers" },
  { label: "साइटमैप", href: "/sitemap.xml" }
]

const DIVISIONS_EN = ["KADS LABS", "KADS MEDIA", "KADS TECHNOLOGIES", "AI Solutions", "Enterprise"]
const DIVISIONS_HI = ["KADS LABS", "KADS MEDIA", "KADS TECHNOLOGIES", "AI समाधान", "एंटरप्राइज़"]
const DIV_HREFS = ["#home", "#services", "#services", "#ai-solutions", "#enterprise"]

export default function PremiumFooter() {
  const { language } = useLanguage()
  const isHi = language === "hi"
  const links = isHi ? QUICK_LINKS_HI : QUICK_LINKS_EN

  const scrollTo = (href: string) => {
    if (href.startsWith("/") || href.startsWith("http")) {
      window.location.href = href
      return
    }
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <footer id="contact" className="relative pt-24 pb-10 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)",
        borderTop: "1px solid var(--border-subtle)"
      }}>
      {/* Top glow */}
      <div aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] -translate-y-1/2 rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(30,107,255,0.18), transparent 70%)" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-25 pointer-events-none" />

      {/* CTA Banner */}
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-14 text-center"
          style={{
            background: "linear-gradient(135deg, #1E6BFF 0%, #33B5FF 60%, #1E6BFF 100%)",
            boxShadow: "0 40px 100px -20px rgba(30,107,255,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
          }}>
          <div aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2), transparent 50%)"
            }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Sparkles className="w-3 h-3" />
              {isHi ? "आइए मिलकर कुछ अद्भुत बनाएं" : "Let's build something extraordinary"}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
              {isHi ? "अपने अगले प्रोजेक्ट के लिए तैयार हैं?" : "Ready to transform your business?"}
            </h2>
            <p className="text-white/85 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              {isHi
                ? "हमसे संपर्क करें और जानें कि KADS LABS आपके विजन को हकीकत में कैसे बदल सकता है।"
                : "Get in touch today and let's discuss how KADS LABS can turn your vision into reality."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <MagneticButton
                onClick={() => { window.location.href = "mailto:founderskadslabs@gmail.com" }}
                className="bg-white text-[#1E6BFF] hover:bg-white/95 font-semibold px-7 py-3 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                ariaLabel="Start a project"
              >
                {isHi ? "प्रोजेक्ट शुरू करें" : "Start a Project"} <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>
              <MagneticButton
                onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-7 py-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.08)" }}
                ariaLabel="Contact us"
              >
                {isHi ? "हमसे संपर्क करें" : "Contact Us"}
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer columns */}
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden" style={{ filter: "drop-shadow(0 4px 16px rgba(30,107,255,0.5))" }}>
                <SafeImage src="/logo-crystal.png" alt="KADS LABS" fill containerClassName="w-full h-full" className="object-contain" />
              </div>
              <div>
                <div className="font-bold text-xl tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
                  KADS <span className="text-brand-gradient">LABS</span>
                </div>
                <div className="text-[10px] tracking-wider uppercase" style={{ color: "var(--text-subtle)" }}>
                  Building Smarter Solutions
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-5 max-w-sm" style={{ color: "var(--text-muted)" }}>
              {isHi
                ? "KADS LABS एक वैश्विक प्रौद्योगिकी कंपनी है जो आधुनिक व्यवसायों के लिए AI-संचालित सॉफ्टवेयर, SaaS प्लेटफ़ॉर्म और डिजिटल समाधान बनाती है।"
                : "KADS LABS is a global technology company building AI-powered software, SaaS platforms, and digital solutions for modern enterprises."}
            </p>

            {/* MSME badge */}
            <div className="flex items-start gap-3 p-3 rounded-xl mb-5"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #FF9933, #138808)", color: "white" }}>
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider leading-tight" style={{ color: "var(--text-subtle)" }}>
                  Government of India
                </div>
                <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>MSME Registered</div>
                <div className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>UDYAM-UP-21-0061122</div>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
              <a href="mailto:founderskadslabs@gmail.com"
                className="flex items-center gap-2.5 transition-colors group hover:pl-1"
                onMouseEnter={e => (e.currentTarget.style.color = "#33B5FF")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                <Mail className="w-4 h-4 shrink-0" style={{ color: "#33B5FF" }} />
                <span>founderskadslabs@gmail.com</span>
              </a>
              <a href="tel:+917524979551"
                className="flex items-center gap-2.5 transition-colors group hover:pl-1"
                onMouseEnter={e => (e.currentTarget.style.color = "#33B5FF")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                <Phone className="w-4 h-4 shrink-0" style={{ color: "#33B5FF" }} />
                <span>+91 75249 79551</span>
              </a>
              <a href="https://kadslabs.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors group hover:pl-1"
                onMouseEnter={e => (e.currentTarget.style.color = "#33B5FF")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                <Globe className="w-4 h-4 shrink-0" style={{ color: "#33B5FF" }} />
                <span>https://kadslabs.com</span>
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#33B5FF" }} />
                <span>Tarkulwa, Deoria, Uttar Pradesh, India - 274408</span>
              </div>
            </div>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--text-primary)" }}>
              {isHi ? "डिवीजन" : "Divisions"}
            </h4>
            <ul className="space-y-2.5">
              {DIVISIONS_EN.map((l, i) => (
                <li key={l}>
                  <button onClick={() => scrollTo(DIV_HREFS[i])}
                    className="text-sm transition-all hover:pl-1"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#33B5FF")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                    {isHi ? DIVISIONS_HI[i] : l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--text-primary)" }}>
              {isHi ? "क्विक लिंक्स" : "Quick Links"}
            </h4>
            <ul className="space-y-2.5">
              {links.map(l => (
                <li key={l.label}>
                  <button onClick={() => scrollTo(l.href)}
                    className="text-sm transition-all hover:pl-1"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#33B5FF")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--text-primary)" }}>
              {isHi ? "फॉलो करें" : "Follow Us"}
            </h4>
            <div className="flex flex-wrap gap-2 mb-5">
              {SOCIALS.map(s => {
                const Icon = s.icon
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label} title={s.label}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-muted)"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "linear-gradient(135deg, #1E6BFF, #33B5FF)"
                      e.currentTarget.style.color = "white"
                      e.currentTarget.style.borderColor = "transparent"
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(30,107,255,0.4)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "var(--bg-tertiary)"
                      e.currentTarget.style.color = "var(--text-muted)"
                      e.currentTarget.style.borderColor = "var(--border-subtle)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-subtle)" }}>
              {isHi
                ? "नवीनतम अपडेट के लिए सब्सक्राइब करें।"
                : "Subscribe for product updates & launches."}
            </p>
            <NewsletterSubscribe variant="footer" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-subtle)" }}>
            <span>© {new Date().getFullYear()} KADS LABS.</span>
            <span className="opacity-50">·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" style={{ color: "#10B981" }} />
              {isHi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-subtle)" }}>
            <span className="flex items-center gap-1.5 font-mono">
              <Building2 className="w-3 h-3" style={{ color: "#FF9933" }} />
              UDYAM-UP-21-0061122
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
