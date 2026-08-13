"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, User, Briefcase, FileText, Ticket, Receipt, Users, ChevronRight, X, Loader2
} from "lucide-react"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type ResultType = "user" | "client" | "developer" | "project" | "ticket" | "career" | "invoice" | "message"

interface SearchResult {
  id: string
  type: ResultType
  title: string
  subtitle?: string
  href?: string
}

const iconMap: Record<ResultType, any> = {
  user: User, client: Users, developer: User, project: Briefcase,
  ticket: Ticket, career: FileText, invoice: Receipt, message: FileText
}

const colorMap: Record<ResultType, string> = {
  user: "#33B5FF", client: "#10B981", developer: "#8B5CF6", project: "#0EA5E9",
  ticket: "#EF4444", career: "#F59E0B", invoice: "#EC4899", message: "#1E6BFF"
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!q.trim() || q.length < 2) { setResults([]); return }
    setLoading(true)
    const t = setTimeout(() => runSearch(q.trim()), 250)
    return () => clearTimeout(t)
  }, [q])

  async function runSearch(query: string) {
    if (!hasSupabaseCredentials()) {
      // Demo results
      setResults(([
        { id: "d1", type: "ticket" as ResultType, title: "TCK-000023 — SaaS platform inquiry", subtitle: "Priya Patel • New", href: "#tickets" },
        { id: "d2", type: "career" as ResultType, title: "Frontend Developer — Rahul Sharma", subtitle: "New application", href: "#careers" },
        { id: "d3", type: "project" as ResultType, title: "AI Customer Support Bot", subtitle: "In progress • 65%", href: "#projects" },
        { id: "d4", type: "client" as ResultType, title: "TechCorp Pvt Ltd", subtitle: "2 active projects", href: "#clients" },
        { id: "d5", type: "invoice" as ResultType, title: "INV-01027 — CloudScale", subtitle: "₹120,000 • Sent", href: "#invoices" }
      ] as SearchResult[]).filter(r => r.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8))
      setLoading(false)
      return
    }
    try {
      // Parallel searches across tables
      const [tickets, projects, profiles, careers, invoices] = await Promise.all([
        supabase.from("tickets").select("id,ticket_id,subject,name,email,status").ilike("subject", `%${query}%`).limit(5),
        supabase.from("projects").select("id,name,client_name,status").ilike("name", `%${query}%`).limit(5),
        supabase.from("profiles").select("id,email,full_name,role,company").or(`full_name.ilike.%${query}%,email.ilike.%${query}%`).limit(5),
        supabase.from("career_applications").select("id,name,position,status").ilike("name", `%${query}%`).limit(3),
        supabase.from("invoices").select("id,invoice_number,client_name,amount,status").ilike("client_name", `%${query}%`).limit(3)
      ])
      const merged: SearchResult[] = []
      tickets.data?.forEach((t: any) => merged.push({
        id: "t-" + t.id, type: "ticket",
        title: `${t.ticket_id} — ${t.subject}`,
        subtitle: `${t.name || t.email} • ${t.status}`,
        href: `#tickets`
      }))
      projects.data?.forEach((p: any) => merged.push({
        id: "p-" + p.id, type: "project",
        title: p.name, subtitle: `${p.client_name || "—"} • ${p.status}`, href: "#projects"
      }))
      profiles.data?.forEach((u: any) => merged.push({
        id: "u-" + u.id,
        type: u.role === "client" ? "client" : u.role === "developer" ? "developer" : "user",
        title: u.full_name || u.email, subtitle: `${u.role}${u.company ? " • " + u.company : ""}`,
        href: u.role === "client" ? "#clients" : "#developers"
      }))
      careers.data?.forEach((c: any) => merged.push({
        id: "c-" + c.id, type: "career",
        title: `${c.name} — ${c.position}`, subtitle: c.status, href: "#careers"
      }))
      invoices.data?.forEach((i: any) => merged.push({
        id: "i-" + i.id, type: "invoice",
        title: `${i.invoice_number} — ${i.client_name}`,
        subtitle: `₹${i.amount} • ${i.status}`, href: "#invoices"
      }))
      setResults(merged.slice(0, 10))
    } catch (e) {
      setResults([])
    }
    setLoading(false)
  }

  function navigate(r: SearchResult) {
    setOpen(false)
    setQ("")
    if (r.href?.startsWith("#")) {
      const el = document.querySelector(r.href)
      el?.scrollIntoView({ behavior: "smooth" })
    } else if (r.href) {
      router.push(r.href)
    }
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg w-64 text-xs transition-colors"
        style={{ background: "var(--bg-tertiary)", color: "var(--text-subtle)", border: "1px solid var(--border-subtle)" }}
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="text-[9px] px-1 rounded border" style={{ borderColor: "var(--border-subtle)" }}>⌘K</kbd>
      </button>
      <button onClick={() => setOpen(true)} className="md:hidden p-2 rounded-lg">
        <Search className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-start justify-center pt-20 px-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-3 flex items-center gap-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                <Search className="w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                <input
                  ref={inputRef} type="text" value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search users, clients, projects, tickets, invoices..."
                  className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--text-primary)" }}
                  autoFocus
                />
                {loading ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--text-subtle)" }} /> :
                  q && <button onClick={() => setQ("")}><X className="w-4 h-4" style={{ color: "var(--text-subtle)" }} /></button>}
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                {results.length === 0 && q.length >= 2 && !loading && (
                  <div className="p-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>No results found</div>
                )}
                {!q && (
                  <div className="p-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    Type to search across everything in your dashboard.
                  </div>
                )}
                {results.map(r => {
                  const Icon = iconMap[r.type]
                  const color = colorMap[r.type]
                  return (
                    <button key={r.id} onClick={() => navigate(r)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors hover:bg-white/5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                           style={{ background: `${color}20` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{r.title}</div>
                        {r.subtitle && <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{r.subtitle}</div>}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--text-subtle)" }} />
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
