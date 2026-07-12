"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { X, Mail, Lock, Eye, EyeOff, Chrome, User, ArrowLeft, CheckCircle } from "lucide-react"
import { useAuth } from "./AuthProvider"

type AuthMode = "signin" | "signup" | "forgot" | "verify"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  title?: string
  subtitle?: string
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Sign in to continue",
  subtitle = "Create an account or sign in to contact KADS LABS."
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const { signIn, signUp, signInWithGoogle, demoMode, resetPassword, resendVerification } = useAuth()
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (!modalRef.current || e.key !== "Tab") return
      const focusable = Array.from(modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')) as HTMLElement[]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.target === first && e.shiftKey) { e.preventDefault(); last.focus() }
      else if (e.target === last && !e.shiftKey) { e.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", handleEscape)
    document.addEventListener("keydown", handleFocusTrap)
    const timer = setTimeout(() => firstInputRef.current?.focus(), 100)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("keydown", handleFocusTrap)
      clearTimeout(timer)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setMode("signin")
      setEmail("")
      setPassword("")
      setFullName("")
      setError("")
      setInfo("")
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")
    setLoading(true)

    if (mode === "forgot") {
      const { error } = await resetPassword(email)
      setLoading(false)
      if (error) setError(error.message)
      else setInfo("Password reset instructions sent to your email.")
      return
    }

    if (mode === "verify") {
      const { error } = await resendVerification(email)
      setLoading(false)
      if (error) setError(error.message)
      else setInfo("Verification email sent.")
      return
    }

    const { error } = mode === "signup"
      ? await signUp(email, password, { full_name: fullName })
      : await signIn(email, password)

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      onSuccess?.()
      onClose()
    }
  }

  const handleGoogle = async () => {
    setError("")
    setLoading(true)
    const { error } = await signInWithGoogle()
    setLoading(false)
    if (error) setError(error.message)
  }

  const titles = {
    signin: "Sign in to continue",
    signup: "Create your account",
    forgot: "Reset your password",
    verify: "Resend verification email"
  }

  const subtitles = {
    signin: "Sign in to contact KADS LABS and manage your projects.",
    signup: "Join KADS LABS to access premium tools and services.",
    forgot: "Enter your email and we'll send you a reset link.",
    verify: "Enter your email to receive a new verification link."
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[90] section-padding"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 glow-border relative">
              <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors" aria-label="Close authentication modal">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-electric/20 flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-electric" />
                </div>
                <h3 id="auth-modal-title" className="text-2xl font-bold mb-2">{titles[mode]}</h3>
                <p className="text-sm text-white/60">{subtitles[mode]}</p>
              </div>

              {demoMode && (
                <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-200">
                  ⚠️ Demo Mode: Supabase is not configured. Email/password will simulate login.
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300" role="alert">
                  {error}
                </div>
              )}
              {info && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-300 flex items-start gap-2" role="status">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {info}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 mb-4">
                {mode === "signup" && (
                  <div>
                    <label htmlFor="fullName" className="sr-only">Full name</label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                    <input
                      id="email"
                      ref={firstInputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors"
                    />
                  </div>
                </div>
                {mode !== "forgot" && mode !== "verify" && (
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" aria-hidden="true" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                      required={mode === "signin" || mode === "signup"}
                      minLength={6}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors"
                    />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Please wait..." : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Reset Link" : mode === "verify" ? "Resend Email" : "Sign In"}
                </motion.button>
              </form>

              {(mode === "signin" || mode === "signup") && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-navy-900 text-white/50">Or continue with</span></div>
                  </div>
                  <motion.button onClick={handleGoogle} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full btn-outline disabled:opacity-50 disabled:cursor-not-allowed" type="button">
                    <Chrome className="w-5 h-5 mr-2" aria-hidden="true" />
                    Google
                  </motion.button>
                </>
              )}

              <div className="mt-6 flex flex-col gap-2 text-center text-sm text-white/60">
                {mode === "signin" && (
                  <>
                    <button type="button" onClick={() => setMode("forgot")} className="text-electric-light hover:text-electric transition-colors">Forgot password?</button>
                    <p>Don't have an account? <button type="button" onClick={() => setMode("signup")} className="text-electric-light hover:text-electric transition-colors font-medium">Sign up</button></p>
                    <p>Need a new verification email? <button type="button" onClick={() => setMode("verify")} className="text-electric-light hover:text-electric transition-colors">Resend</button></p>
                  </>
                )}
                {mode === "signup" && (
                  <p>Already have an account? <button type="button" onClick={() => setMode("signin")} className="text-electric-light hover:text-electric transition-colors font-medium">Sign in</button></p>
                )}
                {(mode === "forgot" || mode === "verify") && (
                  <button type="button" onClick={() => setMode("signin")} className="text-electric-light hover:text-electric transition-colors flex items-center justify-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to sign in
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
