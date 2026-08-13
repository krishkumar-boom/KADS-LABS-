"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/app/components/AuthProvider"
import DashboardShell from "@/components/dashboard/DashboardShell"
import StatCard from "@/components/dashboard/StatCard"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"
import {
  Users, Briefcase, FileText, MessageSquare, CheckCircle2,
  Clock, Eye, Mail, Calendar, TrendingUp
} from "lucide-react"

type CareerApp = {
  id: string
  position: string
  name: string
  email: string
  phone?: string
  city?: string
  experience_years?: string
  resume_url?: string
  portfolio_url?: string
  status: string
  created_at: string
}

export default function HRDashboard() {
  const { user, isAuthenticated, isLoading, isHR, demoMode } = useAuth()
  const router = useRouter()
  const [apps, setApps] = useState<CareerApp[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, new: 0, shortlisted: 0, hired: 0 })

  const load = useCallback(async () => {
    setLoading(true)
    if (demoMode || !hasSupabaseCredentials()) {
      const demo: CareerApp[] = [
        { id: "1", position: "Frontend Developer", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98xxx xxxxx", city: "Lucknow", experience_years: "3", status: "new", created_at: new Date(Date.now()-3600000).toISOString() },
        { id: "2", position: "UI/UX Designer", name: "Priya Verma", email: "priya@example.com", phone: "+91 99xxx xxxxx", city: "Delhi", experience_years: "2", status: "shortlisted", portfolio_url: "https://example.com", created_at: new Date(Date.now()-7200000).toISOString() },
        { id: "3", position: "Backend Developer", name: "Amit Kumar", email: "amit@example.com", city: "Bangalore", experience_years: "5", status: "interview", created_at: new Date(Date.now()-86400000).toISOString() },
      ]
      setApps(demo)
      setStats({ total: demo.length, new: 1, shortlisted: 1, hired: 0 })
      setLoading(false)
      return
    }
    try {
      const { data } = await supabase.from("career_applications").select("*").order("created_at", { ascending: false })
      const list = (data || []) as CareerApp[]
      setApps(list)
      setStats({
        total: list.length,
        new: list.filter(a => a.status === "new").length,
        shortlisted: list.filter(a => a.status === "shortlisted" || a.status === "interview").length,
        hired: list.filter(a => a.status === "hired").length,
      })
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [demoMode])

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !isHR) { router.push("/#auth"); return }
    load()
  }, [isLoading, isAuthenticated, isHR, router, load])

  const updateStatus = async (id: string, status: string) => {
    if (demoMode) { setApps(a => a.map(x => x.id === id ? { ...x, status } : x)); return }
    await supabase.from("career_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    load()
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center" style={{background:"var(--bg-primary)",color:"var(--text-muted)"}}>Loading...</div>

  return (
    <DashboardShell title="HR Dashboard" role="hr">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1" style={{color:"var(--text-primary)"}}>Talent Pipeline 👥</h2>
        <p className="text-sm" style={{color:"var(--text-muted)"}}>Review applications, schedule interviews, manage hiring.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Applications" value={stats.total} />
        <StatCard icon={Clock} label="New" value={stats.new} accent="#1E6BFF" />
        <StatCard icon={TrendingUp} label="In Pipeline" value={stats.shortlisted} accent="#F59E0B" />
        <StatCard icon={CheckCircle2} label="Hired" value={stats.hired} accent="#10B981" />
      </div>

      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-2xl p-5" style={{background:"var(--bg-card)",border:"1px solid var(--border)"}}>
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{color:"var(--text-primary)"}}>
          <Briefcase className="w-4 h-4" style={{color:"var(--accent)"}} /> Recent Applications
        </h3>
        {loading ? <div className="text-sm py-6 text-center" style={{color:"var(--text-muted)"}}>Loading...</div> : apps.length === 0 ? (
          <div className="text-sm py-6 text-center" style={{color:"var(--text-muted)"}}>No applications yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{color:"var(--text-muted)",borderBottom:"1px solid var(--border)"}}>
                  <th className="p-3 font-medium">Candidate</th>
                  <th className="p-3 font-medium">Position</th>
                  <th className="p-3 font-medium">Experience</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(a => (
                  <tr key={a.id} style={{borderBottom:"1px solid var(--border)"}}>
                    <td className="p-3">
                      <div className="font-medium" style={{color:"var(--text-primary)"}}>{a.name}</div>
                      <div className="text-xs flex items-center gap-1" style={{color:"var(--text-muted)"}}><Mail className="w-3 h-3"/>{a.email}</div>
                      {a.city && <div className="text-xs flex items-center gap-1" style={{color:"var(--text-muted)"}}><Calendar className="w-3 h-3"/>{a.city}</div>}
                    </td>
                    <td className="p-3" style={{color:"var(--text-primary)"}}>{a.position}</td>
                    <td className="p-3" style={{color:"var(--text-muted)"}}>{a.experience_years || "—"} yrs</td>
                    <td className="p-3">
                      <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}
                        className="px-2 py-1 rounded-lg text-xs" style={{background:"var(--bg-elevated)",color:"var(--text-primary)",border:"1px solid var(--border)"}}>
                        <option value="new">New</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {a.resume_url && (
                          <a href={a.resume_url} target="_blank" rel="noreferrer" title="View Resume" className="p-1.5 rounded hover:bg-white/10" style={{color:"var(--text-muted)"}}>
                            <FileText className="w-4 h-4"/>
                          </a>
                        )}
                        {a.portfolio_url && (
                          <a href={a.portfolio_url} target="_blank" rel="noreferrer" title="Portfolio" className="p-1.5 rounded hover:bg-white/10" style={{color:"var(--text-muted)"}}>
                            <Eye className="w-4 h-4"/>
                          </a>
                        )}
                        <a href={`mailto:${a.email}`} title="Email" className="p-1.5 rounded hover:bg-white/10" style={{color:"var(--text-muted)"}}>
                          <MessageSquare className="w-4 h-4"/>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </DashboardShell>
  )
}
