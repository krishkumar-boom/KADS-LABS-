"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, Briefcase, FileText, Receipt, MessageSquare,
  UserPlus, Bell, Settings, Shield, Activity, LogOut, Menu, X,
  Bug, FolderKanban, Ticket, BarChart3, LineChart, ChevronRight,
  Sparkles, ChevronDown, Code2, Rocket, Calendar, Home, ExternalLink
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

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/founder", icon: LayoutDashboard },
  { label: "Analytics", href: "/founder#analytics", icon: LineChart },
  {
    label: "Inbox",
    icon: MessageSquare,
    badge: "new",
    children: [
      { label: "All Tickets", href: "/founder#tickets", icon: Ticket },
      { label: "Contact Requests", href: "/founder#contacts", icon: MessageSquare },
      { label: "Career Applications", href: "/hr", icon: UserPlus },
      { label: "Bug Reports", href: "/founder#bugs", icon: Bug },
      { label: "Feedback", href: "/founder#feedback", icon: Sparkles },
      { label: "Quotes", href: "/founder#quotes", icon: FileText }
    ]
  },
  { label: "Projects", href: "/founder#projects", icon: FolderKanban },
  { label: "Clients", href: "/founder#clients", icon: Users },
  { label: "Team", href: "/super", icon: Shield },
  { label: "Developers", href: "/founder#developers", icon: Code2 },
  { label: "Invoices", href: "/founder#invoices", icon: Receipt },
  { label: "Audit Logs", href: "/founder#audit", icon: Shield },
  { label: "Security", href: "/founder#security", icon: Activity },
  { label: "Settings", href: "/founder#settings", icon: Settings }
]

const DEVELOPER_NAV: NavItem[] = [
  { label: "Dashboard", href: "/developer", icon: LayoutDashboard },
  { label: "My Tasks", href: "/developer#tasks", icon: FolderKanban },
  { label: "Assigned Projects", href: "/developer#projects", icon: Briefcase },
  { label: "Bug Tracker", href: "/developer#bugs", icon: Bug },
  { label: "Deployments", href: "/developer#deployments", icon: Rocket },
  { label: "Error Logs", href: "/developer#errors", icon: Activity },
  { label: "Performance", href: "/developer#performance", icon: BarChart3 },
  { label: "Settings", href: "/developer#settings", icon: Settings }
]

const HR_NAV: NavItem[] = [
  { label: "Dashboard", href: "/hr", icon: LayoutDashboard },
  { label: "Applications", href: "/hr#applications", icon: Briefcase },
  { label: "Candidates", href: "/hr#candidates", icon: Users },
  { label: "Interviews", href: "/hr#interviews", icon: Calendar },
  { label: "Settings", href: "/hr#settings", icon: Settings }
]

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Content", href: "/admin#content", icon: FileText },
  { label: "Submissions", href: "/admin#submissions", icon: MessageSquare },
  { label: "Media", href: "/admin#media", icon: FileText },
  { label: "Settings", href: "/admin#settings", icon: Settings }
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

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
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
        background: "var(--bg-secondary)",
        borderColor: "var(--border-subtle)"
      }}>
        {/* Logo */}
        <div className="h-16 px-5 flex items-center gap-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="relative w-9 h-9 rounded-lg overflow-hidden">
            <SafeImage src="/logo-crystal.png" alt="KADS LABS" fill containerClassName="w-full h-full" className="object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm leading-tight" style={{ color: "var(--text-primary)" }}>KADS LABS</div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
              {role === "developer" ? "Developer Panel" : role === "hr" ? "HR Panel" : role === "admin" ? "Admin Panel" : "Founder Dashboard"}
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
                            return (
                              <Link
                                key={child.label}
                                href={child.href || "#"}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                                  active ? "bg-brand-electric/10 text-brand-electric" : "hover:pl-4"
                                )}
                                style={{ color: active ? "var(--brand-electric)" : "var(--text-muted)" }}
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
            return (
              <Link
                key={item.label}
                href={item.href || "#"}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  active ? "bg-brand-electric/10" : "hover:bg-white/5"
                )}
                style={{ color: active ? "var(--brand-electric)" : "var(--text-secondary)" }}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full" style={{ background: "var(--brand-electric)" }} />}
              </Link>
            )
          })}
        </nav>

        {/* User card */}
        <div className="p-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: "var(--bg-tertiary)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                 style={{ background: "var(--gradient-brand)" }}>
              {user?.email?.[0]?.toUpperCase() || "K"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Guest"}
              </div>
              <div className="text-[10px] truncate" style={{ color: "var(--text-subtle)" }}>
                {demoMode ? "Demo Mode" : user?.email}
              </div>
            </div>
            <button onClick={handleSignOut} className="p-1.5 rounded-lg transition-colors hover:bg-white/10" aria-label="Sign out">
              <LogOut className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
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
