"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FolderKanban, Bug, Rocket, AlertTriangle, BarChart3, FileText,
  MessageSquare, CheckCircle2, Clock, Activity, Code2, Database
} from "lucide-react"
import { useAuth } from "@/app/components/AuthProvider"
import DashboardShell from "@/components/dashboard/DashboardShell"
import StatCard from "@/components/dashboard/StatCard"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"

export default function DeveloperDashboard() {
  const { user, isAuthenticated, isDeveloper, isPrivileged, demoMode, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    myTasks: 0, myProjects: 0, openBugs: 0, deployments: 0, errorRate: "0%"
  })
  const [tasks, setTasks] = useState<any[]>([])
  const [bugs, setBugs] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const loadData = useCallback(async () => {
    setLoadingData(true)
    if (demoMode || !hasSupabaseCredentials() || !user) {
      setStats({ myTasks: 8, myProjects: 3, openBugs: 4, deployments: 12, errorRate: "0.2%" })
      setTasks([
        { id: "t1", title: "Implement payment webhook handler", project: "SaaS Billing Platform", status: "in_progress", priority: "high", due: "Today" },
        { id: "t2", title: "Fix mobile navigation close bug", project: "KADS Website", status: "todo", priority: "medium", due: "Tomorrow" },
        { id: "t3", title: "Write unit tests for auth module", project: "AI Support Bot", status: "in_progress", priority: "normal", due: "3 days" },
        { id: "t4", title: "Optimize hero LCP performance", project: "KADS Website", status: "review", priority: "normal", due: "Today" }
      ])
      setBugs([
        { id: "b1", title: "Form submission double-fire on slow networks", severity: "high", status: "in_progress" },
        { id: "b2", title: "Theme toggle flickers on Safari", severity: "medium", status: "triaged" },
        { id: "b3", title: "Image lazy-load missing on /careers page", severity: "low", status: "new" }
      ])
      setLoadingData(false)
      return
    }
    try {
      const [tasksRes, bugsRes, projectsRes] = await Promise.all([
        supabase.from("project_tasks").select("*, projects(name)").eq("assigned_to", user.id).order("due_date", { ascending: true }),
        supabase.from("bug_reports").select("*").eq("assigned_to", user.id).not("status", "in", '("fixed","wontfix")'),
        supabase.from("projects").select("*").contains("assignees", [user.id])
      ])
      setTasks(tasksRes.data || [])
      setBugs(bugsRes.data || [])
      setStats(s => ({
        ...s,
        myTasks: (tasksRes.data || []).filter((t: any) => t.status !== "done").length,
        myProjects: (projectsRes.data || []).length,
        openBugs: (bugsRes.data || []).length
      }))
    } catch (e) {
      console.error(e)
    }
    setLoadingData(false)
  }, [demoMode, user])

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated && !demoMode) {
      router.push("/#auth")
      return
    }
    if (!demoMode && !isDeveloper && !isPrivileged) {
      router.push("/client")
      return
    }
    loadData()
  }, [isLoading, isAuthenticated, demoMode, isDeveloper, isPrivileged, router, loadData])

  const priorityColor = (p: string) => ({
    urgent: "#EF4444", high: "#F97316", normal: "#1E6BFF", low: "#64748B"
  } as Record<string, string>)[p] || "#64748B"

  const statusColor = (s: string) => ({
    todo: "#64748B", in_progress: "#1E6BFF", review: "#F59E0B", done: "#10B981"
  } as Record<string, string>)[s] || "#64748B"

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="animate-pulse text-sm" style={{ color: "var(--text-muted)" }}>Loading...</div>
    </div>
  }

  return (
    <DashboardShell title="Developer Panel" role="developer">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""} 👨‍💻
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Your workbench for today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard icon={CheckCircle2} label="My Tasks" value={stats.myTasks} />
        <StatCard icon={FolderKanban} label="Projects" value={stats.myProjects} />
        <StatCard icon={Bug} label="Open Bugs" value={stats.openBugs} accent="#EF4444" />
        <StatCard icon={Rocket} label="Deployments" value={stats.deployments} />
        <StatCard icon={AlertTriangle} label="Error Rate" value={stats.errorRate} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Activity className="w-4 h-4" style={{ color: "var(--accent)" }} /> My Tasks
          </h3>
          {loadingData ? <div className="text-sm text-white/40 py-6 text-center">Loading...</div> : tasks.length === 0 ? (
            <div className="text-sm text-white/40 py-6 text-center">No tasks assigned</div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: priorityColor(t.priority) }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{t.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.project || "—"} · {t.due}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full font-medium" style={{ background: statusColor(t.status) + "22", color: statusColor(t.status) }}>
                    {t.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Bug className="w-4 h-4 text-red-400" /> Assigned Bugs
          </h3>
          {loadingData ? <div className="text-sm text-white/40 py-6 text-center">Loading...</div> : bugs.length === 0 ? (
            <div className="text-sm text-white/40 py-6 text-center">No bugs assigned 🎉</div>
          ) : (
            <div className="space-y-3">
              {bugs.slice(0, 6).map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{b.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Severity: {b.severity}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full font-medium capitalize" style={{
                    background: (b.severity === "critical" ? "#EF4444" : b.severity === "high" ? "#F97316" : b.severity === "medium" ? "#F59E0B" : "#64748B") + "22",
                    color: b.severity === "critical" ? "#EF4444" : b.severity === "high" ? "#F97316" : b.severity === "medium" ? "#F59E0B" : "#64748B"
                  }}>{b.status.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Rocket className="w-4 h-4" /> Recent Deployments
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { name: "Production – v2.0.0", time: "2 days ago", status: "success" },
              { name: "Staging – hotfix/nav", time: "5 days ago", status: "success" },
              { name: "Preview – feat/dashboard", time: "1 week ago", status: "success" }
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div className="flex-1">
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{d.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{d.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <BarChart3 className="w-4 h-4" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Code2 className="w-4 h-4" />, label: "Error Logs" },
              { icon: <Database className="w-4 h-4" />, label: "DB Console" },
              { icon: <FileText className="w-4 h-4" />, label: "Docs" },
              { icon: <MessageSquare className="w-4 h-4" />, label: "Messages" }
            ].map((a, i) => (
              <button key={i} className="p-3 rounded-xl text-left transition-colors hover:opacity-80 flex items-center gap-2" style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}>
                {a.icon}
                <span className="text-sm font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  )
}
