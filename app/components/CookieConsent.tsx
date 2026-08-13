"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X } from "lucide-react"

const CONSENT_KEY = "kads_cookie_consent"

type Consent = "accepted" | "rejected" | null

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(CONSENT_KEY) as Consent
      if (stored) setConsent(stored)
    } catch {}
  }, [])

  if (!mounted || consent) return null

  const accept = () => {
    try { localStorage.setItem(CONSENT_KEY, "accepted") } catch {}
    setConsent("accepted")
    // If GA/Clarity are loaded after consent they can initialize here; they're already
    // gated by NEXT_PUBLIC_GA4_ID env which is only present in production.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kads:consent", { detail: "accepted" }))
    }
  }

  const reject = () => {
    try { localStorage.setItem(CONSENT_KEY, "rejected") } catch {}
    setConsent("rejected")
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kads:consent", { detail: "rejected" }))
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[80]"
      >
        <div className="rounded-2xl p-5 shadow-2xl flex items-start gap-4"
             style={{
               background: "var(--bg-secondary)",
               border: "1px solid var(--border-default)",
               backdropFilter: "blur(24px)"
             }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: "rgba(30,107,255,0.12)" }}>
            <Cookie className="w-5 h-5" style={{ color: "#33B5FF" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>Cookies & Privacy</h4>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-muted)" }}>
              We use essential cookies for authentication and optional analytics (GA4, Clarity) to improve the site.
              No personal data is sold. See our Privacy Policy.
            </p>
            <div className="flex items-center gap-2">
              <button onClick={reject} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                      style={{ color: "var(--text-muted)", background: "var(--bg-tertiary)" }}>
                Reject All
              </button>
              <button onClick={accept} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                      style={{ background: "var(--gradient-brand)" }}>
                Accept All
              </button>
            </div>
          </div>
          <button onClick={reject} className="shrink-0 p-1 rounded-md" aria-label="Close">
            <X className="w-4 h-4" style={{ color: "var(--text-subtle)" }} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
