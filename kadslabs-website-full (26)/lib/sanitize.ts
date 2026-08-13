"use client"

/**
 * Lightweight client-side input sanitization to reduce XSS risk before
 * sending form data to Supabase. Note: Supabase uses parameterized queries
 * so SQL injection is not possible client-side; this defense is in depth
 * against reflected/stored XSS when values are later rendered in dashboards.
 */

const SCRIPT_PATTERN = /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi
const ON_EVENT_PATTERN = /\s+on\w+\s*=\s*["'][^"']*["']/gi
const IFM_PATTERN = /<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi
const OBJ_PATTERN = /<\s*(object|embed|link|style|form|svg)[^>]*>/gi
const JS_URL_PATTERN = /(javascript|data)\s*:/gi

export function sanitizeInput(input: string, options: { allowNewlines?: boolean; maxLength?: number } = {}): string {
  if (typeof input !== "string") return ""
  let out = input
  out = out.replace(SCRIPT_PATTERN, "")
  out = out.replace(IFM_PATTERN, "")
  out = out.replace(OBJ_PATTERN, "")
  out = out.replace(ON_EVENT_PATTERN, "")
  out = out.replace(JS_URL_PATTERN, "")
  if (!options.allowNewlines) {
    out = out.replace(/[\r\n]+/g, " ")
  }
  if (options.maxLength) {
    out = out.slice(0, options.maxLength)
  }
  return out.trim()
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().replace(/\s+/g, "").slice(0, 254)
}

export function sanitizePhone(phone: string): string {
  // Keep only digits, +, -, spaces, parentheses
  return phone.replace(/[^\d+\-\s()]/g, "").trim().slice(0, 20)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string): boolean {
  if (!phone) return true // optional
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 7 && digits.length <= 15
}
