"use client"

import { Compass, LayoutGrid, Cog, Rocket } from "lucide-react"
import Reveal from "./Reveal"
import GlowCard from "./GlowCard"
import { useLanguage } from "@/app/components/LanguageProvider"

const STEPS = [
  {
    n: "01",
    title: "Discovery",
    desc: "Deep-dive into business goals and technical constraints.",
    icon: Compass,
    accent: "rgba(59,130,246,0.22)",
    border: "rgba(59,130,246,0.50)",
    iconColor: "#60A5FA"
  },
  {
    n: "02",
    title: "Architecture",
    desc: "System design built for scale from day one.",
    icon: LayoutGrid,
    accent: "rgba(76,215,246,0.22)",
    border: "rgba(76,215,246,0.50)",
    iconColor: "#4cd7f6"
  },
  {
    n: "03",
    title: "Build",
    desc: "Agile sprints with weekly shippable increments.",
    icon: Cog,
    accent: "rgba(168,85,247,0.20)",
    border: "rgba(168,85,247,0.50)",
    iconColor: "#A855F7"
  },
  {
    n: "04",
    title: "Launch & Scale",
    desc: "CI/CD, monitoring, and continuous improvement.",
    icon: Rocket,
    accent: "rgba(59,130,246,0.22)",
    border: "rgba(59,130,246,0.50)",
    iconColor: "#60A5FA"
  }
]

export default function ProcessSection() {
  const { language } = useLanguage()
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-[#050b18]" />
      <div className="absolute inset-0 bg-grid opacity-[0.12]" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-14 sm:mb-16">
          <span
            className="inline-block px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] text-electric-light border border-electric/25 bg-electric/5 mb-5"
          >
            {language === "hi" ? "डेवलपमेंट प्रोसेस" : "Development Process"}
          </span>
          <h2 className="section-heading mb-4">
            {language === "hi" ? (
              <>हम सॉफ्टवेयर <span className="text-gradient">कैसे बनाते हैं</span></>
            ) : (
              <>How We Build <span className="text-gradient">Software</span></>
            )}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
            {language === "hi"
              ? "डिस्कवरी से स्केल तक एक पारदर्शी, अनुशासित पाइपलाइन।"
              : "A disciplined, transparent pipeline from discovery to scale."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.n} delay={i * 0.08} y={14}>
                <GlowCard
                  glowAccent={s.accent}
                  borderAccent={s.border}
                  className="p-6 sm:p-7 h-full"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-xs font-mono font-semibold tracking-wider"
                      style={{ color: s.iconColor, opacity: 0.8 }}
                    >
                      {s.n}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${s.iconColor}18`,
                        border: `1px solid ${s.border}`
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: s.iconColor }} />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                    {language === "hi"
                      ? ({
                          "Discovery": "डिस्कवरी",
                          "Architecture": "आर्किटेक्चर",
                          "Build": "बिल्ड",
                          "Launch & Scale": "लॉन्च एंड स्केल"
                        } as Record<string, string>)[s.title]
                      : s.title}
                  </h3>
                  <p className="text-sm text-white/55 leading-relaxed">
                    {s.desc}
                  </p>

                  {/* Connecting line between cards on large screens */}
                  {i < STEPS.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden lg:block absolute top-1/2 -right-[10px] w-5 h-px z-20"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,0.15), transparent)"
                      }}
                    />
                  )}
                </GlowCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
