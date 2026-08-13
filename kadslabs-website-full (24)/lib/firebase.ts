/**
 * Firebase Authentication client.
 *
 * KADS LABS uses Firebase for:
 *   - Google login
 *   - Email/password login
 *   - Password reset
 *   - Session management, remember-me, secure cookies, automatic token refresh
 *
 * Supabase remains the source of truth for Database, Storage, Realtime, Edge Functions,
 * and Row-Level Security. We sync the Firebase UID into Supabase via a server-side
 * Edge Function (`sync-firebase-user`) on first login — but since static/SSR builds
 * must work offline, we use a lightweight JWT-style approach: after Firebase signs in
 * the user we sign them into Supabase via a custom JWT minted by the Edge Function,
 * falling back to Supabase anon when the function isn't deployed yet.
 *
 * When Firebase env vars are missing (localhost, pre-deploy) this module exposes a
 * demo-mode stub that mirrors the real API so UI doesn't crash.
 */

import { shouldUseDemoMode, isProductionDomain } from "./env"

export type KadsUserBase = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  provider: "password" | "google.com" | "anonymous"
  idToken: string
}

export type AuthError = { code: string; message: string }

export interface AuthClient {
  currentUser: KadsUserBase | null
  onAuthStateChanged(cb: (user: KadsUserBase | null) => void): () => void
  signInWithEmail(email: string, password: string): Promise<{ user: KadsUserBase | null; error: AuthError | null }>
  signUpWithEmail(email: string, password: string, displayName: string): Promise<{ user: KadsUserBase | null; error: AuthError | null }>
  signInWithGoogle(): Promise<{ user: KadsUserBase | null; error: AuthError | null }>
  sendPasswordReset(email: string): Promise<{ error: AuthError | null }>
  signOut(): Promise<void>
  getIdToken(force?: boolean): Promise<string | null>
}

// ------- Read config -------
const fbConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

export const hasFirebaseCredentials = (): boolean => {
  return Boolean(fbConfig.apiKey && fbConfig.authDomain && fbConfig.projectId && fbConfig.appId)
}

// ------- Firebase instances (static imports for tree-shaking; client only) -------
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  updatePassword as fbUpdatePassword,
  onAuthStateChanged,
  type Auth,
  type User as FbUser,
} from "firebase/auth"

let _fbApp: FirebaseApp | null = null
let _fbAuth: Auth | null = null
let _googleProvider: GoogleAuthProvider | null = null

/**
 * Public accessor for the singleton Firebase Auth instance.
 * Always use this instead of getAuth() to ensure you're using the same initialized app.
 */
export function getFirebaseAuthInstance(): Auth | null {
  return getFirebaseAuth()
}

function getFirebaseAuth(): Auth | null {
  if (_fbAuth) return _fbAuth
  if (!hasFirebaseCredentials()) {
    if (typeof window !== "undefined") {
      console.warn("[auth] Firebase credentials missing — check NEXT_PUBLIC_FIREBASE_* env vars.")
      console.debug("[auth] Config present:", {
        apiKey: !!fbConfig.apiKey,
        authDomain: fbConfig.authDomain,
        projectId: fbConfig.projectId,
        appId: !!fbConfig.appId,
      })
    }
    return null
  }
  if (typeof window === "undefined") return null
  try {
    const app = getApps().length ? getApp() : initializeApp(fbConfig)
    const auth = getAuth(app)
    setPersistence(auth, browserLocalPersistence).catch(() => {})
    _fbApp = app
    _fbAuth = auth
    _googleProvider = new GoogleAuthProvider()
    _googleProvider.addScope("profile email")
    _googleProvider.addScope("openid")
    _googleProvider.setCustomParameters({ prompt: "select_account" })
    if (process.env.NODE_ENV !== "production") {
      console.log("[auth] Firebase initialized:", { projectId: fbConfig.projectId, authDomain: fbConfig.authDomain })
    }
    return _fbAuth
  } catch (e) {
    console.warn("[auth] Firebase failed to initialize:", e)
    return null
  }
}

// ------- Convert Firebase user -> KadsUserBase -------
function toKadsUserBase(fbUser: FbUser): KadsUserBase {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
    emailVerified: !!fbUser.emailVerified,
    provider: (fbUser.providerData?.[0]?.providerId as KadsUserBase["provider"]) || "password",
    idToken: "",
  }
}

// ------- Demo mode stub -------
const DEMO_USER_KEY = "kads_demo_user"

function getDemoUser(): KadsUserBase | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function setDemoUser(u: KadsUserBase | null) {
  if (typeof window === "undefined") return
  if (!u) { localStorage.removeItem(DEMO_USER_KEY); return }
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(u))
}

const demoListeners = new Set<(u: KadsUserBase | null) => void>()

function notifyDemo(u: KadsUserBase | null) {
  demoListeners.forEach(cb => { try { cb(u) } catch {} })
}

const demoClient: AuthClient = {
  currentUser: null,
  onAuthStateChanged(cb) {
    demoListeners.add(cb)
    // fire initial
    setTimeout(() => cb(getDemoUser()), 0)
    return () => { demoListeners.delete(cb) }
  },
  async signInWithEmail(email, password) {
    if (!email || !password) return { user: null, error: { code: "missing", message: "Email and password required" } }
    const adminEmails = ["ceo@kadslabs.com", "founderskadslabs@gmail.com"]
    const isAdmin = adminEmails.includes(email.toLowerCase())
    const role = email.toLowerCase().includes("hr") ? "hr"
               : email.toLowerCase().includes("dev") ? "developer"
               : email.toLowerCase().includes("client") ? "client"
               : isAdmin ? "founder" : "client"
    const u: KadsUserBase = {
      uid: "demo-" + Math.random().toString(36).slice(2, 10),
      email,
      displayName: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      photoURL: null,
      emailVerified: true,
      provider: "password",
      idToken: "demo-token",
    }
    // store role hint
    setDemoUser({ ...u, idToken: role as any } as any)
    notifyDemo(u)
    return { user: u, error: null }
  },
  async signUpWithEmail(email, password, displayName) {
    const u: KadsUserBase = {
      uid: "demo-" + Math.random().toString(36).slice(2, 10),
      email, displayName, photoURL: null, emailVerified: false, provider: "password", idToken: "client",
    }
    setDemoUser(u); notifyDemo(u)
    return { user: u, error: null }
  },
  async signInWithGoogle() {
    const u: KadsUserBase = {
      uid: "demo-google-" + Math.random().toString(36).slice(2, 10),
      email: "demo.user@gmail.com",
      displayName: "Demo User",
      photoURL: null,
      emailVerified: true,
      provider: "google.com",
      idToken: "demo-google-token",
    }
    setDemoUser(u); notifyDemo(u)
    return { user: u, error: null }
  },
  async sendPasswordReset(email) {
    if (!email) return { error: { code: "missing", message: "Email required" } }
    return { error: null }
  },
  async signOut() {
    setDemoUser(null); notifyDemo(null)
  },
  async getIdToken() {
    const u = getDemoUser()
    return u?.idToken || null
  }
}

// ------- Real Firebase client -------
function createFirebaseClient(): AuthClient {
  const auth = getFirebaseAuth()!
  let currentUser: KadsUserBase | null = null
  const listeners = new Set<(u: KadsUserBase | null) => void>()
  const notify = (u: KadsUserBase | null) => { currentUser = u; listeners.forEach(cb => { try { cb(u) } catch {} }) }

  const unsub = onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) { notify(null); return }
    const ku = toKadsUserBase(fbUser)
    try { ku.idToken = await fbUser.getIdToken() } catch {}
    notify(ku)
  })

  return {
    get currentUser() { return currentUser },
    onAuthStateChanged(cb) {
      listeners.add(cb)
      setTimeout(() => cb(currentUser), 0)
      return () => { listeners.delete(cb) }
    },
    async signInWithEmail(email, password) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password)
        const u = toKadsUserBase(cred.user)
        u.idToken = await cred.user.getIdToken()
        return { user: u, error: null }
      } catch (e: any) {
        return { user: null, error: { code: e.code || "auth/error", message: e.message || "Sign in failed" } }
      }
    },
    async signUpWithEmail(email, password, displayName) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (displayName) await fbUpdateProfile(cred.user, { displayName })
        const u = toKadsUserBase(cred.user)
        u.displayName = displayName
        u.idToken = await cred.user.getIdToken()
        return { user: u, error: null }
      } catch (e: any) {
        return { user: null, error: { code: e.code || "auth/error", message: e.message || "Sign up failed" } }
      }
    },
    async signInWithGoogle() {
      try {
        let cred
        try {
          cred = await signInWithPopup(auth, _googleProvider!)
        } catch (popupErr: any) {
          if (popupErr?.code === "auth/popup-blocked" || popupErr?.code === "auth/operation-not-supported-in-this-environment") {
            await signInWithRedirect(auth, _googleProvider!)
            return { user: null, error: null }
          }
          throw popupErr
        }
        const u = toKadsUserBase(cred.user)
        u.idToken = await cred.user.getIdToken()
        return { user: u, error: null }
      } catch (e: any) {
        return { user: null, error: { code: e.code || "auth/error", message: e.message || "Google sign in failed" } }
      }
    },
    async sendPasswordReset(email) {
      try {
        await sendPasswordResetEmail(auth, email)
        return { error: null }
      } catch (e: any) {
        return { error: { code: e.code || "auth/error", message: e.message || "Password reset failed" } }
      }
    },
    async signOut() {
      try {
        await fbSignOut(auth)
      } catch {}
      notify(null)
    },
    async getIdToken(forceRefresh = false) {
      const fbUser = auth.currentUser
      if (!fbUser) return null
      try { return await fbUser.getIdToken(forceRefresh) } catch { return null }
    }
  }
}

// ------- Export singleton -------
export const auth: AuthClient = (() => {
  if (typeof window !== "undefined" && hasFirebaseCredentials()) {
    try { return createFirebaseClient() } catch (e) {
      console.warn("[auth] Falling back to demo mode:", e)
    }
  }
  return demoClient
})()

export function isAuthDemoMode(): boolean {
  return !hasFirebaseCredentials() || shouldUseDemoMode(hasFirebaseCredentials())
}

export function shouldShowConfigError(): boolean {
  if (typeof window === "undefined") return false
  if (isProductionDomain() && !hasFirebaseCredentials()) return true
  return false
}
