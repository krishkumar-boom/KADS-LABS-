"use client"

import { AlertTriangle, Settings } from "lucide-react"
import { hasSupabaseCredentials } from "@/lib/supabase"
import { hasFirebaseCredentials } from "@/lib/firebase"
import { isProductionDomain } from "@/lib/env"

/**
 * Shown on production domains when required env vars are missing.
 * Never shown in local development or when credentials are present.
 */
export default function ConfigError() {
  if (!isProductionDomain()) return null
  const missing: string[] = []
  if (!hasSupabaseCredentials()) missing.push("Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)")
  if (!hasFirebaseCredentials()) missing.push("Firebase Auth (NEXT_PUBLIC_FIREBASE_*)")
  if (missing.length === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] p-3" style={{ background: "#EF4444" }}>
      <div className="max-w-6xl mx-auto flex items-start gap-3 text-white">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <strong>Configuration Required</strong>
          <p className="text-white/90 text-xs mt-0.5">
            Missing environment variables: {missing.join(", ")}.
            Add these in Vercel → Project Settings → Environment Variables to enable authentication, forms and dashboards.
          </p>
        </div>
        <Settings className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
      </div>
    </div>
  )
}
