"use client"

import { supabase, hasSupabaseCredentials } from "./supabase"
import { clientRateLimit, isHoneypotFilled, sanitizeText, sanitizeEmail, sanitizePhone, generateRandomId } from "./security"

export type TicketType = "contact" | "support" | "quote" | "career" | "feedback" | "bug" | "suggestion" | "complaint"
export type TicketPriority = "low" | "normal" | "medium" | "high" | "urgent"
export type TicketStatus = "new" | "open" | "in_progress" | "assigned" | "resolved" | "archived" | "closed" | "spam"

export interface TicketPayload {
  type: TicketType
  subject: string
  description: string
  priority?: TicketPriority
  name?: string
  email: string
  phone?: string
  company?: string
  category?: string
  metadata?: Record<string, any>
  website?: string // honeypot field
  screenshot_url?: string
}

export interface CareerApplicationPayload {
  position: string
  name: string
  email: string
  phone?: string
  city?: string
  resume_url?: string
  resume_filename?: string
  portfolio_url?: string
  github_url?: string
  linkedin_url?: string
  experience_years?: string
  expected_salary?: string
  notice_period?: string
  cover_letter?: string
  website?: string // honeypot
}

export interface BugReportPayload {
  name?: string
  email: string
  subject: string
  description: string
  severity?: "low" | "medium" | "high" | "critical"
  page_url?: string
  browser?: string
  device?: string
  steps_to_reproduce?: string
  expected_behavior?: string
  actual_behavior?: string
  screenshot_url?: string
  website?: string // honeypot
}

export interface TicketResult {
  ok: boolean
  ticketId?: string
  leadId?: string
  error?: string
  simulated?: boolean
}

export function getTicketErrorMessage(error: string | undefined, lang: "en" | "hi" = "en"): string {
  if (!error) return ""
  if (error === "RATE_LIMITED") {
    return lang === "hi" ? "बहुत जल्दी सबमिट कर रहे हैं। कृपया 1 मिनट रुकें।" : "Please wait a minute before submitting again."
  }
  if (error === "HONEYPOT") {
    return "" // silent fail for bots
  }
  if (error === "INVALID_EMAIL") {
    return lang === "hi" ? "कृपया सही ईमेल डालें।" : "Please enter a valid email address."
  }
  if (error === "MISSING_FIELDS") {
    return lang === "hi" ? "ज़रूरी फ़ील्ड भरें।" : "Please fill in all required fields."
  }
  return lang === "hi" ? "कुछ गड़बड़ हुई। बाद में पुनः प्रयास करें।" : "Something went wrong. Please try again."
}

function collectClientMeta(): Record<string, any> {
  if (typeof window === "undefined") return {}
  return {
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer || null,
    utm_source: new URLSearchParams(window.location.search).get("utm_source"),
    utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
    utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenSize: `${window.screen.width}x${window.screen.height}`
  }
}

export async function submitTicket(payload: TicketPayload): Promise<TicketResult> {
  // Honeypot — silent fail
  if (isHoneypotFilled(payload.website)) {
    return { ok: false, error: "HONEYPOT" }
  }
  if (!payload.email || !payload.subject || !payload.description) {
    return { ok: false, error: "MISSING_FIELDS" }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) {
    return { ok: false, error: "INVALID_EMAIL" }
  }
  const rl = clientRateLimit(`ticket_${payload.type}`, 5)
  if (!rl.ok) {
    return { ok: false, error: "RATE_LIMITED" }
  }

  const row = {
    type: payload.type,
    subject: sanitizeText(payload.subject, { maxLength: 200 }),
    description: sanitizeText(payload.description, { maxLength: 8000, allowNewlines: true }),
    priority: payload.priority || (payload.type === "bug" ? "high" : "normal"),
    name: sanitizeText(payload.name, { maxLength: 100 }),
    email: sanitizeEmail(payload.email),
    phone: sanitizePhone(payload.phone),
    company: sanitizeText(payload.company, { maxLength: 120 }),
    category: sanitizeText(payload.category, { maxLength: 80 }),
    screenshot_url: payload.screenshot_url,
    metadata: {
      ...collectClientMeta(),
      ...(payload.metadata || {})
    },
    source: "website"
  }

  if (!hasSupabaseCredentials()) {
    // Demo fallback
    const localKey = "kads_demo_tickets"
    try {
      const existing = JSON.parse(localStorage.getItem(localKey) || "[]")
      const id = "TCK-" + Math.random().toString(36).slice(2, 8).toUpperCase()
      existing.unshift({ ...row, id, ticket_id: id, created_at: new Date().toISOString(), status: "new" })
      localStorage.setItem(localKey, JSON.stringify(existing.slice(0, 50)))
      return { ok: true, ticketId: id, leadId: id, simulated: true }
    } catch {
      return { ok: true, ticketId: "TCK-DEMO", simulated: true }
    }
  }

  try {
    const { data, error } = await supabase.from("tickets").insert(row).select("ticket_id").single()
    if (error) throw error
    return { ok: true, ticketId: data?.ticket_id, leadId: data?.ticket_id }
  } catch (err: any) {
    console.error("Ticket submission failed:", err)
    return { ok: false, error: err?.message || "SUBMISSION_FAILED" }
  }
}

export async function submitCareerApplication(payload: CareerApplicationPayload): Promise<TicketResult> {
  if (isHoneypotFilled(payload.website)) return { ok: false, error: "HONEYPOT" }
  if (!payload.email || !payload.name || !payload.position) return { ok: false, error: "MISSING_FIELDS" }
  const rl = clientRateLimit("career_submit", 3)
  if (!rl.ok) return { ok: false, error: "RATE_LIMITED" }

  if (!hasSupabaseCredentials()) {
    const id = "TCK-" + generateRandomId(6).toUpperCase()
    return { ok: true, ticketId: id, simulated: true }
  }

  try {
    // First create ticket, then career application row via RPC or two-step
    const { data: ticket, error: tErr } = await supabase.from("tickets").insert({
      type: "career",
      subject: `Career Application: ${payload.position} — ${payload.name}`,
      description: payload.cover_letter
        ? `${payload.name} applied for ${payload.position}.\n\n${sanitizeText(payload.cover_letter, { maxLength: 8000, allowNewlines: true })}`
        : `${payload.name} applied for ${payload.position}.`,
      priority: "normal",
      name: sanitizeText(payload.name, { maxLength: 100 }),
      email: sanitizeEmail(payload.email),
      phone: sanitizePhone(payload.phone),
      category: "career:" + sanitizeText(payload.position, { maxLength: 80 }),
      metadata: collectClientMeta(),
      source: "website"
    }).select("id, ticket_id").single()
    if (tErr) throw tErr

    const { error: cErr } = await supabase.from("career_applications").insert({
      ticket_id: ticket.id,
      position: sanitizeText(payload.position, { maxLength: 120 }),
      name: sanitizeText(payload.name, { maxLength: 100 }),
      email: sanitizeEmail(payload.email),
      phone: sanitizePhone(payload.phone),
      city: sanitizeText(payload.city, { maxLength: 100 }),
      resume_url: payload.resume_url,
      resume_filename: payload.resume_filename,
      portfolio_url: sanitizeText(payload.portfolio_url, { maxLength: 500 }),
      github_url: sanitizeText(payload.github_url, { maxLength: 500 }),
      linkedin_url: sanitizeText(payload.linkedin_url, { maxLength: 500 }),
      experience_years: sanitizeText(payload.experience_years, { maxLength: 50 }),
      expected_salary: sanitizeText(payload.expected_salary, { maxLength: 100 }),
      notice_period: sanitizeText(payload.notice_period, { maxLength: 100 }),
      cover_letter: sanitizeText(payload.cover_letter, { maxLength: 8000, allowNewlines: true })
    })
    if (cErr) {
      console.warn("Career application row failed, ticket created:", cErr)
    }
    return { ok: true, ticketId: ticket.ticket_id, leadId: ticket.ticket_id }
  } catch (err: any) {
    console.error("Career submission failed:", err)
    return { ok: false, error: err?.message || "SUBMISSION_FAILED" }
  }
}

export async function submitBugReport(payload: BugReportPayload): Promise<TicketResult> {
  if (isHoneypotFilled(payload.website)) return { ok: false, error: "HONEYPOT" }
  if (!payload.email || !payload.subject || !payload.description) return { ok: false, error: "MISSING_FIELDS" }
  const rl = clientRateLimit("bug_submit", 5)
  if (!rl.ok) return { ok: false, error: "RATE_LIMITED" }

  if (!hasSupabaseCredentials()) {
    const id = "TCK-" + generateRandomId(6).toUpperCase()
    return { ok: true, ticketId: id, simulated: true }
  }

  try {
    const { data: ticket, error: tErr } = await supabase.from("tickets").insert({
      type: "bug",
      subject: sanitizeText(payload.subject, { maxLength: 200 }),
      description: [
        payload.description,
        payload.steps_to_reproduce ? `\n\nSteps to reproduce:\n${payload.steps_to_reproduce}` : "",
        payload.expected_behavior ? `\nExpected: ${payload.expected_behavior}` : "",
        payload.actual_behavior ? `\nActual: ${payload.actual_behavior}` : "",
        payload.page_url ? `\nURL: ${payload.page_url}` : "",
        payload.browser ? `Browser: ${payload.browser}` : "",
        payload.device ? `Device: ${payload.device}` : ""
      ].join(""),
      priority: payload.severity === "critical" ? "urgent" : "high",
      name: sanitizeText(payload.name, { maxLength: 100 }),
      email: sanitizeEmail(payload.email),
      screenshot_url: payload.screenshot_url,
      metadata: { severity: payload.severity || "medium", ...collectClientMeta() },
      source: "website"
    }).select("id, ticket_id").single()
    if (tErr) throw tErr

    if (payload.severity) {
      await supabase.from("bug_reports").insert({
        ticket_id: ticket.id,
        severity: payload.severity,
        page_url: payload.page_url,
        browser: payload.browser,
        device: payload.device,
        steps_to_reproduce: sanitizeText(payload.steps_to_reproduce, { maxLength: 4000, allowNewlines: true }),
        expected_behavior: sanitizeText(payload.expected_behavior, { maxLength: 2000 }),
        actual_behavior: sanitizeText(payload.actual_behavior, { maxLength: 2000 }),
        screenshot_url: payload.screenshot_url
      })
    }
    return { ok: true, ticketId: ticket.ticket_id }
  } catch (err: any) {
    console.error("Bug report failed:", err)
    return { ok: false, error: err?.message || "SUBMISSION_FAILED" }
  }
}

// ============ Admin / Authenticated APIs ============

export type { Ticket as TicketRow } // avoid conflict
export type TicketRecord = {
  id: string
  ticket_id: string
  type: TicketType
  subject: string
  description: string
  priority: TicketPriority
  status: TicketStatus
  name: string | null
  email: string
  phone: string | null
  company: string | null
  user_id: string | null
  assigned_to: string | null
  category: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  resolved_at: string | null
}

export async function listTickets(userId?: string): Promise<TicketRecord[]> {
  if (!hasSupabaseCredentials()) {
    try {
      return JSON.parse(localStorage.getItem("kads_demo_tickets") || "[]")
    } catch { return [] }
  }
  let query = supabase.from("tickets").select("*").order("created_at", { ascending: false })
  if (userId) query = query.eq("user_id", userId) as any
  const { data, error } = await query
  if (error) throw error
  return (data || []) as TicketRecord[]
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<{ ok: boolean; error?: string }> {
  if (!hasSupabaseCredentials()) return { ok: true }
  try {
    const updates: any = { status }
    if (status === "resolved" || status === "closed") updates.resolved_at = new Date().toISOString()
    const { error } = await supabase.from("tickets").update(updates).eq("id", id)
    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message }
  }
}

export async function replyToTicket(ticketId: string, message: string, authorName: string, internal: boolean = false): Promise<{ ok: boolean; error?: string }> {
  if (!message.trim()) return { ok: false, error: "Empty message" }
  if (!hasSupabaseCredentials()) return { ok: true }
  try {
    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: ticketId,
      message,
      author_name: authorName,
      is_internal: internal,
      is_from_client: false
    })
    if (error) throw error
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message }
  }
}

export async function createTicket(payload: any): Promise<TicketResult> {
  // Accept both new-shape (description/name) and legacy-shape (message/email-only)
  const normalized: TicketPayload = {
    type: (payload.type as TicketType) || "support",
    subject: payload.subject || "Support Ticket",
    description: payload.description || payload.message || "",
    priority: (payload.priority as TicketPriority) || "normal",
    name: payload.name,
    email: payload.email || "anonymous@kadslabs.com",
    phone: payload.phone,
    category: payload.category,
    metadata: payload.metadata || (payload.userId ? { user_id: payload.userId } : {}),
    website: payload.website
  }
  return submitTicket(normalized)
}

// Alias for back-compat
export type Ticket = TicketRecord
