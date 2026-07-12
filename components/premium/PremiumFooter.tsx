"use client"

import { motion } from "framer-motion"
import { ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, Sparkles } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import SafeImage from "@/app/components/SafeImage"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useContent } from "@/app/components/ContentProvider"
import Link from "next/link"

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/kadslabs" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/kadslabs" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/kadslabs" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/kadslabs" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@kadslabs" }
]

const QUICK_LINKS_EN = ["Home", "About", "Services", "Products", "Pricing", "Contact"]
const QUICK_LINKS_HI = ["होम", "हमारे बारे में", "सेवाएं", "प्रोडक्ट्स", "प्राइसिंग", "संपर्क"]
const QUICK_HREFS = ["#home", "#about", "#services", "#products", "#pricing", "#contact"]

const DIVISIONS_EN = ["KADS LABS", "KADS MEDIA", "KADS TECHNOLOGIES", "AI Solutions", "Enterprise"]
const DIVISIONS_HI = ["KADS LABS", "KADS MEDIA", "KADS TECHNOLOGIES", "AI समाधान", "एंटरप्राइज़"]
const DIV_HREFS = ["#home", "#divisions", "#services", "#ai-solutions", "#enterprise"]

export default function PremiumFooter() {
  const { language } = useLanguage()
  const { siteData } = useContent()

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth" })
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
        style={{ background: "radial-gradient(ellipse, rgba(30,107,255,0.15), transparent 70%)" }}
      />

      {/* CTA Banner */}
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, #1E6BFF 0%, #33B5FF 60%, #1E6BFF 100%)",
            boxShadow: "0 40px 100px -20px rgba(30,107,255,0.5), 0 0 0 1px rgba(255,255,255,0.1)"
          }}>
          <div aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.2), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.15), transparent 50%)"
            }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(10px)" }}>
              <Sparkles className="w-3 h-3" />
              {language === "hi" ? "आइए मिलकर कुछ अद्भुत बनाएं" : "Let's build something extraordinary"}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
              {language === "hi"
                ? "अपने अगले प्रोजेक्ट के लिए तैयार हैं?"
                : "Ready to transform your business?"}
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              {language === "hi"
                ? "हमसे संपर्क करें और जानें कि KADS LABS आपके विजन को हकीकत में कैसे बदल सकता है।"
                : "Get in touch today and let's discuss how KADS LABS can turn your vision into reality."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <MagneticButton
                onClick={() => window.location.href = "mailto:founderskadslabs@gmail.com"}
                className="bg-white text-[#1E6BFF] hover:bg-white/90 font-semibold px-7 py-3 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
                ariaLabel="Start a project"
              >
                {language === "hi" ? "प्रोजेक्ट शुरू करें" : "Start a Project"} <ArrowRight className="w-4 h-4 ml-1" />
              </MagneticButton>
              <MagneticButton
                onClick={() => scrollTo("#pricing")}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-7 py-3 rounded-xl"
                ariaLabel="View pricing"
              >
                {language === "hi" ? "प्राइसिंग देखें" : "View Pricing"}
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer columns */}
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden" style={{ filter: "drop-shadow(0 4px 12px rgba(30,107,255,0.4))" }}>
                <SafeImage src="./logo.png" alt="KADS LABS" fill containerClassName="w-full h-full" className="object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>
                KADS <span style={{ color: "#33B5FF" }}>LABS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm" style={{ color: "var(--text-muted)" }}>
              {language === "hi"
                ? "KADS LABS एक वैश्विक प्रौद्योगिकी कंपनी है जो आधुनिक व्यवसायों के लिए AI-संचालित सॉफ्टवेयर, SaaS प्लेटफ़ॉर्म और डिजिटल समाधान बनाती है।"
                : "KADS LABS is a global technology company building AI-powered software, SaaS platforms, and digital solutions for modern enterprises."}
            </p>
            <div className="space-y-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
              <a href={`mailto:${siteData.contact?.email || "founderskadslabs@gmail.com"}`}
                className="flex items-center gap-2.5 hover:text-brand-gradient transition-colors">
                <Mail className="w-4 h-4" style={{ color: "#33B5FF" }} /> {siteData.contact?.email || "founderskadslabs@gmail.com"}
              </a>
              <a href={`tel:${siteData.contact?.phone || "+917524979551"}`}
                className="flex items-center gap-2.5 hover:text-brand-gradient transition-colors">
                <Phone className="w-4 h-4" style={{ color: "#33B5FF" }} /> {siteData.contact?.phone || "+91 75249 79551"}
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#33B5FF" }} />
                <span>{siteData.contact?.address || "Tarkulwa, Deoria, Uttar Pradesh, India - 274408"}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)" }}>
              {language === "hi" ? "क्विक लिंक्स" : "Quick Links"}
            </h4>
            <ul className="space-y-2.5">
              {(language === "hi" ? QUICK_LINKS_HI : QUICK_LINKS_EN).map((l, i) => (
                <li key={l}>
                  <button onClick={() => scrollTo(QUICK_HREFS[i])}
                    className="text-sm transition-colors hover:pl-1"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#33B5FF")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)" }}>
              {language === "hi" ? "डिवीजन" : "Divisions"}
            </h4>
            <ul className="space-y-2.5">
              {(language === "hi" ? DIVISIONS_HI : DIVISIONS_EN).map((l, i) => (
                <li key={l}>
                  <button onClick={() => scrollTo(DIV_HREFS[i])}
                    className="text-sm transition-colors hover:pl-1"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#33B5FF")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)" }}>
              {language === "hi" ? "फॉलो करें" : "Follow Us"}
            </h4>
            <div className="flex gap-2 mb-6">
              {SOCIALS.map(s => {
                const Icon = s.icon
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-tertiary)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-muted)"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg, #1E6BFF, #33B5FF)"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-subtle)" }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
              {language === "hi"
                ? "नवीनतम अपडेट, ब्लॉग और प्रोजेक्ट लॉन्च के लिए हमें फॉलो करें।"
                : "Follow us for updates, blogs, and project launches."}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
            © {new Date().getFullYear()} KADS LABS. {language === "hi" ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
          </p>
          <div className="flex items-center gap-5 text-xs" style={{ color: "var(--text-subtle)" }}>
            <a href="#" className="hover:text-brand-gradient transition-colors">{language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}</a>
            <a href="#" className="hover:text-brand-gradient transition-colors">{language === "hi" ? "सेवा की शर्तें" : "Terms of Service"}</a>
            <a href="#" className="hover:text-brand-gradient transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
