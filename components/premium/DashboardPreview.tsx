"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Home, FolderKanban, BarChart3, Users, Users2, FileText, Headphones, Settings, Search, Bell, Mail, ChevronRight, TrendingUp, Plus } from "lucide-react"
import { useCountUp } from "@/lib/hooks/useCountUp"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const NAV_ITEMS = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: FolderKanban, label: "Projects" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Clients" },
  { icon: Users2, label: "Team" },
  { icon: FileText, label: "Invoices" },
  { icon: Headphones, label: "Support" },
  { icon: Settings, label: "Settings" }
]

const ACTIVITY = [
  { dot: "#1E6BFF", text: "New project 'AI Automation System' created", time: "2 min ago" },
  { dot: "#10B981", text: "Payment received from TechNova Inc.", time: "15 min ago" },
  { dot: "#F59E0B", text: "Project 'KADS Enterprise Platform' updated", time: "1 hour ago" },
  { dot: "#1E6BFF", text: "New client 'Global Corp' added", time: "2 hours ago" }
]

const TEAM = ["#6366F1", "#33B5FF", "#10B981", "#F59E0B", "#EF4444"]

function StatCard({ label, value, suffix, delta, color, delay, inView }: {
  label: string; value: number; suffix: string; delta: string; color: string; delay: number; inView: boolean
}) {
  const n = useCountUp({ end: value, start: inView, duration: 1500, easing: "ease-out" })
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl p-4"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)"
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
        <ChevronRight className="w-4 h-4" style={{ color: "var(--text-subtle)" }} />
      </div>
      <div className="text-2xl font-bold mb-1 tabular-nums" style={{ color: "var(--text-primary)" }}>
        {label.includes("Revenue") ? "₹" : ""}{Math.round(n).toLocaleString()}{suffix}
      </div>
      <div className="flex items-center gap-1 text-xs" style={{ color: "#10B981" }}>
        <TrendingUp className="w-3 h-3" />{delta}
      </div>
    </motion.div>
  )
}

function MiniChart({ inView }: { inView: boolean }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start: number
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min((now - start) / 1500, 1)
      setProgress(t)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView])
  // Simple line path that draws in
  const points = [
    [0, 70], [15, 60], [30, 65], [45, 45], [60, 50], [75, 25], [90, 35], [100, 15]
  ]
  const visiblePoints = Math.floor(progress * points.length)
  const path = points.slice(0, Math.max(2, visiblePoints))
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ")

  return (
    <svg viewBox="0 0 100 80" className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chart-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#33B5FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#33B5FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {path && (
        <>
          <path d={`${path} L ${points[Math.max(0, visiblePoints-1)][0]} 80 L 0 80 Z`} fill="url(#chart-grad)" />
          <path d={path} stroke="#33B5FF" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  )
}

const PROJECTS = [
  { name: "KADS Enterprise Platform", pct: 75, rev: "₹8.4L", color: "#1E6BFF" },
  { name: "AI Automation System", pct: 60, rev: "₹6.2L", color: "#33B5FF" },
  { name: "E-Commerce Solution", pct: 45, rev: "₹4.7L", color: "#8B5CF6" },
  { name: "Mobile Banking App", pct: 30, rev: "₹3.1L", color: "#10B981" }
]

export default function DashboardPreview() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="dashboard-preview" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            {language === "hi" ? "डैशबोर्ड" : "Client Dashboard"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>पावरफुल <span className="text-brand-gradient">एडमिन डैशबोर्ड</span></>
            ) : (
              <>Run your business from a <span className="text-brand-gradient">single dashboard</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "हमारा इनबिल्ट CRM डैशबोर्ड प्रोजेक्ट्स, क्लाइंट्स, रेवेन्यू और टीम को एक जगह मैनेज करता है।"
              : "Project management, client CRM, revenue analytics, team collaboration — all in one beautiful, real-time interface."}
          </p>
        </Reveal>

        <Reveal>
          <div className="relative">
            {/* Browser/Window chrome */}
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 40px 100px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,107,255,0.15), 0 0 80px rgba(30,107,255,0.1)"
              }}>
              {/* Top bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <span className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 max-w-md mx-auto">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-subtle)" }} />
                    <input readOnly
                      placeholder="Search..."
                      className="w-full h-8 pl-9 pr-3 rounded-lg text-sm"
                      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)" }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="relative p-2 rounded-lg" style={{ color: "var(--text-muted)" }}>
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                  </button>
                  <button className="relative p-2 rounded-lg" style={{ color: "var(--text-muted)" }}>
                    <Mail className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                  </button>
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="hidden md:flex flex-col gap-1 w-56 p-3 border-r shrink-0" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}>
                  {NAV_ITEMS.map(n => {
                    const Icon = n.icon
                    return (
                      <button key={n.label}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          background: n.active ? "linear-gradient(90deg, #1E6BFF, #1E6BFF)" : "transparent",
                          color: n.active ? "white" : "var(--text-muted)",
                          boxShadow: n.active ? "0 4px 12px rgba(30,107,255,0.4)" : "none"
                        }}>
                        <Icon className="w-4 h-4" />
                        {n.label}
                      </button>
                    )
                  })}
                  <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-2 p-2 rounded-lg">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #1E6BFF, #33B5FF)" }}>KK</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>Krish Kumar</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Admin</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-4 sm:p-6 min-w-0">
                  <div className="mb-5">
                    <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Dashboard</h3>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>Welcome back, Krish 👋</p>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    <StatCard label="Total Projects" value={24} suffix="" delta="↑ 21% from last month" color="#1E6BFF" delay={0} inView={inView} />
                    <StatCard label="Active Projects" value={12} suffix="" delta="↑ 8% from last month" color="#33B5FF" delay={0.1} inView={inView} />
                    <StatCard label="Total Revenue" value={24} suffix=".8L" delta="↑ 15% from last month" color="#10B981" delay={0.2} inView={inView} />
                    <StatCard label="Clients" value={98} suffix="" delta="↑ 5% from last month" color="#8B5CF6" delay={0.3} inView={inView} />
                  </div>

                  {/* Charts row */}
                  <div className="grid lg:grid-cols-2 gap-4 mb-5">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Revenue Overview</h4>
                          <p className="text-[10px]" style={{ color: "var(--text-subtle)" }}>This Month</p>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>This Month ▾</span>
                      </div>
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>40L</span>
                        <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>30L</span>
                        <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>20L</span>
                        <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>10L</span>
                        <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>0</span>
                      </div>
                      <MiniChart inView={inView} />
                      <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-subtle)" }}>
                        {["Jan","Feb","Mar","Apr","May","Jun","Jul"].map(m => <span key={m}>{m}</span>)}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Top Projects</h4>
                        <span className="text-[10px]" style={{ color: "#33B5FF" }}>View All</span>
                      </div>
                      <div className="space-y-3">
                        {PROJECTS.map((p, i) => (
                          <div key={p.name}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{p.name}</span>
                              <span className="text-[10px] font-semibold ml-2" style={{ color: p.color }}>{p.rev} · {p.pct}%</span>
                            </div>
                            <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={inView ? { width: `${p.pct}%` } : {}}
                                transition={{ duration: 1.2, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}99)` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom row */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
                      <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Recent Activity</h4>
                      <div className="space-y-2.5">
                        {ACTIVITY.map((a, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                            className="flex items-start gap-2.5">
                            <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: a.dot }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{a.text}</p>
                              <p className="text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>{a.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)" }}>
                      <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Team Members</h4>
                      <div className="flex -space-x-2 mb-4">
                        {TEAM.map((c, i) => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ background: c, borderColor: "var(--bg-tertiary)" }}>
                            {["A","S","R","P","M"][i]}
                          </div>
                        ))}
                        <button className="w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center"
                          style={{ borderColor: "var(--border-default)", color: "var(--text-muted)" }}>
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        50+ expert engineers · Available 24/7
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative glow behind */}
            <div aria-hidden="true"
              className="absolute -inset-10 rounded-[40px] -z-10 blur-3xl opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(30,107,255,0.3), transparent 70%)" }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
