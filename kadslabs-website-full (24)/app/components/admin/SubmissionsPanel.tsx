"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ContactSubmission, Note } from "@/lib/content"
import { listLeads, updateLeadStatus, addLeadNote, LEAD_STATUSES, sendConfirmationEmail } from "@/lib/crm"
import { Users, RefreshCw, MessageSquare, Send, CheckCircle, ChevronDown } from "lucide-react"

export default function SubmissionsPanel() {
  const [leads, setLeads] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<ContactSubmission["status"] | "all">("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")
  const [authorName, setAuthorName] = useState("Admin")

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await listLeads({
      page,
      limit: 20,
      status: statusFilter === "all" ? undefined : statusFilter,
      search: search || undefined
    })
    setLeads(data)
    setLoading(false)
  }, [page, statusFilter, search])

  useEffect(() => {
    load()
  }, [load])

  const handleStatusChange = async (leadId: string, status: ContactSubmission["status"]) => {
    await updateLeadStatus(leadId, status)
    await load()
  }

  const handleAddNote = async (leadId: string) => {
    if (!noteText.trim()) return
    await addLeadNote(leadId, { text: noteText, author: authorName || "Admin" })
    setNoteText("")
    await load()
  }

  const handleConfirmation = async (lead: ContactSubmission) => {
    const result = await sendConfirmationEmail(lead)
    if (result.error) alert(result.error)
    else alert("Confirmation email sent (or queued if webhook configured).")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 sm:p-8 glow-border"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Contact Submissions & CRM</h2>
          <p className="text-sm text-white/60 mt-1">Manage leads, track status, add internal notes, and send confirmation emails.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search leads..."
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-electric"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as ContactSubmission["status"] | "all"); setPage(1) }}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-electric"
          >
            <option value="all" className="bg-navy-900">All Statuses</option>
            {LEAD_STATUSES.map(s => <option key={s.value} value={s.value} className="bg-navy-900">{s.label}</option>)}
          </select>
          <button onClick={load} className="btn-outline px-4 py-2 text-sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</button>
        </div>
      </div>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : leads.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <Users className="w-12 h-12 mx-auto mb-4 text-white/20" />
          <p>No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          {leads.map((lead) => (
            <div key={lead.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold">{lead.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${LEAD_STATUSES.find(s => s.value === lead.status)?.color || "bg-gray-500"}`}>
                    {LEAD_STATUSES.find(s => s.value === lead.status)?.label || lead.status}
                  </span>
                </div>
                <span className="text-xs text-white/50">{new Date(lead.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-white/70 mb-2">{lead.message}</p>
              <div className="flex flex-wrap gap-3 text-xs text-white/50 mb-3">
                <span>{lead.email}</span>
                <span>{lead.phone}</span>
                {lead.company && <span>{lead.company}</span>}
                <span className="text-electric-light">{lead.service}</span>
                <span>{lead.budget}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {LEAD_STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(lead.id, s.value)}
                    className={`px-2 py-1 rounded text-xs border ${lead.status === s.value ? "bg-electric border-electric text-white" : "border-white/10 text-white/60 hover:border-electric/40"}`}
                  >
                    {s.label}
                  </button>
                ))}
                <button onClick={() => handleConfirmation(lead)} className="px-2 py-1 rounded text-xs border border-white/10 text-white/60 hover:border-electric/40 flex items-center gap-1">
                  <Send className="w-3 h-3" /> Confirm
                </button>
                <button onClick={() => setExpanded(expanded === lead.id ? null : lead.id)} className="px-2 py-1 rounded text-xs border border-white/10 text-white/60 hover:border-electric/40 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> Notes ({lead.notes?.length || 0}) <ChevronDown className={`w-3 h-3 transition-transform ${expanded === lead.id ? "rotate-180" : ""}`} />
                </button>
              </div>
              {expanded === lead.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="space-y-2 mb-3">
                    {(lead.notes || []).map((note: Note) => (
                      <div key={note.id} className="p-2 rounded-lg bg-white/5 text-sm">
                        <p className="text-white/80">{note.text}</p>
                        <p className="text-xs text-white/40 mt-1">{note.author} · {new Date(note.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Author"
                      className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm w-32"
                    />
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add an internal note..."
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                      onKeyDown={(e) => e.key === "Enter" && handleAddNote(lead.id)}
                    />
                    <button onClick={() => handleAddNote(lead.id)} className="px-3 py-2 rounded-lg bg-electric text-white text-sm"><CheckCircle className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
