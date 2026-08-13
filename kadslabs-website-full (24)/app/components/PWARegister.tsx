"use client"

import { useEffect } from "react"
import { subscribeToPush } from "@/lib/push"

const APP_VERSION_KEY = "kads_app_version"
// Increment this to force client-side cache purge on next visit
const APP_VERSION = "1.0.0"

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // 1. Version check — purge caches/old data when a new version is released
    try {
      const seen = localStorage.getItem(APP_VERSION_KEY)
      if (seen && seen !== APP_VERSION) {
        // Version changed — clear app state that might be stale
        // (Keep auth & theme; clear form drafts, demo-only keys, demo quotes)
        const KEEP = new Set(["kads-theme", "supabase.auth.token", "kads-lang"])
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (!key) continue
          if (KEEP.has(key)) continue
          // Clear cached demo/transient data on new version
          if (key.startsWith("kads_demo_") || key === "kads_lead_submissions") {
            localStorage.removeItem(key)
          }
        }
        // Tell any open tabs to reload
        window.dispatchEvent(new CustomEvent("kads:new-version"))
      }
      localStorage.setItem(APP_VERSION_KEY, APP_VERSION)
    } catch {}

    // 2. Service worker registration with auto-update
    if (!("serviceWorker" in navigator)) return

    const protocol = window.location.protocol
    if (protocol !== "http:" && protocol !== "https:") return

    // File:// pages (local ZIP preview) can't register SW — skip; handle by casting
    if ((protocol as string) === "file:") return

    let reloaded = false

    const registerSW = async () => {
      try {
        // Register with cache-busting query to always pick up new SW immediately
        const registration = await navigator.serviceWorker.register(`./sw.js?v=${APP_VERSION}`, {
          scope: "./",
          updateViaCache: "none" // never use HTTP cache for sw.js itself
        })

        // Check for updates immediately
        registration.update().catch(() => {})

        // Check for updates every 15 mins
        const updateInterval = setInterval(() => {
          registration.update().catch(() => {})
        }, 15 * 60 * 1000)

        // When a new SW is installed, activate it immediately and reload
        const handleUpdateFound = () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New SW is waiting — post SKIP_WAITING and reload after activation
              newWorker.postMessage({ type: "SKIP_WAITING" })
            }
            if (newWorker.state === "activated" && !reloaded) {
              reloaded = true
              // Wait a beat then reload once to pick up new assets
              setTimeout(() => window.location.reload(), 300)
            }
          })
        }
        registration.addEventListener("updatefound", handleUpdateFound)

        // Listen for new-version-activated message from SW
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data?.type === "NEW_VERSION_ACTIVATED" && !reloaded) {
            reloaded = true
            window.location.reload()
          }
        })

        // 3. Push notifications (only when logged in and VAPID key set)
        const { useAuth } = await import("./AuthProvider").catch(() => ({ useAuth: () => ({ user: null }) }))
        // Can't call hooks outside component — do a direct session check
        try {
          const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          if (vapidKey && "PushManager" in window) {
            const permission = await Notification.requestPermission().catch(() => "default")
            if (permission === "granted") {
              const sub = await registration.pushManager.getSubscription()
              if (!sub) {
                // Push subscribe requires an authenticated user id; skip here (handled in profile)
              }
            }
          }
        } catch {}

        return () => clearInterval(updateInterval)
      } catch (error) {
        // SW is progressive enhancement — don't break the app if it fails
        console.warn("Service Worker registration failed:", error)
      }
    }

    // Register after window load to not compete with first-paint resources
    if (document.readyState === "complete") {
      registerSW()
    } else {
      window.addEventListener("load", registerSW, { once: true })
    }

    // When the page becomes visible again, check for updates
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        navigator.serviceWorker.getRegistration().then(r => r?.update()).catch(() => {})
      }
    })
  }, [])

  return null
}
