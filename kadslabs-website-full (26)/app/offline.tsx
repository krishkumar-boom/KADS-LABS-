"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg-primary)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6"
             style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)" }}>
          <WifiOff className="w-8 h-8" style={{ color: "#F59E0B" }} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>You&apos;re offline</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          No internet connection detected. Check your connection and try again. Some cached content may still be available.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <MagneticButton onClick={() => window.location.reload()} ariaLabel="Retry">
            <RefreshCw className="w-4 h-4 mr-1" /> Retry
          </MagneticButton>
          <Link href="/">
            <MagneticButton variant="outline" ariaLabel="Home">
              <Home className="w-4 h-4 mr-1" /> Home
            </MagneticButton>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
