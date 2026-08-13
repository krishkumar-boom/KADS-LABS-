"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Ticket, Users, Briefcase, Receipt, Bug, UserPlus, MessageSquare,
  FileText, Sparkles, Shield, TrendingUp, DollarSign, Clock, CheckCircle2,
  AlertCircle, ChevronRight, ExternalLink, Eye, Filter, Download
} from "lucide-react"
import { useAuth } from "@/app/components/AuthProvider"
import DashboardShell from "@/components/dashboard/DashboardShell"
import StatCard from "@/components/dashboard/StatCard"
import { LineChart, BarChart, DonutChart } from "@/components/dashboard/Charts"
import ActivityTimeline from "@/components/dashboard/ActivityTimeline"
import SystemHealth from "@/components/dashboard/SystemHealth"
import AIAssistant from "@/components/dashboard/AIAssistant"
import GlobalSearch from "@/components/dashboard/GlobalSearch"
import SafeImage from "@/app/components/SafeImage"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type Ticket = any
type Project = any

export default function FounderDashboard() {
  const { user, isAuthenticated, isPrivileged, demoMode, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalTickets: 0, newTickets: 0, resolvedTickets: 0,
    totalProjects: 0, activeProjects: 0, totalClients: 0,
    totalRevenue: 0, pendingInvoices: 0, careers: 0, bugs: 0
  })
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

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
      // Demo data
      setStats({
        totalTickets: 24, newTickets: 6, resolvedTickets: 14,
        totalProjects: 8, activeProjects: 3, totalClients: 12,
        totalRevenue: 245000, pendingInvoices: 2, careers: 9, bugs: 3
      })
      setRecentTickets([
        { id: "1", ticket_id: "TCK-000024", type: "career", subject: "Frontend Developer application — Rahul S.", name: "Rahul Sharma", status: "new", priority: "normal", created_at: new Date(Date.now() - 3600000).toISOString() },
        { id: "2", ticket_id: "TCK-000023", type: "contact", subject: "SaaS platform inquiry for logistics firm", name: "Priya Patel", status: "new", priority: "high", created_at: new Date(Date.now() - 7200000).toISOString() },
        { id: "3", ticket_id: "TCK-000022", type: "bug", subject: "Mobile menu not closing on selection", name: "Amit Kumar", status: "assigned", priority: "medium", created_at: new Date(Date.now() - 18000000).toISOString() },
        { id: "4", ticket_id: "TCK-000021", type: "quote", subject: "Website redesign quote request", name: "GlobalTrend Inc.", status: "in_progress", priority: "normal", created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: "5", ticket_id: "TCK-000020", type: "feedback", subject: "Amazing work on our dashboard!", name: "Meera Joshi", status: "resolved", priority: "low", created_at: new Date(Date.now() - 172800000).toISOString() }
      ])
      setRecentProjects([
        { id: "p1", name: "AI Customer Support Bot", client_name: "TechCorp", status: "in_progress", progress: 65 },
        { id: "p2", name: "E-commerce Mobile App", client_name: "RetailMax", status: "review", progress: 90 },
        { id: "p3", name: "SaaS Billing Platform", client_name: "CloudScale", status: "in_progress", progress: 40 },
        { id: "p4", name: "Brand Identity System", client_name: "FinEdge", status: "completed", progress: 100 }
      ])
      setLoadingData(false)
      return
    }
    try {
      // Parallel queries
      const [ticketsRes, projectsRes, clientsRes, invoicesRes, careersRes, bugsRes] = await Promise.all([
        supabase.from("tickets").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("profiles").select("*").eq("role", "client"),
        supabase.from("invoices").select("*"),
        supabase.from("career_applications").select("*", { count: "exact", head: false }),
        supabase.from("bug_reports").select("*", { count: "exact", head: false })
      ])

      const tickets = ticketsRes.data || []
      const projects = projectsRes.data || []
      setRecentTickets(tickets.slice(0, 5))
      setRecentProjects(projects.slice(0, 4))

      const paidInvoices = (invoicesRes.data || []).filter((i: any) => i.status === "paid")
      const pendingInvoices = (invoicesRes.data || []).filter((i: any) => ["draft", "sent", "viewed", "overdue"].includes(i.status))
      setStats({
        totalTickets: tickets.length,
        newTickets: tickets.filter((t: any) => t.status === "new").length,
        resolvedTickets: tickets.filter((t: any) => t.status === "resolved" || t.status === "closed").length,
        totalProjects: projects.length,
        activeProjects: projects.filter((p: any) => ["planning", "in_progress", "review"].includes(p.status)).length,
        totalClients: clientsRes.data?.length || 0,
        totalRevenue: paidInvoices.reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0),
        pendingInvoices: pendingInvoices.length,
        careers: careersRes.data?.length || 0,
        bugs: (bugsRes.data || []).filter((b: any) => b.status !== "fixed" && b.status !== "wontfix").length
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
      archived: { bg: "rgba(100,116,139,0.1)", color: "#64748B" }
    }
    return map[status] || map.new
  }

  const projectStatusColor = (status: string) => ({
    planning: "#64748B", in_progress: "#1E6BFF", review: "#F59E0B",
    deployed: "#8B5CF6", completed: "#10B981", paused: "#F97316", cancelled: "#EF4444"
  } as Record<string, string>)[status] || "#64748B"

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="animate-pulse text-sm" style={{ color: "var(--text-muted)" }}>Loading...</div>
    </div>
  }

  return (
    <DashboardShell title="Founder Dashboard" role="founder">
      {/* Demo mode banner */}
      {demoMode && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
          <AlertCircle className="w-5 h-5 shrink-0" style={{ color: "#F59E0B" }} />
          <div className="text-xs flex-1" style={{ color: "var(--text-secondary)" }}>
            <strong style={{ color: "#F59E0B" }}>Demo Mode</strong> — Supabase credentials not configured. Showing sample data.
            Connect <code className="px-1 rounded" style={{ background: "rgba(255,255,255,0.05)" }}>NEXT_PUBLIC_SUPABASE_URL</code> and
            <code className="px-1 rounded ml-1" style={{ background: "rgba(255,255,255,0.05)" }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> for live data.
          </div>
        </div>
      )}

      {/* Greeting */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Founder"} 👋
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Here&apos;s what&apos;s happening across KADS LABS today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard label="New Tickets" value={stats.newTickets} icon={Ticket} trend="up" change="+3 today" accent="#33B5FF" />
        <StatCard label="Active Projects" value={stats.activeProjects} icon={Briefcase} accent="#8B5CF6" />
        <StatCard label="Total Clients" value={stats.totalClients} icon={Users} accent="#10B981" />
        <StatCard label="Career Applications" value={stats.careers} icon={UserPlus} accent="#06B6D4" />
        <StatCard label="Open Bugs" value={stats.bugs} icon={Bug} trend={stats.bugs > 0 ? "down" : "neutral"} accent="#EF4444" />
        <StatCard label="Total Tickets" value={stats.totalTickets} icon={MessageSquare} accent="#1E6BFF" />
        <StatCard label="Resolved" value={stats.resolvedTickets} icon={CheckCircle2} accent="#10B981" />
        <StatCard label="Revenue (Paid)" value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} trend="up" change="+12%" accent="#10B981" />
        <StatCard label="Pending Invoices" value={stats.pendingInvoices} icon={Receipt} accent="#F59E0B" />
        <StatCard label="All Projects" value={stats.totalProjects} icon={Briefcase} accent="#EC4899" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lg:col-span-2 premium-card"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Recent Inbox</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Latest submissions across all channels</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg transition-colors" style={{ background: "var(--bg-tertiary)" }}>
                <Filter className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              </button>
              <button className="p-2 rounded-lg transition-colors" style={{ background: "var(--bg-tertiary)" }}>
                <Download className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {loadingData ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-3 rounded-xl animate-pulse" style={{ background: "var(--bg-tertiary)", height: 64 }} />
              ))
            ) : recentTickets.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No tickets yet</div>
            ) : recentTickets.map(t => {
              const sc = statusBadge(t.status)
              const tc = typeColor(t.type)
              return (
                <div key={t.id}
                     className="group p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer hover:translate-x-1"
                     style={{ border: "1px solid var(--border-subtle)" }}
                     onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-default)"}
                     onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-subtle)"}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                       style={{ background: `${tc}20` }}>
                    {t.type === "career" ? <UserPlus className="w-4 h-4" style={{ color: tc }} /> :
                     t.type === "bug" ? <Bug className="w-4 h-4" style={{ color: tc }} /> :
                     t.type === "quote" ? <FileText className="w-4 h-4" style={{ color: tc }} /> :
                     t.type === "feedback" ? <Sparkles className="w-4 h-4" style={{ color: tc }} /> :
                     <MessageSquare className="w-4 h-4" style={{ color: tc }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono" style={{ color: "var(--text-subtle)" }}>{t.ticket_id}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                            style={{ background: sc.bg, color: sc.color }}>{t.status.replace("_", " ")}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                            style={{ background: `${tc}15`, color: tc }}>{t.type}</span>
                    </div>
                    <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{t.subject}</div>
                    <div className="text-xs truncate flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                      <span>{t.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(t.created_at)}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-subtle)" }} />
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions + Active Projects */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="premium-card"
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: FileText, label: "New Quote", href: "/quote" },
                { icon: UserPlus, label: "View Careers", href: "/careers" },
                { icon: MessageSquare, label: "Feedback", href: "/feedback" },
                { icon: Shield, label: "Audit Logs", href: "#audit" },
              ].map(action => {
                const Icon = action.icon
                return (
                  <a key={action.label} href={action.href}
                     className="p-3 rounded-xl flex flex-col items-center gap-2 text-center transition-all hover:-translate-y-0.5"
                     style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
                    <Icon className="w-5 h-5" style={{ color: "var(--brand-electric)" }} />
                    <span className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>{action.label}</span>
                  </a>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="premium-card"
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>Active Projects</h3>
            <div className="space-y-4">
              {loadingData ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ height: 60, background: "var(--bg-tertiary)", borderRadius: 12 }} />
                ))
              ) : recentProjects.length === 0 ? (
                <div className="text-sm text-center p-4" style={{ color: "var(--text-muted)" }}>No active projects</div>
              ) : recentProjects.map((p: any) => (
                <div key={p.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{p.client_name}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider"
                          style={{ background: `${projectStatusColor(p.status)}15`, color: projectStatusColor(p.status) }}>
                      {p.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                         style={{
                           width: `${p.progress || 0}%`,
                           background: `linear-gradient(90deg, ${projectStatusColor(p.status)}, #33B5FF)`
                         }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      {/* Analytics charts row */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Analytics Overview</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Leads, visitors, conversions — last 30 days</p>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:"#1E6BFF"}} />Leads</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:"#10B981"}} />Visitors</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <LineChart
              data={[8,12,10,15,18,14,22,25,19,28,32,30,35,28,40,42,38,45,50,48,52,55,49,58,62,55,64,68,62,70]}
              stroke="#1E6BFF" fill="rgba(30,107,255,0.15)"
              label="Leads this month"
              valueFormatter={v => `${v} leads`}
              height={100}
            />
            <LineChart
              data={[120,135,128,150,180,160,210,240,220,280,310,290,340,280,390,420,380,440,490,470,510,540,480,570,600,560,620,670,610,700]}
              stroke="#10B981" fill="rgba(16,185,129,0.12)"
              label="Unique visitors"
              valueFormatter={v => `${v}`}
              height={100}
            />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            {[
              { label: "Conversion", value: "12.4%", color: "#10B981" },
              { label: "Avg Session", value: "2m 34s", color: "#1E6BFF" },
              { label: "Bounce Rate", value: "32%", color: "#F59E0B" },
              { label: "Monthly Growth", value: "+18%", color: "#8B5CF6" }
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="premium-card">
          <h3 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>Lead Sources</h3>
          <div className="flex items-center gap-4">
            <DonutChart segments={[
              { label: "Organic", value: 42, color: "#1E6BFF" },
              { label: "Social", value: 28, color: "#8B5CF6" },
              { label: "Referral", value: 18, color: "#10B981" },
              { label: "Direct", value: 12, color: "#F59E0B" }
            ]} />
            <div className="flex-1 space-y-2">
              {[
                { label: "Organic Search", value: "42%", color: "#1E6BFF" },
                { label: "Social Media", value: "28%", color: "#8B5CF6" },
                { label: "Referrals", value: "18%", color: "#10B981" },
                { label: "Direct", value: "12%", color: "#F59E0B" }
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.label}
                  </span>
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Activity Timeline + System Health */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card lg:col-span-2">
          <h3 className="font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>Activity Timeline</h3>
          <ActivityTimeline limit={10} />
        </motion.div>
        <SystemHealth />
      </div>

      {/* AI Assistant floating */}
      <AIAssistant />
    </DashboardShell>
  )
}

function timeAgo(date: string): string {
  const s = (Date.now() - new Date(date).getTime()) / 1000
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}
