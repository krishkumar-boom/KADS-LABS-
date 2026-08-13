"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useAuth } from "../components/AuthProvider"
import type { KadsRole } from "../components/AuthProvider"
import { useRouter } from "next/navigation"
import ErrorBoundary from "../components/ErrorBoundary"
import ThemeToggle from "../components/ThemeToggle"
import LanguageToggle from "../components/LanguageToggle"
import { listProfiles, updateUserRole, updateUserStatus } from "@/lib/roles"
import type { ProfileRecord } from "@/lib/roles"
import { hasSupabaseCredentials, supabase } from "@/lib/supabase"
import { Crown, Shield, LogOut, AlertCircle, Trash2, UserPlus, RefreshCw, UserCheck, UserX, Mail } from "lucide-react"
import InviteUserPanel from "@/components/dashboard/InviteUserPanel"

const roleLabels: Record<KadsRole, string> = {
  founder: "Founder / CEO",
  ceo: "CEO",
  director: "Director / Co-Founder",
  admin: "Admin",
  developer: "Developer",
  hr: "HR",
  content_manager: "Content Manager",
  client: "Client",
  guest: "Guest",
}

const assignableRoles: KadsRole[] = ["client", "developer", "hr", "content_manager", "admin", "director"]

export default function SuperAdminPage() {
  const { user, isAuthenticated, isFounder, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<ProfileRecord[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/")
  }, [isLoading, isAuthenticated, router])

  const loadUsers = async () => {
    setLoadingUsers(true)
    const list = await listProfiles()
    setUsers(list)
    setLoadingUsers(false)
  }

  useEffect(() => { if (isAuthenticated && isFounder) loadUsers() }, [isAuthenticated, isFounder])

  const handleRoleChange = async (id: string, role: KadsRole) => {
    const res = await updateUserRole(id, role)
    if (res.error) setMessage(res.error); else { setMessage("Role updated"); loadUsers() }
    setTimeout(() => setMessage(""), 3000)
  }

  const handleStatusChange = async (id: string, status: "active" | "suspended") => {
    const res = await updateUserStatus(id, status)
    if (res.error) setMessage(res.error); else { setMessage(`User ${status}`); loadUsers() }
    setTimeout(() => setMessage(""), 3000)
  }

  const handleSendReset = async (email: string) => {
    // Firebase password reset link via our SINGLETON auth instance
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth")
      const { getFirebaseAuthInstance } = await import("@/lib/firebase")
      const authInst = getFirebaseAuthInstance()
      if (!authInst) { setMessage("Firebase not initialized"); return }
      await sendPasswordResetEmail(authInst, email)
      setMessage(`Password reset sent to ${email}`)
    } catch (e: any) {
      console.error("[super] Reset failed:", e)
      setMessage(e.message || "Reset failed")
    }
    setTimeout(() => setMessage(""), 3000)
  }

  if (isLoading || !isAuthenticated) return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)", color: "var(--text-muted)" }}>Loading...</div>
  if (!isFounder) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 p-6" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <Shield className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Founder access only.</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-24 pb-12" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Crown className="w-7 h-7 text-amber-400" /> Founder Console
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Manage users, roles and access across KADS LABS.</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle /><ThemeToggle />
              <button onClick={() => { signOut(); router.replace("/") }} className="btn-outline flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(30,107,255,0.1)", color: "#33B5FF", border: "1px solid rgba(30,107,255,0.3)" }}>{message}</div>
          )}

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Users", value: users.length },
              { label: "Active", value: users.filter(u => u.status !== "suspended").length },
              { label: "Privileged", value: users.filter(u => ["founder","ceo","director","admin","developer","hr"].includes(u.role)).length },
              { label: "Clients", value: users.filter(u => u.role === "client").length }
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <InviteUserPanel />

          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
              <h2 className="font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <UserPlus className="w-4 h-4" /> User Management
              </h2>
              <button onClick={loadUsers} className="btn-outline text-sm flex items-center gap-1 py-1.5"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
                    <th className="p-3 font-medium">User</th>
                    <th className="p-3 font-medium">Role</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr><td colSpan={4} className="p-6 text-center" style={{ color: "var(--text-muted)" }}>Loading users...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center" style={{ color: "var(--text-muted)" }}>No users yet. Signups will appear here.</td></tr>
                  ) : users.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td className="p-3">
                        <div className="font-medium" style={{ color: "var(--text-primary)" }}>{u.full_name || "—"}</div>
                        <div className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}><Mail className="w-3 h-3" />{u.email}</div>
                      </td>
                      <td className="p-3">
                        <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value as KadsRole)}
                          className="px-2 py-1 rounded-lg text-xs" style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                          disabled={u.role === "founder"}>
                          {Object.entries(roleLabels).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                          background: (u.status === "suspended" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)"),
                          color: u.status === "suspended" ? "#EF4444" : "#10B981"
                        }}>{u.status || "active"}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleSendReset(u.email)} title="Send password reset" className="p-1.5 rounded hover:bg-white/10" style={{ color: "var(--text-muted)" }}>
                            <Shield className="w-4 h-4" />
                          </button>
                          {u.status !== "suspended" ? (
                            <button onClick={() => handleStatusChange(u.id, "suspended")} title="Suspend" className="p-1.5 rounded hover:bg-red-500/20" style={{ color: "#F87171" }}>
                              <UserX className="w-4 h-4" />
                            </button>
                          ) : (
                            <button onClick={() => handleStatusChange(u.id, "active")} title="Reactivate" className="p-1.5 rounded hover:bg-emerald-500/20" style={{ color: "#34D399" }}>
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
