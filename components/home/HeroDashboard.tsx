"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Activity, Server, ArrowUpRight } from "lucide-react"
import { useCountUp } from "@/lib/hooks/useCountUp"

/**
 * HeroDashboard — glass-panel product mockup with two stat cards:
 *  - "Deployment uptime"  0 -> 99.99%
 *  - "Active deployments" 0 -> 50+   (secondary metric: 12,400 AI req/sec)
 * Bars animate height on mount with spring physics. Numbers count up
 * via the shared useCountUp hook. Everything GPU-friendly (transform/opacity).
 */
export default function HeroDashboard({
  animate = true
}: {
  /** pass false to render in a static/reduced-motion state */
  animate?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const run = animate && inView

  // Target bar heights (percentage of container height)
  const barTargets = [42, 68, 52, 85, 60, 78, 48, 92]
  const [bars, setBars] = useState<number[]>(() => barTargets.map(() => 6))

  // Count-up metrics
  const uptime = useCountUp({ end: 99.99, start: run, duration: 1600, easing: "ease-out", decimals: 2 })
  const deploys = useCountUp({ end: 50, start: run, duration: 1400, easing: "ease-out" })
  const reqs = useCountUp({ end: 12400, start: run, duration: 1800, easing: "ease-out" })

  // Spring-ish bar animation (CSS transitions handle the easing)
  useEffect(() => {
    if (!run) {
      setBars(barTargets)
      return
    }
    const t = setTimeout(() => setBars(barTargets), 180)
    return () => clearTimeout(t)
  }, [run])

  return (
    <div ref={ref} className="relative w-full max-w-[560px] mx-auto">
      {/* Ambient glow behind the panel */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-[28px] bg-gradient-to-br from-electric/30 via-cyan/10 to-amethyst/20 blur-3xl opacity-60"
      />

      {/* Browser chrome */}
      <motion.div
        initial={animate ? { opacity: 0, y: 24, scale: 0.98 } : false}
        animate={animate && inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,41,59,0.55) 0%, rgba(15,23,42,0.7) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.12), 0 0 80px -10px rgba(59,130,246,0.25)"
        }}
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <div className="ml-4 flex-1 h-5 rounded-md bg-white/5 border border-white/5 flex items-center px-3">
            <span className="text-[10px] text-white/40 truncate">
              console.kadslabs.com / overview
            </span>
          </div>
        </div>

        {/* Panel body */}
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Uptime card */}
            <div
              className="relative rounded-xl p-4 overflow-hidden"
              style={{
                background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.18)"
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Activity className="w-3 h-3 text-electric-light" />
                <span className="text-[10px] uppercase tracking-widest text-white/50">
                  Deployment Uptime
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl sm:text-3xl font-bold text-electric-light tabular-nums">
                  {uptime.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-electric-light">%</span>
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-1 h-14">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background:
                        "linear-gradient(180deg, #60A5FA 0%, #3B82F6 60%, #2563EB 100%)",
                      transition: "height 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                      transitionDelay: `${i * 60}ms`,
                      boxShadow: "0 0 10px rgba(59,130,246,0.4)"
                    }}
                  />
                ))}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400/90">
                <ArrowUpRight className="w-3 h-3" />
                <span>+0.02% this week</span>
              </div>
            </div>

            {/* Deployments card */}
            <div
              className="relative rounded-xl p-4 overflow-hidden"
              style={{
                background: "rgba(76,215,246,0.05)",
                border: "1px solid rgba(76,215,246,0.15)"
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Server className="w-3 h-3 text-cyan" />
                <span className="text-[10px] uppercase tracking-widest text-white/50">
                  Active Deployments
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl sm:text-3xl font-bold text-cyan tabular-nums">
                  {deploys}
                </span>
                <span className="text-lg font-bold text-cyan">+</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40 mb-2">
                AI requests / sec
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white/90 tabular-nums">
                {reqs.toLocaleString()}
              </div>
              {/* Pulse indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={run ? { width: "82%" } : { width: "82%" }}
                  transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #4cd7f6 0%, #3B82F6 100%)"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer row */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> All systems operational
            </span>
            <span>Last deploy: 2m ago</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
