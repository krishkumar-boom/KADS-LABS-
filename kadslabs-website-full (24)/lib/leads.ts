"use client"

/**
 * Lead submission helpers — Phase 3
 * Client-side helpers for submitting leads (contact, quote, meeting, newsletter, careers)
 * to Supabase with:
 *  - Honeypot spam protection (invisible fields)
 *  - Client-side rate limiting (per-IP via localStorage timestamps)
 *  - Lead ID generation (KADS-000001)
 *  - Automatic notifications (email via Edge Function)
 *  - UTM capture and metadata
 *  - WhatsApp Business deep-link fallback for owner notifications
 */

import { supabase, hasSupabaseCredentials } from "./supabase"

export type LeadSource =
  | "website"
  | "homepage_cta"
  | "footer"
  | "contact_form"
  | "quote_form"
  | "meeting_form"
  | "newsletter"
  | "newsletter_section"
  | "careers"
  | "hero"
  | "cta_section"

export interface BaseLead {
  source?: LeadSource
  metadata?: Record<string, unknown>
}

export interface ContactPayload extends BaseLead {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  budget?: string
  message: string
  // Honeypot (bots fill this, humans don't)
  website?: string
}

export interface QuotePayload extends BaseLead {
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  budget?: string
  details: string
  website?: string
}

export interface MeetingPayload extends BaseLead {
  name: string
  email: string
  phone?: string
  company?: string
  preferred_date?: string
  preferred_time?: string
  meeting_type?: string
  agenda?: string
  website?: string
}

export interface NewsletterPayload extends BaseLead {
  email: string
  name?: string
  website?: string
}

export interface JobApplicationPayload extends BaseLead {
  name: string
  email: string
  phone?: string
  position?: string
  resume_url?: string
  cover_letter?: string
  website?: string
}

export interface LeadResult {
  ok: boolean
  leadId?: string
  error?: string
  simulated?: boolean
}

// ---------- Spam protection ----------

const RATE_LIMIT_KEY = "kads_lead_submissions"
const MIN_SUBMIT_INTERVAL_MS = 15_000 // 15 sec between submissions client-side
const MAX_PER_HOUR = 5

function isLikelyBot(): { bot: boolean; reason?: string } {
  if (typeof window === "undefined") return { bot: false }
  // Headless / webdriver detection
  const nav = navigator as Navigator & { webdriver?: boolean }
  if (nav.webdriver) return { bot: true, reason: "webdriver" }
  // No referrer and suspiciously fast page load could signal automation
  return { bot: false }
}

function rateLimitCheck(): { allowed: boolean; waitMs?: number } {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    const now = Date.now()
    const entries: number[] = raw ? JSON.parse(raw) : []
    // Drop entries older than 1 hour
    const recent = entries.filter(t => now - t < 60 * 60 * 1000)
    if (recent.length >= MAX_PER_HOUR) {
      return { allowed: false, waitMs: 60 * 60 * 1000 - (now - recent[0]) }
    }
    const last = recent[recent.length - 1]
    if (last && now - last < MIN_SUBMIT_INTERVAL_MS) {
      return { allowed: false, waitMs: MIN_SUBMIT_INTERVAL_MS - (now - last) }
    }
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}

function recordSubmission() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    const entries: number[] = raw ? JSON.parse(raw) : []
    entries.push(Date.now())
    // Keep only last hour
    const now = Date.now()
    const trimmed = entries.filter(t => now - t < 60 * 60 * 1000).slice(-MAX_PER_HOUR)
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(trimmed))
  } catch {}
}

/** Simple non-reversible hash (for IP/privacy; IP not collected client-side anyway;
 *  user-agent + timestamp + random as pseudo fingerprint).
 */
async function pseudoFingerprint(): Promise<string> {
  try {
    const data = `${navigator.userAgent}|${screen.width}x${screen.height}|${new Date().getTimezoneOffset()}|${navigator.language}`
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data))
    return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("")
  } catch {
    return ""
  }
}

function getUtmParams() {
  if (typeof window === "undefined") return {}
  const usp = new URLSearchParams(window.location.search)
  return {
    utm_source: usp.get("utm_source") || undefined,
    utm_medium: usp.get("utm_medium") || undefined,
    utm_campaign: usp.get("utm_campaign") || undefined,
    url: window.location.href,
    user_agent: navigator.userAgent?.slice(0, 300)
  }
}

// ---------- Lead ID client-side fallback (server trigger does this too) ----------
// We rely on the DB trigger `trg_set_lead_id` to assign KADS-000001;
// this is a best-effort client-side counter shown immediately for UX.
function clientLeadIdFallback(prefix = "KADS-") {
  try {
    const key = "kads_local_lead_counter"
    const n = parseInt(localStorage.getItem(key) || "0", 10) + 1
    localStorage.setItem(key, String(n))
    return `${prefix}${String(n).padStart(6, "0")}`
  } catch {
    return undefined
  }
}

// ---------- Notifications ----------

async function notifyOwners(payload: {
  type: "contact" | "quote" | "meeting" | "newsletter" | "career"
  leadId?: string
  name: string
  email: string
  phone?: string
  details?: string
  service?: string
  subject: string
}) {
  if (!hasSupabaseCredentials()) return { notified: false }

  // Invoke Supabase Edge Function `send-email` via supabase-js so anon key works.
  // If no provider is configured on the backend, the function simulates success.
  const { error } = await supabase.functions.invoke("send-email", {
    body: {
      to: "founderskadslabs@gmail.com",
      subject: payload.subject,
      body: buildOwnerEmailBody(payload)
    }
  })
  if (error) {
    console.warn("[notifyOwners] Edge function error (non-fatal):", error.message)
    return { notified: false, error: error.message }
  }
  return { notified: true }
}

function buildOwnerEmailBody(p: {
  type: string
  leadId?: string
  name: string
  email: string
  phone?: string
  details?: string
  service?: string
}) {
  return [
    `New lead received (${p.type.toUpperCase()})`,
    ``,
    `Lead ID: ${p.leadId || "pending"}`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    p.phone ? `Phone: ${p.phone}` : null,
    p.service ? `Service: ${p.service}` : null,
    p.details ? `\nMessage:\n${p.details}` : null,
    ``,
    `Source: website`,
    `Time: ${new Date().toISOString()}`,
    ``,
    `Reply directly to this email or contact via WhatsApp.`,
    `View in dashboard: https://kadslabs.com/founder/`
  ].filter(Boolean).join("\n")
}

/** Open a WhatsApp Business chat to owner with a pre-filled lead summary. */
export function openWhatsAppLead(payload: {
  name: string
  email?: string
  message: string
  service?: string
}) {
  const phone = "917524979551" // +91 75249 79551, digits only
  const text = [
    `Hi KADS LABS! ${payload.name} here.`,
    payload.service ? `Service interested: ${payload.service}` : null,
    payload.email ? `Email: ${payload.email}` : null,
    ``,
    payload.message
  ].filter(Boolean).join("\n")
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer")
}

// ---------- Public API ----------

export async function submitContact(payload: ContactPayload): Promise<LeadResult> {
  // Honeypot: if `website` field filled (hidden to humans), silently reject as success.
  if (payload.website && payload.website.length > 0) {
    return { ok: true, simulated: true }
  }
  delete payload.website

  const bot = isLikelyBot()
  if (bot.bot) return { ok: false, error: "bot" }

  const rl = rateLimitCheck()
  if (!rl.allowed) return { ok: false, error: "rate_limited", leadId: undefined }

  if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
    return { ok: false, error: "missing_fields" }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: "invalid_email" }
  }

  const fp = await pseudoFingerprint()
  const utm = getUtmParams()
  const fallbackId = clientLeadIdFallback()

  if (!hasSupabaseCredentials()) {
    recordSubmission()
    // Fallback: mailto link
    if (typeof window !== "undefined") {
      window.location.href = `mailto:founderskadslabs@gmail.com?subject=Project%20Inquiry%20from%20${encodeURIComponent(payload.name)}&body=${encodeURIComponent(payload.message + "\n\n— " + payload.name + "\n" + payload.email + (payload.phone ? "\n" + payload.phone : ""))}`
    }
    return { ok: true, simulated: true, leadId: fallbackId }
  }

  const { data, error } = await supabase
    .from("contact_submissions")
    .insert({
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      service: payload.service || null,
      budget: payload.budget || null,
      message: payload.message.trim(),
      source: payload.source || "website",
      ip_hash: fp,
      ...utm,
      metadata: {
        ...(payload.metadata || {}),
        bot_check: bot
      }
    })
    .select("lead_id")
    .single()

  if (error) {
    console.error("[submitContact] Supabase error:", error.message)
    return { ok: false, error: error.message }
  }

  recordSubmission()

  // Fire-and-forget email notification
  notifyOwners({
    type: "contact",
    leadId: data?.lead_id || fallbackId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    service: payload.service,
    details: payload.message,
    subject: `New Lead ${data?.lead_id || fallbackId || ""} — ${payload.name} (${payload.service || "General Inquiry"})`
  }).catch(() => {})

  return { ok: true, leadId: data?.lead_id || fallbackId }
}

export async function submitQuote(payload: QuotePayload): Promise<LeadResult> {
  if (payload.website && payload.website.length > 0) return { ok: true, simulated: true }
  delete payload.website

  const bot = isLikelyBot()
  if (bot.bot) return { ok: false, error: "bot" }

  const rl = rateLimitCheck()
  if (!rl.allowed) return { ok: false, error: "rate_limited" }

  if (!payload.name?.trim() || !payload.email?.trim() || !payload.service || !payload.details?.trim()) {
    return { ok: false, error: "missing_fields" }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: "invalid_email" }
  }

  const fp = await pseudoFingerprint()
  const utm = getUtmParams()
  const fallbackId = clientLeadIdFallback()

  if (!hasSupabaseCredentials()) {
    recordSubmission()
    if (typeof window !== "undefined") {
      window.location.href = `mailto:founderskadslabs@gmail.com?subject=Quote%20Request%20from%20${encodeURIComponent(payload.name)}&body=${encodeURIComponent(payload.details + "\n\nService: " + payload.service + "\nBudget: " + (payload.budget || "Not specified") + "\n\n— " + payload.name + "\n" + payload.email + (payload.phone ? "\n" + payload.phone : ""))}`
    }
    return { ok: true, simulated: true, leadId: fallbackId }
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      service: payload.service,
      budget: payload.budget || null,
      details: payload.details.trim(),
      source: payload.source || "website",
      ip_hash: fp,
      ...utm,
      metadata: payload.metadata || {}
    })
    .select("lead_id")
    .single()

  if (error) {
    console.error("[submitQuote] Supabase error:", error.message)
    return { ok: false, error: error.message }
  }

  recordSubmission()

  notifyOwners({
    type: "quote",
    leadId: data?.lead_id || fallbackId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    service: payload.service,
    details: payload.details,
    subject: `Quote Request ${data?.lead_id || fallbackId || ""} — ${payload.name} (${payload.service})`
  }).catch(() => {})

  return { ok: true, leadId: data?.lead_id || fallbackId }
}

export async function submitMeeting(payload: MeetingPayload): Promise<LeadResult> {
  if (payload.website && payload.website.length > 0) return { ok: true, simulated: true }
  delete payload.website

  const bot = isLikelyBot()
  if (bot.bot) return { ok: false, error: "bot" }

  const rl = rateLimitCheck()
  if (!rl.allowed) return { ok: false, error: "rate_limited" }

  if (!payload.name?.trim() || !payload.email?.trim()) {
    return { ok: false, error: "missing_fields" }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { ok: false, error: "invalid_email" }
  }

  const fp = await pseudoFingerprint()
  const utm = getUtmParams()
  const fallbackId = clientLeadIdFallback()

  if (!hasSupabaseCredentials()) {
    recordSubmission()
    return { ok: true, simulated: true, leadId: fallbackId }
  }

  const { data, error } = await supabase
    .from("meeting_requests")
    .insert({
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      company: payload.company?.trim() || null,
      preferred_date: payload.preferred_date || null,
      preferred_time: payload.preferred_time || null,
      meeting_type: payload.meeting_type || "consultation",
      agenda: payload.agenda?.trim() || null,
      source: payload.source || "website",
      metadata: { ...(payload.metadata || {}), fp }
    })
    .select("lead_id")
    .single()

  if (error) {
    console.error("[submitMeeting] Supabase error:", error.message)
    return { ok: false, error: error.message }
  }

  recordSubmission()

  notifyOwners({
    type: "meeting",
    leadId: data?.lead_id || fallbackId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    details: `Requested: ${payload.meeting_type || "Consultation"}\nPreferred: ${payload.preferred_date || "TBD"} ${payload.preferred_time || ""}\nAgenda: ${payload.agenda || "—"}`,
    subject: `Meeting Request ${data?.lead_id || fallbackId || ""} — ${payload.name}`
  }).catch(() => {})

  return { ok: true, leadId: data?.lead_id || fallbackId }
}

export async function subscribeNewsletter(payload: NewsletterPayload): Promise<LeadResult> {
  if (payload.website && payload.website.length > 0) return { ok: true, simulated: true }
  delete payload.website

  if (!payload.email?.trim()) return { ok: false, error: "missing_fields" }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return { ok: false, error: "invalid_email" }

  // Newsletter: lighter rate limit
  try {
    const key = "kads_newsletter_last"
    const last = parseInt(localStorage.getItem(key) || "0", 10)
    if (Date.now() - last < 5_000) return { ok: false, error: "rate_limited" }
    localStorage.setItem(key, String(Date.now()))
  } catch {}

  const utm = getUtmParams()

  if (!hasSupabaseCredentials()) {
    return { ok: true, simulated: true }
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: payload.email.trim().toLowerCase(),
      name: payload.name?.trim() || null,
      source: payload.source || "website",
      ...utm,
      metadata: payload.metadata || {}
    })

  if (error) {
    // Unique violation is fine (already subscribed)
    if (error.code === "23505") return { ok: true, simulated: true }
    console.error("[subscribeNewsletter] Supabase error:", error.message)
    return { ok: false, error: error.message }
  }

  notifyOwners({
    type: "newsletter",
    name: payload.name || "Subscriber",
    email: payload.email,
    details: "New newsletter subscription",
    subject: `New Newsletter Subscriber — ${payload.email}`
  }).catch(() => {})

  return { ok: true }
}

export async function submitJobApplication(payload: JobApplicationPayload): Promise<LeadResult> {
  if (payload.website && payload.website.length > 0) return { ok: true, simulated: true }
  delete payload.website

  const rl = rateLimitCheck()
  if (!rl.allowed) return { ok: false, error: "rate_limited" }
  if (!payload.name?.trim() || !payload.email?.trim()) return { ok: false, error: "missing_fields" }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return { ok: false, error: "invalid_email" }

  const fp = await pseudoFingerprint()
  const fallbackId = clientLeadIdFallback()

  if (!hasSupabaseCredentials()) {
    recordSubmission()
    return { ok: true, simulated: true, leadId: fallbackId }
  }

  // job_applications table columns (per setup.sql): name, email, phone, position, resume_url, cover_letter (check)
  const { data, error } = await supabase
    .from("job_applications")
    .insert({
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      position: payload.position || null,
      resume_url: payload.resume_url || null,
      cover_letter: payload.cover_letter?.trim() || null,
      source: payload.source || "website",
      metadata: { fp, ...(payload.metadata || {}) }
    })
    .select("lead_id")
    .single()

  if (error) {
    // Try with alternate column names if schema differs
    console.warn("[submitJobApplication] error:", error.message)
    return { ok: false, error: error.message }
  }

  recordSubmission()

  notifyOwners({
    type: "career",
    leadId: data?.lead_id || fallbackId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    details: `Position: ${payload.position || "General"}\nResume: ${payload.resume_url || "—"}\nCover: ${payload.cover_letter?.slice(0, 500) || "—"}`,
    subject: `Job Application ${data?.lead_id || fallbackId || ""} — ${payload.name} (${payload.position || "General"})`
  }).catch(() => {})

  return { ok: true, leadId: data?.lead_id || fallbackId }
}

export function getLeadErrorMessage(code: string | undefined, language: "en" | "hi" = "en"): string {
  const map: Record<string, { en: string; hi: string }> = {
    missing_fields: { en: "Please fill in all required fields.", hi: "कृपया सभी आवश्यक फ़ील्ड भरें।" },
    invalid_email: { en: "Please enter a valid email address.", hi: "कृपया एक मान्य ईमेल पता दर्ज करें।" },
    rate_limited: { en: "Please wait a moment before submitting again.", hi: "कृपया दोबारा सबमिट करने से पहले थोड़ा इंतज़ार करें।" },
    bot: { en: "Submission blocked.", hi: "सबमिशन ब्लॉक किया गया।" },
    default: { en: "Something went wrong. Please try again or email us directly.", hi: "कुछ गलत हो गया। कृपया पुनः प्रयास करें या सीधे ईमेल करें।" }
  }
  const msg = map[code || "default"] || map.default
  return language === "hi" ? msg.hi : msg.en
}
