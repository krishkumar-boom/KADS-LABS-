"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useContent } from "../ContentProvider"
import { Save, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface JsonEditorSectionProps {
  section: keyof import("@/lib/content").SiteData
  title: string
  description?: string
}

export default function JsonEditorSection({ section, title, description }: JsonEditorSectionProps) {
  const { siteData, updateSection, lastSaved } = useContent()
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    const data = siteData[section as keyof typeof siteData]
    setValue(JSON.stringify(data, null, 2))
    setError("")
  }, [siteData, section])

  const handleSave = async () => {
    setError("")
    setSaveStatus("saving")
    try {
      const parsed = JSON.parse(value)
      await updateSection(section as keyof import("@/lib/content").SiteData, parsed)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (e) {
      setError(String(e))
      setSaveStatus("idle")
    }
  }

  const handleReset = () => {
    const data = siteData[section as keyof typeof siteData]
    setValue(JSON.stringify(data, null, 2))
    setError("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 sm:p-8 glow-border"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {description && <p className="text-sm text-white/60 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" /> Saved
            </span>
          )}
          {lastSaved && (
            <span className="text-xs text-white/40 hidden sm:inline">
              Last saved: {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
          <button onClick={handleReset} className="btn-outline px-4 py-2 text-sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </button>
          <button onClick={handleSave} disabled={saveStatus === "saving"} className="btn-primary px-4 py-2 text-sm">
            <Save className="w-4 h-4 mr-2" />
            {saveStatus === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="font-mono whitespace-pre-wrap">{error}</span>
        </div>
      )}

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          className="w-full h-[60vh] min-h-[400px] px-4 py-3 rounded-lg bg-navy-950/80 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-electric transition-colors resize-y"
        />
        <div className="absolute top-3 right-3 text-xs text-white/30 pointer-events-none">JSON</div>
      </div>

      <p className="mt-4 text-sm text-white/50">
        Edit the JSON structure above. Changes are validated and saved to the live CMS. Invalid JSON will not be saved.
      </p>
    </motion.div>
  )
}
