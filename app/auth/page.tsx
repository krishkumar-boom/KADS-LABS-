"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import AuthModal from "@/app/components/AuthModal"
import MarketingShell from "@/components/layout/MarketingShell"

function AuthContent() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next") || "/dashboard"
  const [open, setOpen] = useState(true)

  // If modal closes without signing in, go home
  useEffect(() => {
    if (!open) router.replace("/")
  }, [open, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-20" style={{ background: "var(--bg-primary)" }}>
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Sign in to KADS LABS
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Access your dashboard, projects and support tickets.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #1E6BFF 0%, #33B5FF 100%)", boxShadow: "0 8px 28px -8px rgba(30,107,255,0.6)" }}
        >
          Sign In / Sign Up
        </button>
      </div>
      <AuthModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false)
          setTimeout(() => router.replace(next), 150)
        }}
        title="Sign in to KADS LABS"
        subtitle="Sign in with Google or email to continue."
      />
    </div>
  )
}

/**
 * /auth — Standalone sign-in page (Suspense-wrapped because useSearchParams
 * requires it during static prerender).
 */
export default function AuthPage() {
  return (
    <MarketingShell>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#33B5FF" }} />
          </div>
        }
      >
        <AuthContent />
      </Suspense>
    </MarketingShell>
  )
}
