// GET /api/health  — lightweight uptime endpoint for SSR/Vercel builds.
//
// This route is SERVER-ONLY. It is never included in the static export
// (output:'export') because static export cannot serve server routes — see
// scripts/build-static.js which temporarily moves app/api/ out of app/ during
// a static build so Next.js never tries to compile it.
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { hasSupabaseCredentials } from "@/lib/supabase"
import { hasFirebaseCredentials } from "@/lib/firebase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const serverSupabase =
  hasSupabaseCredentials() && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null

export const revalidate = 0
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function probeSupabase(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  if (!hasSupabaseCredentials() || !serverSupabase) return { ok: false, error: "not_configured" }
  try {
    const t0 = Date.now()
    const res = await serverSupabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .limit(0)
    if (res.error) return { ok: false, error: res.error.message }
    return { ok: true, latencyMs: Date.now() - t0 }
  } catch (e: any) {
    return { ok: false, error: e?.message || "unknown" }
  }
}

function probeFirebase(): { ok: boolean; error?: string } {
  if (!hasFirebaseCredentials()) return { ok: false, error: "not_configured" }
  return { ok: true }
}

export async function GET() {
  const started = Date.now()
  const [db, auth] = await Promise.all([probeSupabase(), Promise.resolve(probeFirebase())])
  const ok = db.ok && auth.ok
  return NextResponse.json(
    {
      status: ok ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: "2.0.0",
      services: {
        database: db,
        auth,
        storage:        { ok: db.ok, note: "uses supabase storage" },
        realtime:       { ok: db.ok, note: "uses supabase realtime" },
        api:            { ok: true,  note: "next.js api route" },
        email:          {
          ok: !!process.env.SMTP_HOST,
          note: process.env.SMTP_HOST ? "smtp configured" : "smtp not configured",
        },
        edge_functions: { ok: true, note: "supabase edge" },
      },
      latencyMs: Date.now() - started,
    },
    {
      status: ok ? 200 : 503,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    }
  )
}
