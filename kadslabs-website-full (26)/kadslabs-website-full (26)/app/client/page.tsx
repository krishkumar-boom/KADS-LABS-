"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "../components/AuthProvider"
import DashboardShell from "@/components/dashboard/DashboardShell"
import { listClientProjects, listClientInvoices, listClientTickets, ClientProject, ClientInvoice, ClientTicket } from "@/lib/client"
import {
  Briefcase, FileText, Ticket as TicketIcon, CheckCircle2,
  MessageSquare, Folder, Receipt, Wallet, Calendar, Clock,
  IndianRupee, TrendingUp, CircleAlert, Sparkles, ArrowRight, Shield, Zap, Star
} from "lucide-react"

// Blue accent palette (client)
const ACCENT = "#33B5FF"
const ACCENT_DEEP = "#1E6BFF"
const GREEN = "#10B981"
const AMBER = "#F59E0B"
const RED = "#EF4444"
const PURPLE = "#8B5CF6"

function KPI({ icon: Icon, label, value, sub, accent = ACCENT, trend, subColor }: any) {
  return (
    <motion.div initial={{ opacity:0,y:12 }} whileInView={{opacity:1,y:0}} viewport={{once:true}}
      className="relative rounded-xl p-4 overflow-hidden"
      style={{
        background:"linear-gradient(145deg, rgba(11,23,41,0.9), rgba(7,15,35,0.95))",
        border:`1px solid ${accent}33`,
        boxShadow:`0 10px 28px -18px ${accent}77`
      }}>
      <div aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl pointer-events-none"
           style={{background:`radial-gradient(closest-side, ${accent}33, transparent)`}}/>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
             style={{background:`radial-gradient(circle, ${accent}25, ${accent}0d)`, border:`1px solid ${accent}4d`}}>
          <Icon className="w-5 h-5" style={{color:accent}}/>
        </div>
        {trend && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
            style={{background:`${GREEN}15`, color:GREEN, border:`1px solid ${GREEN}33`}}>
            <TrendingUp className="w-2.5 h-2.5"/> {trend}
          </span>
        )}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{color:"rgba(255,255,255,0.5)"}}>{label}</p>
      <p className="text-2xl font-extrabold text-white tracking-tight leading-none mt-1"
         style={{fontFamily:"'Space Grotesk', sans-serif"}}>{value}</p>
      {sub && <p className="text-[10px] mt-1" style={{color: subColor || "rgba(255,255,255,0.5)"}}>{sub}</p>}
    </motion.div>
  )
}

function Section({ title, icon: Icon, action, children, accent=ACCENT }: any) {
  return (
    <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
      className="relative rounded-xl p-5 overflow-hidden"
      style={{
        background:"linear-gradient(145deg, rgba(11,23,41,0.85), rgba(7,15,35,0.92))",
        border:`1px solid ${accent}22`
      }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2" style={{fontFamily:"'Space Grotesk', sans-serif"}}>
          <Icon className="w-4 h-4" style={{color:accent}}/> {title}
        </h3>
        {action}
      </div>
      {children}
    </motion.div>
  )
}

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
    planning: "#64748B", in_progress: ACCENT_DEEP, review: AMBER,
    deployed: PURPLE, completed: GREEN, paused: RED,
    draft: "#64748B", sent: ACCENT_DEEP, viewed: AMBER, paid: GREEN, overdue: RED, cancelled: "#64748B",
    new: ACCENT_DEEP, assigned: AMBER, resolved: GREEN, closed: "#64748B",
  } as Record<string, string>)[s] || "#64748B"

  const openInvoices = invoices.filter(i => !["paid","cancelled"].includes(i.status))
  const paidInvoices = invoices.filter(i => i.status === "paid")
  const totalPaid = paidInvoices.reduce((s,i)=>s + (Number(i.amount) || 0), 0)
  const totalOutstanding = openInvoices.reduce((s,i)=>s + (Number(i.amount) || 0), 0)
  const activeProjects = projects.filter(p => !["completed","cancelled"].includes(p.status))
  const completedProjects = projects.filter(p => p.status === "completed")
  const openTickets = tickets.filter(t => !["resolved","closed"].includes(t.status))
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((s,p)=>s + (Number(p.progress) || 0),0)/projects.length) : 0
  const clientDate = (user as any)?.created_at || (user as any)?.metadata?.createdAt
  const clientSince = clientDate
    ? new Date(clientDate).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
    : "—"

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center" style={{background:"var(--bg-primary)", color:"var(--text-muted)"}}>Loading...</div>
  }

  return (
    <DashboardShell title="Client Dashboard" role="client">
      {/* Welcome */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight"
            style={{fontFamily:"'Space Grotesk', sans-serif"}}>
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""} 👋
          </h2>
          <p className="text-sm" style={{color:"rgba(255,255,255,0.6)"}}>
            Track your projects, invoices, payments and support tickets in one place.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold self-start"
             style={{background:`${AMBER}15`, border:`1px solid ${AMBER}33`, color: AMBER}}>
          <Star className="w-3.5 h-3.5"/> Premium Client
        </div>
      </div>

      {/* 5 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <KPI icon={Briefcase} label="Total Projects"
             value={activeProjects.length} sub={projects.length ? `${projects.length} total` : "No projects yet"}
             accent={ACCENT_DEEP}/>
        <KPI icon={Wallet} label="Total Spent"
             value={totalPaid > 0 ? `₹${(totalPaid/1000).toFixed(totalPaid >= 100000 ? 1 : 0)}${totalPaid >= 100000 ? "L" : "K"}` : "—"}
             sub={paidInvoices.length ? "Total Amount Paid" : "No payments yet"}
             accent={GREEN}/>
        <KPI icon={CircleAlert} label="Outstanding"
             value={totalOutstanding > 0 ? `₹${(totalOutstanding/1000).toFixed(totalOutstanding >= 100000 ? 1 : 0)}${totalOutstanding >= 100000 ? "L" : "K"}` : "₹0"}
             sub={totalOutstanding > 0 ? "Due for Payment" : "All cleared"}
             accent={RED} subColor={totalOutstanding > 0 ? "#FCA5A5" : "rgba(255,255,255,0.5)"}/>
        <KPI icon={TrendingUp} label="Project Progress"
             value={`${avgProgress}%`} sub="Average Completion"
             accent={PURPLE} trend="on track"/>
        <KPI icon={Calendar} label="Client Since"
             value={clientSince !== "—" ? clientSince.split(" ")[1] || "—" : "—"}
             sub={clientSince !== "—" ? clientSince : "Welcome aboard!"}
             accent={AMBER}/>
      </div>

      {/* Row 2: My Projects + Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Section title="My Projects" icon={Folder} className="lg:col-span-2"
          action={
            <button className="text-[11px] font-semibold flex items-center gap-1" style={{color:ACCENT}}>
              View All Projects <ArrowRight className="w-3 h-3"/>
            </button>
          }>
          {loading ? (
            <div className="text-sm py-8 text-center" style={{color:"rgba(255,255,255,0.4)"}}>Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2" style={{color:ACCENT, opacity:0.5}}/>
              <p className="text-xs" style={{color:"rgba(255,255,255,0.5)"}}>No projects yet. Start your first project with us!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.slice(0,4).map(p => {
                const c = statusColor(p.status)
                return (
                  <div key={p.id} className="relative p-3 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{background:"rgba(255,255,255,0.03)", border:`1px solid ${c}33`}}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{background:`${c}22`, border:`1px solid ${c}55`}}>
                        <Briefcase className="w-4 h-4" style={{color:c}}/>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{background:`${c}22`, color:c}}>{p.status.replace("_"," ")}</span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-tight mb-1 line-clamp-1">{p.name}</p>
                    <p className="text-[10px] mb-2" style={{color:"rgba(255,255,255,0.5)"}}>
                      {p.type || "Project"} {p.deadline && `· Due ${new Date(p.deadline).toLocaleDateString("en-IN", {day:"2-digit", month:"short"})}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.06)"}}>
                        <div className="h-full rounded-full" style={{width:`${p.progress||0}%`, background:`linear-gradient(90deg, ${c}, ${ACCENT})`}}/>
                      </div>
                      <span className="text-[10px] font-bold" style={{color:c}}>{p.progress||0}%</span>
                    </div>
                    <button className="mt-2 w-full text-[11px] font-semibold py-1.5 rounded-md transition-colors hover:brightness-125"
                      style={{background:`${c}15`, color:c, border:`1px solid ${c}33`}}>
                      View Details
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </Section>

        <Section title="Invoices & Payments" icon={Receipt}
          action={
            <button className="text-[11px] font-semibold flex items-center gap-1" style={{color:ACCENT}}>
              View All <ArrowRight className="w-3 h-3"/>
            </button>
          }>
          {loading ? (
            <div className="text-sm py-8 text-center" style={{color:"rgba(255,255,255,0.4)"}}>Loading...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 mx-auto mb-2" style={{color:ACCENT, opacity:0.5}}/>
              <p className="text-xs" style={{color:"rgba(255,255,255,0.5)"}}>No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.slice(0,5).map(inv => {
                const c = statusColor(inv.status)
                return (
                  <div key={inv.id} className="flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                         style={{background:`${c}22`, border:`1px solid ${c}44`}}>
                      <FileText className="w-4 h-4" style={{color:c}}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-mono font-semibold text-white truncate">{inv.invoice_number}</p>
                        <p className="text-xs font-bold" style={{color:c}}>
                          ₹{Number(inv.amount || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <p className="text-[10px] flex items-center gap-1" style={{color:"rgba(255,255,255,0.5)"}}>
                        <Clock className="w-2.5 h-2.5"/>
                        {inv.due_date ? `Due ${new Date(inv.due_date).toLocaleDateString("en-IN", {day:"2-digit", month:"short"})}` : "—"}
                      </p>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded capitalize shrink-0"
                      style={{background:`${c}22`, color:c}}>{inv.status}</span>
                  </div>
                )
              })}
              {invoices.some(i => ["sent","viewed","overdue","draft"].includes(i.status)) && (
                <button className="w-full mt-2 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110"
                  style={{background:`linear-gradient(135deg, ${ACCENT_DEEP}, ${ACCENT})`, boxShadow:`0 8px 20px ${ACCENT_DEEP}55`}}>
                  <IndianRupee className="w-3 h-3 inline mr-1"/> Pay Now
                </button>
              )}
            </div>
          )}
        </Section>
      </div>

      {/* Row 3: Tickets + Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Support Tickets" icon={TicketIcon} className="lg:col-span-2"
          action={
            <button className="text-[11px] font-semibold flex items-center gap-1" style={{color:ACCENT}}>
              Create New Ticket <ArrowRight className="w-3 h-3"/>
            </button>
          }>
          {loading ? (
            <div className="text-sm py-6 text-center" style={{color:"rgba(255,255,255,0.4)"}}>Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{color:GREEN, opacity:0.5}}/>
              <p className="text-xs" style={{color:"rgba(255,255,255,0.5)"}}>No support tickets — everything looks good! 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tickets.slice(0,6).map(t => {
                const c = statusColor(t.status)
                return (
                  <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                         style={{background:`${c}22`, border:`1px solid ${c}44`}}>
                      <TicketIcon className="w-3.5 h-3.5" style={{color:c}}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{t.subject}</p>
                      <p className="text-[10px] flex items-center gap-1.5" style={{color:"rgba(255,255,255,0.5)"}}>
                        <span className="font-mono">{t.ticket_id}</span>
                        <span>·</span>
                        <Clock className="w-2.5 h-2.5"/>
                        {new Date(t.created_at).toLocaleDateString("en-IN", {day:"2-digit", month:"short"})}
                      </p>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded capitalize shrink-0"
                      style={{background:`${c}22`, color:c}}>{t.status.replace("_"," ")}</span>
                  </div>
                )
              })}
            </div>
          )}
        </Section>

        <Section title="Need Help?" icon={MessageSquare} accent={PURPLE}>
          <div className="space-y-3">
            {[
              {icon: Shield, label: "Dedicated Manager", desc: "We ensure your success", color: ACCENT},
              {icon: Zap,    label: "Priority Support", desc: "Fast response & resolution", color: AMBER},
              {icon: Star,   label: "Satisfaction Guaranteed", desc: "100% client satisfaction", color: GREEN},
            ].map((v,i) => {
              const V = v.icon
              return (
                <div key={v.label} className="flex items-start gap-3 p-2.5 rounded-lg"
                  style={{background:"rgba(255,255,255,0.03)", border:`1px solid ${v.color}22`}}>
                  <V className="w-4 h-4 shrink-0 mt-0.5" style={{color:v.color}}/>
                  <div>
                    <p className="text-xs font-semibold text-white">{v.label}</p>
                    <p className="text-[10px]" style={{color:"rgba(255,255,255,0.55)"}}>{v.desc}</p>
                  </div>
                </div>
              )
            })}
            <button className="w-full py-2.5 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110 flex items-center justify-center gap-1.5"
              style={{background:`linear-gradient(135deg, ${ACCENT_DEEP}, ${ACCENT})`, boxShadow:`0 8px 20px ${ACCENT_DEEP}55`}}>
              <MessageSquare className="w-3.5 h-3.5"/> Contact Support
            </button>
          </div>
        </Section>
      </div>
    </DashboardShell>
  )
}
