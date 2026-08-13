"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getFirebaseAuthInstance } from "@/lib/firebase"
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import ErrorBoundary from "../../components/ErrorBoundary"
import Link from "next/link"

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem",
  background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
  color: "var(--text-primary)", outline: "none", transition: "all 0.2s"
}

function ResetForm() {
  const router = useRouter()
  const params = useSearchParams()
  const oobCode = params.get("oobCode") || ""
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (!oobCode) {
      setStatus("error")
      setMessage("Invalid or missing reset code. Please request a new password reset link.")
      return
    }
    const auth = getFirebaseAuthInstance()
    if (!auth) {
      setStatus("error")
      setMessage("Firebase Auth is not configured.")
      return
    }
    setStatus("verifying")
    verifyPasswordResetCode(auth, oobCode)
      .then(em => { setEmail(em); setStatus("idle") })
      .catch(() => {
        setStatus("error")
        setMessage("This reset link is invalid or has expired. Please request a new one.")
      })
  }, [oobCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirm) {
      setStatus("error"); setMessage("Passwords do not match."); return
    }
    if (newPassword.length < 6) {
      setStatus("error"); setMessage("Password must be at least 6 characters."); return
    }
    const auth = getFirebaseAuthInstance()
    if (!auth) {
      setStatus("error"); setMessage("Firebase Auth is not configured."); return
    }
    setLoading(true)
    try {
      await confirmPasswordReset(auth, oobCode, newPassword)
      setStatus("success")
      setMessage("Password updated successfully! Redirecting to sign in...")
      setTimeout(() => router.replace("/auth"), 2500)
    } catch (err: any) {
      setStatus("error")
      setMessage(err?.message || "Could not reset password. The link may have expired.")
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md premium-card rounded-2xl p-8 glow-border">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ background: "rgba(30,107,255,0.15)", border: "1px solid rgba(30,107,255,0.3)" }}>
        <Lock className="w-7 h-7" style={{ color: "#33B5FF" }} />
      </div>
      <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--text-primary)" }}>Reset Password</h1>
      <p className="text-center mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        {email ? <>Create a new password for <strong style={{ color: "var(--text-secondary)" }}>{email}</strong>.</>
              : <>Create a new password for your account.</>}
      </p>

      {status === "verifying" ? (
        <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>Verifying reset link…</p>
      ) : status === "success" ? (
        <div className="p-4 rounded-lg text-center text-sm"
          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981" }}>
          <CheckCircle className="w-6 h-6 mx-auto mb-2" />
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === "error" && (
            <div className="p-3 rounded-lg text-sm flex items-start gap-2"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {message}
            </div>
          )}
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password" required minLength={6} style={inputStyle} />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password" required style={inputStyle} />
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? "Updating..." : "Update Password"}
          </button>
          <div className="text-center pt-2">
            <Link href="/auth" className="inline-flex items-center gap-1 text-sm transition-colors"
              style={{ color: "var(--text-muted)" }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <ErrorBoundary>
      <main className="min-h-screen flex flex-col items-center justify-center section-padding px-4"
        style={{ background: "var(--bg-primary)" }}>
        <Link href="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="w-4 h-4" /> KADS LABS
        </Link>
        <Suspense fallback={<div style={{ color: "var(--text-muted)" }}>Loading...</div>}>
          <ResetForm />
        </Suspense>
      </main>
    </ErrorBoundary>
  )
}
