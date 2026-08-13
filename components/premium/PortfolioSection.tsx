"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowUpRight, Lock, Sparkles, Code2, Smartphone, Globe, Megaphone, Brain, Cloud, BarChart3 } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useContent } from "@/app/components/ContentProvider"
import SafeImage from "@/app/components/SafeImage"

// Premium placeholder "project" cards for when real portfolio is not yet public.
// These use category-based professional illustrations — no fake metrics, no fake company names.
const CATEGORY_META: Record<string, { icon: any; gradient: string; label: string; color: string }> = {
  ai: { icon: Brain, gradient: "from-blue-600 to-violet-600", label: "AI / ML", color: "#8B5CF6" },
  apps: { icon: Smartphone, gradient: "from-indigo-600 to-blue-600", label: "Mobile Apps", color: "#33B5FF" },
  websites: { icon: Globe, gradient: "from-slate-600 to-blue-700", label: "Web Platform", color: "#1E6BFF" },
  branding: { icon: Sparkles, gradient: "from-teal-500 to-cyan-600", label: "Branding", color: "#14B8A6" },
  marketing: { icon: Megaphone, gradient: "from-rose-500 to-orange-500", label: "Performance Marketing", color: "#F43F5E" },
  automation: { icon: Code2, gradient: "from-blue-700 to-indigo-800", label: "Automation", color: "#6366F1" },
  saas: { icon: Cloud, gradient: "from-cyan-600 to-blue-700", label: "SaaS", color: "#06B6D4" },
  default: { icon: BarChart3, gradient: "from-blue-600 to-cyan-600", label: "Project", color: "#1E6BFF" }
}

export default function PortfolioSection() {
  const { language } = useLanguage()
  const { siteData } = useContent()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })
  const [hover, setHover] = useState<number | null>(null)

  // Pull real CMS portfolio items. Filter out placeholders that have suspicious fake stats.
  const rawProjects = (siteData.portfolio || []).filter(p => p.title && p.description)
  // Heuristic: any item from CMS with real URLs/screenshots is considered public.
  const hasRealContent = rawProjects.some(p => (p as any).image_url || (p as any).screenshot_url)
  const projects = hasRealContent ? rawProjects : []

  // If there are NO real portfolio items in the CMS, show professional "Private Client Project" placeholders
  // organized by category — these are not fake case studies with fake metrics, they are clearly
  // marked as under NDA / private to demonstrate our capabilities without claiming fake results.
  const placeholderProjects = !hasRealContent ? [
    { id: "nd-1", title: "Private Client Project", category: "ai", gradient: "from-blue-600 to-violet-600", isNda: true, isLarge: true, description: "AI-native platform built for an enterprise client. Details under NDA.", technologies: ["LLM", "RAG", "Vector DB", "Next.js"] },
    { id: "nd-2", title: "Private Client Project", category: "saas", gradient: "from-cyan-600 to-blue-700", isNda: true, isLarge: false, description: "Multi-tenant SaaS platform with billing and RBAC.", technologies: ["Next.js", "Supabase", "Stripe"] },
    { id: "nd-3", title: "Private Client Project", category: "apps", gradient: "from-indigo-600 to-blue-600", isNda: true, isLarge: false, description: "Cross-platform mobile application for a consumer brand.", technologies: ["React Native", "Firebase"] },
    { id: "nd-4", title: "Private Client Project", category: "marketing", gradient: "from-rose-500 to-orange-500", isNda: true, isLarge: false, description: "Performance marketing campaign across Meta + Google.", technologies: ["Meta Ads", "GA4", "Clarity"] },
    { id: "nd-5", title: "Private Client Project", category: "branding", gradient: "from-teal-500 to-cyan-600", isNda: true, isLarge: false, description: "Complete brand identity and design system.", technologies: ["Figma", "Design System"] },
    { id: "cs-1", title: "Coming Soon", category: "default", gradient: "from-slate-700 to-slate-900", isNda: false, isLarge: false, description: "Case studies and public portfolio are being prepared for launch.", technologies: [], isComingSoon: true }
  ] : []

  const renderProjects = projects.length > 0 ? projects : placeholderProjects

  if (renderProjects.length === 0) return null

  return (
    <section id="portfolio" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            {projects.length > 0
              ? (language === "hi" ? "हमारा काम" : "Our Work")
              : (language === "hi" ? "प्रोजेक्ट्स" : "Selected Work")}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>हमारे <span className="text-brand-gradient">इंजीनियर किए हुए</span> प्रोजेक्ट्स</>
            ) : projects.length > 0 ? (
              <>Featured <span className="text-brand-gradient">Case Studies</span></>
            ) : (
              <>Engineered with <span className="text-brand-gradient">precision</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {projects.length > 0
              ? (language === "hi"
                ? "ऐसे प्रोडक्ट्स जो हमने विज़नरी टीमों के लिए बनाए हैं।"
                : "A selection of products and platforms we've engineered for ambitious teams.")
              : (language === "hi"
                ? "अधिकांश एंटरप्राइज़ प्रोजेक्ट्स NDA के अंतर्गत हैं। सार्वजनिक केस स्टडीज़ जल्द आ रही हैं।"
                : "Most enterprise projects are under NDA. Public case studies will be published as client agreements allow.")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderProjects.map((p, i) => {
            const meta = CATEGORY_META[(p as any).category] || CATEGORY_META.default
            const Icon = meta.icon
            const isLarge = i === 0
            const isNda = (p as any).isNda
            const isComingSoon = (p as any).isComingSoon
            const gradient = (p as any).gradient || meta.gradient
            const technologies = (p as any).technologies || []
            const statusBadge = isComingSoon
              ? { text: language === "hi" ? "जल्द आ रहा है" : "Coming Soon", color: "#F59E0B" }
              : isNda
                ? { text: "NDA", color: "#6B7280" }
                : { text: meta.label, color: meta.color }

            return (
              <motion.div
                key={(p as any).id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={`group relative overflow-hidden rounded-2xl ${isLarge ? "lg:col-span-2 lg:row-span-1" : ""}`}
                style={{
                  aspectRatio: isLarge ? "16/9" : "4/3",
                  border: "1px solid var(--border-default)",
                  background: "var(--bg-card)"
                }}
              >
                {/* Gradient backdrop */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-grid-dark opacity-30" />

                {/* Decorative tech pattern */}
                <div aria-hidden="true"
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle, ${meta.color}55 0%, transparent 70%)` }}
                />

                {/* Category icon - large, semi-transparent, floats on hover */}
                <motion.div
                  animate={hover === i ? { scale: 1.1, rotate: -8 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute top-8 right-8"
                >
                  <Icon className="w-16 h-16 sm:w-20 sm:h-20" style={{ color: "rgba(255,255,255,0.15)" }} />
                </motion.div>

                {/* Status badge */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                      background: "rgba(0,0,0,0.35)",
                      backdropFilter: "blur(10px)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.2)"
                    }}>
                    {isNda && <Lock className="w-3 h-3" />}
                    {statusBadge.text}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-end z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    {p.title}
                  </h3>
                  <p className="text-sm text-white/75 mb-4 max-w-md">
                    {p.description}
                  </p>
                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {technologies.slice(0, 4).map((t: string) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                          style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.1)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {!isComingSoon && (
                    <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                      <span>{language === "hi" ? "विवरण NDA के अंतर्गत" : "Details under NDA"}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center mt-10">
            <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
              {language === "hi"
                ? "पब्लिक केस स्टडीज़ जल्द ही यहाँ दिखाई जाएंगी। प्रोजेक्ट शुरू करने के लिए संपर्क करें।"
                : "Public case studies will be published here as they clear client review. Get in touch to start your project."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
