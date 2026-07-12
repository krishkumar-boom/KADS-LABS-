"use client"

import { useEffect } from "react"
import { useAuth } from "./AuthProvider"
import { subscribeToPush } from "@/lib/push"

export default function PWARegister() {
  const { user } = useAuth()

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

    const protocol = window.location.protocol
    if (protocol !== "http:" && protocol !== "https:") {
      console.log("Service Worker skipped on", protocol)
      return
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("./sw.js")
        console.log("Service Worker registered:", registration.scope)

        // Auto-update: check for updates and activate new worker immediately
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              if (confirm("A new version of KADS LABS is available. Reload to update?")) {
                newWorker.postMessage({ type: "SKIP_WAITING" })
                window.location.reload()
              }
            }
          })
        })

        // Push notification subscription
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (vapidKey && "PushManager" in window && user?.id) {
          const permission = await Notification.requestPermission()
          if (permission === "granted") {
            const sub = await registration.pushManager.getSubscription()
            if (!sub) {
              const result = await subscribeToPush(user.id)
              if (result.error) console.error("Push subscription failed:", result.error)
              else console.log("Push notifications enabled")
            }
          }
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error)
      }
    }

    register()

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "RELOAD") {
        window.location.reload()
      }
    })
  }, [user])

  return null
}
