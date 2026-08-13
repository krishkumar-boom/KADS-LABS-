/**
 * One-shot profile sync on login.
 * Calls the Supabase RPC `upsert_firebase_profile` (defined in migration 003) to
 * create/update a `public.profiles` row for the Firebase-authenticated user, with
 * correct role auto-detection for founder emails and a `last_login_at` timestamp.
 *
 * - Idempotent (safe to call on every login).
 * - Only runs in browser with Supabase credentials present.
 * - Falls back silently if Supabase is unreachable.
 */
import { supabase, hasSupabaseCredentials } from "./supabase"
import type { KadsUser } from "@/app/components/AuthProvider"

const SYNCED_KEY = "kads_synced_profiles"

function recentlySynced(uid: string): boolean {
  try {
    const raw = localStorage.getItem(SYNCED_KEY)
    if (!raw) return false
    const map: Record<string, number> = JSON.parse(raw)
    return Date.now() - (map[uid] || 0) < 10 * 60 * 1000
  } catch { return false }
}

function markSynced(uid: string) {
  try {
    const raw = localStorage.getItem(SYNCED_KEY)
    const map: Record<string, number> = raw ? JSON.parse(raw) : {}
    map[uid] = Date.now()
    localStorage.setItem(SYNCED_KEY, JSON.stringify(map))
  } catch {}
}

export async function syncProfileToSupabase(user: KadsUser | null): Promise<string | null> {
  if (!user || !user.email) return null
  if (!hasSupabaseCredentials()) return null
  if (typeof window === "undefined") return null
  if (recentlySynced(user.uid)) return null

  try {
    // Try RPC first (preferred)
    const { data, error } = await (supabase as any).rpc("upsert_firebase_profile", {
      p_firebase_uid: user.uid,
      p_email: user.email.toLowerCase(),
      p_full_name: user.displayName || user.full_name || null,
      p_avatar_url: user.photoURL || user.avatar_url || null,
    })

    if (error) {
      console.debug("[sync] RPC failed, trying direct upsert:", error.message)
      // Fall back to direct upsert by email (won't auto-assign founder role but creates the row)
      const { error: ue } = await supabase.from("profiles").upsert({
        email: user.email.toLowerCase(),
        full_name: user.displayName || user.full_name,
        avatar_url: user.photoURL || user.avatar_url,
        last_login_at: new Date().toISOString(),
      }, { onConflict: "email" })
      if (ue) console.debug("[sync] upsert failed:", ue.message)
    }
    markSynced(user.uid)
    return (data as string) || null
  } catch (e) {
    console.debug("[sync] Profile sync skipped:", e)
    return null
  }
}
