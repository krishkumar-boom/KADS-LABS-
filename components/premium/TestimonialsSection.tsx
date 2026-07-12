"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"

const TESTIMONIALS = [
  {
    quote: "KADS LABS delivered our AI fintech platform ahead of schedule. The team's technical depth and design quality are unmatched in the industry.",
    name: "Vikram Singh",
    role: "CTO, FinEdge Solutions",
    rating: 5,
    color: "#1E6BFF"
  },
  {
    quote: "Our revenue grew 80% in 6 months after KADS MEDIA took over our marketing. Truly result-driven team that understands growth.",
    name: "Neha Agarwal",
    role: "Founder, StyleNest",
    rating: 5,
    color: "#33B5FF"
  },
  {
    quote: "From mobile app to marketing, the KADS team handled everything seamlessly. They're our long-term technology partner now.",
    name: "Sneha Malhotra",
    role: "CEO, LearnSpace",
    rating: 5,
    color: "#8B5CF6"
  },
  {
    quote: "The SaaS dashboard KADS TECHNOLOGIES built is fast, beautiful, and scalable. Our enterprise clients absolutely love it.",
    name: "Karan Mehta",
    role: "Founder, CloudScale",
    rating: 5,
    color: "#10B981"
  },
  {
    quote: "Lead generation campaigns by KADS MEDIA delivered 3x qualified leads while reducing cost per acquisition by 40%.",
    name: "Arun Patel",
    role: "Marketing Head, PropVision",
    rating: 5,
    color: "#F59E0B"
  },
  {
    quote: "The AI automation system KADS built saves us 200+ hours per month. Exceptional engineering quality.",
    name: "Rahul Verma",
    role: "COO, GlobalCorp",
    rating: 5,
    color: "#EF4444"
  }
]

export default function TestimonialsSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const [active, setActive] = useState(0)

  const next = () => setActive(i => (i + 1) % TESTIMONIALS.length)
  const prev = () => setActive(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)

  return (
    <section id="testimonials" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(30,107,255,0.06), transparent 60%)" }}
      />
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            <Star className="w-3 h-3 fill-current" /> {language === "hi" ? "प्रशंसापत्र" : "Testimonials"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>हमारे <span className="text-brand-gradient">खुश ग्राहक</span></>
            ) : (
              <>Trusted by <span className="text-brand-gradient">visionary teams</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "देखिए कि दुनिया भर की कंपनियां KADS LABS के साथ काम करके क्या हासिल कर रही हैं।"
              : "See what companies around the world are saying about working with KADS LABS."}
          </p>
        </Reveal>

        <Reveal>
          <div className="relative max-w-4xl mx-auto">
            {/* Featured testimonial */}
            <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
              style={{ boxShadow: "var(--shadow-brand)" }}>
              <Quote className="absolute top-6 right-6 w-16 h-16 opacity-10" style={{ color: TESTIMONIALS[active].color }} />
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(TESTIMONIALS[active].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xl sm:text-2xl leading-relaxed mb-8 font-medium"
                  style={{ color: "var(--text-primary)" }}>
                  &ldquo;{TESTIMONIALS[active].quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${TESTIMONIALS[active].color}, ${TESTIMONIALS[active].color}99)` }}>
                    {TESTIMONIALS[active].name[0]}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{TESTIMONIALS[active].name}</div>
                    <div className="text-sm" style={{ color: "var(--text-muted)" }}>{TESTIMONIALS[active].role}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: i === active ? "24px" : "8px",
                      background: i === active ? "var(--gradient-brand)" : "var(--border-default)"
                    }}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button onClick={next} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Grid of smaller testimonials */}
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="premium-card"
              onClick={() => setActive(TESTIMONIALS.indexOf(t))}
              style={{ cursor: "pointer" }}
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                &ldquo;{t.quote.length > 120 ? t.quote.slice(0, 120) + "..." : t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: t.color }}>{t.name[0]}</div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</div>
                  <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
