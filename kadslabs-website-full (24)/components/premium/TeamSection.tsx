"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Linkedin, Twitter, Mail } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"
import SafeImage from "@/app/components/SafeImage"

/**
 * Leadership Team — KADS LABS executive board.
 * Premium Fortune-500-style cards with large photos, generous type,
 * glassmorphism, lift-on-hover, blue-glow, and responsive 3/2/1 grid.
 *
 * Branding: tagline "Building Smarter Solutions." is restored in the hero
 * (handled separately) — this section presents the executive team.
 */

type Leader = {
  id: string
  name: string
  designationPrimary: string
  designationSecondary?: string
  bio: string
  photo: string
  accent: string
  social?: { linkedin?: string; twitter?: string; email?: string }
}

const LEADERS: Leader[] = [
  {
    id: "shivam",
    name: "SHIVAM GUPTA",
    designationPrimary: "Founder & Chief Executive Officer (CEO)",
    designationSecondary: "Chief Technology Officer (CTO), KADS Technologies",
    bio: "Founder of KADS LABS, responsible for company vision, enterprise strategy, product innovation, engineering leadership, AI systems, SaaS architecture, and technology operations across KADS LABS and KADS Technologies.",
    photo: "/images/team/shivam-gupta.webp",
    accent: "#1E6BFF",
    social: {
      email: "ceo@kadslabs.com",
      linkedin: "https://linkedin.com/in/kadslabs",
      twitter: "https://x.com/kadslabs"
    }
  },
  {
    id: "ayush",
    name: "AYUSH JAISWAL",
    designationPrimary: "Co-Founder & Director",
    designationSecondary: "Chief Marketing Officer (CMO), KADS Media",
    bio: "Leads global branding, digital marketing, growth strategy, performance marketing, business development, creative campaigns, partnerships, and brand communication for KADS Media.",
    photo: "/images/team/ayush-jaiswal.webp",
    accent: "#8B5CF6",
    social: {
      email: "founderskadslabs@gmail.com",
      linkedin: "https://linkedin.com/in/kadslabs"
    }
  },
  {
    id: "sudheer",
    name: "SUDHEER MADDHESHIYA",
    designationPrimary: "Co-Founder & Director",
    designationSecondary: "Chief Administrative Officer (CAO), KADS Media",
    bio: "Responsible for administration, business operations, organizational management, client coordination, internal systems, and operational excellence across KADS Media.",
    photo: "/images/team/sudheer-maddheshiya.webp",
    accent: "#33B5FF",
    social: {
      email: "founderskadslabs@gmail.com",
      linkedin: "https://linkedin.com/in/kadslabs"
    }
  }
]

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }
  })
}

export default function TeamSection() {
  const { language } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section id="team" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      {/* Glow orbs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(30,107,255,0.12), transparent 70%)" }} />
        <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto section-padding">
        <Reveal className="text-center mb-20">
          <span className="eyebrow-pill mb-6">
            {language === "hi" ? "नेतृत्व टीम" : "Leadership Team"}
          </span>
          <h2 className="section-heading mb-6 text-balance">
            {language === "hi" ? (
              <>हमारी <span className="text-brand-gradient glow-text">कार्यकारी बोर्ड</span></>
            ) : (
              <>The executive <span className="text-brand-gradient glow-text">leadership</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "वे संस्थापक और निर्देशक जो KADS LABS, KADS MEDIA और KADS TECHNOLOGIES की दृष्टि, विकास और संचालन का नेतृत्व कर रहे हैं।"
              : "The founders and directors guiding the vision, engineering, growth and operations of KADS LABS, KADS Media and KADS Technologies."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {LEADERS.map((leader, i) => (
            <motion.article
              key={leader.id}
              custom={i}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative flex flex-col h-full rounded-3xl overflow-hidden will-change-transform"
              style={{
                background: "linear-gradient(145deg, var(--bg-card), var(--bg-secondary))",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "0 10px 40px -15px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              {/* Premium animated gradient border on hover */}
              <div aria-hidden="true"
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${leader.accent}30, transparent 40%, transparent 60%, ${leader.accent}20)`,
                  padding: 1,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              {/* Blue glow on hover */}
              <div aria-hidden="true"
                className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at 50% 0%, ${leader.accent}18, transparent 55%)`,
                  filter: "blur(20px)",
                  zIndex: -1
                }}
              />

              {/* Large profile photo (3:4 aspect ratio, faces properly framed) */}
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5", background: `linear-gradient(160deg, ${leader.accent}20, var(--bg-tertiary))` }}>
                <SafeImage
                  src={leader.photo}
                  alt={leader.name}
                  fill
                  containerClassName="w-full h-full"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={i === 0}
                />

                {/* Bottom gradient over photo for contrast with text below */}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5"
                  style={{ background: "linear-gradient(to top, var(--bg-secondary) 10%, transparent)" }} />

                {/* Accent color top strip */}
                <div aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-[3px] opacity-80"
                  style={{ background: `linear-gradient(90deg, ${leader.accent}, #33B5FF)` }}
                />

                {/* Social icons — slide up on hover */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 translate-y-[-8px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  {leader.social?.linkedin && (
                    <a href={leader.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${leader.name} LinkedIn`}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                      style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {leader.social?.twitter && (
                    <a href={leader.social.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${leader.name} Twitter`}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                      style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {leader.social?.email && (
                    <a href={`mailto:${leader.social.email}`} aria-label={`Email ${leader.name}`}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                      style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Text block — premium sizing per spec */}
              <div className="relative p-7 sm:p-8 flex flex-col flex-1">
                {/* Name: 30–36px desktop, weight 800 */}
                <h3
                  className="tracking-tight leading-[1.05] mb-4 transition-all duration-300 group-hover:tracking-[-0.02em]"
                  style={{
                    fontSize: "clamp(1.75rem, 3.3vw, 2.25rem)",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                    letterSpacing: "-0.01em"
                  }}
                >
                  {leader.name}
                </h3>

                {/* Primary designation */}
                <div
                  className="font-semibold leading-snug mb-1.5"
                  style={{
                    fontSize: "clamp(1rem, 1.45vw, 1.15rem)",
                    color: leader.accent,
                    lineHeight: 1.45
                  }}
                >
                  {leader.designationPrimary}
                </div>

                {/* Secondary designation */}
                {leader.designationSecondary && (
                  <div
                    className="font-medium mb-5"
                    style={{
                      fontSize: "clamp(0.92rem, 1.25vw, 1.02rem)",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5
                    }}
                  >
                    {leader.designationSecondary}
                  </div>
                )}

                {/* Divider */}
                <div className="w-12 h-[2px] rounded-full mb-5 transition-all duration-500 group-hover:w-20"
                  style={{ background: `linear-gradient(90deg, ${leader.accent}, transparent)` }}
                />

                {/* Bio — 15–16px, relaxed line height */}
                <p
                  className="leading-relaxed flex-1"
                  style={{
                    fontSize: "clamp(0.93rem, 1.2vw, 1rem)",
                    color: "var(--text-muted)",
                    lineHeight: 1.7
                  }}
                >
                  {leader.bio}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
