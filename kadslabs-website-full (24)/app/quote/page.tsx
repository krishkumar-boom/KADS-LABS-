"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Send, Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "../components/Toast"
import { useLanguage } from "../components/LanguageProvider"
import { submitQuote, getLeadErrorMessage } from "@/lib/leads"
import { createQuoteRequest } from "@/lib/quotes"
import MarketingShell from "@/components/layout/MarketingShell"

const quoteSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1, "Select a service"),
  budget: z.string().min(1, "Select a budget"),
  details: z.string().min(10, "Please provide more details"),
  website: z.string().optional() // honeypot
})

type QuoteForm = z.infer<typeof quoteSchema>

export default function QuotePage() {
  const router = useRouter()
  const toast = useToast()
  const { language } = useLanguage()
  const isHi = language === "hi"
  const [submitted, setSubmitted] = useState<{ leadId?: string; simulated?: boolean } | null>(null)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema)
  })

  const onSubmit = async (data: QuoteForm) => {
    setLoading(true)
    // Primary: use new leads helper (inserts to Supabase with lead_id, triggers email notifications).
    // Legacy createQuoteRequest kept as fallback for local-storage demo mode.
    try {
      const result = await submitQuote({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        service: data.service,
        budget: data.budget,
        details: data.details,
        website: data.website,
        source: "quote_form"
      })
      if (!result.ok) {
        toast.error(getLeadErrorMessage(result.error, isHi ? "hi" : "en"))
        setLoading(false)
        return
      }
      setSubmitted({ leadId: result.leadId, simulated: result.simulated })
      // Also write via old helper to keep legacy admin panel in sync
      createQuoteRequest({ name: data.name, email: data.email, phone: data.phone, company: data.company, service: data.service, budget: data.budget, details: data.details }).catch(() => {})
      toast.success(isHi ? "कोट अनुरोध भेज दिया गया!" : "Quote request sent!")
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem",
    background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none", transition: "all 0.2s"
  }
  const labelStyle: React.CSSProperties = { color: "var(--text-secondary)", fontSize: "0.875rem", display: "block", marginBottom: "0.5rem", fontWeight: 500 }
  const errorStyle: React.CSSProperties = { color: "#EF4444", fontSize: "0.8rem", marginTop: "0.25rem" }

  return (
    <MarketingShell>
    <div className="min-h-screen pt-28 pb-12" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-[800px] mx-auto section-padding">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
            <ArrowLeft className="w-4 h-4" /> {isHi ? "वेबसाइट पर वापस" : "Back to website"}
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6 sm:p-8 glow-border">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" style={{ color: "#33B5FF" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#33B5FF" }}>
              {isHi ? "कस्टम कोट" : "Custom Quote"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight" style={{ color: "var(--text-primary)" }}>
            {isHi ? "कस्टम कोट पाएं" : "Request a Custom Quote"}
          </h1>
          <p className="mb-6 text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
            {isHi
              ? "अपने प्रोजेक्ट के बारे में बताएं, हम 24 घंटे के अंदर विस्तृत प्रस्ताव भेजेंगे।"
              : "Tell us about your project and we'll send you a tailored proposal within 24 hours."}
          </p>

          {submitted ? (
            <div className="p-8 rounded-xl text-center"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)" }}>
                <CheckCircle className="w-10 h-10" style={{ color: "#10B981" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {isHi ? "अनुरोध सफलतापूर्वक भेज दिया गया!" : "Quote Request Sent!"}
              </h3>
              <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                {isHi
                  ? "हम जल्द ही आपसे संपर्क करेंगे।"
                  : "We will review your requirements and get back to you within 24 hours."}
              </p>
              {submitted.leadId && (
                <div className="inline-block px-4 py-2 rounded-lg font-mono text-sm"
                  style={{ background: "var(--bg-tertiary)", color: "#33B5FF", border: "1px solid var(--border-default)" }}>
                  Lead ID: <strong>{submitted.leadId}</strong>
                </div>
              )}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => router.push("/")} className="btn-primary justify-center">
                  {isHi ? "होम पर वापस" : "Back to Home"}
                </button>
                <button onClick={() => { setSubmitted(null); setValue("name", ""), setValue("email", ""), setValue("details", "") }}
                  className="btn-outline justify-center">
                  {isHi ? "नया अनुरोध" : "Send another"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Honeypot */}
              <input type="text" {...register("website")} tabIndex={-1} autoComplete="off"
                style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none", height: 0, width: 0 }} aria-hidden="true" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>{isHi ? "नाम *" : "Name *"}</label>
                  <input {...register("name")} style={inputStyle} disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                  {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>{isHi ? "ईमेल *" : "Email *"}</label>
                  <input type="email" {...register("email")} style={inputStyle} disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                  {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>{isHi ? "फ़ोन" : "Phone"}</label>
                  <input {...register("phone")} style={inputStyle} disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                </div>
                <div>
                  <label style={labelStyle}>{isHi ? "कंपनी" : "Company"}</label>
                  <input {...register("company")} style={inputStyle} disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                </div>
                <div>
                  <label style={labelStyle}>{isHi ? "सेवा *" : "Service *"}</label>
                  <select {...register("service")} style={inputStyle} disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)")}>
                    <option value="">{isHi ? "सेवा चुनें" : "Select service"}</option>
                    <option value="AI Development">AI Development</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="SaaS Development">SaaS Development</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Web Applications">Web Applications</option>
                    <option value="Enterprise Solutions">Enterprise Solutions</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Performance Advertising">Performance Advertising</option>
                    <option value="Branding & Design">Branding & Design</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.service && <p style={errorStyle}>{errors.service.message}</p>}
                </div>
                <div>
                  <label style={labelStyle}>{isHi ? "बजट" : "Budget"}</label>
                  <select {...register("budget")} style={inputStyle} disabled={loading}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)")}>
                    <option value="">{isHi ? "बजट चुनें" : "Select budget"}</option>
                    <option value="< ₹50K">{"< ₹50K"}</option>
                    <option value="₹50K – ₹2L">₹50K – ₹2L</option>
                    <option value="₹2L – ₹5L">₹2L – ₹5L</option>
                    <option value="₹5L – ₹15L">₹5L – ₹15L</option>
                    <option value="₹15L+">₹15L+</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                  {errors.budget && <p style={errorStyle}>{errors.budget.message}</p>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>{isHi ? "प्रोजेक्ट विवरण *" : "Project Details *"}</label>
                <textarea rows={6} {...register("details")} style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} disabled={loading}
                  onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)")} />
                {errors.details && <p style={errorStyle}>{errors.details.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {isHi ? "भेज रहे हैं..." : "Sending..."}</>
                  : <><Send className="w-4 h-4" /> {isHi ? "कोट अनुरोध भेजें" : "Send Quote Request"}</>}
              </button>
              <p className="text-xs text-center" style={{ color: "var(--text-subtle)" }}>
                {isHi ? "फॉर्म सबमिट करके आप हमारी गोपनीयता नीति से सहमत होते हैं।" : "By submitting you agree to our privacy policy. We respond within 24 hours."}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
    </MarketingShell>
  )
}
