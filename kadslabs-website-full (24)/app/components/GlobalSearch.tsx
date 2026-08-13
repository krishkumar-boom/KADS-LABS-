"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { useContent } from "./ContentProvider"

export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ label: string; href: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { siteData, content } = useContent()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const matches: { label: string; href: string }[] = []
    if (content.heroTitle.toLowerCase().includes(q)) matches.push({ label: "Hero: " + content.heroTitle, href: "#home" })
    if (content.aboutTitle.toLowerCase().includes(q)) matches.push({ label: "About: " + content.aboutTitle, href: "#about" })
    if (content.mediaTitle.toLowerCase().includes(q)) matches.push({ label: "KADS Media: " + content.mediaTitle, href: "#media" })
    if (content.techTitle.toLowerCase().includes(q)) matches.push({ label: "KADS Tech: " + content.techTitle, href: "#tech" })
    if (content.contactTitle.toLowerCase().includes(q)) matches.push({ label: "Contact: " + content.contactTitle, href: "#contact" })
    siteData.services.forEach(s => { if (s.title.toLowerCase().includes(q)) matches.push({ label: "Service: " + s.title, href: "#services" }) })
    siteData.blogs.forEach(b => { if (b.title.toLowerCase().includes(q)) matches.push({ label: "Blog: " + b.title, href: "#blogs" }) })
    siteData.careers.forEach(c => { if (c.title.toLowerCase().includes(q)) matches.push({ label: "Career: " + c.title, href: "#careers" }) })
    siteData.faqs.forEach((f: typeof siteData.faqs[0]) => { if (f.question.toLowerCase().includes(q)) matches.push({ label: "FAQ: " + f.question, href: "#faq" }) })
    setResults(matches.slice(0, 10))
  }, [query, siteData, content])

  const handleClick = (href: string) => {
    setOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 text-white/60 hover:text-white transition-colors" aria-label="Search">
        <Search className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" />
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed left-1/2 top-24 -translate-x-1/2 w-full max-w-lg z-[90] section-padding">
              <div className="glass-card rounded-2xl p-4 glow-border">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search content, services, blogs, careers... (Ctrl+K)"
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric"
                  />
                  <button onClick={() => setOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                  {results.length === 0 ? (
                    <p className="text-sm text-white/40 text-center py-4">{query ? "No results found" : "Start typing to search"}</p>
                  ) : (
                    <div className="space-y-1">
                      {results.map((r, i) => (
                        <button key={i} onClick={() => handleClick(r.href)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-white/80 transition-colors">
                          {r.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
