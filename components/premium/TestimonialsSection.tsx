"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight, Award, ShieldCheck, Clock, Users } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useContent } from "@/app/components/ContentProvider"

interface Testimonial {
  id?: string
  quote: string
  name: string
  role?: string
  company?: string
  rating?: number
  avatar_url?: string
  color?: string
}

const TRUST_METRICS = [
  { icon: ShieldCheck, label: "Enterprise-Grade", color: "#1E6BFF" },
  { icon: Clock, label: "On-Time Delivery", color: "#33B5FF" },
  { icon: Award, label: "Quality Assured", color: "#8B5CF6" },
  { icon: Users, label: "Long-Term Partners", color: "#10B981" },
]

export default function TestimonialsSection() {
  const { language } = useLanguage()
  const { siteData } = useContent()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const [active, setActive] = useState(0)

  // Pull real testimonials from CMS (site-data). If none, we render a trust block instead of fake quotes.
  const testimonials: Testimonial[] = Array.isArray((siteData as any)?.testimonials)
    ? (siteData as any).testimonials.filter((t: any) => t && t.quote && t.name)
    : []

  const hasTestimonials = testimonials.length > 0

  useEffect(() => {
    if (!hasTestimonials) return
    const id = setInterval(() => setActive(i => (i + 1) % testimonials.length), 6000)
    return () => clearInterval(id)
  }, [hasTestimonials, testimonials.length])

  const next = () => setActive(i => (i + 1) % testimonials.length)
  const prev = () => setActive(i => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <section id="testimonials" ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(30,107,255,0.06), transparent 60%)" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            <Star className="w-3 h-3 fill-current" />
            {language === "hi" ? "विश्वास और गुणवत्ता" : "Trust & Quality"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>हमारे काम का <span className="text-brand-gradient">प्रमाण</span></>
            ) : hasTestimonials ? (
              <>Trusted by <span className="text-brand-gradient">visionary teams</span></>
            ) : (
              <>Built on <span className="text-brand-gradient">trust & quality</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "हम एंटरप्राइज़-ग्रेड क्वालिटी, समय पर डिलीवरी और लंबे समय की पार्टनरशिप पर विश्वास करते हैं।"
              : hasTestimonials
              ? "See what companies around the world are saying about working with KADS LABS."
              : "We don't rely on stock quotes — our work speaks for itself. Enterprise-grade engineering, transparent delivery, long-term partnerships."}
          </p>
        </Reveal>

        {hasTestimonials ? (
          <Reveal>
            <div className="relative max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
                style={{ boxShadow: "var(--shadow-brand)" }}>
                <Quote className="absolute top-6 right-6 w-16 h-16 opacity-10" style={{ color: testimonials[active].color || "#1E6BFF" }} />
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonials[active].rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl sm:text-2xl leading-relaxed mb-8 font-medium" style={{ color: "var(--text-primary)" }}>
                    &ldquo;{testimonials[active].quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${testimonials[active].color || "#1E6BFF"}, ${testimonials[active].color || "#33B5FF"}99)` }}>
                      {testimonials[active].name[0]}
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{testimonials[active].name}</div>
                      <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                        {testimonials[active].role && testimonials[active].company
                          ? `${testimonials[active].role}, ${testimonials[active].company}`
                          : testimonials[active].role || testimonials[active].company || ""}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                  aria-label="Previous">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
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
                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                  aria-label="Next">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          /* Trust metrics grid — shown when no CMS testimonials yet (no fake data!) */
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {TRUST_METRICS.map((m, i) => {
                const Icon = m.icon
                return (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    className="premium-card flex flex-col items-center text-center gap-3 py-8"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${m.color}20, ${m.color}40)`,
                        border: `1px solid ${m.color}30`,
                        boxShadow: `0 8px 24px ${m.color}20`
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: m.color }} />
                    </div>
                    <div className="font-semibold text-sm sm:text-base" style={{ color: "var(--text-primary)" }}>
                      {language === "hi"
                        ? ({ "Enterprise-Grade": "एंटरप्राइज़-ग्रेड", "On-Time Delivery": "समय पर डिलीवरी", "Quality Assured": "गुणवत्ता आश्वासन", "Long-Term Partners": "दीर्घकालिक साझेदार" } as Record<string,string>)[m.label] || m.label
                        : m.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-10 text-sm"
              style={{ color: "var(--text-subtle)" }}
            >
              {language === "hi"
                ? "असली ग्राहकों की समीक्षाएं जल्द ही जोड़ी जाएंगी।"
                : "Client testimonials will be published here as we receive them — we don't use placeholder reviews."}
            </motion.p>
          </Reveal>
        )}

        {/* Process promise strip */}
        <Reveal className="mt-16">
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
            style={{
              background: "var(--gradient-glass)",
              border: "1px solid var(--border-default)"
            }}
          >
            <div>
              <h4 className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
                {language === "hi" ? "हर प्रोजेक्ट पर हमारी प्रतिबद्धता" : "Our commitment on every project"}
              </h4>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {language === "hi"
                  ? "पारदर्शी संचार, समय पर डिलीवरी, और एंटरप्राइज़-ग्रेड क्वालिटी।"
                  : "Transparent communication, on-time delivery, and enterprise-grade quality — guaranteed."}
              </p>
            </div>
            <a
              href={`mailto:founderskadslabs@gmail.com?subject=Project%20Inquiry`}
              className="btn-primary text-sm whitespace-nowrap"
            >
              {language === "hi" ? "बातचीत शुरू करें" : "Start a Conversation"}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
