"use client"

/**
 * PageShell — consistent layout wrapper for every public marketing page.
 * (Page chrome: nav, footer, particle background, scroll progress, etc. lives in MarketingShell.)
 *
 * Provides:
 *  - Hero with eyebrow + heading + subheading + optional CTA
 *  - Breadcrumb (Home > Section)
 *  - Ambient orbs + grid + noise + gradient accent
 *  - Automatic fade-in entrance
 *
 * Usage (inside MarketingShell):
 *   <PageShell eyebrow="Services" title="What we build" subtitle="...">
 *     <ServicesContent />
 *   </PageShell>
 */

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { ReactNode } from "react"

interface Crumb {
  label: string
  href?: string
}

interface Props {
  eyebrow?: string
  title: string | ReactNode
  subtitle?: string | ReactNode
  crumbs?: Crumb[]
  cta?: ReactNode
  children: ReactNode
  /** Optional accent color (hex) for the hero glow */
  accent?: string
}

export default function PageShell({ eyebrow, title, subtitle, crumbs, cta, children, accent = "#1E6BFF" }: Props) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-28 pb-4 section-padding max-w-[1400px] mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs" style={{ color: "var(--text-subtle)" }}>
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors">
            <Home className="w-3 h-3" />
            <span>Home</span>
          </Link>
          {crumbs?.map((c, i) => (
            <span key={c.label} className="inline-flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              {c.href && i < crumbs.length - 1 ? (
                <Link href={c.href} className="hover:text-[var(--text-secondary)] transition-colors">{c.label}</Link>
              ) : (
                <span style={{ color: "var(--text-secondary)" }}>{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Page Hero */}
      <section className="relative overflow-hidden pb-20 pt-8">
        {/* Noise */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
          }}
        />
        {/* Grid */}
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" style={{ opacity: 0.4 }} />
        {/* Glow orb */}
        <div aria-hidden="true"
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}22 0%, transparent 65%)` }}
        />
        <div aria-hidden="true"
          className="absolute top-20 right-[5%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-[1000px] mx-auto section-padding text-center">
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow-pill mb-6 backdrop-blur-xl inline-flex"
            >
              {eyebrow}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22,1,0.36,1] }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[-0.035em] leading-[1.02] mb-6 text-balance"
            style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-[1.65] mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              {subtitle}
            </motion.p>
          )}

          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              {cta}
            </motion.div>
          )}
        </div>
      </section>

      {/* Page content */}
      <div className="relative z-10 section-padding max-w-[1400px] mx-auto pb-32">
        {children}
      </div>
    </>
  )
}
