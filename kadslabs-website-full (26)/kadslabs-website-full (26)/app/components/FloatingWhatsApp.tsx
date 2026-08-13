"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send } from "lucide-react"
import { useLanguage } from "./LanguageProvider"
import { WhatsAppIcon } from "@/lib/custom-icons"
import { openWhatsAppLead } from "@/lib/leads"

/**
 * Floating WhatsApp widget — bottom-right corner.
 * - Collapsed: small FAB with unobtrusive pulse
 * - Expanded: friendly bubble with quick reply options
 * - Disabled on small in-app browsers where it could be annoying
 * - Respects reduced motion
 */
export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState("")
  const { language } = useLanguage()
  const isHi = language === "hi"

  useEffect(() => {
    // Don't show immediately — wait until the page has settled
    const t = setTimeout(() => setShow(true), 2500)
    return () => clearTimeout(t)
  }, [])

  const quickReplies = isHi
    ? ["मुझे प्रोजेक्ट के बारे में बात करनी है", "कोट चाहिए", "मीटिंग बुक करनी है", "सर्विसेज के बारे में बताइए"]
    : ["I'd like to discuss a project", "Need a quote", "Book a meeting", "Tell me about your services"]

  const send = (text?: string) => {
    const msg = (text || message || "Hi! I'd like to know more about KADS LABS.").trim()
    openWhatsAppLead({ name: "Website Visitor", message: msg })
    setOpen(false)
    setMessage("")
  }

  if (!show) return null

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-[320px] max-w-[calc(100vw-2.5rem)] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              backdropFilter: "blur(20px)"
            }}
          >
            {/* Header */}
            <div className="p-4 flex items-center gap-3" style={{ background: "#25D366" }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <WhatsAppIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-white">
                <div className="font-bold text-sm">KADS LABS</div>
                <div className="text-xs opacity-90 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  {isHi ? "आमतौर पर तुरंत जवाब" : "Usually replies instantly"}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat body */}
            <div className="p-4 space-y-3" style={{ background: "var(--bg-secondary)" }}>
              <div className="px-3 py-2 rounded-lg rounded-tl-none text-sm max-w-[85%]"
                style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}>
                👋 {isHi ? "नमस्ते! KADS LABS में आपका स्वागत है। हम कैसे मदद कर सकते हैं?" : "Hi there! Welcome to KADS LABS. How can we help you today?"}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {quickReplies.map(q => (
                  <button key={q}
                    onClick={() => send(q)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:-translate-y-0.5"
                    style={{
                      background: "rgba(37,211,102,0.1)",
                      border: "1px solid rgba(37,211,102,0.3)",
                      color: "#25D366"
                    }}>
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder={isHi ? "अपना संदेश लिखें..." : "Type your message..."}
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                  style={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)"
                  }}
                />
                <button onClick={() => send()}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white transition-transform hover:scale-105"
                  style={{ background: "#25D366" }} aria-label="Send">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2.7, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl"
        style={{
          background: "#25D366",
          boxShadow: "0 10px 30px rgba(37,211,102,0.4), 0 0 0 0 rgba(37,211,102,0.5)"
        }}
        aria-label={open ? "Close WhatsApp chat" : "Chat on WhatsApp"}
      >
        <motion.span
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
          style={{ background: "#25D366" }}
          aria-hidden="true"
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={open ? "x" : "wa"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
