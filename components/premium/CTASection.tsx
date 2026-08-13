"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { CalendarDays, Mail, MessageSquare, FileText, ArrowRight, Sparkles } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import MagneticButton from "@/app/components/MagneticButton"
import { useLanguage } from "@/app/components/LanguageProvider"
import { openWhatsAppLead } from "@/lib/leads"

const ACTIONS_EN = [
  { icon: CalendarDays, title: "Book a Consultation", desc: "Schedule a free 30-minute strategy call with our team.", cta: "Book Now", action: "meeting", color: "#1E6BFF" },
  { icon: Mail, title: "Contact Us", desc: "Send us a message and we'll get back within 24 hours.", cta: "Send Message", action: "contact", color: "#33B5FF" },
  { icon: MessageSquare, title: "Chat on WhatsApp", desc: "Instant conversation — get answers right away.", cta: "Open WhatsApp", action: "whatsapp", color: "#25D366" },
  { icon: FileText, title: "Get a Custom Quote", desc: "Tell us about your project for a tailored proposal.", cta: "Request Quote", action: "quote", color: "#8B5CF6" }
]
const ACTIONS_HI = [
  { icon: CalendarDays, title: "परामर्श बुक करें", desc: "हमारी टीम के साथ मुफ्त 30 मिनट की रणनीति कॉल बुक करें।", cta: "अभी बुक करें", action: "meeting", color: "#1E6BFF" },
  { icon: Mail, title: "हमसे संपर्क करें", desc: "हमें संदेश भेजें, हम 24 घंटे के अंदर जवाब देंगे।", cta: "संदेश भेजें", action: "contact", color: "#33B5FF" },
  { icon: MessageSquare, title: "WhatsApp पर चैट", desc: "तुरंत बातचीत — जवाब तुरंत पाएं।", cta: "WhatsApp खोलें", action: "whatsapp", color: "#25D366" },
  { icon: FileText, title: "कस्टम कोट पाएं", desc: "अनुकूल प्रस्ताव के लिए अपने प्रोजेक्ट के बारे में बताएं।", cta: "कोट मांगें", action: "quote", color: "#8B5CF6" }
]

export default function CTASection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const actions = language === "hi" ? ACTIONS_HI : ACTIONS_EN

  const handle = (action: string) => {
    switch (action) {
      case "whatsapp":
        openWhatsAppLead({ name: "Website Visitor", message: "Hi! I'd like to book a consultation / know more about KADS LABS." })
        break
      case "contact":
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
        break
      case "meeting":
        window.location.href = "mailto:founderskadslabs@gmail.com?subject=Meeting%20Request&body=Hi%20KADS%20LABS%2C%0A%0AI%27d%20like%20to%20schedule%20a%20meeting%20to%20discuss..."
        break
      case "quote":
        window.location.href = "./quote/"
        break
    }
  }

  return (
    <section id="cta" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      <div aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(30,107,255,0.08), transparent 60%)" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-14">
          <span className="eyebrow-pill mb-5">
            <Sparkles className="w-3 h-3" /> {language === "hi" ? "शुरू करें" : "Get Started"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>चलिए मिलकर कुछ <span className="text-brand-gradient">बड़ा बनाते हैं</span></>
            ) : (
              <>Let's build something <span className="text-brand-gradient">extraordinary</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "आपकी ज़रूरत के अनुसार सही तरीका चुनें। हर पूछताछ का सीधा जवाब मिलता है।"
              : "Choose the way that works best for you. Every enquiry is handled directly by our team."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {actions.map((a, i) => {
            const Icon = a.icon
            return (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group premium-card p-6 flex flex-col h-full cursor-pointer"
                onClick={() => handle(a.action)}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-[-6deg]"
                  style={{ background: `${a.color}18`, border: `1px solid ${a.color}40` }}>
                  <Icon className="w-6 h-6" style={{ color: a.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{a.title}</h3>
                <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); handle(a.action) }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all group-hover:gap-3"
                  style={{
                    background: a.action === "whatsapp" ? "#25D366" : "var(--bg-tertiary)",
                    color: a.action === "whatsapp" ? "white" : "var(--text-primary)",
                    border: `1px solid ${a.action === "whatsapp" ? "transparent" : "var(--border-default)"}`
                  }}
                >
                  {a.cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
