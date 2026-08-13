"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "../components/AuthProvider"
import DashboardShell from "@/components/dashboard/DashboardShell"
import StatCard from "@/components/dashboard/StatCard"
import { listClientProjects, listClientInvoices, listClientTickets, ClientProject, ClientInvoice, ClientTicket } from "@/lib/client"
import {
  Briefcase, FileText, Ticket as TicketIcon, CheckCircle2,
  MessageSquare, Folder, Receipt
} from "lucide-react"

export default function ClientPortal() {
  const { user, isAuthenticated, isLoading, isClient, isPrivileged, demoMode } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<ClientProject[]>([])
  const [invoices, setInvoices] = useState<ClientInvoice[]>([])
  const [tickets, setTickets] = useState<ClientTicket[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    const uid = user.id
    const email = user.email || ""
    const [p, i, t] = await Promise.all([
      listClientProjects(uid, email),
      listClientInvoices(uid, email),
      listClientTickets(uid, email),
    ])
    setProjects(p); setInvoices(i); setTickets(t)
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) { router.replace("/#auth"); return }
    if (!demoMode && !isClient && !isPrivileged) { router.replace("/"); return }
    load()
  }, [isLoading, isAuthenticated, isClient, isPrivileged, demoMode, router, load])

  const statusColor = (s: string) => ({
    planning: "#64748B", in_progress: "#1E6BFF", review: "#F59E0B",
    deployed: "#8B5CF6", completed: "#10B981", paused: "#EF4444",
    draft: "#64748B", sent: "#1E6BFF", viewed: "#F59E0B", paid: "#10B981", overdue: "#EF4444", cancelled: "#64748B",
    new: "#1E6BFF", assigned: "#F59E0B", resolved: "#10B981", closed: "#64748B",
  } as Record<string, string>)[s] || "#64748B"

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)", color: "var(--text-muted)" }}>Loading...</div>
  }

  return (
    <DashboardShell title="Client Portal" role="client">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Welcome{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""} 👋
        </h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Track your projects, invoices, and support tickets.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Briefcase} label="Active Projects" value={projects.filter(p => !["completed","cancelled"].includes(p.status)).length} />
        <StatCard icon={Receipt} label="Open Invoices" value={invoices.filter(i => !["paid","cancelled"].includes(i.status)).length} accent="#F59E0B" />
        <StatCard icon={TicketIcon} label="Open Tickets" value={tickets.filter(t => !["resolved","closed"].includes(t.status)).length} />
        <StatCard icon={CheckCircle2} label="Completed" value={projects.filter(p => p.status === "completed").length} accent="#10B981" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="rounded-2xl p-5" style={{background:"var(--bg-card)",border:"1px solid var(--border)"}}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{color:"var(--text-primary)"}}>
            <Folder className="w-4 h-4" style={{color:"var(--accent)"}}/> My Projects
          </h3>
          {loading ? <div className="text-sm text-white/40 py-6 text-center">Loading...</div> : projects.length === 0 ? (
            <div className="text-sm text-white/40 py-6 text-center">No projects yet</div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0,5).map(p => (
                <div key={p.id} className="p-3 rounded-xl" style={{background:"var(--bg-elevated)"}}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium" style={{color:"var(--text-primary)"}}>{p.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize" style={{background:statusColor(p.status)+"22",color:statusColor(p.status)}}>{p.status.replace("_"," ")}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 mb-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{width:`${p.progress||0}%`,background:"var(--brand-electric)"}}/>
                  </div>
                  <p className="text-xs" style={{color:"var(--text-muted)"}}>{p.progress||0}% complete {p.deadline && `· Due ${new Date(p.deadline).toLocaleDateString()}`}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="rounded-2xl p-5" style={{background:"var(--bg-card)",border:"1px solid var(--border)"}}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{color:"var(--text-primary)"}}>
            <Receipt className="w-4 h-4" style={{color:"var(--accent)"}}/> Invoices
          </h3>
          {loading ? <div className="text-sm text-white/40 py-6 text-center">Loading...</div> : invoices.length === 0 ? (
            <div className="text-sm text-white/40 py-6 text-center">No invoices yet</div>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0,5).map(inv => (
                <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:"var(--bg-elevated)"}}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:statusColor(inv.status)+"22"}}>
                    <FileText className="w-4 h-4" style={{color:statusColor(inv.status)}}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{color:"var(--text-primary)"}}>{inv.invoice_number}</p>
                    <p className="text-xs" style={{color:"var(--text-muted)"}}>₹{inv.amount?.toLocaleString?.() || inv.amount} · Due {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "—"}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize" style={{background:statusColor(inv.status)+"22",color:statusColor(inv.status)}}>{inv.status}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="rounded-2xl p-5 lg:col-span-2" style={{background:"var(--bg-card)",border:"1px solid var(--border)"}}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{color:"var(--text-primary)"}}>
            <MessageSquare className="w-4 h-4" style={{color:"var(--accent)"}}/> Support Tickets
          </h3>
          {loading ? <div className="text-sm text-white/40 py-6 text-center">Loading...</div> : tickets.length === 0 ? (
            <div className="text-sm text-white/40 py-6 text-center">No support tickets</div>
          ) : (
            <div className="space-y-2">
              {tickets.slice(0,8).map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:"var(--bg-elevated)"}}>
                  <TicketIcon className="w-4 h-4" style={{color:statusColor(t.status)}}/>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{color:"var(--text-primary)"}}>{t.subject}</p>
                    <p className="text-xs" style={{color:"var(--text-muted)"}}>{t.ticket_id} · {new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize" style={{background:statusColor(t.status)+"22",color:statusColor(t.status)}}>{t.status.replace("_"," ")}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardShell>
  )
}
