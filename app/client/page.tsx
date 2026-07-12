"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../components/AuthProvider"
import { listProjects, ClientProject } from "@/lib/client"
import { listTickets, Ticket } from "@/lib/tickets"
import { ArrowLeft, Briefcase, Ticket as TicketIcon, LogOut } from "lucide-react"
import ThemeToggle from "../components/ThemeToggle"
import LanguageToggle from "../components/LanguageToggle"

export default function ClientPortal() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<ClientProject[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/")
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (!user?.id) return
    const load = async () => {
      const [p, t] = await Promise.all([listProjects(user.id), listTickets(user.id)])
      setProjects(p)
      setTickets(t)
    }
    load()
  }, [user])

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white/60">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-12">
      <div className="max-w-[1200px] mx-auto section-padding">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/")} className="text-white/60 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to website
          </button>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <button onClick={() => { signOut(); router.replace("/") }} className="btn-outline text-sm flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Client Portal</h1>
        <p className="text-white/60 mb-8">Welcome back, {user?.email}</p>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="premium-card p-6 glow-border">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-electric" />
              <h2 className="font-bold text-lg">Your Projects</h2>
            </div>
            {projects.length === 0 ? (
              <p className="text-white/50">No projects assigned yet.</p>
            ) : (
              <div className="space-y-4">
                {projects.map(p => (
                  <div key={p.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{p.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-electric/20 text-electric-light capitalize">{p.status}</span>
                    </div>
                    <p className="text-sm text-white/60 mb-2">{p.description}</p>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-electric" style={{ width: `${p.progress}%` }} />
                    </div>
                    <p className="text-xs text-white/40 mt-1">{p.progress}% complete</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="premium-card p-6 glow-border">
            <div className="flex items-center gap-2 mb-4">
              <TicketIcon className="w-5 h-5 text-electric" />
              <h2 className="font-bold text-lg">Your Tickets</h2>
            </div>
            {tickets.length === 0 ? (
              <p className="text-white/50">No tickets yet.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map(t => (
                  <div key={t.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="font-medium text-sm">{t.subject}</p>
                    <p className="text-xs text-white/50 mt-1">Status: <span className="capitalize text-electric-light">{t.status}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
