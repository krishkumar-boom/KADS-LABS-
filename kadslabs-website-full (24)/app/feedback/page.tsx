"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare, Lightbulb, Bug, Sparkles, AlertCircle, Send,
  CheckCircle2, User, Mail, Phone, FileText, Image as ImageIcon
} from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useToast } from "@/app/components/Toast"
import { submitTicket, submitBugReport, getTicketErrorMessage } from "@/lib/tickets"
import { isHoneypotFilled, clientRateLimit } from "@/lib/security"
import MarketingShell from "@/components/layout/MarketingShell"

const TYPES = [
  { id: "feedback", label: "Feedback", icon: MessageSquare, color: "#33B5FF", desc: "Share your experience" },
  { id: "suggestion", label: "Suggestion", icon: Lightbulb, color: "#F59E0B", desc: "Feature or improvement idea" },
  { id: "bug", label: "Bug Report", icon: Bug, color: "#EF4444", desc: "Report something broken" },
  { id: "feature", label: "Feature Request", icon: Sparkles, color: "#8B5CF6", desc: "Request a new feature" },
  { id: "complaint", label: "Complaint", icon: AlertCircle, color: "#F97316", desc: "Raise a concern" }
]

const PRIORITIES = [
  { id: "low", label: "Low" },
  { id: "normal", label: "Normal" },
  { id: "high", label: "High" },
  { id: "urgent", label: "Urgent" }
]

export default function FeedbackPage() {
  const { language } = useLanguage()
  const toast = useToast()
  const isHi = language === "hi"
  const [type, setType] = useState("feedback")
  const [priority, setPriority] = useState("normal")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", description: "",
    page_url: "", browser: "", steps: "", expected: "", actual: "", website: ""
  })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    if (isHoneypotFilled(form.website)) return
    const rl = clientRateLimit("feedback_submit", 5)
    if (!rl.ok) {
      toast.error(isHi ? "बहुत जल्दी सबमिट कर रहे हैं।" : "Please wait a minute before submitting again.")
      return
    }
    if (!form.email || !form.subject || !form.description) {
      toast.error(isHi ? "ज़रूरी फ़ील्ड भरें।" : "Please fill in all required fields.")
      return
    }
    setLoading(true)
    setSuccess(null)

    let result
    if (type === "bug") {
      result = await submitBugReport({
        name: form.name, email: form.email, subject: form.subject, description: form.description,
        severity: priority === "urgent" ? "critical" : priority as any,
        page_url: form.page_url || (typeof window !== "undefined" ? window.location.href : ""),
        browser: form.browser || (typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 100) : ""),
        steps_to_reproduce: form.steps, expected_behavior: form.expected, actual_behavior: form.actual,
        website: form.website
      })
    } else {
      result = await submitTicket({
        type: type as any, subject: form.subject, description: form.description,
        priority: priority as any, name: form.name, email: form.email, phone: form.phone,
        metadata: { page_url: form.page_url, browser: form.browser, steps: form.steps, expected: form.expected, actual: form.actual },
        website: form.website
      })
    }

    setLoading(false)
    if (!result.ok) {
      toast.error(getTicketErrorMessage(result.error, isHi ? "hi" : "en"))
      return
    }
    setSuccess(result.ticketId || "")
    toast.success(
      isHi ? `भेज दिया! ${result.ticketId ? "ID: " + result.ticketId : ""}`
           : `Submitted! ${result.ticketId ? "Reference ID: " + result.ticketId : ""}`
    )
    setForm({ name: "", email: "", phone: "", subject: "", description: "", page_url: "", browser: "", steps: "", expected: "", actual: "", website: "" })
    setTimeout(() => setSuccess(null), 8000)
  }

  const selected = TYPES.find(t => t.id === type)

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem",
    background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
    color: "var(--text-primary)", outline: "none", transition: "all 0.2s"
  }

  return (
    <MarketingShell>
    <div className="min-h-screen pt-28 pb-20" style={{ background: "var(--bg-primary)" }}>
      <input type="text" name="website" value={form.website} onChange={e => update("website", e.target.value)}
             tabIndex={-1} autoComplete="off" aria-hidden="true"
             style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none", height: 0, width: 0 }} />

      <div className="max-w-3xl mx-auto section-padding">
        <Reveal className="text-center mb-12">
          <span className="eyebrow-pill mb-5">
            <MessageSquare className="w-3 h-3" /> {isHi ? "फीडबैक सेंटर" : "Feedback Center"}
          </span>
          <h1 className="section-heading mb-5">
            {isHi ? (
              <>हमें <span className="text-brand-gradient">बताइए</span></>
            ) : (
              <>We&apos;d love to <span className="text-brand-gradient">hear from you</span></>
            )}
          </h1>
          <p className="section-subheading mx-auto">
            {isHi
              ? "फीडबैक, सुझाव, बग रिपोर्ट या शिकायत — सब यहाँ सबमिट करें। हर संदेश फाउंडर डैशबोर्ड तक पहुँचता है।"
              : "Feedback, suggestions, bug reports, or complaints — every message goes straight to the founder dashboard."}
          </p>
        </Reveal>

        {success ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="premium-card p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5"
                 style={{ background: "rgba(16,185,129,0.12)" }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: "#10B981" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {isHi ? "धन्यवाद!" : "Thank you!"}
            </h3>
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
              {isHi ? "आपका संदेश मिल गया। हम जल्द ही जवाब देंगे।" : "Your message has been received. We'll review it shortly."}
            </p>
            {success && <p className="text-xs font-mono" style={{ color: "var(--brand-neon)" }}>{success}</p>}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="premium-card p-6 sm:p-8 space-y-5">
            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                {isHi ? "प्रकार *" : "Type *"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {TYPES.map(t => {
                  const Icon = t.icon
                  const active = type === t.id
                  return (
                    <button key={t.id} type="button" onClick={() => setType(t.id)}
                      className="p-3 rounded-xl text-center transition-all"
                      style={{
                        background: active ? `${t.color}18` : "var(--bg-tertiary)",
                        border: `1px solid ${active ? t.color : "var(--border-subtle)"}`
                      }}>
                      <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: t.color }} />
                      <div className="text-[11px] font-semibold" style={{ color: active ? t.color : "var(--text-primary)" }}>{t.label}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                {isHi ? "प्राथमिकता" : "Priority"}
              </label>
              <div className="flex flex-wrap gap-2">
                {PRIORITIES.map(p => {
                  const active = priority === p.id
                  return (
                    <button key={p.id} type="button" onClick={() => setPriority(p.id)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: active ? "var(--gradient-brand)" : "var(--bg-tertiary)",
                        color: active ? "white" : "var(--text-secondary)",
                        border: active ? "none" : "1px solid var(--border-subtle)"
                      }}>
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={isHi ? "नाम" : "Name"}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                  <input type="text" value={form.name} onChange={e => update("name", e.target.value)}
                         placeholder="Your name" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                </div>
              </Field>
              <Field label={isHi ? "ईमेल *" : "Email *"}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                  <input type="email" required value={form.email} onChange={e => update("email", e.target.value)}
                         placeholder="you@example.com" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                </div>
              </Field>
              <Field label={isHi ? "फ़ोन" : "Phone"}>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                  <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
                         placeholder="+91 XXXXX XXXXX" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                </div>
              </Field>
              <Field label={isHi ? "विषय *" : "Subject *"}>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                  <input type="text" required value={form.subject} onChange={e => update("subject", e.target.value)}
                         placeholder="Short summary" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                </div>
              </Field>
            </div>

            <Field label={isHi ? "विवरण *" : "Description *"}>
              <textarea required rows={5} value={form.description} onChange={e => update("description", e.target.value)}
                        placeholder={isHi ? "विस्तार से बताइए..." : "Provide as much detail as you can..."}
                        style={{ ...inputStyle, resize: "vertical", minHeight: 120, fontFamily: "inherit" }} disabled={loading} />
            </Field>

            {/* Bug-specific fields */}
            {type === "bug" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                <div className="p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <p className="text-xs font-semibold flex items-center gap-2" style={{ color: "#EF4444" }}>
                    <Bug className="w-3.5 h-3.5" /> Bug report details help us fix issues faster.
                  </p>
                </div>
                <Field label="Page URL">
                  <input type="url" value={form.page_url} onChange={e => update("page_url", e.target.value)}
                         placeholder="https://kadslabs.com/page" style={inputStyle} disabled={loading} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Steps to Reproduce">
                    <textarea rows={3} value={form.steps} onChange={e => update("steps", e.target.value)}
                              placeholder="1. Go to...\n2. Click on...\n3. See error..."
                              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} disabled={loading} />
                  </Field>
                  <Field label="Expected vs Actual">
                    <textarea rows={3} value={form.expected ? `${form.expected}\n\nActual: ${form.actual}` : form.actual}
                              onChange={e => {
                                const parts = e.target.value.split(/\n\nActual:\s*/)
                                update("expected", parts[0] || "")
                                update("actual", parts[1] || "")
                              }}
                              placeholder="Expected: ...\n\nActual: ..."
                              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} disabled={loading} />
                  </Field>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--text-subtle)" }}>
                <ImageIcon className="w-3 h-3" style={{ color: "var(--brand-neon)" }} />
                {isHi ? "स्क्रीनशॉट अगले अपडेट में सपोर्ट होगा।" : "Screenshot uploads coming in next update."}
              </p>
              <MagneticButton type="submit" className="btn-primary min-w-[180px] justify-center" ariaLabel="Submit feedback" disabled={loading}>
                {loading ? (isHi ? "भेज रहे हैं..." : "Sending...") : (isHi ? "भेजें" : "Send Message")}
                {!loading && <Send className="w-4 h-4 ml-1" />}
              </MagneticButton>
            </div>
          </form>
        )}
      </div>
    </div>
    </MarketingShell>
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
