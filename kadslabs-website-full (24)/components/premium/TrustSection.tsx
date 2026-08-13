"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ShieldCheck, Building2, Brain, Cloud, Clock, Eye, Lock, Code, Award, HeadphonesIcon } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const TRUST_FACTORS = [
  {
    icon: Building2,
    title: "MSME Registered",
    titleHi: "MSME पंजीकृत",
    desc: "Udyam-registered enterprise under Government of India.",
    descHi: "भारत सरकार के अंतर्गत उद्यम पंजीकृत कंपनी।"
  },
  {
    icon: ShieldCheck,
    title: "Secure Development",
    titleHi: "सुरक्षित डेवलपमेंट",
    desc: "Zero-trust architecture, end-to-end encryption, secure SDLC.",
    descHi: "शून्य-विश्वास आर्किटेक्चर, एंड-टू-एंड एन्क्रिप्शन।"
  },
  {
    icon: Brain,
    title: "AI-Driven Engineering",
    titleHi: "AI-संचालित इंजीनियरिंग",
    desc: "LLMs, RAG systems, and intelligent automation built-in.",
    descHi: "LLM, RAG सिस्टम, और इंटेलिजेंट ऑटोमेशन।"
  },
  {
    icon: Cloud,
    title: "Enterprise Architecture",
    titleHi: "एंटरप्राइज़ आर्किटेक्चर",
    desc: "Scalable multi-tenant systems with 99.9% uptime design.",
    descHi: "99.9% अपटाइम के साथ स्केलेबल मल्टी-टेनेंट सिस्टम।"
  },
  {
    icon: Code,
    title: "Scalable Codebase",
    titleHi: "स्केलेबल कोडबेस",
    desc: "TypeScript, clean architecture, tested for growth.",
    descHi: "TypeScript, क्लीन आर्किटेक्चर, विकास के लिए तैयार।"
  },
  {
    icon: HeadphonesIcon,
    title: "Long-Term Support",
    titleHi: "दीर्घकालिक सपोर्ट",
    desc: "Ongoing maintenance, monitoring, and technical partnership.",
    descHi: "निरंतर रखरखाव, मॉनिटरिंग और तकनीकी साझेदारी।"
  },
  {
    icon: Eye,
    title: "Transparent Process",
    titleHi: "पारदर्शी प्रक्रिया",
    desc: "Clear communication, weekly updates, and honest timelines.",
    descHi: "स्पष्ट संचार, साप्ताहिक अपडेट, ईमानदार टाइमलाइन।"
  },
  {
    icon: Lock,
    title: "Data Privacy First",
    titleHi: "डेटा प्राइवेसी",
    desc: "GDPR-aware, client data never shared or sold.",
    descHi: "GDPR-अनुरूप, क्लाइंट डेटा कभी साझा नहीं किया जाता।"
  }
]

export default function TrustSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const isHi = language === "hi"

  return (
    <section id="trust" ref={ref} className="relative py-24 sm:py-28 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-14">
          <span className="eyebrow-pill mb-5">
            <ShieldCheck className="w-3 h-3" /> {isHi ? "क्यों भरोसा करें" : "Why trust KADS LABS"}
          </span>
          <h2 className="section-heading mb-5">
            {isHi ? (
              <>एंटरप्राइज़-ग्रेड <span className="text-brand-gradient">विश्वास</span></>
            ) : (
              <>Built on <span className="text-brand-gradient">trust & quality</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {isHi
              ? "हम पारदर्शिता, सुरक्षा और लंबे समय की साझेदारी पर विश्वास करते हैं।"
              : "We build on transparency, security, and long-term technical partnership — not on fake awards or paid badges."}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {TRUST_FACTORS.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="premium-card p-5 text-center flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: "rgba(30,107,255,0.1)", border: "1px solid rgba(30,107,255,0.2)" }}>
                  <Icon className="w-6 h-6" style={{ color: "#33B5FF" }} />
                </div>
                <h4 className="font-semibold text-sm sm:text-base" style={{ color: "var(--text-primary)" }}>
                  {isHi ? f.titleHi : f.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {isHi ? f.descHi : f.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* MSME certification callout */}
        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 p-5 sm:p-6 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,153,51,0.08), rgba(19,136,8,0.08))",
              border: "1px solid var(--border-default)"
            }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #FF9933, #138808)", color: "white" }}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
                  Government of India
                </div>
                <div className="font-bold" style={{ color: "var(--text-primary)" }}>MSME Registered Enterprise</div>
                <div className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>UDYAM-UP-21-0061122</div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12" style={{ background: "var(--border-default)" }} />
            <p className="text-xs sm:text-sm max-w-sm text-center sm:text-left" style={{ color: "var(--text-muted)" }}>
              {isHi
                ? "उद्यम पंजीकरण संख्या के तहत पंजीकृत भारतीय सूक्ष्म उद्यम।"
                : "Registered Indian micro-enterprise under the Ministry of MSME."}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
