"use client"

/**
 * Environment detection helpers.
 * - Demo mode is ONLY for localhost / file:// / local preview.
 * - On production (kadslabs.com, *.vercel.app) missing env vars show an error, NOT demo fallback.
 */

export function isProductionDomain(): boolean {
  if (typeof window === "undefined") return false
  const host = window.location.hostname
  return (
    host === "kadslabs.com" ||
    host === "www.kadslabs.com" ||
    host.endsWith(".vercel.app") ||
    host === "kads-labs.vercel.app"
  )
}

export function isLocalPreview(): boolean {
  if (typeof window === "undefined") return false
  const host = window.location.hostname
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "" ||
    host.startsWith("192.168.") ||
    host.startsWith("10.") ||
    window.location.protocol === "file:"
  )
}

export function shouldUseDemoMode(hasCredentials: boolean): boolean {
  if (hasCredentials) return false
  if (isProductionDomain()) return false // never demo on prod
  return isLocalPreview()
}

export function getEnvironmentName(): "production" | "preview" | "development" {
  if (typeof window === "undefined") return "development"
  const host = window.location.hostname
  if (host === "kadslabs.com" || host === "www.kadslabs.com") return "production"
  if (host.endsWith(".vercel.app")) return "preview"
  return "development"
}
