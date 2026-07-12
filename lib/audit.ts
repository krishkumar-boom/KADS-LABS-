import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"

const DEMO_AUDIT_KEY = "kads_demo_audit"

export interface AuditLog {
  id: string
  userId?: string
  email?: string
  action: string
  resource: string
  details?: Record<string, any>
  createdAt: string
}

export const logAction = async (
  userId: string | undefined,
  email: string | undefined,
  action: string,
  resource: string,
  details?: Record<string, any>
): Promise<void> => {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    userId,
    email,
    action,
    resource,
    details,
    createdAt: new Date().toISOString()
  }
  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_AUDIT_KEY) || "[]") as AuditLog[]
    existing.unshift(log)
    safeStorage.setItem(DEMO_AUDIT_KEY, JSON.stringify(existing.slice(0, 200)))
    return
  }
  try {
    await supabase.from("audit_logs").insert({
      user_id: userId,
      email,
      action,
      resource,
      details
    })
  } catch (err) {
    console.error("logAction failed:", err)
  }
}

export const listAuditLogs = async (options?: { limit?: number }): Promise<AuditLog[]> => {
  const limit = options?.limit || 100
  if (!hasSupabaseCredentials()) {
    return JSON.parse(safeStorage.getItem(DEMO_AUDIT_KEY) || "[]").slice(0, limit)
  }
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      email: row.email,
      action: row.action,
      resource: row.resource,
      details: row.details,
      createdAt: row.created_at
    }))
  } catch (err) {
    console.error("listAuditLogs failed:", err)
    return []
  }
}
