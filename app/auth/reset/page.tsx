"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"
import { Lock, CheckCircle, AlertCircle } from "lucide-react"
import ErrorBoundary from "../../components/ErrorBoundary"
import ThemeToggle from "../../components/ThemeToggle"
import LanguageToggle from "../../components/LanguageToggle"

function ResetForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const type = params.get("type")
    if (type === "recovery" && hasSupabaseCredentials()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          setStatus("error")
          setMessage("Invalid or expired password reset link. Please request a new one.")
        }
      })
    }
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirm) {
      setStatus("error")
      setMessage("Passwords do not match.")
      return
    }
    if (newPassword.length < 6) {
      setStatus("error")
      setMessage("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    if (!hasSupabaseCredentials()) {
      setStatus("success")
      setMessage("Demo mode: password would be updated. Configure Supabase for real password reset.")
      setLoading(false)
      return
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setStatus("success")
      setMessage("Password updated successfully. You can now sign in.")
      setTimeout(() => router.replace("/"), 3000)
    } catch (err) {
      setStatus("error")
      setMessage(String(err))
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md glass-card rounded-2xl p-8 glow-border">
      <div className="w-14 h-14 rounded-2xl bg-electric/20 flex items-center justify-center mx-auto mb-6">
        <Lock className="w-7 h-7 text-electric" />
      </div>
      <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
      <p className="text-white/60 text-center mb-6">Create a new password for your account.</p>

      {status === "success" ? (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2" />
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "error" && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {message}
            </div>
          )}
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" required minLength={6} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric" />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" required className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric" />
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center section-padding">
        <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <Suspense fallback={<div className="text-white/60">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
