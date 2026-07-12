import { supabase, hasSupabaseCredentials, KadsRole } from "./supabase"
import { safeStorage } from "./storage"

export type PermissionKey =
  | "cms:read" | "cms:write"
  | "media:read" | "media:write"
  | "leads:read" | "leads:write"
  | "users:read" | "users:write"
  | "analytics:read"
  | "tickets:read" | "tickets:write"
  | "projects:read" | "projects:write"

const DEMO_PERMISSIONS_KEY = "kads_demo_permissions"

export const getRolePermissions = async (role: KadsRole | null): Promise<PermissionKey[]> => {
  if (!role) return []
  if (!hasSupabaseCredentials()) {
    const stored = JSON.parse(safeStorage.getItem(DEMO_PERMISSIONS_KEY) || "[]") as PermissionKey[]
    return stored
  }
  try {
    const { data, error } = await supabase.from("role_permissions").select("permission_key").eq("role", role)
    if (error) throw error
    return (data || []).map((row: any) => row.permission_key as PermissionKey)
  } catch (err) {
    console.error("getRolePermissions failed:", err)
    return []
  }
}

export const hasPermission = async (role: KadsRole | null, permission: PermissionKey): Promise<boolean> => {
  if (role === "ceo" || role === "developer") return true
  const permissions = await getRolePermissions(role)
  return permissions.includes(permission)
}

export const setDemoPermissions = (permissions: PermissionKey[]) => {
  safeStorage.setItem(DEMO_PERMISSIONS_KEY, JSON.stringify(permissions))
}
