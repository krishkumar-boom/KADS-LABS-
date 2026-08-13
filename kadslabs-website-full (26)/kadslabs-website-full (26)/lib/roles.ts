import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"
import type { KadsRole } from "@/app/components/AuthProvider"

const DEMO_ROLES_KEY = "kads_demo_roles"

export interface ProfileRecord {
  id: string
  email: string
  full_name: string
  role: KadsRole
  company?: string
  phone?: string
  city?: string
  avatar_url?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export async function listProfiles(): Promise<ProfileRecord[]> {
  if (!hasSupabaseCredentials()) {
    try { return JSON.parse(safeStorage.getItem(DEMO_ROLES_KEY) || "[]") } catch { return [] }
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,role,company,phone,city,avatar_url,status,created_at,updated_at")
      .order("created_at", { ascending: false })
    if (error) throw error
    return (data || []) as ProfileRecord[]
  } catch (e) {
    console.error("listProfiles failed:", e)
    return []
  }
}

export async function updateUserRole(profileId: string, newRole: KadsRole): Promise<{ error?: string }> {
  if (!hasSupabaseCredentials()) {
    const list = JSON.parse(safeStorage.getItem(DEMO_ROLES_KEY) || "[]") as ProfileRecord[]
    const idx = list.findIndex(p => p.id === profileId)
    if (idx >= 0) list[idx].role = newRole
    safeStorage.setItem(DEMO_ROLES_KEY, JSON.stringify(list))
    return {}
  }
  try {
    const { error } = await supabase.from("profiles").update({ role: newRole, updated_at: new Date().toISOString() }).eq("id", profileId)
    if (error) throw error
    await logAdminAction("role_change", "profiles", profileId, { role: newRole })
    return {}
  } catch (e: any) {
    return { error: e.message || String(e) }
  }
}

export async function updateUserStatus(profileId: string, status: "active" | "suspended" | "banned"): Promise<{ error?: string }> {
  if (!hasSupabaseCredentials()) return {}
  try {
    const { error } = await supabase.from("profiles").update({ status, updated_at: new Date().toISOString() }).eq("id", profileId)
    if (error) throw error
    await logAdminAction("user_status_change", "profiles", profileId, { status })
    return {}
  } catch (e: any) {
    return { error: e.message || String(e) }
  }
}

async function logAdminAction(action: string, entity: string, entityId: string, meta: Record<string, any>) {
  if (!hasSupabaseCredentials()) return
  try {
    await supabase.rpc("log_audit", {
      p_action: action,
      p_entity_type: entity,
      p_entity_id: entityId,
      p_new_data: meta,
    })
  } catch {}
}
