"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../components/AuthProvider"
import { useRouter } from "next/navigation"
import { User, Mail, Building, Phone, Camera, Lock, Save, LogOut, ArrowLeft } from "lucide-react"
import { getProfile, updateProfile, ProfileRecord } from "@/lib/roles"
import { hasSupabaseCredentials } from "@/lib/supabase"
import ErrorBoundary from "../components/ErrorBoundary"
import ThemeToggle from "../components/ThemeToggle"
import LanguageToggle from "../components/LanguageToggle"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, signOut, updateProfile: updateAuthProfile, updatePassword, demoMode } = useAuth()
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
    const load = async () => {
      if (!user?.id) return
      const profile = await getProfile(user.id)
      setFullName(profile?.fullName || user.user_metadata?.full_name || "")
      setCompany(profile?.company || user.user_metadata?.company || "")
      setPhone(profile?.phone || user.user_metadata?.phone || "")
      setAvatarUrl(profile?.avatarUrl || user.user_metadata?.avatar_url || "")
    }
    load()
  }, [user])

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white/60">Loading...</div>
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    const metadata = { full_name: fullName, company, phone, avatar_url: avatarUrl }
    await updateAuthProfile(metadata)
    if (user?.id) await updateProfile(user.id, { fullName, company, phone, avatarUrl })
    setMessage("Profile updated successfully.")
    setLoading(false)
  }

  const handlePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage("Password must be at least 6 characters.")
      return
    }
    const { error } = await updatePassword(newPassword)
    if (error) setMessage(error.message)
    else {
      setMessage("Password updated successfully.")
      setNewPassword("")
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-navy-950 pt-24 pb-12">
        <div className="max-w-[800px] mx-auto section-padding">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => router.push("/")} className="text-white/60 hover:text-white flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to website
            </button>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          <div className="premium-card p-6 sm:p-8 glow-border mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-electric/20 flex items-center justify-center">
                <User className="w-8 h-8 text-electric" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-sm text-white/60 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {user?.email}</p>
                {demoMode && <p className="text-xs text-yellow-300 mt-1">Demo mode</p>}
              </div>
            </div>

            {message && <p className="mb-4 p-3 rounded-lg bg-electric/10 text-electric-light text-sm">{message}</p>}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-white/70 flex items-center gap-2 mb-2"><User className="w-4 h-4" /> Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/70 flex items-center gap-2 mb-2"><Building className="w-4 h-4" /> Company</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-white/70 flex items-center gap-2 mb-2"><Phone className="w-4 h-4" /> Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/70 flex items-center gap-2 mb-2"><Camera className="w-4 h-4" /> Avatar URL</label>
                  <input type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          <div className="premium-card p-6 sm:p-8 glow-border mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock className="w-5 h-5 text-electric" /> Update Password</h2>
            <div className="flex gap-3">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
              <button onClick={handlePassword} className="btn-primary px-6">Update</button>
            </div>
          </div>

          <button onClick={() => { signOut(); router.replace("/") }} className="w-full btn-outline flex items-center justify-center">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </button>
        </div>
      </div>
    </ErrorBoundary>
  )
}
