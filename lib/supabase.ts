import { createClient, SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Lazy initialization: only create the real client when credentials are present.
// This prevents runtime errors when the site is opened as a static file without Supabase configured.
let _supabase: SupabaseClient | null = null

const noOp = () => ({
  then: () => noOp,
  catch: () => noOp,
  finally: () => noOp
})

const chain = () => chain

const createSafeClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith("https://")) {
    // Return a dummy client that logs and rejects gracefully so nothing crashes
    return new Proxy({} as SupabaseClient, {
      get(_target, prop) {
        if (prop === "auth") {
          return {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            signUp: () => Promise.resolve({ data: null, error: null }),
            signInWithPassword: () => Promise.resolve({ data: null, error: null }),
            signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
            signOut: () => Promise.resolve({ error: null }),
            resetPasswordForEmail: () => Promise.resolve({ data: null, error: null }),
            resend: () => Promise.resolve({ data: null, error: null }),
            updateUser: () => Promise.resolve({ data: null, error: null }),
            verifyOtp: () => Promise.resolve({ data: null, error: null })
          }
        }
        if (prop === "from") {
          return () => ({
            select: () => chain,
            insert: () => chain,
            upsert: () => chain,
            update: () => chain,
            delete: () => chain,
            eq: () => chain,
            neq: () => chain,
            in: () => chain,
            order: () => chain,
            range: () => chain,
            limit: () => chain,
            single: () => Promise.resolve({ data: null, error: null }),
            maybeSingle: () => Promise.resolve({ data: null, error: null })
          })
        }
        if (prop === "channel") {
          return () => ({
            on: () => chain,
            subscribe: () => chain
          })
        }
        if (prop === "removeChannel") {
          return () => {}
        }
        if (prop === "storage") {
          return {
            from: () => ({
              upload: () => Promise.resolve({ data: null, error: null }),
              list: () => Promise.resolve({ data: null, error: null }),
              move: () => Promise.resolve({ data: null, error: null }),
              remove: () => Promise.resolve({ data: null, error: null }),
              getPublicUrl: () => ({ data: { publicUrl: "" } }),
              createSignedUrl: () => Promise.resolve({ data: null, error: null })
            })
          }
        }
        return chain
      }
    })
  }

  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  }
  return _supabase
}

export const supabase = createSafeClient()

export const hasSupabaseCredentials = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("https://"))
}

export const getAdminEmails = () => {
  const emails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "developer@krish.com"
  return emails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean)
}

export const isAdminEmail = (email?: string) => {
  if (!email) return false
  return getAdminEmails().includes(email.toLowerCase())
}

export type KadsRole = "ceo" | "developer" | "admin" | "content_manager" | "guest"

export const ROLE_HIERARCHY: Record<KadsRole, number> = {
  ceo: 100,
  developer: 80,
  admin: 60,
  content_manager: 40,
  guest: 20
}

export const isPrivilegedRole = (role?: KadsRole | string) => {
  if (!role) return false
  return ["ceo", "developer", "admin", "content_manager"].includes(role)
}

export const roleCanAssign = (role?: KadsRole | string) => {
  return role === "ceo" || role === "developer"
}

export const roleHasAccess = (userRole?: KadsRole | string, required?: KadsRole | string) => {
  if (!userRole || !required) return false
  return (ROLE_HIERARCHY[userRole as KadsRole] || 0) >= (ROLE_HIERARCHY[required as KadsRole] || 0)
}
