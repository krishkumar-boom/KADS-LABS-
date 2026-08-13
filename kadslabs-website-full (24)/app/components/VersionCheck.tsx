"use client"

import { useEffect } from "react"

/**
 * Polls /VERSION every minute when the tab is visible. If the version changes
 * (meaning a new deployment went live), shows a prompt to reload and activates
 * the waiting service worker.
 */
export default function VersionCheck() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.location.protocol === "file:") return // local preview, skip

    const STORAGE_KEY = "kads_last_seen_version"

    const checkVersion = async () => {
      if (document.visibilityState !== "visible") return
      try {
        const res = await fetch(`./VERSION?t=${Date.now()}`, {
          cache: "no-store",
          credentials: "same-origin"
        })
        if (!res.ok) return
        const latest = (await res.text()).trim()
        if (!latest) return

        const lastSeen = localStorage.getItem(STORAGE_KEY)
        if (lastSeen && lastSeen !== latest) {
          // New version live — trigger service worker update then reload
          console.debug("[VersionCheck] New version detected:", latest, "→", lastSeen)

          // Tell the service worker to skip waiting
          if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" })
            const reg = await navigator.serviceWorker.getRegistration()
            await reg?.update()
          }

          // Show a subtle UI notification to reload
          showReloadBar(() => {
            localStorage.setItem(STORAGE_KEY, latest)
            window.location.reload()
          })
          return
        }
        localStorage.setItem(STORAGE_KEY, latest)
      } catch {}
    }

    const onSWMessage = (event: MessageEvent) => {
      if (event.data?.type === "NEW_VERSION_ACTIVATED") {
        window.location.reload()
      }
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", onSWMessage)
    }

    // Check on mount + every 2 minutes + when tab becomes visible
    checkVersion()
    const interval = setInterval(checkVersion, 2 * 60 * 1000)
    const onVisible = () => { if (document.visibilityState === "visible") checkVersion() }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", onSWMessage)
      }
    }
  }, [])

  return null
}

function showReloadBar(onReload: () => void) {
  // Don't double-show
  if (document.getElementById("kads-reload-bar")) return
  const bar = document.createElement("div")
  bar.id = "kads-reload-bar"
  bar.setAttribute("role", "alert")
  bar.innerHTML = `
    <div style="position:fixed;top:0;left:0;right:0;z-index:9999;padding:10px 16px;display:flex;align-items:center;justify-content:center;gap:12px;background:linear-gradient(135deg,#1E6BFF,#33B5FF);color:white;font-size:14px;font-weight:500;box-shadow:0 4px 20px rgba(30,107,255,.4);">
      <span>A new version of KADS LABS is available.</span>
      <button id="kads-reload-btn" style="background:white;color:#1E6BFF;border:none;padding:6px 14px;border-radius:8px;font-weight:600;cursor:pointer;font-size:13px;">Update now</button>
      <button id="kads-dismiss-btn" style="background:transparent;color:white;border:1px solid rgba(255,255,255,.4);padding:6px 12px;border-radius:8px;cursor:pointer;font-size:12px;">Later</button>
    </div>
  `
  document.body.appendChild(bar)
  document.getElementById("kads-reload-btn")?.addEventListener("click", onReload)
  document.getElementById("kads-dismiss-btn")?.addEventListener("click", () => bar.remove())
}
