"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../components/AuthProvider"
import { useRouter } from "next/navigation"
import { User, Mail, Building, Phone, Camera, Lock, Save, LogOut, ArrowLeft } from "lucide-react"
import ErrorBoundary from "../components/ErrorBoundary"
import MarketingShell from "@/components/layout/MarketingShell"

export default function ProfilePage() {
  const { user, profile, isAuthenticated, isLoading, signOut, updateProfile: updateAuthProfile, updatePassword, demoMode } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (!user) return
    setFullName(profile?.full_name || user.user_metadata?.full_name || user.displayName || "")
    setCompany(profile?.company || user.user_metadata?.company || "")
    setPhone(user.user_metadata?.phone || "")
    setAvatarUrl(user.avatar_url || user.photoURL || "")
  }, [user, profile])

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)", color: "var(--text-muted)" }}>Loading...</div>
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    const metadata = { full_name: fullName, company, phone, avatar_url: avatarUrl, displayName: fullName, photoURL: avatarUrl }
    const { error } = await updateAuthProfile(metadata)
    if (error) setMessage(error.message)
    else setMessage("Profile updated successfully.")
    setLoading(false)
  }

  const handlePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.")
      return
    }
    if (!updatePassword) { setMessage("Password update requires re-authentication."); return }
    const { error } = await updatePassword(newPassword)
    if (error) setMessage(error.message)
    else {
      setMessage("Password updated successfully.")
      setNewPassword("")
    }
  }

  return (
    <ErrorBoundary>
      <MarketingShell>
      <div className="min-h-screen pt-28 pb-12" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-[800px] mx-auto section-padding">
          <div className="flex items-center mb-6">
            <button onClick={() => router.push("/")} className="flex items-center gap-2 transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              <ArrowLeft className="w-4 h-4" /> Back to website
            </button>
          </div>
          <div className="premium-card p-6 sm:p-8 glow-border mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(30,107,255,0.15)", border: "1px solid rgba(30,107,255,0.3)" }}>
                <User className="w-8 h-8" style={{ color: "#33B5FF" }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>My Profile</h1>
                <p className="text-sm flex items-center gap-2" style={{ color: "var(--text-muted)" }}><Mail className="w-3.5 h-3.5" /> {user?.email}</p>
                {demoMode && <p className="text-xs mt-1" style={{ color: "#F59E0B" }}>Demo mode</p>}
              </div>
            </div>

            {message && <p className="mb-4 p-3 rounded-lg text-sm" style={{ background: "rgba(30,107,255,0.1)", color: "#33B5FF" }}>{message}</p>}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm flex items-center gap-2 mb-2" style={{ color: "var(--text-secondary)" }}><User className="w-4 h-4" /> Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="text-sm flex items-center gap-2 mb-2" style={{ color: "var(--text-secondary)" }}><Building className="w-4 h-4" /> Company</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm flex items-center gap-2 mb-2" style={{ color: "var(--text-secondary)" }}><Phone className="w-4 h-4" /> Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="text-sm flex items-center gap-2 mb-2" style={{ color: "var(--text-secondary)" }}><Camera className="w-4 h-4" /> Avatar URL</label>
                  <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          <div className="premium-card p-6 sm:p-8 glow-border mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}><Lock className="w-5 h-5" style={{ color: "#33B5FF" }} /> Update Password</h2>
            <div className="flex gap-3">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password"
                className="flex-1 px-4 py-3 rounded-lg"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
              <button onClick={handlePassword} className="btn-primary px-6">Update</button>
            </div>
          </div>

          <button onClick={() => { signOut(); router.replace("/") }} className="w-full btn-outline flex items-center justify-center">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </div>
      </div>
      </MarketingShell>
    </ErrorBoundary>
  )
}
