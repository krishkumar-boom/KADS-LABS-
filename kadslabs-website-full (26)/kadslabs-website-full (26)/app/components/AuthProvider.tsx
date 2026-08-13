"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"
import { safeStorage } from "@/lib/storage"
import { auth as fbAuth, hasFirebaseCredentials, KadsUserBase, isAuthDemoMode, getFirebaseAuthInstance } from "@/lib/firebase"
import { shouldUseDemoMode, isProductionDomain } from "@/lib/env"
import { syncProfileToSupabase } from "@/lib/sync-profile"
import { updatePassword as fbUpdatePassword, updateProfile as fbFirebaseUpdateProfile } from "firebase/auth"

export type KadsRole = "founder" | "ceo" | "director" | "admin" | "developer" | "hr" | "content_manager" | "client" | "guest"

export interface KadsUser {
  uid: string
  id: string
  email: string | null
  displayName: string | null
  full_name: string | null
  name: string | null
  photoURL: string | null
  avatar_url: string | null
  emailVerified: boolean
  provider: "password" | "google.com" | "anonymous"
  idToken: string
  user_metadata: Record<string, any>
}

interface AuthContextType {
  user: KadsUser | null
  profile: { id: string; role: KadsRole; full_name?: string; company?: string; status?: string } | null
  isLoading: boolean
  isAdmin: boolean
  isFounder: boolean
  isDirector: boolean
  isDeveloper: boolean
  isHR: boolean
  isClient: boolean
  isGuest: boolean
  isPrivileged: boolean
  isSuperDeveloper: boolean
  isContentManager: boolean
  isAuthenticated: boolean
  userRole: KadsRole | null
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: { code: string; message: string } | null }>
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ error: { code: string; message: string } | null }>
  signInWithGoogle: () => Promise<{ error: { code: string; message: string } | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: { code: string; message: string } | null }>
  resendVerification?: (email: string) => Promise<{ error: { code: string; message: string } | null }>
  updatePassword?: (newPassword: string) => Promise<{ error: { code: string; message: string } | null }>
  updateProfile: (updates: Record<string, any>) => Promise<{ error: { code: string; message: string } | null }>
  demoMode: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USER_KEY = "kads_demo_user"

const ADMIN_EMAILS = ["ceo@kadslabs.com", "founderskadslabs@gmail.com", "shivam@kadslabs.com"]

function emailToRole(email: string | null | undefined): KadsRole {
  if (!email) return "guest"
  const e = email.toLowerCase()
  if (ADMIN_EMAILS.includes(e)) return "founder"
  if (e.startsWith("dev") || e.includes("developer")) return "developer"
  if (e.startsWith("hr") || e.includes("hr@")) return "hr"
  if (e.startsWith("admin")) return "admin"
  return "client"
}

function shapeUser(fb: KadsUserBase | null): KadsUser | null {
  if (!fb) return null
  const displayName = fb.displayName || (fb.email ? fb.email.split("@")[0] : "User")
  return {
    ...fb,
    id: fb.uid,
    displayName,
    full_name: displayName,
    name: displayName,
    avatar_url: fb.photoURL,
    user_metadata: { full_name: displayName, email: fb.email, avatar_url: fb.photoURL }
  }
}

function makeDemoUser(email: string, overrides: Partial<KadsUserBase> = {}): KadsUser {
  const base: KadsUserBase = {
    uid: "demo-" + Math.random().toString(36).slice(2, 10),
    email,
    displayName: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    photoURL: null,
    emailVerified: true,
    provider: "password",
    idToken: "demo",
    ...overrides,
  }
  return shapeUser(base)!
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<KadsUser | null>(null)
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const mountedRef = useRef(true)

  const refreshProfile = useCallback(async (currentUser: KadsUser | null) => {
    if (!currentUser) { setProfile(null); return }

    const demo = !hasSupabaseCredentials() || isAuthDemoMode()
    const role = emailToRole(currentUser.email)
    if (demo) {
      setProfile({
        id: currentUser.uid,
        role,
        full_name: currentUser.displayName || undefined,
        status: "active",
      })
      return
    }

    try {
      const { data } = await supabase
        .from("profiles")
        .select("id,email,full_name,role,company,status")
        .eq("email", (currentUser.email || "").toLowerCase())
        .maybeSingle()
      if (data) {
        setProfile({
          id: data.id,
          role: (data.role as KadsRole) || role,
          full_name: data.full_name || currentUser.displayName,
          company: data.company,
          status: data.status,
        })
      } else {
        setProfile({ id: currentUser.uid, role, full_name: currentUser.displayName || undefined, status: "active" })
      }
    } catch (e) {
      console.warn("[auth] Profile lookup failed:", e)
      setProfile({ id: currentUser.uid, role, full_name: currentUser.displayName || undefined, status: "active" })
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    let unsub: (() => void) | undefined

    const init = async () => {
      if (isProductionDomain() && !hasFirebaseCredentials() && !hasSupabaseCredentials()) {
        if (mountedRef.current) { setDemoMode(false); setIsLoading(false) }
        return
      }

      if (shouldUseDemoMode(hasFirebaseCredentials() || hasSupabaseCredentials())) {
        setDemoMode(true)
        const raw = safeStorage.getItem(DEMO_USER_KEY)
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as KadsUser
            setUser(parsed)
            await refreshProfile(parsed)
          } catch { safeStorage.removeItem(DEMO_USER_KEY) }
        }
        if (mountedRef.current) setIsLoading(false)
        return
      }

      unsub = fbAuth.onAuthStateChanged(async (fbUser) => {
        if (!mountedRef.current) return
        const shaped = shapeUser(fbUser)
        if (shaped) {
          setUser(shaped)
          // Sync to Supabase (profiles table + login_history), non-blocking
          syncProfileToSupabase(shaped).catch(() => {})
          await refreshProfile(shaped)
        } else {
          setUser(null); setProfile(null)
        }
        setIsLoading(false)
      })
    }

    init()
    return () => { mountedRef.current = false; unsub?.() }
  }, [refreshProfile])

  const userRole: KadsRole | null = profile?.role || (user ? emailToRole(user.email) : null)
  const isFounder = userRole === "founder" || userRole === "ceo"
  const isDirector = isFounder || userRole === "director"
  const isAdmin = isDirector || userRole === "admin"
  const isDeveloper = isAdmin || userRole === "developer"
  const isHR = isAdmin || userRole === "hr"
  const isContentManager = isAdmin || userRole === "content_manager"
  const isPrivileged = isDeveloper || isContentManager
  const isClient = userRole === "client"
  const isGuest = !user || userRole === "guest"
  const isSuperDeveloper = isFounder

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    const displayName = metadata?.full_name || metadata?.displayName
    if (demoMode) {
      const u = makeDemoUser(email, { displayName, emailVerified: false })
      safeStorage.setItem(DEMO_USER_KEY, JSON.stringify(u))
      setUser(u); await refreshProfile(u)
      return { error: null }
    }
    const res = await fbAuth.signUpWithEmail(email, password, displayName || "")
    if (!res.error && res.user) {
      const shaped = shapeUser(res.user)
      if (shaped) { setUser(shaped); await refreshProfile(shaped) }
    }
    return { error: res.error }
  }

  const signIn = async (email: string, password: string) => {
    if (demoMode) {
      const u = makeDemoUser(email)
      safeStorage.setItem(DEMO_USER_KEY, JSON.stringify(u))
      setUser(u); await refreshProfile(u)
      return { error: null }
    }
    const res = await fbAuth.signInWithEmail(email, password)
    if (!res.error && res.user) {
      const shaped = shapeUser(res.user)
      if (shaped) { setUser(shaped); await refreshProfile(shaped) }
    }
    return { error: res.error }
  }

  const signInWithGoogle = async () => {
    if (demoMode) {
      const u = makeDemoUser("demo.user@gmail.com", { displayName: "Demo User", provider: "google.com" })
      safeStorage.setItem(DEMO_USER_KEY, JSON.stringify(u))
      setUser(u); await refreshProfile(u)
      return { error: null }
    }
    const res = await fbAuth.signInWithGoogle()
    if (!res.error && res.user) {
      const shaped = shapeUser(res.user)
      if (shaped) { setUser(shaped); await refreshProfile(shaped) }
    }
    return { error: res.error }
  }

  const signOut = async () => {
    if (demoMode) {
      safeStorage.removeItem(DEMO_USER_KEY)
      setUser(null); setProfile(null)
      return
    }
    await fbAuth.signOut()
    setUser(null); setProfile(null)
  }

  const resetPassword = async (email: string) => {
    if (demoMode) return { error: null }
    const res = await fbAuth.sendPasswordReset(email)
    return { error: res.error }
  }

  const resendVerification = async (_email: string) => {
    // Firebase sends verification via the client SDK; no-op demo/non-configured
    return { error: null }
  }

  const updatePassword = async (newPassword: string) => {
    if (demoMode) return { error: null }
    try {
      const authMod = getFirebaseAuthInstance()
      if (authMod?.currentUser) await fbUpdatePassword(authMod.currentUser, newPassword)
      return { error: null }
    } catch (e: any) {
      return { error: { code: e.code || "error", message: e.message || "Update failed" } }
    }
  }

  const updateProfile = async (updates: Record<string, any>) => {
    if (demoMode || !user) {
      if (user) {
        const updated: KadsUser = {
          ...user,
          displayName: updates.displayName || updates.full_name || user.displayName,
          full_name: updates.full_name || updates.displayName || user.full_name,
          name: updates.displayName || updates.full_name || user.name,
          avatar_url: updates.avatar_url || updates.photoURL || user.avatar_url,
          photoURL: updates.photoURL || updates.avatar_url || user.photoURL,
          user_metadata: { ...user.user_metadata, ...updates },
        }
        safeStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated))
        setUser(updated)
      }
      return { error: null }
    }
    try {
      const authMod = getFirebaseAuthInstance()
      const displayName = updates.displayName || updates.full_name
      const photoURL = updates.photoURL || updates.avatar_url
      if (authMod?.currentUser && (displayName || photoURL)) {
        await fbFirebaseUpdateProfile(authMod.currentUser, { displayName, photoURL })
      }
      if (hasSupabaseCredentials() && profile?.id) {
        await supabase.from("profiles").update({
          full_name: displayName,
          phone: updates.phone,
          company: updates.company,
          city: updates.city,
          bio: updates.bio,
          avatar_url: photoURL,
        }).eq("id", profile.id)
      }
      await refreshProfile(user)
      return { error: null }
    } catch (e: any) {
      return { error: { code: e.code || "error", message: e.message || "Update failed" } }
    }
  }

  return (
    <AuthContext.Provider value={{
      user, profile, isLoading,
      isAdmin, isFounder, isDirector, isDeveloper, isHR, isClient, isGuest,
      isPrivileged, isSuperDeveloper, isContentManager,
      isAuthenticated: !!user,
      userRole,
      signUp, signIn, signInWithGoogle, signOut, resetPassword, resendVerification,
      updatePassword, updateProfile,
      demoMode, refreshProfile: () => refreshProfile(user),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}

export function roleMeetsMinimum(role: KadsRole | null | undefined, required: KadsRole): boolean {
  const order: Record<KadsRole, number> = {
    guest: 0, client: 10, content_manager: 30, hr: 40, developer: 50, admin: 70, director: 80, ceo: 90, founder: 100,
  }
  return (order[role || "guest"] || 0) >= (order[required] || 0)
}
