"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useAuth } from "../components/AuthProvider"
import AuthModal from "../components/AuthModal"
import ErrorBoundary from "../components/ErrorBoundary"
import SubmissionsPanel from "../components/admin/SubmissionsPanel"
import ThemeToggle from "../components/ThemeToggle"
import LanguageToggle from "../components/LanguageToggle"
import { listNotifications, markNotificationRead } from "@/lib/crm"
import { Crown, Bell, LogOut, Shield, AlertCircle } from "lucide-react"
import { safeStorage } from "@/lib/storage"

const FOUNDER_PASSWORD_KEY = "kads_founder_password"

function FounderDashboardContent() {
  const { user, isAuthenticated, isFounder, signOut, demoMode } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [verified, setVerified] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (isAuthenticated && isFounder && (!demoMode || verified)) {
      loadNotifications()
    }
  }, [isAuthenticated, isFounder, verified, demoMode])

  const loadNotifications = async () => {
    const notifs = await listNotifications()
    setNotifications(notifs)
  }

  const verifyPassword = () => {
    const expected = safeStorage.getItem(FOUNDER_PASSWORD_KEY) || "kads-founder-2026"
    if (password === expected) {
      setVerified(true)
      setPasswordError("")
    } else {
      setPasswordError("Incorrect founder password")
    }
  }

  const markRead = async (id: string) => {
    await markNotificationRead(id)
    await loadNotifications()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center section-padding">
        <div className="text-center max-w-md">
          <Crown className="w-12 h-12 text-electric mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Founder Dashboard</h1>
          <p className="text-white/60 mb-8">Secure founder access only. Sign in to continue.</p>
          <button onClick={() => setAuthOpen(true)} className="btn-primary">Sign In</button>
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
      </div>
    )
  }

  if (!isFounder) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center section-padding">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/60 mb-8">You do not have founder privileges.</p>
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
          <h1 className="text-2xl font-bold mb-4">Founder Verification</h1>
          <p className="text-white/60 mb-6">Default password: <code className="text-electric-light">kads-founder-2026</code></p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter founder password"
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
      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="premium-card p-6 sm:p-8 mb-8 glow-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-electric" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Founder Dashboard</h1>
              <p className="text-sm text-white/60">Lead management, CRM, and notifications.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-white/60">{user?.email}</span>
            <LanguageToggle />
            <ThemeToggle />
            <button onClick={signOut} className="btn-outline px-4 py-2 text-sm"><LogOut className="w-4 h-4 mr-2" /> Sign Out</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="premium-card p-6 glow-border">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-electric" />
                <h2 className="font-bold">Notifications</h2>
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-white/50">No new notifications.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {notifications.map((n) => (
                    <div key={n.id} className={`p-3 rounded-lg border ${n.read ? "bg-white/5 border-white/10" : "bg-electric/10 border-electric/20"}`}>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-white/50 mt-1">{new Date(n.created_at || n.createdAt).toLocaleString()}</p>
                      {!n.read && <button onClick={() => markRead(n.id)} className="text-xs text-electric-light mt-2 hover:underline">Mark as read</button>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <SubmissionsPanel />
          </div>
        </div>
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default function FounderDashboard() {
  return (
    <ErrorBoundary>
      <FounderDashboardContent />
    </ErrorBoundary>
  )
}
