"use client"

/**
 * Client-side security helpers: honeypot detection, simple in-memory rate limiting,
 * input sanitization, CSRF token generation. Server-side equivalents live in edge functions.
 */

const RATE_LIMIT_KEY = "kads_rate_limit"
const RATE_WINDOW_MS = 60_000 // 1 minute
const DEFAULT_MAX_REQUESTS = 3

interface RateEntry {
  timestamps: number[]
}

function readRateMap(): Record<string, RateEntry> {
  if (typeof window === "undefined") return {}
  try {
    return JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || "{}")
  } catch {
    return {}
  }
}

function writeRateMap(map: Record<string, RateEntry>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(map))
  } catch {}
}

export function clientRateLimit(
  action: string = "form_submit",
  maxRequests: number = DEFAULT_MAX_REQUESTS
): { ok: boolean; retryAfterMs: number } {
  const now = Date.now()
  const map = readRateMap()
  const entry = map[action] || { timestamps: [] }
  entry.timestamps = entry.timestamps.filter(t => now - t < RATE_WINDOW_MS)
  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0]
    return { ok: false, retryAfterMs: RATE_WINDOW_MS - (now - oldest) }
  }
  entry.timestamps.push(now)
  map[action] = entry
  writeRateMap(map)
  return { ok: true, retryAfterMs: 0 }
}

/** Simple CSRF token: stored per session, sent with every form post to edge/server. */
const CSRF_KEY = "kads_csrf"
export function getCsrfToken(): string {
  if (typeof window === "undefined") return ""
  let token = sessionStorage.getItem(CSRF_KEY)
  if (!token) {
    token = generateRandomId(32)
    sessionStorage.setItem(CSRF_KEY, token)
  }
  return token
}

export function validateCsrfToken(token: string): boolean {
  if (typeof window === "undefined") return true
  return token === getCsrfToken()
}

export function generateRandomId(length: number = 16): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let out = ""
  const arr = new Uint8Array(length)
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr)
    for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length]
  } else {
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

/** Honeypot check: if hidden field is filled, treat as bot. */
export function isHoneypotFilled(value: string | undefined | null): boolean {
  if (!value) return false
  return value.trim().length > 0
}

/** Lightweight XSS-safe text sanitizer: strips tags, normalizes whitespace, caps length. */
export function sanitizeText(input: unknown, opts: { maxLength?: number; allowNewlines?: boolean } = {}): string {
  const { maxLength = 2000, allowNewlines = false } = opts
  if (input == null) return ""
  const str = String(input)
    .replace(/<[^>]*>/g, "") // strip tags
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "") // control chars
  const normalized = allowNewlines ? str : str.replace(/[\r\n\t]+/g, " ")
  return normalized.trim().slice(0, maxLength)
}

export function sanitizeEmail(input: unknown): string {
  return sanitizeText(input, { maxLength: 254 }).toLowerCase()
}

export function sanitizePhone(input: unknown): string {
  const str = String(input ?? "").replace(/[^\d+\-\s()]/g, "").trim()
  return str.slice(0, 20)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

/** Hash IP/client id for logging without storing PII. */
export async function hashClientId(input: string): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    // Fallback simple hash
    let h = 0
    for (let i = 0; i < input.length; i++) h = ((h << 5) - h + input.charCodeAt(i)) | 0
    return (h >>> 0).toString(16).padStart(8, "0")
  }
  const buf = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest("SHA-256", buf)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16)
}
