"use client"

import { useState } from "react"
import { Mail, CheckCircle2, Loader2, ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useToast } from "@/app/components/Toast"
import { subscribeNewsletter, getLeadErrorMessage } from "@/lib/leads"

interface Props {
  variant?: "inline" | "hero" | "footer"
  className?: string
}

export default function NewsletterSubscribe({ variant = "inline", className = "" }: Props) {
  const { language } = useLanguage()
  const toast = useToast()
  const isHi = language === "hi"
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    const res = await subscribeNewsletter({ email, source: variant === "footer" ? "footer" : "newsletter_section" })
    setLoading(false)
    if (!res.ok) {
      toast.error(getLeadErrorMessage(res.error, isHi ? "hi" : "en"))
      return
    }
    setDone(true)
    setEmail("")
    toast.success(isHi ? "सदस्यता ले ली! धन्यवाद।" : "You're subscribed! Thank you.")
    setTimeout(() => setDone(false), 4000)
  }

  if (variant === "footer") {
    return (
      <form onSubmit={submit} className={`flex gap-2 ${className}`}>
        {/* Honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off"
          style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none", height: 0, width: 0 }} aria-hidden="true" />
        <input
          type="email" required
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder={isHi ? "आपका ईमेल" : "your@email.com"}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)"
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)")}
          disabled={loading}
        />
        <button
          type="submit" disabled={loading || done}
          className="px-4 rounded-lg text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70"
          style={{ background: "var(--gradient-brand)" }}
          aria-label="Subscribe"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : done ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={submit} className={`relative flex flex-col sm:flex-row gap-3 max-w-xl mx-auto ${className}`}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none", height: 0, width: 0 }} aria-hidden="true" />
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
        <input
          type="email" required
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder={isHi ? "अपना ईमेल डालें" : "Enter your email"}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm focus:outline-none transition-all"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
            backdropFilter: "blur(12px)"
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "var(--brand-electric)", e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,107,255,0.15)")}
          onBlur={e => (e.currentTarget.style.borderColor = "var(--border-default)", e.currentTarget.style.boxShadow = "none")}
          disabled={loading}
        />
      </div>
      <button
        type="submit" disabled={loading || done}
        className="btn-primary whitespace-nowrap disabled:opacity-70 justify-center"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> :
         done ? <><CheckCircle2 className="w-4 h-4" /> {isHi ? "सदस्यता ले ली" : "Subscribed!"}</> :
         <><Sparkles className="w-4 h-4" /> {isHi ? "सदस्यता लें" : "Subscribe"}</>}
      </button>
    </form>
  )
}
