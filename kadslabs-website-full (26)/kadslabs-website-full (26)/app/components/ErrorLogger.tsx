"use client"

import { useEffect } from "react"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"

/**
 * Global error logger.
 * - Catches uncaught errors + unhandled promise rejections.
 * - Logs Web Vitals (LCP) to console for debugging.
 * - Pushes critical errors to Supabase `system_events` (which emails founders in real time).
 */
export default function ErrorLogger() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const report = (level: "error" | "critical", source: string, message: string, meta: Record<string, any> = {}) => {
      console.warn(`[KADS ${level}]`, source, message, meta)
      if (!hasSupabaseCredentials()) return
      supabase.from("system_events").insert({
        level,
        source,
        message: message.slice(0, 2000),
        metadata: { url: window.location.href, ua: navigator.userAgent.slice(0, 300), ...meta }
      }).then(({ error }) => { if (error) console.debug("system_events insert failed:", error.message) }, () => {})
    }

    let errorCount = 0
    const onError = (event: ErrorEvent) => {
      if (event.filename && !event.filename.includes(location.hostname) && !event.filename.includes("supabase")) return
      errorCount++
      const level: "error" | "critical" = errorCount > 5 ? "critical" : "error"
      report(level, "window.error", event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack?.slice(0, 500),
      })
    }

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = typeof event.reason === "string" ? event.reason : event.reason?.message || "Unhandled promise rejection"
      report("error", "unhandledrejection", reason, { stack: event.reason?.stack?.slice(0, 500) })
    }

    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onRejection)

    // Performance monitoring
    if (typeof performance !== "undefined" && "getEntriesByType" in performance) {
      // Report LCP/CLS/FID to analytics once available
      try {
        const PO = (window as any).PerformanceObserver
        if (!PO) return
        const observer = new PO((list: any) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === "largest-contentful-paint") {
              console.debug("[Web Vitals] LCP", Math.round(entry.startTime), "ms")
            }
          }
        })
        observer?.observe({ type: "largest-contentful-paint", buffered: true })
      } catch {}
    }

    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onRejection)
    }
  }, [])

  return null
}
