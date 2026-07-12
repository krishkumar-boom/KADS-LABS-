"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Ticket, listTickets, replyToTicket, updateTicketStatus } from "@/lib/tickets"
import { TicketIcon, RefreshCw, CheckCircle } from "lucide-react"

const statuses = ["open", "in_progress", "resolved", "closed"] as const

export default function TicketsPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [replyTarget, setReplyTarget] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await listTickets()
    setTickets(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleStatus = async (id: string, status: typeof statuses[number]) => {
    await updateTicketStatus(id, status)
    await load()
  }

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return
    await replyToTicket(id, replyText, "Support Team")
    setReplyText("")
    setReplyTarget(null)
    await load()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Support Tickets</h2>
          <p className="text-sm text-white/60 mt-1">Reply to tickets and update their status.</p>
        </div>
        <button onClick={load} className="btn-outline px-4 py-2 text-sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</button>
      </div>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <TicketIcon className="w-12 h-12 mx-auto mb-4 text-white/20" />
          <p>No tickets yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          {tickets.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold">{t.subject}</h4>
                  <p className="text-xs text-white/50">{t.email} · Priority: {t.priority}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-electric/20 text-electric-light capitalize">{t.status}</span>
              </div>
              <p className="text-sm text-white/60 mb-3">{t.message}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatus(t.id, s)}
                    className={`px-2 py-1 rounded text-xs border ${t.status === s ? "bg-electric border-electric text-white" : "border-white/10 text-white/60 hover:border-electric/40"}`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
              {t.replies && t.replies.length > 0 && (
                <div className="space-y-2 mb-3 pl-3 border-l-2 border-electric/30">
                  {t.replies.map((r) => (
                    <div key={r.id} className="text-sm p-2 rounded bg-white/5">
                      <p className="text-white/80">{r.text}</p>
                      <p className="text-xs text-white/40">{r.author} · {new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
              {replyTarget === t.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a reply..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleReply(t.id)}
                  />
                  <button onClick={() => handleReply(t.id)} className="px-3 py-2 rounded-lg bg-electric text-white text-sm"><CheckCircle className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => setReplyTarget(t.id)} className="text-sm text-electric-light hover:underline">Reply</button>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
