"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react"
import { supabase, isAdminEmail, hasSupabaseCredentials, KadsRole, roleHasAccess } from "@/lib/supabase"
import { User, AuthError } from "@supabase/supabase-js"
import { safeStorage } from "@/lib/storage"
import { getUserRole } from "@/lib/roles"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  isFounder: boolean
  isDirector: boolean
  isSuperDeveloper: boolean
  isContentManager: boolean
  isGuest: boolean
  isAuthenticated: boolean
  userRole: KadsRole | null
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  resendVerification: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Record<string, any>) => Promise<{ error: AuthError | null }>
  demoMode: boolean
  refreshRole: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USER_KEY = "kads_demo_user"
const DEMO_ROLE_KEY = "kads_demo_role"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)
  const [userRole, setUserRole] = useState<KadsRole | null>(null)

  const resolveRole = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setUserRole(null)
      return
    }
    if (demoMode) {
      const storedRole = safeStorage.getItem(DEMO_ROLE_KEY) as KadsRole | null
      const role = storedRole || (isAdminEmail(currentUser.email) ? "admin" : "guest")
      setUserRole(role)
      return
    }
    const role = await getUserRole(currentUser.id)
    // Fall back to admin email configuration if no role is set (client-side UI only)
    if (!role && isAdminEmail(currentUser.email)) {
      setUserRole("admin")
      return
    }
    setUserRole(role || "guest")
  }, [demoMode])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      if (!hasSupabaseCredentials()) {
        const demoUser = safeStorage.getItem(DEMO_USER_KEY)
        if (demoUser) {
          try {
            const parsed = JSON.parse(demoUser)
            if (mounted) setUser(parsed as User)
            if (mounted) await resolveRole(parsed as User)
          } catch {
            safeStorage.removeItem(DEMO_USER_KEY)
          }
        }
        if (mounted) {
          setDemoMode(true)
          setIsLoading(false)
        }
        return
      }

      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (mounted) {
            const nextUser = session?.user ?? null
            setUser(nextUser)
            resolveRole(nextUser)
            setIsLoading(false)
          }
        })

        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          const nextUser = session?.user ?? null
          setUser(nextUser)
          await resolveRole(nextUser)
          setIsLoading(false)
        }

        return () => subscription.unsubscribe()
      } catch (err) {
        console.error("Auth initialization failed:", err)
        if (mounted) {
          setDemoMode(true)
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [resolveRole])

  const isAdmin = roleHasAccess(userRole || "guest", "admin") || isAdminEmail(user?.email)
  const isFounder = roleHasAccess(userRole || "guest", "developer")
  const isDirector = roleHasAccess(userRole || "guest", "admin")
  const isSuperDeveloper = userRole === "ceo"
  const isContentManager = roleHasAccess(userRole || "guest", "content_manager")
  const isGuest = userRole === "guest"

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    if (demoMode) {
      const mockUser = { id: "demo-" + Date.now(), email, user_metadata: metadata || {} } as User
      safeStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser))
      setUser(mockUser)
      resolveRole(mockUser)
      return { error: null }
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      })
      return { error }
    } catch (err) {
      return { error: { message: String(err) } as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (demoMode) {
      const mockUser = { id: "demo-" + Date.now(), email } as User
      safeStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser))
      setUser(mockUser)
      resolveRole(mockUser)
      return { error: null }
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { error }
    } catch (err) {
      return { error: { message: String(err) } as AuthError }
    }
  }

  const signInWithGoogle = async () => {
    if (demoMode) {
      return { error: { message: "Demo mode: use Email/Password tab. Configure Supabase for real OAuth." } as AuthError }
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined
        }
      })
      return { error }
    } catch (err) {
      return { error: { message: String(err) } as AuthError }
    }
  }

  const signOut = async () => {
    if (demoMode) {
      safeStorage.removeItem(DEMO_USER_KEY)
      setUser(null)
      setUserRole(null)
      return
    }
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Sign out failed:", err)
    }
    setUser(null)
    setUserRole(null)
  }

  const resetPassword = async (email: string) => {
    if (demoMode) {
      return { error: { message: "Demo mode: password reset is simulated. In production, Supabase will send a real reset email." } as AuthError }
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/reset/` : undefined
      })
      return { error }
    } catch (err) {
      return { error: { message: String(err) } as AuthError }
    }
  }

  const resendVerification = async (email: string) => {
    if (demoMode) {
      return { error: { message: "Demo mode: verification email is simulated." } as AuthError }
    }
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined }
      })
      return { error }
    } catch (err) {
      return { error: { message: String(err) } as AuthError }
    }
  }

  const updatePassword = async (newPassword: string) => {
    if (demoMode) {
      return { error: null }
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      return { error }
    } catch (err) {
      return { error: { message: String(err) } as AuthError }
    }
  }

  const updateProfile = async (updates: Record<string, any>) => {
    if (demoMode) {
      const updated = { ...(user || {}), user_metadata: { ...(user?.user_metadata || {}), ...updates } } as User
      safeStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated))
      setUser(updated)
      return { error: null }
    }
    try {
      const { error } = await supabase.auth.updateUser({ data: updates })
      return { error }
    } catch (err) {
      return { error: { message: String(err) } as AuthError }
    }
  }

  const refreshRole = async () => {
    await resolveRole(user)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAdmin,
      isFounder,
      isDirector,
      isSuperDeveloper,
      isContentManager,
      isGuest,
      isAuthenticated: !!user,
      userRole,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      resendVerification,
      updatePassword,
      updateProfile,
      demoMode,
      refreshRole
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
