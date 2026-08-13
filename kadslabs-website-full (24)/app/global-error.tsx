"use client"

import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[KADS LABS] Global error:", error)
  }, [error])

  return (
    <html>
      <body style={{ background: "#05070B", color: "white", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.25rem", fontFamily: "system-ui, sans-serif" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertTriangle className="w-8 h-8" style={{ color: "#EF4444" }} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Something went wrong</h1>
          <p className="text-sm text-white/60 mb-8">
            An unexpected error occurred. We&apos;ve been notified and are working on a fix.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono mb-6 text-white/40">
              Error ID: {error.digest}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MagneticButton onClick={reset} ariaLabel="Try again">
              <RefreshCw className="w-4 h-4 mr-1" /> Try Again
            </MagneticButton>
            <Link href="/">
              <MagneticButton variant="outline" ariaLabel="Go home">
                <Home className="w-4 h-4 mr-1" /> Home
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </body>
    </html>
  )
}
