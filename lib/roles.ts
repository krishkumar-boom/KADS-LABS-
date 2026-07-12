import { supabase, hasSupabaseCredentials, KadsRole, ROLE_HIERARCHY } from "./supabase"
import { safeStorage } from "./storage"
import { generateId } from "./site-data"

const DEMO_ROLES_KEY = "kads_demo_roles"
const DEMO_PROFILES_KEY = "kads_demo_profiles"

export interface RoleRecord {
  id: string
  userId: string
  role: KadsRole
  email: string
  createdAt: string
  updatedAt: string
}

export interface ProfileRecord {
  id: string
  fullName: string
  company: string
  phone: string
  avatarUrl?: string
  email: string
  createdAt: string
  updatedAt: string
}

export const getUserRole = async (userId?: string): Promise<KadsRole | null> => {
  if (!userId) return null
  if (!hasSupabaseCredentials()) {
    const roles = JSON.parse(safeStorage.getItem(DEMO_ROLES_KEY) || "[]") as RoleRecord[]
    const found = roles.find(r => r.userId === userId)
    return found?.role || "guest"
  }
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single()
    if (error || !data) return null
    return data.role as KadsRole
  } catch (err) {
    console.error("getUserRole failed:", err)
    return null
  }
}

export const getUserRoleByEmail = async (email?: string): Promise<KadsRole | null> => {
  if (!email) return null
  if (!hasSupabaseCredentials()) {
    const roles = JSON.parse(safeStorage.getItem(DEMO_ROLES_KEY) || "[]") as RoleRecord[]
    const found = roles.find(r => r.email.toLowerCase() === email.toLowerCase())
    return found?.role || "guest"
  }
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .ilike("email", email)
      .single()
    if (error || !data) return null
    return (data.role as KadsRole) || null
  } catch (err) {
    console.error("getUserRoleByEmail failed:", err)
    return null
  }
}

const canManageRole = (assignerRole: KadsRole | null | undefined, targetRole: KadsRole): { error?: string } => {
  if (!assignerRole) return { error: "No assigner role provided." }
  const assignerLevel = ROLE_HIERARCHY[assignerRole] || 0
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0
  if (assignerLevel < targetLevel) {
    return { error: "You cannot assign a role higher than your own." }
  }
  return {}
}

export const assignRole = async (userId: string, email: string, role: KadsRole, assignerRole?: KadsRole | null): Promise<{ error?: string }> => {
  const check = canManageRole(assignerRole, role)
  if (check.error) return check
  if (!hasSupabaseCredentials()) {
    const roles = JSON.parse(safeStorage.getItem(DEMO_ROLES_KEY) || "[]") as RoleRecord[]
    const now = new Date().toISOString()
    const existing = roles.find(r => r.userId === userId)
    if (existing) {
      existing.role = role
      existing.email = email
      existing.updatedAt = now
    } else {
      roles.push({ id: generateId("role"), userId, email, role, createdAt: now, updatedAt: now })
    }
    safeStorage.setItem(DEMO_ROLES_KEY, JSON.stringify(roles))
    return {}
  }
  try {
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, email, role, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
    if (error) throw error
    return {}
  } catch (err) {
    console.error("assignRole failed:", err)
    return { error: String(err) }
  }
}

export const removeRole = async (userId: string, assignerRole?: KadsRole | null): Promise<{ error?: string }> => {
  if (!assignerRole) return { error: "No assigner role provided." }
  if (assignerRole !== "ceo" && assignerRole !== "developer") {
    return { error: "Only CEO or Developer can remove roles." }
  }
  if (!hasSupabaseCredentials()) {
    const roles = JSON.parse(safeStorage.getItem(DEMO_ROLES_KEY) || "[]") as RoleRecord[]
    safeStorage.setItem(DEMO_ROLES_KEY, JSON.stringify(roles.filter(r => r.userId !== userId)))
    return {}
  }
  try {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId)
    if (error) throw error
    return {}
  } catch (err) {
    console.error("removeRole failed:", err)
    return { error: String(err) }
  }
}

export const listRoles = async (): Promise<RoleRecord[]> => {
  if (!hasSupabaseCredentials()) {
    return JSON.parse(safeStorage.getItem(DEMO_ROLES_KEY) || "[]")
  }
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("id, user_id, email, role, created_at, updated_at")
      .order("created_at", { ascending: false })
    if (error || !data) return []
    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      role: row.role as KadsRole,
      email: row.email || "",
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (err) {
    console.error("listRoles failed:", err)
    return []
  }
}

export const getProfile = async (userId?: string): Promise<ProfileRecord | null> => {
  if (!userId) return null
  if (!hasSupabaseCredentials()) {
    const profiles = JSON.parse(safeStorage.getItem(DEMO_PROFILES_KEY) || "[]") as ProfileRecord[]
    return profiles.find(p => p.id === userId) || null
  }
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (error || !data) return null
    return {
      id: data.id,
      fullName: data.full_name || "",
      company: data.company || "",
      phone: data.phone || "",
      avatarUrl: data.avatar_url || "",
      email: "",
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  } catch (err) {
    console.error("getProfile failed:", err)
    return null
  }
}

export const updateProfile = async (userId: string, updates: Partial<ProfileRecord>): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    const profiles = JSON.parse(safeStorage.getItem(DEMO_PROFILES_KEY) || "[]") as ProfileRecord[]
    const now = new Date().toISOString()
    const existing = profiles.find(p => p.id === userId)
    if (existing) {
      Object.assign(existing, updates, { updatedAt: now })
    } else {
      profiles.push({ id: userId, fullName: "", company: "", phone: "", email: "", createdAt: now, updatedAt: now, ...updates })
    }
    safeStorage.setItem(DEMO_PROFILES_KEY, JSON.stringify(profiles))
    return {}
  }
  try {
    const payload: Record<string, any> = { updated_at: new Date().toISOString() }
    if (updates.fullName !== undefined) payload.full_name = updates.fullName
    if (updates.company !== undefined) payload.company = updates.company
    if (updates.phone !== undefined) payload.phone = updates.phone
    if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl
    const { error } = await supabase.from("profiles").upsert({ id: userId, ...payload }, { onConflict: "id" })
    if (error) throw error
    return {}
  } catch (err) {
    console.error("updateProfile failed:", err)
    return { error: String(err) }
  }
}
