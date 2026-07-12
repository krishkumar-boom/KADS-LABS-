"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useContent } from "../ContentProvider"
import { Download, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { hasSupabaseCredentials } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"

export default function BackupRestore() {
  const { siteData, refresh } = useContent()
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [importing, setImporting] = useState(false)

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(siteData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kadslabs-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setMessage({ text: "Backup downloaded successfully", type: "success" })
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setMessage(null)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (hasSupabaseCredentials()) {
        const rows = Object.entries(parsed).map(([key, value]) => ({
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        }))
        const { error } = await supabase.from("site_data").upsert(rows, { onConflict: "key" })
        if (error) throw error
      }
      await refresh()
      setMessage({ text: "Backup restored successfully", type: "success" })
    } catch (err) {
      setMessage({ text: "Restore failed: " + String(err), type: "error" })
    }
    setImporting(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Backup & Restore</h2>
        <p className="text-sm text-white/60 mt-1">Export the entire CMS as JSON, or restore from a previous backup.</p>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === "error" ? "bg-red-500/10 text-red-300 border border-red-500/20" : "bg-green-500/10 text-green-300 border border-green-500/20"}`}>
          {message.type === "error" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <button onClick={handleExport} className="btn-primary flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Export Backup
        </button>
        <label className="btn-outline flex items-center justify-center gap-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          {importing ? "Restoring..." : "Import Backup"}
          <input type="file" accept=".json,application/json" onChange={handleImport} className="hidden" />
        </label>
      </div>
    </motion.div>
  )
}
