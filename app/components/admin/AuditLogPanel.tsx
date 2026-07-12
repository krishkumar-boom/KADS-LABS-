"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { AuditLog, listAuditLogs } from "@/lib/audit"
import { Shield, RefreshCw } from "lucide-react"

export default function AuditLogPanel() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await listAuditLogs({ limit: 200 })
    setLogs(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Audit Log</h2>
          <p className="text-sm text-white/60 mt-1">Recent actions across the system.</p>
        </div>
        <button onClick={load} className="btn-outline px-4 py-2 text-sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</button>
      </div>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <Shield className="w-12 h-12 mx-auto mb-4 text-white/20" />
          <p>No audit logs yet.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[700px] overflow-y-auto pr-2">
          {logs.map((log) => (
            <div key={log.id} className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-electric-light">{log.action}</span>
                <span className="text-xs text-white/40">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-white/60">Resource: {log.resource}</p>
              <p className="text-white/40 text-xs">User: {log.email || log.userId || "Anonymous"}</p>
              {log.details && <p className="text-white/30 text-xs mt-1">{JSON.stringify(log.details)}</p>}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
