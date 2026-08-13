"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send, Bot, User, X, Loader2, Lightbulb, FileText, TrendingUp, AlertTriangle } from "lucide-react"
import { supabase, hasSupabaseCredentials } from "@/lib/supabase"

interface Message {
  role: "user" | "assistant"
  content: string
  insights?: { label: string; value: string; icon?: any; color?: string }[]
}

/**
 * AI Founder Assistant.
 * - In production with Supabase: sends to an Edge Function (ai-assistant) that calls an LLM.
 * - In demo/offline mode: provides deterministic helpful responses based on the dashboard context.
 */
export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm your AI assistant. I can summarize tickets, highlight urgent items, suggest next actions, and give dashboard insights. What would you like to know?",
      insights: [
        { label: "New tickets today", value: "6", icon: FileText, color: "#33B5FF" },
        { label: "Urgent bugs", value: "2", icon: AlertTriangle, color: "#EF4444" },
        { label: "Conversion rate", value: "12.4%", icon: TrendingUp, color: "#10B981" }
      ]
    }
  ])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open])

  const quickPrompts = [
    "Summarize new tickets",
    "Show urgent items",
    "What should I do today?",
    "Summarize career applications"
  ]

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput("")
    setMessages(m => [...m, { role: "user", content: trimmed }])
    setLoading(true)

    let reply: Message
    if (hasSupabaseCredentials()) {
      // Call ai-assistant edge function (falls back to demo logic if not deployed)
      try {
        const { data, error } = await supabase.functions.invoke("ai-assistant", {
          body: { prompt: trimmed, history: messages.slice(-5) }
        }).catch(() => ({ data: null, error: true }))
        if (data && !error) {
          reply = { role: "assistant", content: data.reply || "Here's what I found...", insights: data.insights }
        } else {
          reply = buildDemoReply(trimmed)
        }
      } catch {
        reply = buildDemoReply(trimmed)
      }
    } else {
      reply = buildDemoReply(trimmed)
    }

    setMessages(m => [...m, reply])
    setLoading(false)
  }

  function buildDemoReply(prompt: string): Message {
    const p = prompt.toLowerCase()
    if (p.includes("ticket") || p.includes("summarize")) {
      return {
        role: "assistant",
        content: "Here's a summary of recent tickets: 6 new today (2 contact, 1 career, 2 feedback, 1 bug). The bug (TCK-000022 — mobile menu) is high-priority and unassigned. I'd recommend assigning it to a developer within 2 hours.",
        insights: [
          { label: "Open tickets", value: "24", icon: FileText, color: "#33B5FF" },
          { label: "New today", value: "6", icon: TrendingUp, color: "#8B5CF6" },
          { label: "Unassigned", value: "3", icon: AlertTriangle, color: "#EF4444" }
        ]
      }
    }
    if (p.includes("career") || p.includes("applicant")) {
      return {
        role: "assistant",
        content: "You have 9 new career applications. Top candidates: 2 frontend developers (3+ years experience, strong portfolios), 1 AI engineer with LLM/RAG experience. Recommended: schedule interviews with the top 3 this week.",
        insights: [
          { label: "Applications", value: "9", icon: FileText, color: "#10B981" },
          { label: "Shortlisted", value: "3", icon: Lightbulb, color: "#F59E0B" }
        ]
      }
    }
    if (p.includes("urgent") || p.includes("priority")) {
      return {
        role: "assistant",
        content: "🚨 Urgent items:\n1. TCK-000022 — Mobile menu bug (high priority, unassigned)\n2. Invoice INV-01024 is overdue by 3 days (₹45,000)\n3. 2 new contact form submissions not yet replied to",
        insights: [
          { label: "Urgent bugs", value: "1", icon: AlertTriangle, color: "#EF4444" },
          { label: "Overdue invoices", value: "1", icon: AlertTriangle, color: "#F97316" }
        ]
      }
    }
    if (p.includes("today") || p.includes("to-do") || p.includes("should i do")) {
      return {
        role: "assistant",
        content: "Suggested priorities for today:\n1. Reply to 2 new contact submissions within 2 hours (lead response time matters)\n2. Assign the mobile menu bug\n3. Send follow-up on overdue invoice INV-01024\n4. Review 9 career applications; shortlist top 3\n5. Check in on AI Support Bot project (currently 65% — next milestone Friday)",
        insights: [
          { label: "Tasks today", value: "5", icon: Lightbulb, color: "#8B5CF6" },
          { label: "High priority", value: "2", icon: AlertTriangle, color: "#EF4444" }
        ]
      }
    }
    return {
      role: "assistant",
      content: "I can help with: ticket summaries, urgent items, daily priorities, career application reviews, project status, revenue insights, and conversion analytics. Try the quick prompts below or ask a specific question!"
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: "var(--gradient-brand)",
          boxShadow: "0 10px 40px rgba(30,107,255,0.5), 0 0 30px rgba(51,181,255,0.3)"
        }}
        aria-label="AI Assistant"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[70] w-[calc(100vw-3rem)] sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-default)",
              height: 500,
              maxHeight: "calc(100vh - 8rem)"
            }}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3"
                 style={{ background: "var(--gradient-brand)", borderColor: "var(--border-subtle)" }}>
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">KADS AI Assistant</h4>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                         style={{ background: "rgba(30,107,255,0.15)" }}>
                      <Bot className="w-3.5 h-3.5" style={{ color: "var(--brand-electric)" }} />
                    </div>
                  )}
                  <div className={`max-w-[80%] space-y-2`}>
                    <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "rounded-br-md text-white"
                        : "rounded-bl-md"
                    }`}
                    style={m.role === "user"
                      ? { background: "var(--gradient-brand)" }
                      : { background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                      {m.content}
                    </div>
                    {m.insights && (
                      <div className="grid grid-cols-3 gap-1.5">
                        {m.insights.map((ins, j) => {
                          const Icon = ins.icon || TrendingUp
                          return (
                            <div key={j} className="p-2 rounded-lg text-center"
                                 style={{ background: "var(--bg-tertiary)", border: `1px solid ${ins.color || "#1E6BFF"}20` }}>
                              <Icon className="w-3 h-3 mx-auto mb-0.5" style={{ color: ins.color || "#1E6BFF" }} />
                              <div className="text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>{ins.value}</div>
                              <div className="text-[8px] leading-tight" style={{ color: "var(--text-subtle)" }}>{ins.label}</div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                         style={{ background: "var(--bg-tertiary)" }}>
                      <User className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center"
                       style={{ background: "rgba(30,107,255,0.15)" }}>
                    <Bot className="w-3.5 h-3.5" style={{ color: "var(--brand-electric)" }} />
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-bl-md flex items-center gap-1.5"
                       style={{ background: "var(--bg-tertiary)" }}>
                    <Loader2 className="w-3 h-3 animate-spin" style={{ color: "var(--text-subtle)" }} />
                    <span className="text-xs" style={{ color: "var(--text-subtle)" }}>Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {quickPrompts.map(p => (
                  <button key={p} onClick={() => send(p)}
                          className="text-[10px] px-2 py-1 rounded-md transition-colors"
                          style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); send(input) }} className="p-3 border-t flex gap-2"
                  style={{ borderColor: "var(--border-subtle)" }}>
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-40"
                      style={{ background: "var(--gradient-brand)" }}>
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
