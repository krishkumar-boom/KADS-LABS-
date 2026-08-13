"use client"

/**
 * Invitation-based onboarding.
 *
 * Founders/Admins generate a time-bound, signed invitation token that links to
 * /auth?invite=<token>. When the invited user signs up with the matching email,
 * the backend (Supabase RPC) grants them the pre-assigned role.
 *
 * In demo mode tokens are validated locally in localStorage.
 */

import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"

export type InviteRole = "developer" | "hr" | "admin" | "director" | "client"

export interface Invitation {
  id: string
  email: string
  role: InviteRole
  invited_by: string | null
  invited_by_name?: string | null
  token: string
  expires_at: string
  accepted_at?: string | null
  created_at: string
}

const DEMO_INVITES_KEY = "kads_demo_invitations"

function b64url(input: string): string {
  if (typeof window === "undefined") return input
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function generateToken(email: string, role: InviteRole): string {
  const rand = Math.random().toString(36).slice(2, 16) + Date.now().toString(36)
  return b64url(`${email}|${role}|${rand}|${Date.now() + 7 * 24 * 3600 * 1000}`)
}

export async function createInvitation(email: string, role: InviteRole, invitedBy?: { id?: string; name?: string; email?: string }): Promise<{ token?: string; error?: string; inviteUrl?: string }> {
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: "Valid email required" }
  }

  const token = generateToken(email, role)
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "https://kadslabs.com")
  const inviteUrl = `${appUrl}/?invite=${token}&action=accept`

  if (hasSupabaseCredentials()) {
    try {
      // Prefer the RPC (if migration has been updated with create_invitation function).
      // Fallback to direct insert to invitations table if RPC unavailable.
      const payload = {
        email: email.toLowerCase(),
        role,
        token,
        invited_by: invitedBy?.id || null,
        invited_by_name: invitedBy?.name || null,
        expires_at: expiresAt,
      }
      const { error } = await supabase.from("invitations").insert(payload as any)
      if (error) {
        console.warn("[invites] Insert failed, storing demo-side:", error.message)
        storeDemoInvite({ ...payload, id: `inv-${Date.now()}`, created_at: new Date().toISOString() })
      }
    } catch (e: any) {
      console.warn("[invites] Supabase unavailable, storing demo-side:", e?.message)
      storeDemoInvite({ id: `inv-${Date.now()}`, email: email.toLowerCase(), role, token, invited_by: invitedBy?.id || "", invited_by_name: invitedBy?.name, expires_at: expiresAt, created_at: new Date().toISOString() })
    }
  } else {
    storeDemoInvite({ id: `inv-${Date.now()}`, email: email.toLowerCase(), role, token, invited_by: invitedBy?.id || "", invited_by_name: invitedBy?.name, expires_at: expiresAt, created_at: new Date().toISOString() })
  }

  return { token, inviteUrl }
}

function storeDemoInvite(inv: Invitation) {
  const list = JSON.parse(safeStorage.getItem(DEMO_INVITES_KEY) || "[]") as Invitation[]
  list.unshift(inv)
  safeStorage.setItem(DEMO_INVITES_KEY, JSON.stringify(list.slice(0, 50)))
}

export async function listInvitations(): Promise<Invitation[]> {
  if (!hasSupabaseCredentials()) {
    try { return JSON.parse(safeStorage.getItem(DEMO_INVITES_KEY) || "[]") } catch { return [] }
  }
  try {
    const { data } = await supabase.from("invitations").select("*").order("created_at", { ascending: false }).limit(50)
    return (data || []) as Invitation[]
  } catch { return [] }
}

export async function consumeInvitation(token: string, acceptedByEmail: string): Promise<{ ok: boolean; role?: InviteRole; error?: string }> {
  if (!hasSupabaseCredentials()) {
    const list = JSON.parse(safeStorage.getItem(DEMO_INVITES_KEY) || "[]") as Invitation[]
    const inv = list.find(i => i.token === token)
    if (!inv) return { ok: false, error: "Invalid or expired invitation" }
    if (new Date(inv.expires_at) < new Date()) return { ok: false, error: "Invitation expired" }
    if (inv.accepted_at) return { ok: false, error: "Invitation already used" }
    inv.accepted_at = new Date().toISOString()
    safeStorage.setItem(DEMO_INVITES_KEY, JSON.stringify(list))
    // When accepting, the consumer (AuthProvider) assigns this role to the signing-up user.
    return { ok: true, role: inv.role }
  }
  try {
    // Call the accept_invitation RPC (defined in migration 003 — see below)
    const { data, error } = await (supabase as any).rpc("accept_invitation", { p_token: token, p_email: acceptedByEmail.toLowerCase() })
    if (error) return { ok: false, error: error.message }
    return { ok: true, role: (data as InviteRole) || undefined }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Failed to accept invitation" }
  }
}
