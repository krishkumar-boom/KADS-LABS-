"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Search } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--bg-primary)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-[120px] sm:text-[160px] font-bold leading-none mb-4 text-brand-gradient glow-text"
        >
          404
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Page not found
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <MagneticButton onClick={() => window.history.back()} variant="outline" className="w-full sm:w-auto" ariaLabel="Go back">
            <ArrowLeft className="w-4 h-4 mr-1" /> Go Back
          </MagneticButton>
          <Link href="/">
            <MagneticButton className="w-full sm:w-auto" ariaLabel="Go home">
              <Home className="w-4 h-4 mr-1" /> Back to Home
            </MagneticButton>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
