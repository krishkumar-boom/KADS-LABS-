"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { QuoteRequest, listQuoteRequests, updateQuoteStatus } from "@/lib/quotes"
import { FileText, RefreshCw } from "lucide-react"

const statuses = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const

export default function QuoteRequestsPanel() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await listQuoteRequests()
    setQuotes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleStatus = async (id: string, status: typeof statuses[number]) => {
    await updateQuoteStatus(id, status)
    await load()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Quote Requests</h2>
          <p className="text-sm text-white/60 mt-1">Manage quote requests from potential clients.</p>
        </div>
        <button onClick={load} className="btn-outline px-4 py-2 text-sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</button>
      </div>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : quotes.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <FileText className="w-12 h-12 mx-auto mb-4 text-white/20" />
          <p>No quote requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
          {quotes.map((q) => (
            <div key={q.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold">{q.name}</h4>
                  <p className="text-xs text-white/50">{q.email} · {q.company}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-electric/20 text-electric-light capitalize">{q.status}</span>
              </div>
              <p className="text-sm text-white/70 mb-2"><FileText className="w-4 h-4 inline mr-1" /> {q.service} · {q.budget}</p>
              <p className="text-sm text-white/60 mb-3">{q.details}</p>
              <div className="flex flex-wrap gap-2">
                {statuses.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatus(q.id, s)}
                    className={`px-2 py-1 rounded text-xs border ${q.status === s ? "bg-electric border-electric text-white" : "border-white/10 text-white/60 hover:border-electric/40"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
