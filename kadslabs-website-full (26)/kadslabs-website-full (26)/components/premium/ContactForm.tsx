"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, MessageSquare, CalendarDays, Sparkles, Loader2, Building2, ShieldCheck } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useToast } from "@/app/components/Toast"
import { submitContact, openWhatsAppLead, getLeadErrorMessage } from "@/lib/leads"
import { sanitizeInput, sanitizeEmail, sanitizePhone } from "@/lib/sanitize"

const SERVICES = [
  "AI Development",
  "Custom Software",
  "SaaS Development",
  "Mobile Apps",
  "Web Applications",
  "Enterprise Solutions",
  "Digital Marketing",
  "Performance Advertising",
  "Branding & Design",
  "Content Production",
  "Other"
]

const BUDGETS = ["< ₹50K", "₹50K – ₹2L", "₹2L – ₹5L", "₹5L – ₹15L", "₹15L+", "Not sure"]

export default function ContactForm() {
  const { language } = useLanguage()
  const toast = useToast()
  const isHi = language === "hi"

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
    website: "" // honeypot
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<null | { leadId?: string; simulated?: boolean }>(null)

  const update = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setSuccess(null)

    const result = await submitContact({
      name: sanitizeInput(form.name, { maxLength: 100 }),
      email: sanitizeEmail(form.email),
      phone: form.phone ? sanitizePhone(form.phone) : "",
      company: form.company ? sanitizeInput(form.company, { maxLength: 120 }) : "",
      service: form.service,
      budget: form.budget,
      message: sanitizeInput(form.message, { allowNewlines: true, maxLength: 4000 }),
      website: form.website,
      source: "contact_form"
    })

    setLoading(false)
    if (!result.ok) {
      toast.error(getLeadErrorMessage(result.error, isHi ? "hi" : "en"))
      return
    }
    setSuccess({ leadId: result.leadId, simulated: result.simulated })
    toast.success(
      isHi
        ? (result.simulated
            ? "धन्यवाद! हम जल्द ही संपर्क करेंगे।"
            : `संदेश भेज दिया गया! ${result.leadId ? "लीड ID: " + result.leadId : ""}`)
        : (result.simulated
            ? "Thanks! We'll get back to you soon."
            : `Message sent! ${result.leadId ? "Lead ID: " + result.leadId : ""}`)
    )
    setForm({ name: "", email: "", phone: "", company: "", service: "", budget: "", message: "", website: "" })
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
    outline: "none",
    transition: "all 0.2s"
  }

  return (
    <section id="contact-form" className="relative py-24 sm:py-32 overflow-hidden">
      <div aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(30,107,255,0.08), transparent 60%)" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-14">
          <span className="eyebrow-pill mb-5">
            <Mail className="w-3 h-3" /> {isHi ? "संपर्क करें" : "Get in Touch"}
          </span>
          <h2 className="section-heading mb-5">
            {isHi ? (
              <>हमसे <span className="text-brand-gradient">बात करें</span></>
            ) : (
              <>Let's start a <span className="text-brand-gradient">conversation</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {isHi
              ? "फॉर्म भरें, हम 24 घंटे के अंदर जवाब देंगे। या सीधे ईमेल/WhatsApp पर संपर्क करें।"
              : "Fill out the form and we'll respond within 24 hours. Or reach us directly via email or WhatsApp."}
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info column */}
          <Reveal className="lg:col-span-2 space-y-4">
            <div className="premium-card p-6 space-y-5">
              <h3 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                {isHi ? "सीधे संपर्क करें" : "Contact directly"}
              </h3>
              <a href="mailto:founderskadslabs@gmail.com"
                className="flex items-center gap-3 p-3 -mx-3 rounded-xl transition-all hover:pl-4 group"
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-tertiary)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(30,107,255,0.12)", border: "1px solid rgba(30,107,255,0.2)" }}>
                  <Mail className="w-4 h-4" style={{ color: "#33B5FF" }} />
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>Email</div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>founderskadslabs@gmail.com</div>
                </div>
              </a>
              <a href="tel:+917524979551"
                className="flex items-center gap-3 p-3 -mx-3 rounded-xl transition-all hover:pl-4 group"
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-tertiary)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(30,107,255,0.12)", border: "1px solid rgba(30,107,255,0.2)" }}>
                  <Phone className="w-4 h-4" style={{ color: "#33B5FF" }} />
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>{isHi ? "फ़ोन" : "Phone"}</div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>+91 75249 79551</div>
                </div>
              </a>
              <div className="flex items-start gap-3 p-3 -mx-3 rounded-xl">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(30,107,255,0.12)", border: "1px solid rgba(30,107,255,0.2)" }}>
                  <MapPin className="w-4 h-4" style={{ color: "#33B5FF" }} />
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>{isHi ? "पता" : "Location"}</div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Tarkulwa, Deoria</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>Uttar Pradesh, India - 274408</div>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-subtle)" }}>
                  {isHi ? "तुरंत बात करें" : "Quick actions"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => openWhatsAppLead({ name: "Website Visitor", message: "Hi! I'd like to know more about KADS LABS services." })}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: "#25D366", color: "white", boxShadow: "0 6px 20px rgba(37,211,102,0.3)", border: "none", cursor: "pointer" }}>
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </button>
                  <a
                    href="mailto:founderskadslabs@gmail.com?subject=Meeting%20Request"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-default)" }}>
                    <CalendarDays className="w-4 h-4" /> {isHi ? "मीटिंग" : "Meeting"}
                  </a>
                </div>
              </div>

              {/* MSME Registration badge */}
              <div className="flex items-start gap-3 p-3 rounded-xl"
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

              {/* Trust indicator */}
              <div className="flex items-center gap-2 pt-2 text-[11px]" style={{ color: "var(--text-subtle)" }}>
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
                <span>{isHi ? "आपका डेटा सुरक्षित है। हम कभी स्पैम नहीं करते।" : "Your data is secure. We never spam."}</span>
              </div>

              {success?.leadId && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg text-xs text-center"
                  style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981" }}>
                  {isHi ? "आपका लीड ID" : "Your Lead ID"}: <strong>{success.leadId}</strong>
                </motion.div>
              )}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="premium-card p-6 sm:p-8 space-y-5" noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={e => update("website", e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none", height: 0, width: 0 }}
                aria-hidden="true"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={isHi ? "नाम *" : "Full Name *"}>
                  <input
                    type="text" required
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    placeholder={isHi ? "आपका नाम" : "John Doe"}
                    style={inputStyle}
                    disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)", e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)", e.currentTarget.style.boxShadow = "none")}
                  />
                </Field>
                <Field label={isHi ? "ईमेल *" : "Email *"}>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    placeholder="you@company.com"
                    style={inputStyle}
                    disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)", e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)", e.currentTarget.style.boxShadow = "none")}
                  />
                </Field>
                <Field label={isHi ? "फ़ोन" : "Phone"}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update("phone", e.target.value)}
                    placeholder="+91 00000 00000"
                    style={inputStyle}
                    disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)", e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)", e.currentTarget.style.boxShadow = "none")}
                  />
                </Field>
                <Field label={isHi ? "कंपनी" : "Company"}>
                  <input
                    type="text"
                    value={form.company}
                    onChange={e => update("company", e.target.value)}
                    placeholder={isHi ? "आपकी कंपनी" : "Your company"}
                    style={inputStyle}
                    disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)", e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)", e.currentTarget.style.boxShadow = "none")}
                  />
                </Field>
                <Field label={isHi ? "सेवा *" : "Service *"}>
                  <select
                    required
                    value={form.service}
                    onChange={e => update("service", e.target.value)}
                    style={inputStyle}
                    disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)", e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)", e.currentTarget.style.boxShadow = "none")}
                  >
                    <option value="">{isHi ? "सेवा चुनें" : "Select a service"}</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label={isHi ? "बजट" : "Budget"}>
                  <select
                    value={form.budget}
                    onChange={e => update("budget", e.target.value)}
                    style={inputStyle}
                    disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)", e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)", e.currentTarget.style.boxShadow = "none")}
                  >
                    <option value="">{isHi ? "चुनें (वैकल्पिक)" : "Select (optional)"}</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>

              <Field label={isHi ? "अपने प्रोजेक्ट के बारे में बताएं *" : "Tell us about your project *"}>
                <textarea
                  required
                  value={form.message}
                  onChange={e => update("message", e.target.value)}
                  rows={5}
                  placeholder={isHi ? "अपनी आवश्यकताएं, लक्ष्य, समयसीमा बताएं..." : "Describe your project, goals, timeline..."}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 120, fontFamily: "inherit" }}
                  disabled={loading}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)", e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)", e.currentTarget.style.boxShadow = "none")}
                />
              </Field>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-subtle)" }}>
                  <Sparkles className="w-3 h-3" style={{ color: "#33B5FF" }} />
                  {isHi ? "हम 24 घंटे के अंदर जवाब देते हैं।" : "We respond within 24 hours. Your data stays private."}
                </p>
                <MagneticButton
                  type="submit"
                  className="btn-primary min-w-[180px] justify-center"
                  ariaLabel="Send message"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {isHi ? "भेज रहे हैं..." : "Sending..."}</>
                  ) : (
                    <>{isHi ? "संदेश भेजें" : "Send Message"} <Send className="w-4 h-4" /></>
                  )}
                </MagneticButton>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</span>
      {children}
    </label>
  )
}
