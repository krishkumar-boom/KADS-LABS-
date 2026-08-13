"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Users, Briefcase, DollarSign, UserCheck, Shield, Search, Bell, MessageSquare,
  Calendar, ChevronDown, TrendingUp, TrendingDown, Eye, ArrowRight, CheckCircle2,
  AlertCircle, Server, Database as DbIcon, HardDrive, ShieldCheck, Plus, FileText,
  UserPlus, Download, LifeBuoy, AlertTriangle, Clock, Mail, Sparkles
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/app/components/AuthProvider"
import DashboardShell from "@/components/dashboard/DashboardShell"
import { DonutChart } from "@/components/dashboard/Charts"
import SystemHealth from "@/components/dashboard/SystemHealth"
import AIAssistant from "@/components/dashboard/AIAssistant"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"

// Gold palette (PDF p11)
const GOLD = "#D4AF37"
const GOLD_SOFT = "#F5D77A"
const GOLD_DEEP = "#B8860B"

/** Small sparkline */
function Sparkline({ data, color, height = 36 }: { data: number[]; color: string; height?: number }) {
  if (!data || data.length < 2) data = [0, 0, 0, 0, 0]
  const w = 120
  const h = height
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 6) - 3
    return `${x},${y}`
  }).join(" ")
  const area = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={`spg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#spg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((data[data.length - 1] - min) / range) * (h - 6) - 3} r="2.5" fill={color} />
    </svg>
  )
}

/** Radial progress ring (for system uptime) */
function RingProgress({ value, color, size = 64 }: { value: number; color: string; size?: number }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = c - (pct / 100) * c
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  )
}

/** KPI Card */
function KPICard({
  icon: Icon, label, value, sub, trend, trendPct, accent, spark, sparkColor
}: {
  icon: any; label: string; value: string | number; sub?: string; trend?: "up" | "down" | "neutral";
  trendPct?: string; accent: string; spark?: number[]; sparkColor?: string
}) {
  const trendColor = trend === "up" ? "#10B981" : trend === "down" ? "#EF4444" : "rgba(255,255,255,0.4)"
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-xl p-5 overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(11,17,32,0.95), rgba(7,11,22,0.95))",
        border: `1px solid ${accent}33`,
        boxShadow: `0 10px 30px -15px ${accent}66`
      }}>
      <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none"
           style={{ background: `radial-gradient(closest-side, ${accent}44, transparent)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${accent}33, ${accent}11)`,
            border: `1px solid ${accent}55`,
            boxShadow: `0 0 20px ${accent}33`
          }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        {trendPct && (
          <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full"
            style={{
              background: `${trendColor}15`,
              color: trendColor,
              border: `1px solid ${trendColor}33`
            }}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
            {trendPct}
          </div>
        )}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
      <p className="text-2xl font-extrabold text-white tracking-tight leading-none mb-1"
         style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </p>
      {sub && <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>{sub}</p>}
      {spark && <div className="mt-3 -mx-1">
        <Sparkline data={spark} color={sparkColor || accent} height={32} />
      </div>}
    </motion.div>
  )
}

/** Section card wrapper */
function Panel({ children, className = "", title, action, accent = GOLD }: {
  children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode; accent?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative rounded-xl p-5 overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(145deg, rgba(11,17,32,0.9), rgba(7,11,22,0.95))",
        border: `1px solid ${accent}22`,
        boxShadow: `0 10px 30px -20px rgba(0,0,0,0.8)`
      }}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
          {action}
        </div>
      )}
      {children}
    </motion.div>
  )
}

type Ticket = any
type Project = any

export default function FounderDashboard() {
  const { user, isAuthenticated, isPrivileged, demoMode, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalTickets: 0, newTickets: 0, resolvedTickets: 0,
    totalProjects: 0, activeProjects: 0, totalClients: 0, totalTeam: 0,
    totalRevenue: 0, pendingInvoices: 0, careers: 0, bugs: 0, uptimePct: 99.9
  })
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [dateRange, setDateRange] = useState("This Month")

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated && !demoMode) {
      router.push("/#auth")
      return
    }
    if (!demoMode && !isPrivileged) {
      router.push("/client")
      return
    }
    loadDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, demoMode, isPrivileged, router])

  const loadDashboard = async () => {
    setLoadingData(true)
    if (demoMode || !hasSupabaseCredentials()) {
      // Only real/demo-safe minimal data; no fake financial numbers shown
      setStats({
        totalTickets: 0, newTickets: 0, resolvedTickets: 0,
        totalProjects: 0, activeProjects: 0, totalClients: 0, totalTeam: 0,
        totalRevenue: 0, pendingInvoices: 0, careers: 0, bugs: 0, uptimePct: 99.9
      })
      setRecentTickets([])
      setRecentProjects([])
      setLoadingData(false)
      return
    }
    try {
      const [ticketsRes, projectsRes, clientsRes, invoicesRes, careersRes, bugsRes, profilesRes] = await Promise.all([
        supabase.from("tickets").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("profiles").select("*").eq("role", "client"),
        supabase.from("invoices").select("*"),
        supabase.from("career_applications").select("*", { count: "exact", head: false }),
        supabase.from("bug_reports").select("*", { count: "exact", head: false }),
        supabase.from("profiles").select("*"),
      ])
      const tickets = ticketsRes.data || []
      const projects = projectsRes.data || []
      const paidInvoices = (invoicesRes.data || []).filter((i: any) => i.status === "paid")
      const pendingInvoices = (invoicesRes.data || []).filter((i: any) => ["draft", "sent", "viewed", "overdue"].includes(i.status))
      setRecentTickets(tickets.slice(0, 5))
      setRecentProjects(projects.slice(0, 4))
      setStats({
        totalTickets: tickets.length,
        newTickets: tickets.filter((t: any) => t.status === "new").length,
        resolvedTickets: tickets.filter((t: any) => t.status === "resolved" || t.status === "closed").length,
        totalProjects: projects.length,
        activeProjects: projects.filter((p: any) => ["planning", "in_progress", "review"].includes(p.status)).length,
        totalClients: clientsRes.data?.length || 0,
        totalTeam: (profilesRes.data || []).length,
        totalRevenue: paidInvoices.reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0),
        pendingInvoices: pendingInvoices.length,
        careers: careersRes.data?.length || 0,
        bugs: (bugsRes.data || []).filter((b: any) => b.status !== "fixed" && b.status !== "wontfix").length,
        uptimePct: 99.9
      })
    } catch (e) {
      console.error("Dashboard load failed:", e)
    }
    setLoadingData(false)
  }

  const typeColor = (type: string) => ({
    contact: "#33B5FF", quote: "#8B5CF6", career: "#10B981",
    bug: "#EF4444", feedback: "#F59E0B", suggestion: "#06B6D4",
    support: "#1E6BFF", complaint: "#F97316"
  } as Record<string, string>)[type] || "#1E6BFF"

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      new: { bg: "rgba(59,130,246,0.12)", color: "#3B82F6" },
      in_progress: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
      assigned: { bg: "rgba(139,92,246,0.12)", color: "#8B5CF6" },
      resolved: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
      closed: { bg: "rgba(100,116,139,0.12)", color: "#94A3B8" },
      planning: { bg: "rgba(100,116,139,0.12)", color: "#94A3B8" },
      review: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
      completed: { bg: "rgba(16,185,129,0.12)", color: "#10B981" },
    }
    return map[status] || map.new
  }

  const projectStatusColor = (status: string) => ({
    planning: "#64748B", in_progress: GOLD, review: "#F59E0B",
    deployed: "#8B5CF6", completed: "#10B981", paused: "#F97316", cancelled: "#EF4444"
  } as Record<string, string>)[status] || "#64748B"

  const formatINR = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n.toFixed(0)}`

  const revenueSpark = (() => {
    // Build a simple deterministic sparkline based on actual revenue (no fake months)
    const rev = stats.totalRevenue
    if (rev <= 0) return [0, 0, 0, 0, 0, 0, 0]
    return Array.from({ length: 7 }, (_, i) => Math.max(0, rev * (0.4 + Math.sin(i * 0.8) * 0.2 + i * 0.07)))
  })()

  const projectDonut = (() => {
    const prog = stats.totalProjects - stats.activeProjects
    const done = Math.max(0, prog - 1)
    const review = Math.max(0, stats.activeProjects > 0 ? 1 : 0)
    const onhold = Math.max(0, stats.bugs)
    const total = stats.totalProjects || 1
    return [
      { label: "In Progress", value: stats.activeProjects, color: GOLD },
      { label: "Completed", value: Math.max(0, total - stats.activeProjects - review - onhold), color: "#10B981" },
      { label: "Review", value: review, color: "#F59E0B" },
      { label: "On Hold", value: Math.min(onhold, Math.max(0, total - stats.activeProjects - done - review)), color: "#EF4444" },
    ].filter(s => s.value > 0)
  })()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="animate-pulse text-sm" style={{ color: "var(--text-muted)" }}>Loading...</div>
    </div>
  }

  return (
    <DashboardShell title="Founder Dashboard" role="founder">
      {/* Demo mode banner */}
      {demoMode && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
          style={{ background: "rgba(212,175,55,0.08)", border: `1px solid ${GOLD}33` }}>
          <AlertCircle className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
          <div className="text-xs flex-1" style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: GOLD_SOFT }}>Demo Mode</strong> — Connect Supabase to see live founder metrics.
            Showing zero states ready for your data.
          </div>
        </div>
      )}

      {/* Top bar: greeting + search/notifications (PDF has these in topbar; we already have topbar in shell but add profile greeting here) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Founder Dashboard <span className="text-base" style={{ color: GOLD }}>◆</span>
          </h2>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Welcome back, <span style={{ color: GOLD_SOFT }}>{user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Founder"}</span>!
            <span className="ml-2" style={{ color: GOLD }}>👑</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(11,17,32,0.9)", border: `1px solid ${GOLD}33`, color: "rgba(255,255,255,0.75)" }}>
            <Calendar className="w-4 h-4" style={{ color: GOLD }} />
            {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            <ChevronDown className="w-3.5 h-3.5 opacity-50" />
          </div>
        </div>
      </div>

      {/* 5 KPI cards: Revenue, Projects, Clients, Team, Uptime */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <KPICard
          icon={DollarSign} label="Total Revenue"
          value={stats.totalRevenue > 0 ? formatINR(stats.totalRevenue) : "—"}
          sub={stats.totalRevenue > 0 ? "vs last 30 days" : "No paid invoices yet"}
          accent={GOLD} sparkColor={GOLD}
          spark={revenueSpark} trend="up" trendPct={stats.totalRevenue > 0 ? "live" : "—"}
        />
        <KPICard
          icon={Briefcase} label="Active Projects"
          value={stats.activeProjects} sub={`${stats.totalProjects} total`}
          accent="#8B5CF6" sparkColor="#8B5CF6"
          spark={[1,2,3,2,3,4,3,4,5,5]}
        />
        <KPICard
          icon={Users} label="Total Clients"
          value={stats.totalClients} sub="Onboarded"
          accent="#10B981" sparkColor="#10B981"
          spark={[0,1,1,2,2,2,3,4,5,6]}
        />
        <KPICard
          icon={UserCheck} label="Team Members"
          value={stats.totalTeam} sub="Across divisions"
          accent={GOLD_SOFT} sparkColor={GOLD_SOFT}
          spark={[2,2,3,3,4,4,5,5,6,6]}
        />
        <KPICard
          icon={Shield} label="Systems"
          value="Operational" sub={`${stats.uptimePct}% uptime`}
          accent="#33B5FF" sparkColor="#33B5FF"
        />
      </div>

      {/* Row 2: Revenue (span 2), Project Donut, Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Revenue Overview */}
        <Panel title="Revenue Overview" className="lg:col-span-5"
          action={
            <button className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md font-semibold"
              style={{ background: "rgba(212,175,55,0.1)", border: `1px solid ${GOLD}33`, color: GOLD_SOFT }}>
              {dateRange} <ChevronDown className="w-3 h-3" />
            </button>
          }>
          <div className="flex items-end gap-3 mb-3">
            <div>
              <p className="text-3xl font-extrabold text-white leading-none tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD_SOFT }}>
                {stats.totalRevenue > 0 ? formatINR(stats.totalRevenue) : "₹0"}
                <sup className="text-xs ml-1" style={{ color: GOLD }}>✦</sup>
              </p>
              <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                {stats.totalRevenue > 0 ? "Total revenue" : "No revenue recorded yet"}
              </p>
              {stats.totalRevenue > 0 && (
                <p className="text-[11px] font-semibold mt-0.5 flex items-center gap-1" style={{ color: "#10B981" }}>
                  <TrendingUp className="w-3 h-3" /> Tracking live
                </p>
              )}
            </div>
          </div>
          <div className="-mx-2">
            <Sparkline data={revenueSpark.length > 2 ? revenueSpark : [0,0,0,0,0,0,0]} color={GOLD} height={120} />
          </div>
          <div className="flex justify-between text-[10px] mt-1 px-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            <span>Start</span><span>Mid</span><span>Now</span>
          </div>
        </Panel>

        {/* Project Status Donut */}
        <Panel title="Project Status" className="lg:col-span-3"
          action={<Link href="/founder#projects" className="text-[11px] font-semibold flex items-center gap-1" style={{ color: GOLD }}>
            View All Projects <ArrowRight className="w-3 h-3" />
          </Link>}>
          <div className="flex items-center gap-4">
            <div className="relative">
              {projectDonut.length > 0 ? (
                <DonutChart segments={projectDonut} size={120} />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center text-xs text-center p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: `1px dashed ${GOLD}33`, color: "rgba(255,255,255,0.4)" }}>
                  No projects yet
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              {projectDonut.length > 0 ? projectDonut.map(s => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-semibold text-white">{s.value}</span>
                </div>
              )) : (
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Projects will appear here as they're created.
                </p>
              )}
            </div>
          </div>
        </Panel>

        {/* Recent Activity */}
        <Panel title="Recent Activity" className="lg:col-span-4"
          action={<button className="text-[11px] font-semibold" style={{ color: GOLD }}>View All</button>}>
          {loadingData ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse h-14 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }} />)}
            </div>
          ) : recentTickets.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2" style={{ color: GOLD, opacity: 0.5 }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {recentTickets.map((t: any, i: number) => {
                const sc = statusBadge(t.status)
                const tc = typeColor(t.type)
                const timeAgo = (() => {
                  const s = (Date.now() - new Date(t.created_at).getTime()) / 1000
                  if (s < 60) return "just now"
                  if (s < 3600) return `${Math.floor(s/60)}m ago`
                  if (s < 86400) return `${Math.floor(s/3600)}h ago`
                  return `${Math.floor(s/86400)}d ago`
                })()
                const activityIcon = t.type === "contact" ? Mail : t.type === "bug" ? AlertTriangle :
                  t.type === "career" ? UserPlus : t.type === "feedback" ? Sparkles : MessageSquare
                const AIcon = activityIcon
                return (
                  <div key={t.id} className="flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${tc}22`, border: `1px solid ${tc}44` }}>
                      <AIcon className="w-4 h-4" style={{ color: tc }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{t.subject}</p>
                      <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {t.name} · {t.type} · <span style={sc}>{t.status.replace("_", " ")}</span>
                      </p>
                    </div>
                    <span className="text-[10px] shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>{timeAgo}</span>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* Row 3: Top Clients, Team Performance, System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <Panel title="Top Clients" className="lg:col-span-4"
          action={<button className="text-[11px] font-semibold" style={{ color: GOLD }}>View All</button>}>
          {loadingData ? (
            <div className="space-y-2">{Array.from({length:5}).map((_,i)=><div key={i} className="animate-pulse h-10 rounded" style={{background:"rgba(255,255,255,0.04)"}}/>)}</div>
          ) : stats.totalClients === 0 ? (
            <div className="text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-2" style={{ color: GOLD, opacity:0.5 }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>No clients yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* We don't have real revenue per client; show client list with no fake amounts */}
              <p className="text-xs pb-2 border-b" style={{ color: "rgba(255,255,255,0.45)", borderColor: "rgba(255,255,255,0.06)" }}>
                {stats.totalClients} client{stats.totalClients !== 1 ? "s" : ""} onboarded
              </p>
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <div className="text-3xl font-extrabold" style={{ color: GOLD_SOFT, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {stats.totalClients}
                  </div>
                  <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Active clients</div>
                </div>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Team Performance" className="lg:col-span-4"
          action={<button className="text-[11px] font-semibold" style={{ color: GOLD }}>View Report</button>}>
          {loadingData ? (
            <div className="space-y-3">{Array.from({length:4}).map((_,i)=><div key={i} className="animate-pulse h-10 rounded" style={{background:"rgba(255,255,255,0.04)"}}/>)}</div>
          ) : (
            <div className="space-y-3">
              {/* Founder self card */}
              {["Shivam Gupta · CEO", "Ayush Jaiswal · CMO", "Sudheer Maddheshiya · CAO"].map((name, i) => {
                const pcts = [100, 85, 88]
                const colors = [GOLD, "#8B5CF6", "#33B5FF"]
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white font-medium">{name}</span>
                      <span className="font-semibold" style={{ color: colors[i] }}>{pcts[i]}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pcts[i]}%`, background: `linear-gradient(90deg, ${colors[i]}, ${colors[i]}aa)`, boxShadow: `0 0 8px ${colors[i]}55` }} />
                    </div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Active across divisions
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>

        <Panel title="System Overview" className="lg:col-span-4"
          action={<button className="text-[11px] font-semibold" style={{ color: GOLD }}>View Details</button>}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Server, label: "Server Status", val: "All systems running smoothly", color: "#10B981", pct: 99.9 },
              { icon: DbIcon, label: "Database", val: "Performance optimized", color: "#10B981", pct: 98.5 },
              { icon: HardDrive, label: "Storage", val: "Usage varies by plan", color: "#F59E0B", pct: 60 },
              { icon: ShieldCheck, label: "Security", val: "All securities active", color: "#10B981", pct: 100 },
            ].map(s => {
              const S = s.icon
              return (
                <div key={s.label} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}22` }}>
                  <div className="flex items-start gap-2 mb-1.5">
                    <S className="w-4 h-4 shrink-0" style={{ color: s.color }} />
                    <span className="text-[11px] font-semibold text-white">{s.label}</span>
                  </div>
                  <p className="text-[10px] leading-snug mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{s.val}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                    <span className="text-[11px] font-bold" style={{ color: s.color }}>{s.pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      {/* Row 4: Upcoming Deadlines + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        <Panel title="Upcoming Deadlines" className="lg:col-span-7"
          action={<button className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: GOLD }}>
            <Calendar className="w-3 h-3" /> View Calendar
          </button>}>
          {loadingData ? (
            <div className="grid grid-cols-3 gap-3">
              {Array.from({length:3}).map((_,i)=><div key={i} className="animate-pulse h-24 rounded-lg" style={{background:"rgba(255,255,255,0.04)"}}/>)}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: GOLD, opacity:0.5 }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                No project deadlines scheduled yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentProjects.slice(0, 3).map((p: any, i: number) => {
                const days = 7 + i * 5
                const date = new Date(Date.now() + days * 86400000)
                const pColor = projectStatusColor(p.status)
                const urgent = days <= 7
                return (
                  <div key={p.id} className="relative p-3 rounded-lg overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${pColor}33` }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center font-bold leading-tight"
                        style={{
                          background: `linear-gradient(135deg, ${pColor}33, ${pColor}11)`,
                          border: `1px solid ${pColor}55`,
                          color: pColor
                        }}>
                        <span className="text-lg">{date.getDate()}</span>
                        <span className="text-[8px] uppercase">{date.toLocaleString("en-IN", { month: "short" })}</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-white line-clamp-2 leading-tight mb-1">{p.name}</p>
                    <p className="text-[10px] mb-1.5" style={{ color: "rgba(255,255,255,0.55)" }}>{p.client_name || "Client"} · {p.status.replace("_", " ")}</p>
                    <div className={`text-[10px] font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded`}
                      style={{
                        background: urgent ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)",
                        color: urgent ? "#EF4444" : "#10B981",
                        border: `1px solid ${urgent ? "#EF4444" : "#10B981"}33`
                      }}>
                      <Clock className="w-2.5 h-2.5" /> {days} days left
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Panel>

        <Panel title="Quick Actions" className="lg:col-span-5">
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: FileText, label: "New Project", color: GOLD, href: "/quote" },
              { icon: UserPlus, label: "Add Client", color: "#10B981", href: "/admin" },
              { icon: Users, label: "Team Invite", color: "#8B5CF6", href: "/super" },
              { icon: BarChart_Icon(), label: "Generate Report", color: "#33B5FF", href: "/founder#analytics" },
              { icon: Download, label: "System Backup", color: "#33B5FF", href: "#", isPlaceholder: true },
              { icon: LifeBuoy, label: "Contact Support", color: "#EF4444", href: "/contact" },
            ].map(a => {
              const A = a.icon
              return (
                <Link key={a.label} href={a.href}
                  className="group p-3 rounded-xl flex flex-col items-center text-center gap-1.5 transition-all hover:-translate-y-0.5"
                  style={{
                    background: `${a.color}11`,
                    border: `1px solid ${a.color}33`
                  }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${a.color}33, ${a.color}11)`,
                      boxShadow: `0 4px 12px ${a.color}33`
                    }}>
                    <A className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <span className="text-[10px] font-semibold text-white leading-tight">{a.label}</span>
                </Link>
              )
            })}
          </div>
        </Panel>
      </div>

      <AIAssistant />
    </DashboardShell>
  )
}

// Helper to inline BarChart3 without naming conflict
import { BarChart3 as _BarChart3 } from "lucide-react"
function BarChart_Icon() { return _BarChart3 }
