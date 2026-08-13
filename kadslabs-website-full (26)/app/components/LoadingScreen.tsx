"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useCallback } from "react"
import SafeImage from "./SafeImage"

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Quick graceful splash — finish as soon as the document is ready
    const finish = () => setLoading(false)
    if (document.readyState === "complete") {
      const t = setTimeout(finish, 600)
      return () => clearTimeout(t)
    }
    const t1 = setTimeout(finish, 1200)
    window.addEventListener("load", finish, { once: true })
    return () => {
      clearTimeout(t1)
      window.removeEventListener("load", finish)
    }
  }, [])

  const skipLoading = useCallback(() => setLoading(false), [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center js-loading"
          style={{ background: "var(--bg-primary)" }}
          role="status"
          aria-live="polite"
          aria-label="Loading KADS LABS website"
        >
          {/* Radial glow */}
          <div aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(30,107,255,0.18) 0%, transparent 60%)" }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-40 pointer-events-none" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
            className="relative z-10"
          >
            {/* Rotating glow ring */}
            <motion.div
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-full"
              style={{ border: "1px dashed rgba(51,181,255,0.3)" }}
            />
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 30px rgba(30,107,255,0.35)",
                  "0 0 60px rgba(51,181,255,0.55)",
                  "0 0 30px rgba(30,107,255,0.35)"
                ]
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-secondary)" }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                <SafeImage
                  src="/logo-crystal.png"
                  alt="KADS LABS"
                  fill
                  containerClassName="w-full h-full"
                  className="object-contain p-3"
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-center z-10"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              KADS <span className="text-brand-gradient">LABS</span>
            </h2>
            <p className="mt-1 text-[10px] sm:text-xs tracking-[0.25em] uppercase" style={{ color: "var(--text-muted)" }}>
              Building Smarter Solutions
            </p>
          </motion.div>

          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-44 h-1 rounded-full overflow-hidden"
            style={{ background: "var(--bg-tertiary)" }}>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #1E6BFF, #33B5FF)", boxShadow: "0 0 10px rgba(51,181,255,0.6)" }}
            />
          </div>

          <button
            onClick={skipLoading}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs transition-colors z-20"
            style={{ color: "var(--text-subtle)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-muted)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}
            aria-label="Skip loading animation"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
