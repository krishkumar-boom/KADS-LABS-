"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import MagneticButton from "../components/MagneticButton"
import { useContent } from "../components/ContentProvider"
import SafeImage from "../components/SafeImage"
import { useLanguage } from "../components/LanguageProvider"
import { getIcon } from "@/lib/icons"
import GlowCard from "@/components/home/GlowCard"

const colorClasses: Record<string, { badge: string; title: string; card: string; icon: string; step: string }> = {
  blue: {
    badge: "text-electric-light bg-electric/10 border-electric/20",
    title: "text-electric",
    card: "border-white/10 hover:border-electric/40",
    icon: "text-electric",
    step: "text-electric/20"
  },
  purple: {
    badge: "text-purple-300 bg-purple-500/10 border-purple-500/20",
    title: "text-purple-400",
    card: "border-purple-500/20 hover:border-purple-500/40",
    icon: "text-purple-400",
    step: "text-purple-400/30"
  }
}

export default function KadTech() {
  const { content, siteData } = useContent()
  const { t } = useLanguage()
  const division = siteData.divisions.find(d => d.id === "kads-tech")
  const services = siteData.services.filter(s => s.divisionId === "kads-tech").sort((a, b) => a.order - b.order)
  const process = siteData.process.filter(p => p.divisionId === "kads-tech").sort((a, b) => a.order - b.order)
  const portfolio = siteData.divisionPortfolio.filter(p => p.divisionId === "kads-tech").sort((a, b) => a.order - b.order)
  const testimonials = siteData.divisionTestimonials.filter(t => t.division === "KADS Technologies" || t.division === "kads-tech").sort((a, b) => a.order - b.order)
  const techStack = ["React", "Next.js", "React Native", "Flutter", "Node.js", "Express", "Python", "TypeScript", "Supabase", "Firebase", "PostgreSQL", "MongoDB", "Docker", "AWS", "GitHub", "Vercel", "OpenAI", "Claude", "Gemini", "DeepSeek", "RAG", "Vector Database"]
  const theme = colorClasses[division?.color || "blue"]

  if (!division) return null

  return (
    <section id="services" className="relative min-h-screen py-24 sm:py-32 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-[#071025] to-navy-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric/10 rounded-full blur-[180px]" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-20 pt-16">
          <div className="relative w-32 h-20 sm:w-40 sm:h-24 mx-auto mb-6 rounded-xl overflow-hidden bg-navy-950/50">
            <SafeImage src="./logo-tech.png" alt="KADS TECHNOLOGIES" fill containerClassName="w-full h-full" className="object-contain p-2" />
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card mb-6">
            <span className="w-2 h-2 rounded-full bg-electric animate-pulse" />
            <span className="text-sm font-medium text-white/80">{division.subtitle}</span>
          </div>
          <h2 className="section-heading mb-6">
            {division.title.split(" ")[0]} <span className={theme.title}>{division.title.split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-4">{content.techTitle}</p>
          <p className="text-base text-white/60 max-w-2xl mx-auto mb-10">{content.techDescription}</p>
          <MagneticButton href={division.ctaHref} ariaLabel={division.cta}>
            {division.cta}
            <ArrowRight className="ml-2 w-4 h-4" />
          </MagneticButton>
        </AnimatedSection>

        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm border mb-4 ${theme.badge}`}>{t("tech.servicesLabel", "Development Services")}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("tech.servicesTitle", "Technology Solutions We Build")}</h3>
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
                    glowAccent="rgba(59,130,246,0.18)"
                    borderAccent="rgba(59,130,246,0.45)"
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
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm border mb-4 ${theme.badge}`}>{t("tech.stackLabel", "Technology Stack")}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("tech.stackTitle", "Modern Tools, Proven Results")}</h3>
          </div>
          <div className="premium-card p-8 sm:p-10 glow-border">
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white/80 hover:bg-electric/20 hover:border-electric/30 transition-colors cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm border mb-4 ${theme.badge}`}>{t("tech.processLabel", "Development Process")}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("tech.processTitle", "How We Build Software")}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {process.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="relative premium-card p-5 glow-border"
              >
                <span className={`text-4xl font-bold ${theme.step} absolute top-3 right-4`}>{item.step}</span>
                <h4 className="text-base font-bold mt-2 mb-1">{item.title}</h4>
                <p className="text-xs text-white/50">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm border mb-4 ${theme.badge}`}>{t("tech.whyLabel", "Why Choose KADS Technologies")}</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("tech.whyTitle", "Engineering Excellence at Scale")}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              "Enterprise Architecture", "AI Powered", "Cloud Native", "Secure", "Fast", "SEO Optimized", "Scalable", "Modern UI", "Long-Term Support"
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="premium-card p-5 flex items-start gap-4 glow-border"
              >
                <CheckCircle2 className={`w-6 h-6 ${theme.icon} flex-shrink-0 mt-0.5`} />
                <div>
                  <h4 className="text-base font-bold mb-1">{item}</h4>
                  <p className="text-sm text-white/60">Built into every project we deliver.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">{t("tech.portfolioTitle", "Recent Engineering Deliveries")}</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br ${item.gradient || "from-blue-600 to-cyan-600"} p-6 flex flex-col justify-end group cursor-pointer premium-card`}
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
      </div>
    </section>
  )
}
