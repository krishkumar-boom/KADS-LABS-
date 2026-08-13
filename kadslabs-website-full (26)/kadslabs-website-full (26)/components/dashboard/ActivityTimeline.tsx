"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  LogIn, UserPlus, MessageSquare, Briefcase, FileText, Receipt,
  Ticket, DollarSign, Sparkles, User, Mail, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownRight
} from "lucide-react"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"

type Activity = {
  id: string
  type: "login" | "lead" | "feedback" | "career" | "project" | "invoice" | "ticket_update" | "new_user" | "payment"
  title: string
  description?: string
  metadata?: any
  created_at: string
  user_name?: string
}

const iconMap: Record<string, any> = {
  login: LogIn, lead: UserPlus, feedback: Sparkles, career: Briefcase,
  project: FileText, invoice: Receipt, ticket_update: Ticket,
  new_user: User, payment: DollarSign, message: MessageSquare
}

const colorMap: Record<string, string> = {
  login: "#33B5FF", lead: "#10B981", feedback: "#F59E0B", career: "#8B5CF6",
  project: "#0EA5E9", invoice: "#EC4899", ticket_update: "#EF4444",
  new_user: "#06B6D4", payment: "#10B981", message: "#1E6BFF"
}

function generateDemoActivity(): Activity[] {
  const now = Date.now()
  const ago = (h: number) => new Date(now - h * 3600000).toISOString()
  return [
    { id: "a1", type: "lead", title: "New contact form submission", description: "Priya Patel — SaaS platform inquiry", created_at: ago(0.5), user_name: "Priya Patel" },
    { id: "a2", type: "career", title: "New career application", description: "Frontend Developer — Rahul Sharma", created_at: ago(2), user_name: "Rahul Sharma" },
    { id: "a3", type: "login", title: "Founder login from new device", description: "ceo@kadslabs.com · Chrome on Windows", created_at: ago(3), user_name: "Shivam Gupta" },
    { id: "a4", type: "ticket_update", title: "Ticket resolved", description: "TCK-000019 marked resolved", created_at: ago(6), user_name: "Support Team" },
    { id: "a5", type: "payment", title: "Invoice INV-01023 paid", description: "₹85,000 received from TechCorp", created_at: ago(12), user_name: "TechCorp" },
    { id: "a6", type: "feedback", title: "New 5-star feedback", description: "\"Excellent work on our dashboard\" — Meera Joshi", created_at: ago(20), user_name: "Meera Joshi" },
    { id: "a7", type: "project", title: "Project update: AI Support Bot", description: "Progress 65% → 75%", created_at: ago(26) },
    { id: "a8", type: "invoice", title: "Invoice INV-01027 sent", description: "Sent to CloudScale Pvt Ltd — ₹120,000", created_at: ago(30), user_name: "CloudScale" }
  ]
}

export default function ActivityTimeline({ limit = 10 }: { limit?: number }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivity()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadActivity() {
    setLoading(true)
    if (!hasSupabaseCredentials()) {
      setActivities(generateDemoActivity().slice(0, limit))
      setLoading(false)
      return
    }
    try {
      // Query audit_logs for real activity stream
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)
      setActivities((data || []).map((l: any) => ({
        id: l.id, type: (l.action || "lead") as any,
        title: l.action?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Activity",
        description: l.entity_type ? `${l.entity_type}: ${l.entity_id}` : undefined,
        metadata: l.metadata, created_at: l.created_at
      })))
    } catch {
      setActivities(generateDemoActivity().slice(0, limit))
    }
    setLoading(false)
  }

  function timeAgo(date: string) {
    const s = (Date.now() - new Date(date).getTime()) / 1000
    if (s < 60) return "just now"
    if (s < 3600) return `${Math.floor(s/60)}m ago`
    if (s < 86400) return `${Math.floor(s/3600)}h ago`
    return `${Math.floor(s/86400)}d ago`
  }

  if (loading) {
    return <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full" style={{ background: "var(--bg-tertiary)" }} />
          <div className="flex-1 space-y-2">
            <div className="h-3 rounded" style={{ background: "var(--bg-tertiary)", width: "60%" }} />
            <div className="h-2 rounded" style={{ background: "var(--bg-tertiary)", width: "40%" }} />
          </div>
        </div>
      ))}
    </div>
  }

  return (
    <div className="space-y-0 relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-px" style={{ background: "var(--border-subtle)" }} aria-hidden="true" />

      {activities.map((a, i) => {
        const Icon = iconMap[a.type] || MessageSquare
        const color = colorMap[a.type] || "#1E6BFF"
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="relative flex gap-3 py-2.5 pl-0"
          >
            <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                 style={{ background: `${color}20`, border: `2px solid ${color}` }}>
              <Icon className="w-3.5 h-3.5" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>{a.title}</p>
                <span className="text-[10px] shrink-0" style={{ color: "var(--text-subtle)" }}>{timeAgo(a.created_at)}</span>
              </div>
              {a.description && (
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>{a.description}</p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
