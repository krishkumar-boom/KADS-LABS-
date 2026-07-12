"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useCallback } from "react"
import SafeImage from "./SafeImage"

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const skipLoading = useCallback(() => {
    setLoading(false)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-950 js-loading"
          role="status"
          aria-live="polite"
          aria-label="Loading KADS LABS website"
        >
          <div className="absolute inset-0 bg-gradient-radial opacity-50" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10"
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                boxShadow: [
                  "0 0 20px rgba(37, 99, 235, 0.3)",
                  "0 0 40px rgba(37, 99, 235, 0.5)",
                  "0 0 20px rgba(37, 99, 235, 0.3)"
                ]
              }}
              transition={{ 
                rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <SafeImage
                src="./logo.png"
                alt="KADS LABS"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center z-10"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider">
              KADS <span className="text-electric">LABS</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-white/60 tracking-[0.2em] uppercase">
              Building Smarter Solutions
            </p>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-40 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-electric to-electric-light rounded-full"
            />
          </div>

          <button
            onClick={skipLoading}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/30 hover:text-white/70 transition-colors z-20"
            aria-label="Skip loading animation"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
