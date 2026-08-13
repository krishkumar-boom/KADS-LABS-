"use client"

import { createContext, useCallback, useContext, useState, ReactNode, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Info, X, AlertTriangle } from "lucide-react"

type ToastType = "success" | "error" | "info" | "loading"

interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  show: (message: string, type?: ToastType, duration?: number) => number
  success: (message: string, duration?: number) => number
  error: (message: string, duration?: number) => number
  info: (message: string, duration?: number) => number
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return {
    show: () => 0, success: () => 0, error: () => 0, info: () => 0, dismiss: () => {}
  } as ToastContextValue
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const show = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = ++idRef.current
    setToasts(t => [...t, { id, message, type, duration }])
    if (type !== "loading" && duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  const success = useCallback((m: string, d?: number) => show(m, "success", d), [show])
  const error = useCallback((m: string, d?: number) => show(m, "error", d), [show])
  const info = useCallback((m: string, d?: number) => show(m, "info", d), [show])

  return (
    <ToastContext.Provider value={{ show, success, error, info, dismiss }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none max-w-sm w-[calc(100%-2.5rem)]">
        <AnimatePresence initial={false}>
          {toasts.map(t => {
            const Icon = t.type === "success" ? CheckCircle2
              : t.type === "error" ? XCircle
              : t.type === "loading" ? AlertTriangle
              : Info
            const color = t.type === "success" ? "#10B981"
              : t.type === "error" ? "#EF4444"
              : "#33B5FF"
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg backdrop-blur-xl"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-lg)"
                }}
                role="status"
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color }} />
                <p className="text-sm flex-1" style={{ color: "var(--text-primary)" }}>{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="p-0.5 rounded-md transition-colors shrink-0"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
