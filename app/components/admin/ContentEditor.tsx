"use client"

import { motion } from "framer-motion"
import { useContent } from "../ContentProvider"
import { SiteContent, defaultContent } from "@/lib/content"
import { Save, RefreshCw, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"

export default function ContentEditor() {
  const { content, updateContent, lastSaved } = useContent()
  const [formValues, setFormValues] = useState<Partial<SiteContent>>({})
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    setFormValues(content)
  }, [content])

  const handleChange = (key: keyof SiteContent, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaveStatus("saving")
    await updateContent(formValues)
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  const handleReset = () => {
    setFormValues(defaultContent)
  }

  const fields: { key: keyof SiteContent; label: string; rows?: number }[] = [
    { key: "metaTitle", label: "Meta Title" },
    { key: "metaDescription", label: "Meta Description", rows: 2 },
    { key: "heroTitle", label: "Hero Title" },
    { key: "heroSubtitle", label: "Hero Subtitle" },
    { key: "heroDescription", label: "Hero Description", rows: 3 },
    { key: "heroCtaPrimary", label: "Hero CTA Primary" },
    { key: "heroCtaSecondary", label: "Hero CTA Secondary" },
    { key: "heroVideoLabel", label: "Hero Video Label" },
    { key: "aboutTitle", label: "About Title" },
    { key: "aboutDescription", label: "About Description", rows: 3 },
    { key: "mission", label: "Mission Statement", rows: 3 },
    { key: "vision", label: "Vision Statement", rows: 3 },
    { key: "mediaTitle", label: "KADS Media Title" },
    { key: "mediaDescription", label: "KADS Media Description", rows: 3 },
    { key: "techTitle", label: "KADS Tech Title" },
    { key: "techDescription", label: "KADS Tech Description", rows: 3 },
    { key: "contactTitle", label: "Contact Title" },
    { key: "contactDescription", label: "Contact Description", rows: 3 },
    { key: "founderNote", label: "Leadership Note", rows: 2 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 sm:p-8 glow-border"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold">Website Content</h2>
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

      <div className="grid md:grid-cols-2 gap-5">
        {fields.map((field) => (
          <div key={field.key} className={field.rows ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-white/80 mb-2">{field.label}</label>
            {field.rows ? (
              <textarea
                value={formValues[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                rows={field.rows}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-electric transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                value={formValues[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-electric transition-colors"
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
