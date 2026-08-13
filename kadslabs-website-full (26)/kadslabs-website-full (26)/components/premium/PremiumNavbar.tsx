"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Menu, X, User, Users, LogOut, LayoutDashboard, UserCircle, ChevronDown, ChevronRight,
  BookOpen, Briefcase, BarChart3, Megaphone, Code2, Brain, Building2, Sparkles, Layers, Shield,
  Phone, ArrowRight, MessageSquare, Cpu, Cloud, Database, GraduationCap, Heart, FileText,
  ShoppingBag, Factory, Smartphone
} from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import { useAuth } from "@/app/components/AuthProvider"
import AuthModal from "@/app/components/AuthModal"
import SafeImage from "@/app/components/SafeImage"
import GlobalSearch from "@/app/components/GlobalSearch"
import ThemeToggle from "@/app/components/ThemeToggle"
import LanguageToggle from "@/app/components/LanguageToggle"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useTheme } from "@/app/components/ThemeProvider"

/**
 * Multi-page enterprise navigation.
 * Architecture restored to stable edge-to-edge fixed layout.
 * Improvements applied surgically:
 *   - Desktop (lg+) shows horizontal links — no hamburger required.
 *   - Mobile always shows Sign In + Get Started quick actions in addition to hamburger.
 *   - Premium glass/blur backdrop active from page load (not just after scroll).
 *   - Crystal-K logo used in navbar.
 *   - Original event handlers, state, mobile drawer, mega menu, auth cluster preserved.
 */

const NAV = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    mega: true,
    columns: [
      {
        title: "Engineering",
        items: [
          { icon: Brain,      label: "AI / ML Solutions",      href: "/services#ai", desc: "Intelligent automation & ML" },
          { icon: Code2,      label: "Web Development",       href: "/services#web", desc: "Modern web applications" },
          { icon: Sparkles,   label: "SaaS Development",      href: "/services#saas", desc: "Multi-tenant platforms" },
          { icon: Smartphone, label: "Mobile Apps",           href: "/services#mobile", desc: "iOS & Android" },
        ],
      },
      {
        title: "Platform & Cloud",
        items: [
          { icon: Cloud,      label: "Cloud Architecture",    href: "/services#cloud", desc: "AWS / Azure / GCP" },
          { icon: Cpu,        label: "DevOps & SRE",          href: "/services#devops", desc: "CI/CD & reliability" },
          { icon: Database,   label: "APIs & Integrations",   href: "/services#api", desc: "REST, GraphQL, systems" },
          { icon: Building2,  label: "Enterprise Software",   href: "/services#enterprise", desc: "Mission-critical" },
        ],
      },
      {
        title: "Growth & Media",
        items: [
          { icon: Megaphone,  label: "Digital Marketing",     href: "/services#marketing", desc: "Performance & brand" },
          { icon: Briefcase,  label: "Branding & Design",     href: "/services#design", desc: "Identity & UI/UX" },
          { icon: BarChart3,  label: "Performance Ads",       href: "/services#ads", desc: "Meta · Google · LinkedIn" },
          { icon: BookOpen,   label: "Content & Video",       href: "/services#content", desc: "Reels, creative, copy" },
        ],
      },
    ],
  },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  {
    label: "Company",
    href: "/about",
    mega: true,
    columns: [
      {
        title: "About",
        items: [
          { icon: Building2,  label: "About KADS LABS",   href: "/about", desc: "Our story & mission" },
          { icon: Users,       label: "Leadership Team",   href: "/about#team", desc: "Founders & directors" },
          { icon: Sparkles,    label: "KADS Technologies", href: "/technologies", desc: "Engineering division" },
          { icon: Megaphone,   label: "KADS Media",        href: "/media", desc: "Marketing division" },
        ],
      },
      {
        title: "Work with us",
        items: [
          { icon: Briefcase,   label: "Careers",           href: "/careers", desc: "Open positions" },
          { icon: MessageSquare, label: "Feedback",        href: "/feedback", desc: "Share your thoughts" },
          { icon: FileText,    label: "Press & Media Kit", href: "/contact", desc: "Brand assets" },
          { icon: Phone,       label: "Contact",           href: "/contact", desc: "Get in touch" },
        ],
      },
      {
        title: "Platform",
        items: [
          { icon: Layers,      label: "Products",          href: "/products", desc: "In-house platforms" },
          { icon: ArrowRight,  label: "Client Portal",     href: "/client", desc: "Project tracking" },
          { icon: Shield,      label: "Founder Login",     href: "/auth?next=/founder", desc: "Internal dashboard" },
        ],
      },
    ],
  },
  { label: "Contact", href: "/contact" },
]

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname.startsWith(href)
}

export default function PremiumNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubnav, setMobileSubnav] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const pathname = usePathname()
  const { user, isAuthenticated, isPrivileged, signOut } = useAuth()
  const { language } = useLanguage()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSubnav(null)
    setMegaOpen(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  return (
    <>
      {/* ===== Top campaign announcement strip (Independence Day) ===== */}
      <TopCampaignStrip />

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
        className="fixed left-0 right-0 z-[60] transition-all duration-300"
        role="navigation"
        aria-label="Primary"
        style={{
          top: "var(--kads-top-offset, 0px)",
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
          paddingLeft: 12,
          paddingRight: 12,
          pointerEvents: "auto",
        }}
      >
        {/* Inner bar — glassmorphic floating pill on scroll, transparent with soft border at top */}
        <div
          className="mx-auto max-w-[1400px] rounded-xl md:rounded-2xl transition-all duration-300"
          style={{
            padding: scrolled ? "0.5rem 0.9rem" : "0.65rem 1.1rem",
            background: isDark
              ? (scrolled ? "color-mix(in srgb, rgba(8,17,31,0.85), transparent)" : "color-mix(in srgb, rgba(5,7,11,0.35), transparent)")
              : (scrolled ? "color-mix(in srgb, rgba(255,255,255,0.85), transparent)" : "color-mix(in srgb, rgba(255,255,255,0.55), transparent)"),
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: `1px solid ${isDark
              ? (scrolled ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.06)")
              : (scrolled ? "rgba(15,23,42,0.08)" : "rgba(15,23,42,0.05)")}`,
            boxShadow: scrolled ? "0 12px 40px -16px rgba(0,0,0,0.5)" : "none",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Logo (always visible, original architecture) */}
            <Link href="/" aria-label="KADS LABS Home" className="flex items-center gap-2.5 group shrink-0">
              <div
                className="relative w-9 h-9 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
                style={{ filter: "drop-shadow(0 4px 14px rgba(30,107,255,0.5))" }}
              >
                <SafeImage
                  src="/logo-crystal.png"
                  alt="KADS LABS"
                  fill
                  containerClassName="w-full h-full"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden sm:block font-bold text-lg tracking-tight leading-none" style={{ color: "var(--text-primary)" }}>
                KADS <span style={{ color: "#33B5FF" }}>LABS</span>
              </span>
            </Link>

            {/* Desktop nav links (lg+ = ≥1024px) — always visible, no hamburger */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV.map(item => {
                const active = isActive(pathname, item.href)
                const open = megaOpen === item.label
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.mega && setMegaOpen(item.label)}
                    onMouseLeave={() => item.mega && setMegaOpen(null)}
                  >
                    {item.mega ? (
                      <Link
                        href={item.href}
                        className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
                        aria-current={active ? "page" : undefined}
                      >
                        {active && (
                          <motion.span
                            layoutId="nav-active-pill"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            className="absolute inset-0 rounded-lg -z-0"
                            style={{ background: "var(--bg-tertiary)" }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                        <ChevronDown className={`relative z-10 w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                      </Link>
                    ) : (
                      <Link
                        href={item.href}
                        className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
                        aria-current={active ? "page" : undefined}
                      >
                        {active && (
                          <motion.span
                            layoutId="nav-active-pill"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            className="absolute inset-0 rounded-lg -z-0"
                            style={{ background: "var(--bg-tertiary)" }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    )}

                    {/* Mega menu */}
                    <AnimatePresence>
                      {item.mega && open && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[820px] pointer-events-auto"
                          style={{ zIndex: 70 }}
                        >
                          <div
                            className="rounded-2xl p-5 grid grid-cols-3 gap-2"
                            style={{
                              background: isDark ? "rgba(8,17,31,0.94)" : "rgba(255,255,255,0.96)",
                              backdropFilter: "blur(28px) saturate(180%)",
                              WebkitBackdropFilter: "blur(28px) saturate(180%)",
                              border: "1px solid var(--border-default)",
                              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(30,107,255,0.08)"
                            }}
                          >
                            {item.columns?.map(col => (
                              <div key={col.title}>
                                <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3 px-2" style={{ color: "#33B5FF" }}>
                                  {col.title}
                                </div>
                                {col.items.map(mi => {
                                  const Icon = mi.icon
                                  return (
                                    <Link key={mi.label} href={mi.href}
                                      className="w-full flex items-start gap-3 px-2 py-2 rounded-lg text-left text-sm transition-all hover:pl-3"
                                      style={{ color: "var(--text-secondary)" }}
                                      onMouseEnter={e => {
                                        e.currentTarget.style.color = "var(--text-primary)"
                                        e.currentTarget.style.background = "var(--bg-tertiary)"
                                      }}
                                      onMouseLeave={e => {
                                        e.currentTarget.style.color = "var(--text-secondary)"
                                        e.currentTarget.style.background = "transparent"
                                      }}
                                    >
                                      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ background: "rgba(30,107,255,0.1)" }}>
                                        <Icon className="w-3.5 h-3.5" />
                                      </div>
                                      <div>
                                        <div className="font-medium" style={{ color: "var(--text-primary)" }}>{mi.label}</div>
                                        <div className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{mi.desc}</div>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            ))}
                            <Link href="/services"
                              className="col-span-3 mt-2 pt-3 border-t flex items-center justify-between px-2"
                              style={{ borderColor: "var(--border-subtle)", color: "#33B5FF" }}>
                              <span className="text-xs font-semibold">View all 18 services</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* Right cluster — desktop (lg+) */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0 pointer-events-auto">
              <GlobalSearch />
              <LanguageToggle />
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 pointer-events-auto"
                    style={{ color: "#33B5FF", background: "rgba(30,107,255,0.1)" }}
                    title="Dashboard"
                    aria-label="Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                  {isPrivileged && (
                    <Link
                      href="/admin"
                      className="p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 pointer-events-auto"
                      style={{ color: "var(--text-muted)", background: "var(--bg-tertiary)" }}
                      title="Admin"
                      aria-label="Admin"
                    >
                      <ShieldIcon className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5 max-w-[160px] pointer-events-auto"
                    style={{ color: "var(--text-secondary)", background: "var(--bg-tertiary)" }}
                  >
                    <UserCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">{user?.full_name || user?.email?.split("@")[0]}</span>
                  </Link>
                  <button
                    onClick={signOut}
                    className="p-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 pointer-events-auto"
                    style={{ color: "var(--text-muted)", background: "var(--bg-tertiary)" }}
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-colors pointer-events-auto"
                    style={{ color: "var(--text-secondary)" }}
                    aria-label="Sign In"
                  >
                    {language === "hi" ? "साइन इन" : "Sign In"}
                  </button>
                  <MagneticButton
                    onClick={() => setAuthOpen(true)}
                    ariaLabel="Get Started"
                    className="pointer-events-auto"
                  >
                    {language === "hi" ? "शुरू करें" : "Get Started"}
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </>
              )}
            </div>

            {/* Mobile/Tablet right cluster */}
            <div className="flex lg:hidden items-center gap-1.5 shrink-0 pointer-events-auto">
              <ThemeToggle />
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="p-2 rounded-lg pointer-events-auto"
                  style={{ color: "#33B5FF", background: "rgba(30,107,255,0.1)" }}
                  aria-label="Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  {/* Always-visible Sign In on mobile/tablet per requirement */}
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg text-sm font-medium pointer-events-auto"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-white pointer-events-auto"
                    style={{ background: "linear-gradient(135deg, #1E6BFF 0%, #33B5FF 100%)" }}
                  >
                    Get Started
                  </button>
                </>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg pointer-events-auto"
                style={{ color: "var(--text-primary)" }}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen drawer (original architecture, z-indexed below nav) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden pt-20 overflow-y-auto pointer-events-auto"
            style={{
              background: "color-mix(in srgb, var(--bg-primary) 97%, transparent)",
              backdropFilter: "blur(28px)"
            }}
          >
            <div className="p-5 space-y-1 pb-24">
              {NAV.map((item, i) => {
                const active = isActive(pathname, item.href)
                const subOpen = mobileSubnav === item.label
                return (
                  <div key={item.label}>
                    {item.mega ? (
                      <>
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          onClick={() => setMobileSubnav(subOpen ? null : item.label)}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-lg font-semibold pointer-events-auto"
                          style={{ color: "var(--text-primary)" }}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${subOpen ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }} />
                        </motion.button>
                        <AnimatePresence>
                          {subOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-4"
                            >
                              {item.columns?.flatMap(c => c.items).map(mi => {
                                const Icon = mi.icon
                                return (
                                  <Link
                                    key={mi.label}
                                    href={mi.href}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm pointer-events-auto"
                                    style={{ color: "var(--text-secondary)" }}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    <Icon className="w-4 h-4" style={{ color: "#33B5FF" }} />
                                    {mi.label}
                                  </Link>
                                )
                              })}
                              <Link
                                href="/services"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium pointer-events-auto"
                                style={{ color: "#33B5FF" }}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                View all services <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center justify-between px-4 py-3.5 rounded-xl text-lg font-semibold pointer-events-auto"
                          style={{
                            color: active ? "#33B5FF" : "var(--text-primary)",
                            background: active ? "rgba(30,107,255,0.08)" : "transparent"
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                          <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                )
              })}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="pt-6 border-t mt-4 space-y-3"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="flex gap-2">
                  <LanguageToggle className="flex-1 justify-center pointer-events-auto" />
                  <ThemeToggle className="flex-1 justify-center pointer-events-auto" variant="button" />
                </div>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium pointer-events-auto"
                      style={{ background: "linear-gradient(135deg,#1E6BFF,#33B5FF)", color: "white" }}
                    >
                      <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium pointer-events-auto"
                      style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                    >
                      <UserCircle className="w-4 h-4" /> Profile
                    </Link>
                    <button
                      onClick={() => { signOut(); setMobileMenuOpen(false) }}
                      className="w-full py-3 rounded-xl font-medium pointer-events-auto"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setAuthOpen(true); setMobileMenuOpen(false) }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium pointer-events-auto"
                      style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border-subtle)" }}
                    >
                      <User className="w-4 h-4" /> Sign In
                    </button>
                    <button
                      onClick={() => { setAuthOpen(true); setMobileMenuOpen(false) }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white pointer-events-auto"
                      style={{ background: "linear-gradient(135deg,#1E6BFF,#33B5FF)" }}
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link
                      href="https://wa.me/917524979551?text=Hi%20KADS%20LABS"
                      target="_blank"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium pointer-events-auto"
                      style={{ background: "#25D36622", color: "#25D366", border: "1px solid #25D36644" }}
                    >
                      <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

/**
 * Thin top announcement strip — Independence Day "Azadi to Grow" campaign.
 * Auto-hides outside the Aug 10–15 campaign window and can be dismissed.
 */
function TopCampaignStrip() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const now = Date.now()
    const start = new Date("2026-08-08T00:00:00+05:30").getTime()
    const end = new Date("2026-08-16T00:00:00+05:30").getTime()
    const dismissed = typeof window !== "undefined" && localStorage.getItem("kads-top-strip") === "azadi-2026"
    const show = now >= start && now <= end && !dismissed
    setVisible(show)
    document.documentElement.style.setProperty("--kads-top-offset", show ? "40px" : "0px")
    return () => { document.documentElement.style.setProperty("--kads-top-offset", "0px") }
  }, [])
  if (!visible) return null
  const dismiss = () => {
    try { localStorage.setItem("kads-top-strip", "azadi-2026") } catch {}
    document.documentElement.style.setProperty("--kads-top-offset", "0px")
    setVisible(false)
  }
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[61] h-10 flex items-center justify-center text-xs font-semibold text-white px-4"
      style={{
        background: "linear-gradient(90deg, #FF9933 0%, #ffffff 50%, #138808 100%)",
        color: "#05070B",
      }}
    >
      <span className="flex items-center gap-2">
        <span>🇮🇳</span>
        <span>INDEPENDENCE DAY SPECIAL</span>
        <span style={{ color: "#0a6b0a", fontWeight: 800 }}>AZADI TO GROW — FLAT 30% OFF</span>
        <span className="opacity-80 hidden sm:inline">· 10–15 August only</span>
      </span>
      <Link
        href="https://wa.me/917524979551?text=Hi%20KADS%20LABS%2C%20I%20want%20to%20claim%20the%20AZADI%20offer"
        target="_blank" rel="noopener noreferrer"
        className="ml-4 px-3 py-1 rounded-md text-[11px] font-bold text-white transition-transform hover:-translate-y-0.5"
        style={{ background: "#05070B" }}
      >
        DM "AZADI" →
      </Link>
      <button onClick={dismiss} aria-label="Dismiss"
        className="absolute right-3 p-1 rounded hover:bg-black/10 text-black/70">
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
