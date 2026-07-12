"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { EmailTemplate, getEmailTemplates } from "@/lib/email"
import { Mail, RefreshCw } from "lucide-react"

export default function EmailTemplatesPanel() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getEmailTemplates()
    setTemplates(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Email Templates</h2>
          <p className="text-sm text-white/60 mt-1">Templates used by the automatic email system (Resend/Brevo via Edge Function).</p>
        </div>
        <button onClick={load} className="btn-outline px-4 py-2 text-sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</button>
      </div>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <Mail className="w-12 h-12 mx-auto mb-4 text-white/20" />
          <p>No templates configured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map((t) => (
            <div key={t.key} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">{t.key}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${t.isActive ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/50"}`}>{t.isActive ? "Active" : "Inactive"}</span>
              </div>
              <p className="text-sm text-white/60 mb-1">Subject: {t.subject}</p>
              <p className="text-sm text-white/50">From: {t.fromAddress}</p>
              <pre className="mt-3 p-3 rounded-lg bg-navy-950/80 text-xs text-white/60 whitespace-pre-wrap">{t.body}</pre>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
