"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useAuth } from "../components/AuthProvider"
import AuthModal from "../components/AuthModal"
import ErrorBoundary from "../components/ErrorBoundary"
import ThemeToggle from "../components/ThemeToggle"
import LanguageToggle from "../components/LanguageToggle"
import { listRoles, assignRole, removeRole, RoleRecord } from "@/lib/roles"
import { KadsRole } from "@/lib/supabase"
import { hasSupabaseCredentials } from "@/lib/supabase"
import { Crown, Shield, LogOut, AlertCircle, Trash2, UserPlus, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { safeStorage } from "@/lib/storage"

const SUPER_PASSWORD_KEY = "kads_super_password"

const roleLabels: Record<KadsRole, string> = {
  ceo: "CEO",
  developer: "Developer",
  admin: "Admin",
  content_manager: "Content Manager",
  guest: "Guest"
}

function SuperDashboardContent() {
  const { user, isAuthenticated, isSuperDeveloper, signOut, demoMode, userRole } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [verified, setVerified] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [roles, setRoles] = useState<RoleRecord[]>([])
  const [email, setEmail] = useState("")
  const [newRole, setNewRole] = useState<KadsRole>("admin")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (isAuthenticated && isSuperDeveloper && (!demoMode || verified)) {
      loadRoles()
    }
  }, [isAuthenticated, isSuperDeveloper, verified, demoMode])

  const loadRoles = async () => {
    const data = await listRoles()
    setRoles(data)
  }

  const verifyPassword = () => {
    const expected = safeStorage.getItem(SUPER_PASSWORD_KEY) || "kads-super-2026"
    if (password === expected) {
      setVerified(true)
      setPasswordError("")
    } else {
      setPasswordError("Incorrect super developer password")
    }
  }

  const handleCreateAndAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    if (!email || !newPassword) return

    if (!hasSupabaseCredentials()) {
      const demoId = "demo-" + Date.now()
      const result = await assignRole(demoId, email, newRole, userRole || undefined)
      if (result.error) setMessage(result.error)
      else {
        setMessage("Demo user created and role assigned locally.")
        setEmail("")
        setNewPassword("")
        await loadRoles()
      }
      return
    }

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password: newPassword })
      if (signUpError) throw signUpError
      const userId = signUpData.user?.id
      if (!userId) throw new Error("User creation did not return an ID.")
      const result = await assignRole(userId, email, newRole, userRole || undefined)
      if (result.error) throw new Error(result.error)
      setMessage(`User ${email} created and assigned ${roleLabels[newRole]}.`)
      setEmail("")
      setNewPassword("")
      await loadRoles()
    } catch (err) {
      setMessage(String(err))
    }
  }

  const handleChangeRole = async (userId: string, email: string, role: KadsRole) => {
    const result = await assignRole(userId, email, role, userRole || undefined)
    if (result.error) setMessage(result.error)
    else {
      setMessage("Role updated.")
      await loadRoles()
    }
  }

  const handleRemove = async (userId: string) => {
    const result = await removeRole(userId, userRole || undefined)
    if (result.error) setMessage(result.error)
    else {
      setMessage("Role removed.")
      await loadRoles()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center section-padding">
        <div className="text-center max-w-md">
          <Crown className="w-12 h-12 text-electric mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Super Developer Dashboard</h1>
          <p className="text-white/60 mb-8">Restricted to the Super Developer role.</p>
          <button onClick={() => setAuthOpen(true)} className="btn-primary">Sign In</button>
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
      </div>
    )
  }

  if (!isSuperDeveloper) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center section-padding">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/60 mb-8">Super Developer access only.</p>
          <button onClick={signOut} className="btn-outline">Sign Out</button>
        </div>
      </div>
    )
  }

  if (demoMode && !verified) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center section-padding">
        <div className="text-center max-w-md glass-card rounded-2xl p-8 glow-border">
          <Shield className="w-12 h-12 text-electric mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Super Developer Verification</h1>
          <p className="text-white/60 mb-6">Default password: <code className="text-electric-light">kads-super-2026</code></p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter super password"
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white mb-4"
            onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
          />
          {passwordError && <p className="text-sm text-red-400 mb-2">{passwordError}</p>}
          <button onClick={verifyPassword} className="w-full btn-primary">Verify</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-12">
      <div className="max-w-[1200px] mx-auto section-padding">
        <div className="premium-card p-6 sm:p-8 mb-8 glow-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-electric" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Super Developer Dashboard</h1>
              <p className="text-sm text-white/60">Assign and manage privileged roles.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-white/60">{user?.email}</span>
            <LanguageToggle />
            <ThemeToggle />
            <button onClick={signOut} className="btn-outline px-4 py-2 text-sm"><LogOut className="w-4 h-4 mr-2" /> Sign Out</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5 text-electric" /> Create User & Assign Role</h2>
            <p className="text-sm text-yellow-200/80 mb-4">
              ⚠️ In production, user creation should be handled by a Supabase Edge Function or server-side admin SDK to avoid session swapping. This form is a client-side convenience for small teams and demo environments.
            </p>
            {message && <p className="mb-4 text-sm text-white/80">{message}</p>}
            <form onSubmit={handleCreateAndAssign} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="New user email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Temporary password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as KadsRole)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white"
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value} className="bg-navy-900">{label}</option>
                ))}
              </select>
              <button type="submit" className="w-full btn-primary">Create & Assign Role</button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6 sm:p-8 glow-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Privileged Users</h2>
              <button onClick={loadRoles} className="text-white/60 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
            </div>
            {roles.length === 0 ? (
              <p className="text-white/50">No privileged roles assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {roles.map((r) => (
                  <div key={r.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">{r.email}</p>
                      <p className="text-xs text-white/50">User ID: {r.userId.slice(0, 8)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={r.role}
                        onChange={(e) => handleChangeRole(r.userId, r.email, e.target.value as KadsRole)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white"
                      >
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <option key={value} value={value} className="bg-navy-900">{label}</option>
                        ))}
                      </select>
                      <button onClick={() => handleRemove(r.userId)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default function SuperDashboard() {
  return (
    <ErrorBoundary>
      <SuperDashboardContent />
    </ErrorBoundary>
  )
}
