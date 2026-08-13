"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, Briefcase, FileText, Receipt, MessageSquare,
  UserPlus, Bell, Settings, Shield, Activity, LogOut, Menu, X,
  Bug, FolderKanban, Ticket, BarChart3, LineChart, ChevronRight,
  Sparkles, ChevronDown, Code2, Rocket, Calendar, Home, ExternalLink, Crown
} from "lucide-react"
import GlobalSearch from "./GlobalSearch"
import { useAuth } from "@/app/components/AuthProvider"
import SafeImage from "@/app/components/SafeImage"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href?: string
  icon: any
  badge?: string
  children?: NavItem[]
  requireRole?: string[]
}

const SUPER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/super", icon: LayoutDashboard },
  { label: "Developers", href: "/super#developers", icon: Code2 },
  { label: "Projects", href: "/founder#projects", icon: FolderKanban },
  { label: "Team Invites", href: "/super#invites", icon: UserPlus },
  { label: "Security", href: "/founder#security", icon: Activity },
  { label: "Settings", href: "/founder#settings", icon: Settings }
]

const CLIENT_NAV: NavItem[] = [
  { label: "Dashboard", href: "/client", icon: LayoutDashboard },
  { label: "My Projects", href: "/client#projects", icon: FolderKanban },
  { label: "Invoices & Payments", href: "/client#invoices", icon: Receipt },
  { label: "Files & Documents", href: "/client#files", icon: FileText },
  { label: "Messages", href: "/client#messages", icon: MessageSquare, badge: "new" },
  { label: "Support Tickets", href: "/client#tickets", icon: Ticket },
  { label: "Settings", href: "/profile", icon: Settings }
]

const DEVELOPER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/developer", icon: LayoutDashboard },
  { label: "My Tasks", href: "/developer#tasks", icon: FileText },
  { label: "Projects", href: "/developer#projects", icon: FolderKanban },
  { label: "Bug Tracker", href: "/developer#bugs", icon: Bug },
  { label: "Deployments", href: "/developer#deployments", icon: Rocket },
  { label: "Error Logs", href: "/developer#errors", icon: Activity },
  { label: "Performance", href: "/developer#performance", icon: BarChart3 },
  { label: "Settings", href: "/developer#settings", icon: Settings }
]

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin#users", icon: Users },
  { label: "Projects", href: "/admin#projects", icon: FolderKanban },
  { label: "Clients", href: "/founder#clients", icon: Users },
  { label: "Invoices", href: "/founder#invoices", icon: Receipt },
  { label: "Submissions", href: "/admin#submissions", icon: MessageSquare },
  { label: "Content", href: "/admin#content", icon: FileText },
  { label: "Reports", href: "/founder#analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin#settings", icon: Settings }
]

const NAV: NavItem[] = [
  { label: "Overview", href: "/founder", icon: LayoutDashboard },
  { label: "Projects", href: "/founder#projects", icon: FolderKanban },
  { label: "Clients", href: "/founder#clients", icon: Users },
  { label: "Revenue", href: "/founder#invoices", icon: Receipt },
  { label: "Team", href: "/super", icon: Shield },
  {
    label: "Analytics",
    icon: LineChart,
    children: [
      { label: "Overview", href: "/founder#analytics", icon: BarChart3 },
      { label: "Leads", href: "/founder#analytics", icon: Users },
      { label: "Traffic", href: "/founder#analytics", icon: Activity },
      { label: "Reports", href: "/founder#analytics", icon: FileText }
    ]
  },
  { label: "Reports", href: "/founder#analytics", icon: FileText },
  {
    label: "Resources",
    icon: Briefcase,
    children: [
      { label: "Inbox / Tickets", href: "/founder#tickets", icon: Ticket },
      { label: "Career Applications", href: "/hr", icon: UserPlus },
      { label: "Feedback", href: "/feedback", icon: Sparkles },
      { label: "Quotes", href: "/quote", icon: FileText }
    ]
  },
  {
    label: "Support",
    icon: MessageSquare,
    children: [
      { label: "Bug Reports", href: "/founder#bugs", icon: Bug },
      { label: "Contact Requests", href: "/founder#contacts", icon: MessageSquare }
    ]
  },
  { label: "Settings", href: "/founder#settings", icon: Settings }
]

const HR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/hr", icon: LayoutDashboard },
  { label: "Applications", href: "/hr#applications", icon: Briefcase },
  { label: "Candidates", href: "/hr#candidates", icon: Users },
  { label: "Interviews", href: "/hr#interviews", icon: Calendar },
  { label: "Settings", href: "/hr#settings", icon: Settings }
]

interface DashboardShellProps {
  children: ReactNode
  title?: string
  role?: "founder" | "developer" | "admin" | "hr" | "client" | "super"
}

export default function DashboardShell({ children, title, role = "founder" }: DashboardShellProps) {
  const { user, isAuthenticated, isAdmin, isFounder, signOut, demoMode } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ Inbox: true })
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const nav =
    role === "developer" ? DEVELOPER_NAV :
    role === "hr" ? HR_NAV :
    role === "admin" ? ADMIN_NAV :
    role === "client" ? CLIENT_NAV :
    role === "super" ? SUPER_NAV :
    NAV

  useEffect(() => {
    if (!isAuthenticated && !demoMode) {
      router.push("/#auth")
      return
    }
    // Load notifications
    if (!demoMode && user) {
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data }: any) => {
          setNotifications(data || [])
          setUnreadCount((data || []).filter((n: any) => !n.is_read).length)
        })
    } else {
      // demo notifications
      setNotifications([
        { id: "d1", title: "Welcome to KADS LABS", message: "Demo mode — connect Supabase for live data", is_read: false, type: "info", created_at: new Date().toISOString() }
      ])
      setUnreadCount(1)
    }
  }, [isAuthenticated, demoMode, user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const markAllRead = async () => {
    setNotifications(n => n.map(x => ({ ...x, is_read: true })))
    setUnreadCount(0)
    if (user && !demoMode) {
      await supabase.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("user_id", user.id)
    }
  }

  const isNavActive = (href?: string) => {
    if (!href) return false
    if (href.includes("#")) return pathname === href.split("#")[0] || pathname === "/" + href.split("#")[0]
    return pathname === href || pathname?.startsWith(href + "/")
  }

  const isFounderShell = role === "founder"
  const GOLD = "#D4AF37"
  const GOLD_SOFT = "#F5D77A"
  const GOLD_DEEP = "#B8860B"

  return (
    <div className="min-h-screen flex" style={{
      background: isFounderShell
        ? "radial-gradient(900px 400px at 15% 0%, rgba(212,175,55,0.06), transparent 60%), var(--bg-primary)"
        : "var(--bg-primary)"
    }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 h-screen z-50 w-64 flex flex-col border-r transition-transform",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )} style={{
        background: isFounderShell
          ? "linear-gradient(180deg, #070A14 0%, #050913 100%)"
          : "var(--bg-secondary)",
        borderColor: isFounderShell ? "rgba(212,175,55,0.18)" : "var(--border-subtle)",
        boxShadow: isFounderShell ? "2px 0 40px -20px rgba(212,175,55,0.25)" : "none"
      }}>
        {/* Logo */}
        <div className="h-16 px-5 flex items-center gap-3 border-b" style={{
          borderColor: isFounderShell ? "rgba(212,175,55,0.18)" : "var(--border-subtle)"
        }}>
          <div className="relative w-10 h-10 rounded-lg overflow-hidden">
            <SafeImage src="/logo-crystal.png" alt="KADS LABS" fill containerClassName="w-full h-full" className="object-contain" />
            {isFounderShell && (
              <div className="absolute inset-0 rounded-lg pointer-events-none"
                   style={{ boxShadow: `inset 0 0 16px ${GOLD}55, 0 0 20px ${GOLD}33` }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm leading-tight flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
              KADS LABS
              {isFounderShell && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DEEP})`,
                  color: "#050913"
                }}>★</span>}
            </div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: isFounderShell ? `${GOLD}cc` : "var(--text-subtle)" }}>
              {role === "developer" ? "Developer Panel" : role === "hr" ? "HR Panel" : role === "admin" ? "Admin Panel" : "BUILDING TOMORROW"}
            </div>
          </div>
          <button className="lg:hidden p-1 rounded-md" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {nav.map(item => {
            if (item.children) {
              const isOpen = expandedGroups[item.label]
              const hasActive = item.children.some(c => isNavActive(c.href))
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setExpandedGroups(g => ({ ...g, [item.label]: !g[item.label] }))}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      hasActive ? "text-brand-neon" : ""
                    )}
                    style={{ color: hasActive ? "var(--brand-neon)" : "var(--text-secondary)" }}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-brand-neon/20 text-brand-neon">{item.badge}</span>
                    )}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 mt-1 space-y-0.5 border-l ml-4" style={{ borderColor: "var(--border-subtle)" }}>
                          {item.children.map(child => {
                            const active = isNavActive(child.href)
                            const cGold = isFounderShell ? GOLD : "var(--brand-electric)"
                            return (
                              <Link
                                key={child.label}
                                href={child.href || "#"}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                  active ? "" : "hover:pl-4"
                                )}
                                style={{
                                  color: active ? cGold : "var(--text-muted)",
                                  background: active ? (isFounderShell ? `${GOLD}15` : "rgba(30,107,255,0.1)") : "transparent"
                                }}
                              >
                                <child.icon className="w-3 h-3 shrink-0" />
                                <span>{child.label}</span>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }
            const active = isNavActive(item.href)
            const activeColor = isFounderShell ? GOLD : "var(--brand-electric)"
            const activeBg = isFounderShell ? `${GOLD}15` : "rgba(30,107,255,0.1)"
            return (
              <Link
                key={item.label}
                href={item.href || "#"}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  active ? "" : "hover:bg-white/5"
                )}
                style={{
                  color: active ? activeColor : "var(--text-secondary)",
                  background: active ? activeBg : "transparent",
                  boxShadow: active && isFounderShell ? `inset 3px 0 0 ${GOLD}, 0 0 20px ${GOLD}22` :
                            active ? "inset 3px 0 0 var(--brand-electric)" : "none"
                }}
              >
                <item.icon className="w-4 h-4 shrink-0" style={{ color: active ? activeColor : undefined }} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-70" style={{ color: activeColor }} />}
              </Link>
            )
          })}
        </nav>

        {/* Pro Founder card (only for founder) */}
        {isFounderShell && (
          <div className="px-3 mb-2">
            <div className="rounded-xl p-3 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(212,175,55,0.12), rgba(184,134,11,0.06))`,
                border: `1px solid ${GOLD}44`,
                boxShadow: `inset 0 0 20px ${GOLD}11`
              }}>
              <div aria-hidden className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl"
                   style={{ background: `radial-gradient(closest-side, ${GOLD}55, transparent)` }} />
              <div className="relative flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5" style={{ color: GOLD, filter: `drop-shadow(0 0 8px ${GOLD}88)` }} />
                <span className="text-sm font-bold" style={{ color: GOLD_SOFT }}>Pro Founder</span>
              </div>
              <p className="text-[11px] mb-2.5 leading-snug" style={{ color: "rgba(255,255,255,0.65)" }}>
                You are on Pro Founder Plan
              </p>
              <button className="w-full text-[11px] font-semibold py-1.5 rounded-md transition-all hover:brightness-110"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DEEP})`,
                  color: "#050913",
                  boxShadow: `0 4px 12px ${GOLD}44`
                }}>
                View Plan Details
              </button>
            </div>
          </div>
        )}

        {/* User card */}
        <div className="p-3 border-t" style={{
          borderColor: isFounderShell ? "rgba(212,175,55,0.18)" : "var(--border-subtle)"
        }}>
          <div className="p-3 rounded-xl flex items-center gap-3" style={{
            background: isFounderShell ? "rgba(212,175,55,0.06)" : "var(--bg-tertiary)",
            border: isFounderShell ? `1px solid ${GOLD}22` : "none"
          }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                 style={{
                   background: isFounderShell
                    ? `linear-gradient(135deg, ${GOLD}, ${GOLD_DEEP})`
                    : "var(--gradient-brand)",
                   color: isFounderShell ? "#050913" : "#fff"
                 }}>
              {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "K"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest"}
              </div>
              <div className="text-[10px] truncate" style={{ color: isFounderShell ? `${GOLD}aa` : "var(--text-subtle)" }}>
                {demoMode ? "Demo Mode" : (isFounderShell ? "Founder & CEO" : user?.email)}
              </div>
            </div>
            <button onClick={handleSignOut} className="p-1.5 rounded-lg transition-colors hover:bg-white/10" aria-label="Sign out">
              <LogOut className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          {isFounderShell && (
            <div className="mt-2 flex items-center justify-between text-[10px] px-2" style={{ color: "rgba(255,255,255,0.35)" }}>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "rgba(212,175,55,0.2)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
                </span>
                KADS LABS
              </span>
              <span>v2.5.0</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b backdrop-blur-xl flex items-center px-4 sm:px-6 gap-4"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
          <button className="lg:hidden p-2 rounded-md" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          </button>
          {title && (
            <h1 className="text-lg font-semibold truncate" style={{ color: "var(--text-primary)" }}>{title}</h1>
          )}
          <div className="flex-1" />
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
            style={{ color: "var(--text-secondary)" }}
            title="Back to website"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Back to Site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
          <GlobalSearch />
          <div className="relative">
            <button onClick={() => setNotifOpen(o => !o)} className="relative p-2 rounded-lg transition-colors"
                    style={{ background: notifOpen ? "var(--bg-tertiary)" : "transparent" }}>
              <Bell className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                      style={{ background: "#EF4444" }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-80 rounded-xl overflow-hidden shadow-xl border z-50"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border-default)" }}
                >
                  <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border-subtle)" }}>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Notifications</span>
                    <button onClick={markAllRead} className="text-[10px] font-semibold" style={{ color: "var(--brand-electric)" }}>
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>No notifications</div>
                    ) : notifications.map((n: any) => (
                      <div key={n.id} className="p-3 border-b text-xs hover:bg-white/5 transition-colors" style={{ borderColor: "var(--border-subtle)" }}>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.is_read ? "var(--text-subtle)" : "var(--brand-electric)" }} />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{n.title}</div>
                            {n.message && <div className="mt-0.5" style={{ color: "var(--text-muted)" }}>{n.message}</div>}
                            <div className="mt-1 text-[10px]" style={{ color: "var(--text-subtle)" }}>
                              {new Date(n.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
