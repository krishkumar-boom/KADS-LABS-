"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import {
  X, Mail, Lock, Eye, EyeOff, Chrome, User, ArrowLeft, CheckCircle,
  Facebook, Github, Twitter, Sparkles, ArrowRight, Building2, ShieldCheck, Rocket
} from "lucide-react"
import { useAuth } from "./AuthProvider"

type AuthMode = "signin" | "signup" | "forgot" | "verify"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  title?: string
  subtitle?: string
}

/**
 * Premium glass auth modal matching PDF p10.
 * - Two-column layout: left marketing panel, right glass form
 * - Sign In / Create Account tabs
 * - Social providers grid (Google + GitHub + Twitter + Facebook)
 * - All existing Firebase auth handlers preserved (signIn, signUp, signInWithGoogle, resetPassword, resendVerification)
 * - iPhone-style device preview on marketing panel (visual only, no fake content)
 */
export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("signin")
  const [tab, setTab] = useState<"signin" | "signup">("signin")
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
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.target === first && e.shiftKey) { e.preventDefault(); last.focus() }
      else if (e.target === last && !e.shiftKey) { e.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", handleEscape)
    document.addEventListener("keydown", handleFocusTrap)
    const timer = setTimeout(() => firstInputRef.current?.focus(), 200)
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
      setTab("signin")
      setEmail("")
      setPassword("")
      setFullName("")
      setError("")
      setInfo("")
    }
  }, [isOpen])

  const switchTab = (t: "signin" | "signup") => {
    setTab(t)
    setMode(t)
    setError("")
    setInfo("")
  }

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
      const { error } = (await resendVerification?.(email)) || { error: null }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80]"
            style={{
              background: "radial-gradient(800px 400px at 30% 20%, rgba(30,107,255,0.15), transparent), rgba(0,0,0,0.75)",
              backdropFilter: "blur(10px)"
            }}
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(96vw,1100px)] z-[90] px-3 sm:px-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]"
              style={{
                background: "linear-gradient(145deg, rgba(11,23,41,0.92), rgba(7,15,35,0.96))",
                border: "1.5px solid rgba(51,181,255,0.28)",
                boxShadow: "0 40px 90px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(30,107,255,0.1)"
              }}>

              {/* Close button */}
              <button onClick={onClose}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all hover:bg-white/10"
                aria-label="Close authentication modal">
                <X className="w-5 h-5" />
              </button>

              {/* ===== LEFT MARKETING PANEL ===== */}
              <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, rgba(30,107,255,0.15) 0%, rgba(7,15,35,0.4) 50%, rgba(139,92,246,0.15) 100%)",
                  borderRight: "1px solid rgba(51,181,255,0.15)"
                }}>
                {/* Decorative glows */}
                <div aria-hidden className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                     style={{ background: "radial-gradient(closest-side, rgba(30,107,255,0.5), transparent)" }} />
                <div aria-hidden className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full blur-3xl pointer-events-none"
                     style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.45), transparent)" }} />
                {/* Grid */}
                <div aria-hidden className="absolute inset-0 opacity-[0.08]"
                     style={{
                       backgroundImage: "linear-gradient(#33B5FF 1px, transparent 1px), linear-gradient(90deg, #33B5FF 1px, transparent 1px)",
                       backgroundSize: "32px 32px"
                     }} />

                <div className="relative z-10">
                  {/* Logo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-crystal.png" alt="KADS LABS" className="h-12 w-auto mb-8"
                       style={{ filter: "drop-shadow(0 0 20px rgba(30,107,255,0.6))" }} />

                  <h2 id="auth-modal-title" className="text-3xl xl:text-4xl font-extrabold text-white leading-[1.1] tracking-[-0.02em] mb-4"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Welcome Back!<br />
                    <span style={{ color: "#33B5FF" }}>Let's Build Something</span><br />
                    <span style={{ color: "#33B5FF" }}>Extraordinary Together</span>
                  </h2>

                  <p className="text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Access your client portal, projects, dashboard and premium tools
                    built by KADS LABS.
                  </p>

                  {/* Feature bullets */}
                  <ul className="mt-8 space-y-3">
                    {[
                      { icon: ShieldCheck, title: "Secure & Encrypted", desc: "Enterprise-grade Firebase auth" },
                      { icon: Rocket,      title: "Fast Onboarding",   desc: "Start projects in minutes" },
                      { icon: Building2,   title: "Enterprise Ready",  desc: "Role-based access & dashboards" },
                    ].map(f => {
                      const F = f.icon
                      return (
                        <li key={f.title} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                            style={{
                              background: "rgba(51,181,255,0.15)",
                              border: "1px solid rgba(51,181,255,0.35)"
                            }}>
                            <F className="w-4 h-4" style={{ color: "#33B5FF" }} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{f.title}</p>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{f.desc}</p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* iPhone-style device preview (abstract UI, no fake data) */}
                <div className="relative z-10 flex justify-center mt-6">
                  <div className="relative w-[160px] h-[320px] rounded-[32px] p-1.5"
                    style={{
                      background: "linear-gradient(145deg, #0B1729, #05070B)",
                      border: "2px solid rgba(51,181,255,0.5)",
                      boxShadow: "0 25px 60px -10px rgba(30,107,255,0.5), inset 0 0 30px rgba(30,107,255,0.2)"
                    }}>
                    <div className="w-full h-full rounded-[26px] overflow-hidden flex flex-col relative"
                      style={{ background: "linear-gradient(180deg, #0B1729, #050913)" }}>
                      {/* Notch */}
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full bg-black z-10" />
                      <div className="flex-1 pt-8 px-3 pb-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #1E6BFF, #33B5FF)" }}>
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div>
                            <div className="h-2 w-16 rounded-full bg-white/30" />
                            <div className="h-1.5 w-10 rounded-full bg-white/15 mt-1" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 mb-3">
                          {[0,1,2,3,4,5].map(i => (
                            <div key={i} className="aspect-square rounded-md"
                                 style={{
                                   background: i % 2
                                    ? `linear-gradient(135deg, rgba(30,107,255,${0.3 + i*0.05}), rgba(51,181,255,${0.15 + i*0.05}))`
                                    : `linear-gradient(135deg, rgba(139,92,246,0.25), rgba(30,107,255,0.12))`,
                                   border: "1px solid rgba(51,181,255,0.2)"
                                 }} />
                          ))}
                        </div>
                        <div className="space-y-1.5">
                          {[0,1,2,3].map(i => (
                            <div key={i} className="h-2.5 rounded-full"
                                 style={{
                                   background: i === 0
                                    ? "linear-gradient(90deg, #1E6BFF, #33B5FF)"
                                    : "rgba(255,255,255,0.1)",
                                   width: `${85 - i*12}%`
                                 }} />
                          ))}
                        </div>
                        <div className="mt-4 h-8 rounded-lg"
                             style={{
                               background: "linear-gradient(135deg, #1E6BFF, #33B5FF)",
                               boxShadow: "0 6px 14px rgba(30,107,255,0.4)"
                             }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== RIGHT FORM PANEL ===== */}
              <div className="relative p-7 sm:p-10 lg:py-12 lg:px-10">
                {/* Mobile-only compact logo */}
                <div className="lg:hidden flex items-center justify-center mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-crystal.png" alt="KADS LABS" className="h-10 w-auto" />
                </div>

                {/* Tabs (only show for signin/signup, not forgot/verify) */}
                {(mode === "signin" || mode === "signup") && (
                  <div className="relative p-1 rounded-xl mb-6 inline-flex w-full sm:w-auto"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                    <button onClick={() => switchTab("signin")} type="button"
                      className="relative z-10 px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                      style={{ color: tab === "signin" ? "#fff" : "rgba(255,255,255,0.55)" }}>
                      Sign In
                    </button>
                    <button onClick={() => switchTab("signup")} type="button"
                      className="relative z-10 px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                      style={{ color: tab === "signup" ? "#fff" : "rgba(255,255,255,0.55)" }}>
                      Create Account
                    </button>
                    <motion.div
                      layout
                      className="absolute inset-y-1 rounded-lg"
                      style={{
                        width: "calc(50% - 4px)",
                        left: tab === "signin" ? 4 : "auto",
                        right: tab === "signup" ? 4 : "auto",
                        background: "linear-gradient(135deg, #1E6BFF, #33B5FF)",
                        boxShadow: "0 6px 16px rgba(30,107,255,0.4)"
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  </div>
                )}

                {/* Headline (changes per mode) */}
                <div className="mb-6">
                  {mode === "forgot" && (
                    <button type="button" onClick={() => setMode("signin")}
                      className="inline-flex items-center gap-1 text-sm mb-3 transition-colors"
                      style={{ color: "#33B5FF" }}>
                      <ArrowLeft className="w-4 h-4" /> Back to sign in
                    </button>
                  )}
                  <h3 className="text-2xl sm:text-[1.7rem] font-extrabold text-white leading-tight tracking-[-0.02em]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {mode === "signin" && "Sign in to your account"}
                    {mode === "signup" && "Create your account"}
                    {mode === "forgot" && "Reset your password"}
                    {mode === "verify" && "Resend verification email"}
                  </h3>
                  <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {mode === "signin" && "Welcome back! Let's build something extraordinary together."}
                    {mode === "signup" && "Join KADS LABS and start building smarter solutions."}
                    {mode === "forgot" && "Enter your email and we'll send you a reset link."}
                    {mode === "verify" && "Enter your email to receive a new verification link."}
                  </p>
                </div>

                {demoMode && (
                  <div className="mb-4 p-3 rounded-lg text-sm flex items-start gap-2"
                    style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.25)", color: "#FCD34D" }}>
                    ⚠️ Demo Mode: Firebase not configured. Email/password will simulate login.
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 rounded-lg text-sm flex items-start gap-2"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }} role="alert">
                    {error}
                  </div>
                )}
                {info && (
                  <div className="mb-4 p-3 rounded-lg text-sm flex items-start gap-2"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#86EFAC" }} role="status">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {info}
                  </div>
                )}

                {/* Social providers — only for signin/signup */}
                {(mode === "signin" || mode === "signup") && (
                  <>
                    <div className="grid grid-cols-4 gap-2 mb-5">
                      {[
                        { icon: Chrome, label: "Google",    color: "#fff", onClick: handleGoogle },
                        { icon: Github, label: "GitHub",    color: "#fff", onClick: () => {} },
                        { icon: Facebook, label: "Facebook", color: "#1877F2", onClick: () => {} },
                        { icon: Twitter, label: "Twitter",  color: "#1DA1F2", onClick: () => {} },
                      ].map(p => {
                        const P = p.icon
                        const clickable = p.label === "Google"
                        return (
                          <button key={p.label} type="button" onClick={clickable ? p.onClick : undefined}
                            disabled={loading || !clickable}
                            title={clickable ? `Continue with ${p.label}` : `${p.label} coming soon`}
                            className="h-11 rounded-lg flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.12)"
                            }}>
                            <P className="w-5 h-5" style={{ color: p.color }} />
                          </button>
                        )
                      })}
                    </div>

                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} /></div>
                      <div className="relative flex justify-center text-xs">
                        <span className="px-3" style={{ background: "rgba(11,23,41,0.95)", color: "rgba(255,255,255,0.4)" }}>
                          or continue with email
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {mode === "signup" && (
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none" style={{ color: "rgba(255,255,255,0.4)" }} aria-hidden="true" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full pl-10 pr-4 h-12 rounded-xl text-white placeholder:text-white/40 outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)"
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = "#33B5FF"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(51,181,255,0.15)" }}
                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none" }}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none" style={{ color: "rgba(255,255,255,0.4)" }} aria-hidden="true" />
                    <input
                      ref={firstInputRef}
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 h-12 rounded-xl text-white placeholder:text-white/40 outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = "#33B5FF"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(51,181,255,0.15)" }}
                      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none" }}
                    />
                  </div>

                  {mode !== "forgot" && mode !== "verify" && (
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] pointer-events-none" style={{ color: "rgba(255,255,255,0.4)" }} aria-hidden="true" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        required={mode === "signin" || mode === "signup"}
                        minLength={6}
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        className="w-full pl-10 pr-12 h-12 rounded-xl text-white placeholder:text-white/40 outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.1)"
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = "#33B5FF"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(51,181,255,0.15)" }}
                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none" }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                        aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                      </button>
                    </div>
                  )}

                  {mode === "signin" && (
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setMode("forgot")}
                        className="text-xs font-medium transition-colors" style={{ color: "#33B5FF" }}>
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <motion.button type="submit" disabled={loading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-xl font-semibold text-white text-sm inline-flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, #1E6BFF, #33B5FF)",
                      boxShadow: "0 12px 28px rgba(30,107,255,0.45)"
                    }}>
                    {loading
                      ? "Please wait..."
                      : mode === "signup" ? "Create Account"
                      : mode === "forgot" ? "Send Reset Link"
                      : mode === "verify" ? "Resend Email"
                      : "Sign In"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </motion.button>
                </form>

                {/* Footer switches */}
                <div className="mt-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {mode === "signin" && (
                    <>
                      Don't have an account?{" "}
                      <button type="button" onClick={() => switchTab("signup")} className="font-semibold" style={{ color: "#33B5FF" }}>
                        Sign up
                      </button>
                    </>
                  )}
                  {mode === "signup" && (
                    <>
                      Already have an account?{" "}
                      <button type="button" onClick={() => switchTab("signin")} className="font-semibold" style={{ color: "#33B5FF" }}>
                        Sign in
                      </button>
                    </>
                  )}
                </div>

                <p className="mt-5 text-[11px] text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
                  By continuing you agree to KADS LABS Terms of Service & Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
