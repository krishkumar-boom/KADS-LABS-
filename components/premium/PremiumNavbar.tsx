"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, LayoutDashboard, UserCircle, ChevronDown, Search, BookOpen, Briefcase, BarChart3, Megaphone, Code2, Brain, Building2, Sparkles, Phone, ArrowRight } from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import { useAuth } from "@/app/components/AuthProvider"
import AuthModal from "@/app/components/AuthModal"
import SafeImage from "@/app/components/SafeImage"
import GlobalSearch from "@/app/components/GlobalSearch"
import ThemeToggle from "@/app/components/ThemeToggle"
import LanguageToggle from "@/app/components/LanguageToggle"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useContent } from "@/app/components/ContentProvider"

const NAV = [
  { label: "Home", href: "#home" },
  {
    label: "Services",
    href: "#services",
    mega: true,
    columns: [
      {
        title: "AI & Engineering",
        items: [
          { icon: Brain, label: "AI Development", href: "#services" },
          { icon: Code2, label: "Custom Software", href: "#services" },
          { icon: Sparkles, label: "SaaS Development", href: "#services" },
          { icon: Building2, label: "Enterprise Solutions", href: "#enterprise" }
        ]
      },
      {
        title: "Products & Design",
        items: [
          { icon: Megaphone, label: "Web Development", href: "#services" },
          { icon: Briefcase, label: "Mobile Apps", href: "#services" },
          { icon: BookOpen, label: "UI/UX & Branding", href: "#services" },
          { icon: BarChart3, label: "Cloud & DevOps", href: "#services" }
        ]
      }
    ]
  },
  { label: "Solutions", href: "#ai-solutions" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Company", href: "#about" },
  { label: "Pricing", href: "#pricing" }
]

export default function PremiumNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [authOpen, setAuthOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)
  const { user, isAuthenticated, isContentManager, isFounder, isSuperDeveloper, signOut } = useAuth()
  const { language } = useLanguage()
  const { siteData } = useContent()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = ["home", "services", "ai-solutions", "products", "industries", "about", "portfolio", "pricing", "team", "faq", "contact"]
      const pos = window.scrollY + window.innerHeight / 3
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.offsetTop <= pos) { setActiveSection(sections[i]); break }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false)
    setMegaOpen(null)
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
        role="navigation"
        style={{
          background: scrolled ? "color-mix(in srgb, var(--bg-primary) 80%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent"
        }}
      >
        <div className="max-w-[1400px] mx-auto section-padding flex items-center justify-between">
          {/* Logo */}
          <a href="#home" onClick={e => { e.preventDefault(); scrollTo("#home") }} className="flex items-center gap-2.5 group" aria-label="KADS LABS Home">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105"
              style={{ filter: "drop-shadow(0 4px 12px rgba(30,107,255,0.4))" }}>
              <SafeImage src="./logo.png" alt="KADS LABS" fill containerClassName="w-full h-full" className="object-contain" priority />
            </div>
            <span className="hidden sm:block font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
              KADS <span style={{ color: "#33B5FF" }}>LABS</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV.map(item => {
              const active = activeSection === item.href.slice(1)
              const isMegaOpen = megaOpen === item.label
              return (
                <div
                  key={item.label}
                  onMouseEnter={() => item.mega && setMegaOpen(item.label)}
                  onMouseLeave={() => item.mega && setMegaOpen(null)}
                  className="relative"
                >
                  <button
                    onClick={() => !item.mega && scrollTo(item.href)}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${active ? "" : ""}`}
                    style={{
                      color: active ? "var(--text-primary)" : "var(--text-secondary)",
                      background: active ? "var(--bg-tertiary)" : "transparent"
                    }}
                  >
                    {item.label}
                    {item.mega && <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaOpen ? "rotate-180" : ""}`} />}
                  </button>

                  {/* Mega menu */}
                  <AnimatePresence>
                    {item.mega && isMegaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[560px]"
                      >
                        <div
                          className="rounded-2xl p-5 grid grid-cols-2 gap-3"
                          style={{
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border-default)",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,107,255,0.1)"
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
                                  <button key={mi.label}
                                    onClick={() => scrollTo(mi.href)}
                                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left text-sm transition-all hover:pl-3"
                                    style={{ color: "var(--text-secondary)" }}
                                    onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)", (e.currentTarget.style.background = "var(--bg-tertiary)"))}
                                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)", (e.currentTarget.style.background = "transparent"))}
                                  >
                                    <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                                      style={{ background: "rgba(30,107,255,0.1)" }}>
                                      <Icon className="w-3.5 h-3.5" style={{ color: "#33B5FF" }} />
                                    </div>
                                    {mi.label}
                                  </button>
                                )
                              })}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            <GlobalSearch />
            <LanguageToggle />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                {isSuperDeveloper && (
                  <a href="./super/" className="p-2 rounded-lg transition-colors"
                    style={{ color: "#33B5FF" }} title="Super Dev" aria-label="Super Dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                  </a>
                )}
                {isContentManager && (
                  <a href="./admin/" className="p-2 rounded-lg transition-colors hover:bg-white/5"
                    style={{ color: "var(--text-muted)" }} title="Admin" aria-label="Admin">
                    <LayoutDashboard className="w-4 h-4" />
                  </a>
                )}
                <a href="./profile/" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-white/5"
                  style={{ color: "var(--text-secondary)" }}>
                  <UserCircle className="w-4 h-4" /> {user?.email?.split("@")[0]}
                </a>
                <button onClick={signOut} className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: "var(--text-muted)" }} aria-label="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setAuthOpen(true)} className="btn-ghost" aria-label="Sign In">
                  {language === "hi" ? "साइन इन" : "Sign In"}
                </button>
                <MagneticButton onClick={() => { setAuthOpen(true); setMobileMenuOpen(false) }} ariaLabel="Get Started">
                  {language === "hi" ? "शुरू करें" : "Get Started"} <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors" style={{ color: "var(--text-primary)" }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden pt-24 overflow-y-auto"
            style={{
              background: "color-mix(in srgb, var(--bg-primary) 96%, transparent)",
              backdropFilter: "blur(28px)"
            }}
          >
            <div className="p-6 space-y-1">
              {NAV.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(item.href)}
                  className="w-full text-left px-4 py-3 rounded-xl text-lg font-semibold flex items-center justify-between"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.label}
                  {item.mega && <ChevronDown className="w-4 h-4" style={{ color: "var(--text-muted)" }} />}
                </motion.button>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="pt-6 flex flex-col gap-3">
                <LanguageToggle />
                <ThemeToggle />
                {isAuthenticated ? (
                  <>
                    <a href="./profile/" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 rounded-xl text-center font-medium"
                      style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                      <UserCircle className="w-4 h-4 inline mr-2" /> Profile
                    </a>
                    <button onClick={() => { signOut(); setMobileMenuOpen(false) }} className="w-full py-3 rounded-xl font-medium"
                      style={{ color: "var(--text-secondary)" }}>Sign Out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setAuthOpen(true); setMobileMenuOpen(false) }}
                      className="w-full py-3 rounded-xl text-center font-medium"
                      style={{ color: "var(--text-secondary)" }}>
                      Sign In
                    </button>
                    <MagneticButton onClick={() => { setAuthOpen(true); setMobileMenuOpen(false) }} className="w-full justify-center py-3" ariaLabel="Get Started">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
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
