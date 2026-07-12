"use client"

import { ArrowUpRight, Cpu, Megaphone } from "lucide-react"
import GlowCard from "./GlowCard"
import Reveal from "./Reveal"
import { useContent } from "@/app/components/ContentProvider"
import { useLanguage } from "@/app/components/LanguageProvider"

/**
 * CoreEcosystem — "Two Divisions. One Standard." showcase.
 * Side-by-side GlowCards for KADS Technologies (electric blue) and KADS Media
 * (amethyst purple) with mouse-tracked radial glows. Clicking a card scrolls
 * to the corresponding deep-dive section.
 */
export default function CoreEcosystem() {
  const { t, language } = useLanguage()
  const { siteData } = useContent()

  const tech = siteData.divisions.find(d => d.id === "kads-tech")
  const media = siteData.divisions.find(d => d.id === "kads-media")

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      id="ecosystem"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-[#060b1b] to-navy-950" />
      <div className="absolute inset-0 bg-grid opacity-[0.15]" />
      {/* soft center glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(168,85,247,0.08) 50%, transparent 75%)"
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-14 sm:mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] text-electric-light border border-electric/25 bg-electric/5 mb-5"
          >
            {language === "hi" ? "कोर इकोसिस्टम" : "Core Ecosystem"}
          </span>
          <h2 className="section-heading mb-4">
            {language === "hi" ? (
              <>दो डिवीजन। <span className="text-gradient">एक मानक।</span></>
            ) : (
              <>Two Divisions. <span className="text-gradient">One Standard.</span></>
            )}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
            {language === "hi"
              ? "इंजीनियरिंग परिशुद्धता और क्रिएटिव वेग का संगम — एक-दूसरे के साथ सहजता से काम करने के लिए बनाया गया।"
              : "Engineering precision meets creative velocity — built to work seamlessly together."}
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* KADS Technologies */}
          <Reveal delay={0.05} y={16}>
            <GlowCard
              glowAccent="rgba(59,130,246,0.22)"
              borderAccent="rgba(59,130,246,0.55)"
              onClick={() => scrollTo("services")}
              className="p-7 sm:p-9 h-full group"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] text-electric-light border border-electric/25 bg-electric/5">
                  <Cpu className="w-3 h-3" /> Division 01 — Tech
                </span>
                <ArrowUpRight className="w-5 h-5 text-electric-light/60 group-hover:text-electric-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                KADS <span className="text-electric-light">Technologies</span>
              </h3>
              <p className="text-sm sm:text-base text-white/60 mb-6 max-w-md leading-relaxed">
                {tech?.description ||
                  "Enterprise-grade SaaS platforms, bespoke AI integrations, and zero-downtime cloud architecture."}
              </p>
              <div className="flex flex-wrap gap-2">
                {["Cloud Native", "AI & ML Ops", "API Architecture", "Zero-Trust Security"].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 bg-white/[0.04] border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlowCard>
          </Reveal>

          {/* KADS Media */}
          <Reveal delay={0.12} y={16}>
            <GlowCard
              glowAccent="rgba(168,85,247,0.22)"
              borderAccent="rgba(168,85,247,0.55)"
              onClick={() => scrollTo("divisions")}
              className="p-7 sm:p-9 h-full group"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] text-amethyst border border-amethyst/25 bg-amethyst/5">
                  <Megaphone className="w-3 h-3" /> Division 02 — Media
                </span>
                <ArrowUpRight className="w-5 h-5 text-amethyst/60 group-hover:text-amethyst group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
                KADS <span className="text-amethyst">Media</span>
              </h3>
              <p className="text-sm sm:text-base text-white/60 mb-6 max-w-md leading-relaxed">
                {media?.description ||
                  "Premium brand systems and high-conversion marketing engines for tech enterprises."}
              </p>
              <div className="flex flex-wrap gap-2">
                {["Brand Identity", "Performance Ads", "Content Systems"].map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 bg-white/[0.04] border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
