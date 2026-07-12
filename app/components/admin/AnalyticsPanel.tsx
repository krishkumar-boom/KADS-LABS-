"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useContent } from "../ContentProvider"
import { AnalyticsSummary } from "@/lib/content"
import { BarChart3, Eye, Users, MousePointer, TrendingUp } from "lucide-react"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"
import { safeStorage } from "@/lib/storage"

const DEMO_ANALYTICS_KEY = "kads_analytics"

export const trackEvent = async (type: string, payload?: Record<string, any>) => {
  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_ANALYTICS_KEY) || "[]") as any[]
    existing.push({ type, payload, createdAt: new Date().toISOString() })
    safeStorage.setItem(DEMO_ANALYTICS_KEY, JSON.stringify(existing.slice(-200)))
    return
  }
  try {
    await supabase.from("analytics_events").insert({ type, payload })
  } catch (err) {
    console.error("trackEvent failed:", err)
  }
}

export default function AnalyticsPanel() {
  const { siteData } = useContent()
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(siteData.analytics)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    setAnalytics(siteData.analytics)
  }, [siteData.analytics])

  useEffect(() => {
    const load = async () => {
      if (!hasSupabaseCredentials()) {
        setEvents(JSON.parse(safeStorage.getItem(DEMO_ANALYTICS_KEY) || "[]").slice(-20).reverse())
        return
      }
      try {
        const { data, error } = await supabase.from("analytics_events").select("*").order("created_at", { ascending: false }).limit(20)
        if (!error) setEvents(data || [])
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const statCards = [
    { label: "Total Visits", value: analytics.totalVisits, icon: Users },
    { label: "Page Views", value: analytics.pageViews, icon: Eye },
    { label: "Leads", value: analytics.leads, icon: MousePointer },
    { label: "Top Page", value: analytics.topPages?.[0]?.views || 0, icon: TrendingUp }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 sm:p-8 glow-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Analytics Overview</h2>
          <p className="text-sm text-white/60 mt-1">Real-time visitor, lead, and engagement metrics.</p>
        </div>
        <BarChart3 className="w-6 h-6 text-electric" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <card.icon className="w-6 h-6 text-electric mb-3" />
            <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
            <p className="text-xs text-white/50">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-bold mb-4">Top Pages</h3>
          {(analytics.topPages || []).length === 0 ? (
            <p className="text-sm text-white/50">No page view data yet.</p>
          ) : (
            <div className="space-y-2">
              {analytics.topPages.map((page, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{page.path}</span>
                  <span className="font-medium">{page.views}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-bold mb-4">Recent Events</h3>
          {events.length === 0 ? (
            <p className="text-sm text-white/50">No events tracked yet.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {events.map((ev, i) => (
                <div key={i} className="text-sm p-2 rounded bg-white/5">
                  <span className="font-medium text-electric-light">{ev.type}</span>
                  <span className="text-white/40 text-xs ml-2">{new Date(ev.created_at || ev.createdAt).toLocaleTimeString()}</span>
                  {ev.payload && <p className="text-xs text-white/50 mt-1">{JSON.stringify(ev.payload)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-white/50">
        For production analytics at scale, connect Supabase and enable analytics_events table with indexes on type and created_at.
      </p>
    </motion.div>
  )
}
