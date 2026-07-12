"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, LayoutDashboard, UserCircle } from "lucide-react"
import MagneticButton from "./MagneticButton"
import { useAuth } from "./AuthProvider"
import AuthModal from "./AuthModal"
import SafeImage from "./SafeImage"
import { useContent } from "./ContentProvider"
import GlobalSearch from "./GlobalSearch"
import ThemeToggle from "./ThemeToggle"
import LanguageToggle from "./LanguageToggle"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [authOpen, setAuthOpen] = useState(false)
  const { user, isAuthenticated, isContentManager, isFounder, isSuperDeveloper, signOut } = useAuth()
  const { siteData } = useContent()
  const menuItems = siteData.navigation.filter(n => n.visible).sort((a, b) => a.order - b.order)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = menuItems.map(item => item.href.slice(1))
      const scrollPosition = window.scrollY + window.innerHeight / 3
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [menuItems])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass py-3 shadow-[0_8px_30px_rgba(0,0,0,0.35)] border-b border-white/5" : "bg-transparent py-5"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto section-padding flex items-center justify-between">
          <a href="#home" onClick={() => handleNavClick("#home")} className="flex items-center gap-3 group" aria-label="KADS LABS Home">
            <div className="relative w-24 h-10 sm:w-28 sm:h-12 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <SafeImage src="./logo.png" alt="KADS LABS Logo" fill containerClassName="w-full h-full" />
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`nav-link ${activeSection === item.href.slice(1) ? "active" : ""}`}
                aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <GlobalSearch />
            <LanguageToggle />
            <ThemeToggle />
            {isAuthenticated && (
              <a href="./profile/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors" aria-label="My Profile">
                <UserCircle className="w-4 h-4" /> Profile
              </a>
            )}
            {isAuthenticated && (
              <a href="./client/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors" aria-label="Client Portal">
                <LayoutDashboard className="w-4 h-4" /> Client
              </a>
            )}
            {isContentManager && (
              <a href="./admin/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors" aria-label="Developer Control Centre">
                <LayoutDashboard className="w-4 h-4" /> Admin
              </a>
            )}
            {isFounder && (
              <a href="./founder/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors" aria-label="Founder Dashboard">
                <LayoutDashboard className="w-4 h-4" /> CRM
              </a>
            )}
            {isSuperDeveloper && (
              <a href="./super/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-electric-light hover:text-white hover:bg-white/5 transition-colors" aria-label="Super Developer Dashboard">
                <LayoutDashboard className="w-4 h-4" /> Super
              </a>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <User className="w-4 h-4 text-electric" />
                  <span className="text-sm text-white/80">{user?.email?.split("@")[0]}</span>
                </div>
                <button onClick={signOut} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors" aria-label="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <MagneticButton onClick={() => setAuthOpen(true)} className="text-sm px-5 py-2.5">Sign In</MagneticButton>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-electric transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 glass pt-24 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              <div className="py-2"><LanguageToggle /></div>
              <div className="py-2"><ThemeToggle /></div>
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-2xl font-semibold ${activeSection === item.href.slice(1) ? "text-electric" : "text-white"}`}
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="py-2"><GlobalSearch /></div>
              {isAuthenticated && <a href="./client/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-semibold text-electric"><LayoutDashboard className="w-6 h-6" /> Client Portal</a>}
              {isContentManager && <a href="./admin/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-semibold text-electric"><LayoutDashboard className="w-6 h-6" /> Admin Panel</a>}
              {isFounder && <a href="./founder/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-semibold text-electric"><LayoutDashboard className="w-6 h-6" /> CRM</a>}
              {isSuperDeveloper && <a href="./super/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-semibold text-electric"><LayoutDashboard className="w-6 h-6" /> Super Dashboard</a>}
              {isAuthenticated && <a href="./profile/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-2xl font-semibold text-white"><UserCircle className="w-6 h-6" /> Profile</a>}
              {isAuthenticated ? (
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-2xl font-semibold text-white/70"><LogOut className="w-6 h-6" /> Sign Out</button>
              ) : (
                <MagneticButton onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }} className="mt-4 text-lg px-8 py-3">Sign In</MagneticButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
