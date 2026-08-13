"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/app/components/AuthProvider"
import { Loader2 } from "lucide-react"

function DashboardRouterInner() {
  const { user, isLoading, isFounder, isDirector, isAdmin, isDeveloper, isHR, isClient } = useAuth()
  const router = useRouter()
  const [pushed, setPushed] = useState(false)

  useEffect(() => {
    if (isLoading || pushed) return
    let dest = ""
    if (!user) {
      dest = "/auth?next=/dashboard"
    } else if (isFounder) {
      dest = "/founder"
    } else if (isDirector || isAdmin) {
      dest = "/admin"
    } else if (isDeveloper) {
      dest = "/developer"
    } else if (isHR) {
      dest = "/hr"
    } else if (isClient) {
      dest = "/client"
    } else {
      dest = "/profile"
    }
    setPushed(true)
    router.replace(dest)
  }, [isLoading, user, isFounder, isDirector, isAdmin, isDeveloper, isHR, isClient, router, pushed])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#33B5FF" }} />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Routing to your dashboard…</p>
      </div>
    </div>
  )
}

/**
 * /dashboard — smart role router (client).
 * Reads Firebase auth state via AuthProvider and redirects to the right dashboard.
 * Unauthenticated users are sent to /auth?next=/dashboard.
 */
export default function DashboardRouter() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#33B5FF" }} />
        </div>
      }
    >
      <DashboardRouterInner />
    </Suspense>
  )
}
