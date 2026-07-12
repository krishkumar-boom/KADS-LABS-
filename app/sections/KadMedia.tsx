"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import MagneticButton from "../components/MagneticButton"
import { useContent } from "../components/ContentProvider"
import SafeImage from "../components/SafeImage"
import { useLanguage } from "../components/LanguageProvider"
import { getIcon } from "@/lib/icons"
import GlowCard from "@/components/home/GlowCard"

const colorClasses: Record<string, { badge: string; title: string; card: string; icon: string; step: string }> = {
  purple: {
    badge: "text-purple-300 bg-purple-500/10 border-purple-500/20",
    title: "text-purple-400",
    card: "border-purple-500/20 hover:border-purple-500/40",
    icon: "text-purple-400",
    step: "text-purple-400/30"
  },
  blue: {
    badge: "text-electric-light bg-electric/10 border-electric/20",
    title: "text-electric",
    card: "border-white/10 hover:border-electric/40",
    icon: "text-electric",
    step: "text-electric/20"
  }
}

export default function KadMedia() {
  const { content, siteData } = useContent()
  const { t } = useLanguage()
  const division = siteData.divisions.find(d => d.id === "kads-media")
  const services = siteData.services.filter(s => s.divisionId === "kads-media").sort((a, b) => a.order - b.order)
  const process = siteData.process.filter(p => p.divisionId === "kads-media").sort((a, b) => a.order - b.order)
  const industries = siteData.industries.filter(i => i.divisionId === "kads-media").sort((a, b) => a.order - b.order)
  const portfolio = siteData.divisionPortfolio.filter(p => p.divisionId === "kads-media").sort((a, b) => a.order - b.order)
  const testimonials = siteData.divisionTestimonials.filter(t => t.division === "KADS Media" || t.division === "kads-media").sort((a, b) => a.order - b.order)
  const theme = colorClasses[division?.color || "purple"]

  if (!division) return null

  return (
    <section id="divisions" className="relative min-h-screen py-24 sm:py-32 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-[#0a1229] to-navy-950" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-20 pt-16">
          <div className="relative w-32 h-20 sm:w-40 sm:h-24 mx-auto mb-6 rounded-xl overflow-hidden bg-navy-950/50">
            <SafeImage src="./logo-media.png" alt="KADS MEDIA" fill containerClassName="w-full h-full" className="object-contain p-2" />
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-white/80">{division.subtitle}</span>
          </div>
          <h2 className="section-heading mb-6">
            {division.title.split(" ")[0]} <span className={theme.title}>{division.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-4">{content.mediaTitle}</p>
          <p className="text-base text-white/60 max-w-2xl mx-auto mb-10">{content.mediaDescription}</p>
          <MagneticButton href={division.ctaHref} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500" ariaLabel={division.cta}>
            {division.cta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </MagneticButton>
        </AnimatedSection>

        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm border mb-4 ${theme.badge}`}>{t("services.title")}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("media.servicesTitle", "Full-Spectrum Digital Marketing")}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon)
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.5 }}
                >
                  <GlowCard
                    glowAccent="rgba(168,85,247,0.20)"
                    borderAccent="rgba(168,85,247,0.50)"
                    className="p-5 h-full"
                  >
                    <Icon className={`w-6 h-6 ${theme.icon} mb-3`} />
                    <h4 className="text-base font-bold mb-1 text-white">{service.title}</h4>
                    <p className="text-sm text-white/60">{service.description}</p>
                  </GlowCard>
                </motion.div>
              )
            })}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm border mb-4 ${theme.badge}`}>{t("media.processLabel", "Working Process")}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("media.processTitle", "How We Drive Growth")}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {process.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative premium-card p-5 text-center glow-border"
              >
                <span className={`text-3xl font-bold ${theme.step} absolute top-3 left-4`}>{item.step}</span>
                <h4 className="text-base font-bold mt-6 mb-1">{item.title}</h4>
                <p className="text-xs text-white/50">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm border mb-4 ${theme.badge}`}>{t("media.industriesLabel", "Industries We Serve")}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("media.industriesTitle", "Marketing Expertise Across Sectors")}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {industries.map((industry, index) => {
              const Icon = getIcon(industry.icon)
              return (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="premium-card p-4 text-center glow-border"
                >
                  <Icon className={`w-7 h-7 ${theme.icon} mx-auto mb-2`} />
                  <span className="text-sm font-medium">{industry.title}</span>
                </motion.div>
              )
            })}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm border mb-4 ${theme.badge}`}>{t("portfolio.title")}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("media.portfolioTitle", "Campaigns That Delivered Results")}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br ${item.gradient || "from-purple-600 to-blue-800"} p-6 flex flex-col justify-end group cursor-pointer premium-card`}
                tabIndex={0}
                role="button"
                aria-label={`${item.title} - ${item.category}`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10">
                  <span className="inline-block self-start px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm mb-3 uppercase tracking-wider">{item.category}</span>
                  <h4 className="text-xl font-bold">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("media.testimonialsTitle", "Client Success Stories")}</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="premium-card p-6 glow-border"
              >
                <p className="text-white/80 mb-6 leading-relaxed">&ldquo;{item.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-white/50">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
