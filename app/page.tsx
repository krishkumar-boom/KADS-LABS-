"use client"

import { useEffect } from "react"
import LoadingScreen from "./components/LoadingScreen"
import ScrollProgress from "./components/ScrollProgress"
import MetadataUpdater from "./components/MetadataUpdater"
import PWARegister from "./components/PWARegister"
import ErrorBoundary from "./components/ErrorBoundary"
import { trackEvent } from "./components/admin/AnalyticsPanel"
import PremiumNavbar from "@/components/premium/PremiumNavbar"
import PremiumHero from "@/components/premium/PremiumHero"
import TrustedCompanies from "@/components/premium/TrustedCompanies"
import ServicesSection from "@/components/premium/ServicesSection"
import AboutSection from "@/components/premium/AboutSection"
import IndustriesSection from "@/components/premium/IndustriesSection"
import PortfolioSection from "@/components/premium/PortfolioSection"
import ProductsSection from "@/components/premium/ProductsSection"
import TechnologiesSection from "@/components/premium/TechnologiesSection"
import DashboardPreview from "@/components/premium/DashboardPreview"
import AISolutions from "@/components/premium/AISolutions"
import EnterpriseSection from "@/components/premium/EnterpriseSection"
import PricingSection from "@/components/premium/PricingSection"
import TestimonialsSection from "@/components/premium/TestimonialsSection"
import TeamSection from "@/components/premium/TeamSection"
import PremiumFAQ from "@/components/premium/PremiumFAQ"
import PremiumFooter from "@/components/premium/PremiumFooter"

// Legacy sections still retained for their Supabase forms/contact & career/blog logic
import dynamic from "next/dynamic"
const Careers = dynamic(() => import("./sections/Careers"), { loading: () => null })
const Blogs = dynamic(() => import("./sections/Blogs"), { loading: () => null })

// Lightweight cursor glow & particle background kept (performance-friendly)
import ParticleBackground from "./components/ParticleBackground"

export default function Home() {
  useEffect(() => {
    if (typeof window === "undefined") return
    trackEvent("page_view", { path: window.location.pathname, referrer: document.referrer })
  }, [])

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <LoadingScreen />
        <ScrollProgress />
        <PremiumNavbar />
        <ParticleBackground />
        <MetadataUpdater />
        <PWARegister />

        <PremiumHero />
        <TrustedCompanies />
        <ServicesSection />
        <AboutSection />
        <IndustriesSection />
        <PortfolioSection />
        <ProductsSection />
        <TechnologiesSection />
        <DashboardPreview />
        <AISolutions />
        <EnterpriseSection />
        <PricingSection />
        <TestimonialsSection />
        <TeamSection />
        <Blogs />
        <Careers />
        <PremiumFAQ />
        <PremiumFooter />
      </main>
    </ErrorBoundary>
  )
}
