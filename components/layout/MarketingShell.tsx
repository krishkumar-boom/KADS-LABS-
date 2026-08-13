"use client"

/**
 * MarketingShell — wraps every public marketing sub-page with PremiumNavbar + PremiumFooter,
 * so all routes (/, /services, /solutions, ..., /contact, /careers, /feedback) share
 * the same navigation, footer, and chrome.
 */
import { ReactNode } from "react"
import PremiumNavbar from "@/components/premium/PremiumNavbar"
import PremiumFooter from "@/components/premium/PremiumFooter"
import ScrollProgress from "@/app/components/ScrollProgress"
import CursorGlow from "@/app/components/CursorGlow"
import FloatingWhatsApp from "@/app/components/FloatingWhatsApp"
import PWARegister from "@/app/components/PWARegister"
import ParticleBackground from "@/app/components/ParticleBackground"

export default function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen outline-none"
      style={{ background: "var(--bg-primary)" }}
    >
      <ScrollProgress />
      <CursorGlow />
      <PremiumNavbar />
      <ParticleBackground />
      <PWARegister />
      {children}
      <PremiumFooter />
      <FloatingWhatsApp />
    </main>
  )
}
