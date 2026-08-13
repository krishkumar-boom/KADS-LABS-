"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Linkedin, Building2, Globe, Rocket, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import Reveal from "@/components/home/Reveal"
import SafeImage from "@/app/components/SafeImage"

/**
 * Leadership Team — KADS LABS executive board.
 * Redesigned to match PDF p6: dark navy card, photo on left (4:5),
 * role BADGE over photo corner, name + title (LABS / division),
 * verified bios, single LinkedIn action, NO fabricated stat pills.
 * Bottom strip: "About KADS LABS — Building The Future, Together." + Founded 2024.
 */

type Leader = {
  id: string
  name: string
  badge: string          // top-right badge over photo, e.g. "FOUNDER & CEO"
  rolePrimary: string    // e.g. "Founder & Chief Executive Officer (CEO)"
  companyPrimary: string // "KADS LABS"
  roleSecondary?: string
  companySecondary?: string
  bio: string
  photo: string
  accent: string
  linkedin?: string
}

const LEADERS: Leader[] = [
  {
    id: "shivam",
    name: "Shivam Gupta",
    badge: "FOUNDER & CEO",
    rolePrimary: "Founder & Chief Executive Officer (CEO)",
    companyPrimary: "KADS LABS",
    roleSecondary: "Head of Technology (CTO)",
    companySecondary: "KADS TECHNOLOGIES",
    bio: "Visionary leader and technology enthusiast with a passion for building innovative digital solutions that empower businesses.",
    photo: "/images/team/shivam-gupta.webp",
    accent: "#1E6BFF",
    linkedin: "https://www.linkedin.com/in/shivam-gupta-951112420",
  },
  {
    id: "ayush",
    name: "Ayush Jaiswal",
    badge: "CO-FOUNDER & DIRECTOR",
    rolePrimary: "Co-Founder & Director",
    companyPrimary: "KADS LABS",
    roleSecondary: "Chief Marketing Officer (CMO)",
    companySecondary: "KADS MEDIA",
    bio: "Marketing strategist and growth architect focused on branding, digital marketing, and business expansion.",
    photo: "/images/team/ayush-jaiswal.webp",
    accent: "#8B5CF6",
    linkedin: "https://linkedin.com/in/kadslabs",
  },
  {
    id: "sudheer",
    name: "Sudheer Maddheshiya",
    badge: "CO-FOUNDER & DIRECTOR",
    rolePrimary: "Co-Founder & Director",
    companyPrimary: "KADS LABS",
    roleSecondary: "Chief Administrative Officer (CAO)",
    companySecondary: "KADS MEDIA",
    bio: "Operations expert ensuring seamless administration, team coordination, and business operations excellence.",
    photo: "/images/team/sudheer-maddheshiya.webp",
    accent: "#33B5FF",
    linkedin: "https://linkedin.com/in/kadslabs",
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as const }
  })
}

export default function TeamSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="team" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050913 0%, #070F23 50%, #050913 100%)"
      }}>

      {/* City skyline silhouette bg */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-[280px] opacity-30"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(30,107,255,0.12) 100%)"
          }} />
        {/* Network dots world-map style */}
        <svg className="absolute top-10 left-6 opacity-20" width="260" height="180" viewBox="0 0 260 180" fill="none">
          {Array.from({ length: 14 }).map((_, r) =>
            Array.from({ length: 20 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={15 + c * 13} cy={15 + r * 12} r="1" fill="#33B5FF" />
            ))
          )}
        </svg>
        <svg className="absolute top-6 right-0 opacity-20" width="360" height="240" viewBox="0 0 360 240" fill="none">
          {/* stylized skyline */}
          <rect x="20" y="150" width="18" height="90" fill="#33B5FF" opacity="0.35" />
          <rect x="45" y="120" width="14" height="120" fill="#33B5FF" opacity="0.3" />
          <rect x="66" y="100" width="22" height="140" fill="#33B5FF" opacity="0.4" />
          <rect x="96" y="140" width="16" height="100" fill="#33B5FF" opacity="0.3" />
          <rect x="120" y="80" width="20" height="160" fill="#1E6BFF" opacity="0.45" />
          <rect x="148" y="110" width="16" height="130" fill="#33B5FF" opacity="0.35" />
          <rect x="172" y="60" width="24" height="180" fill="#1E6BFF" opacity="0.5" />
          <rect x="204" y="120" width="18" height="120" fill="#33B5FF" opacity="0.3" />
          <rect x="230" y="90" width="20" height="150" fill="#1E6BFF" opacity="0.4" />
          <rect x="258" y="130" width="16" height="110" fill="#33B5FF" opacity="0.3" />
          <rect x="282" y="70" width="22" height="170" fill="#1E6BFF" opacity="0.45" />
          <rect x="312" y="110" width="18" height="130" fill="#33B5FF" opacity="0.3" />
          {/* spire top lights */}
          {[66, 120, 172, 230, 282].map((x, i) => (
            <circle key={i} cx={x + 11} cy={80 - (i%2)*20} r="2" fill="#33B5FF">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2+i*0.4}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
        {/* Blue glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgba(30,107,255,0.18), transparent)" }} />
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto section-padding">
        <Reveal className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(90deg, transparent, #33B5FF)" }} />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase" style={{ color: "#33B5FF" }}>
              Leadership Team
            </span>
            <span className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(90deg, #33B5FF, transparent)" }} />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-5 text-white"
              style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
            Visionary Leaders. <span style={{ color: "#33B5FF" }}>Driving Excellence.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            Meet the passionate minds behind KADS LABS. Our leadership team combines
            innovation, expertise, and dedication to deliver exceptional results.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #33B5FF)" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#1E6BFF", boxShadow: "0 0 12px #1E6BFF" }} />
            <span className="h-px w-10" style={{ background: "linear-gradient(90deg, #33B5FF, transparent)" }} />
          </div>
        </Reveal>

        {/* 3-up cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {LEADERS.map((leader, i) => (
            <motion.article
              key={leader.id}
              custom={i}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative flex flex-col lg:flex-row h-full rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(11,23,49,0.95), rgba(7,15,35,0.9))",
                border: "1px solid rgba(51,181,255,0.18)",
                boxShadow: "0 14px 40px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(30,107,255,0.08)"
              }}>
              {/* Photo */}
              <div className="relative lg:w-[44%] shrink-0 overflow-hidden" style={{ aspectRatio: "4/5", minHeight: "280px" }}>
                <SafeImage
                  src={leader.photo}
                  alt={leader.name}
                  fill
                  containerClassName="w-full h-full"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={i === 0}
                />
                {/* Gradient overlay for right fade (so text next to photo is legible) + bottom fade */}
                <div aria-hidden className="absolute inset-0"
                  style={{ background: "linear-gradient(90deg, transparent 50%, rgba(7,15,35,0.4) 100%), linear-gradient(180deg, transparent 60%, rgba(7,15,35,0.75) 100%)" }} />

                {/* Badge — top right */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-md font-bold text-[10px] tracking-[0.15em] uppercase text-white"
                  style={{
                    background: `linear-gradient(135deg, ${leader.accent}, ${leader.accent}cc)`,
                    boxShadow: `0 8px 20px -6px ${leader.accent}99`
                  }}>
                  {leader.badge}
                </div>

                {/* Bottom divider line accent */}
                <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${leader.accent}, transparent)` }} />
              </div>

              {/* Text block */}
              <div className="relative p-6 sm:p-7 flex flex-col flex-1 lg:py-8">
                <h3 className="text-2xl sm:text-[1.65rem] font-extrabold tracking-tight leading-[1.05] mb-2 text-white"
                    style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
                  {leader.name}
                </h3>

                <p className="text-sm font-semibold mb-0.5" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {leader.rolePrimary}
                </p>
                <p className="text-sm font-bold mb-3" style={{ color: leader.accent }}>
                  {leader.companyPrimary}
                </p>

                {leader.roleSecondary && (
                  <>
                    <p className="text-sm font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                      {leader.roleSecondary}
                    </p>
                    <p className="text-sm font-semibold mb-4" style={{ color: "#33B5FF" }}>
                      {leader.companySecondary}
                    </p>
                  </>
                )}

                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "rgba(255,255,255,0.62)" }}>
                  {leader.bio}
                </p>

                {/* LinkedIn CTA at bottom */}
                {leader.linkedin && (
                  <div className="mt-auto flex justify-center">
                    <a href={leader.linkedin} target="_blank" rel="noopener noreferrer"
                      aria-label={`${leader.name} on LinkedIn`}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${leader.accent}22, ${leader.accent}44)`,
                        border: `1px solid ${leader.accent}66`,
                        boxShadow: `0 6px 16px -4px ${leader.accent}77`
                      }}>
                      <Linkedin className="w-4 h-4" style={{ color: leader.accent }} />
                    </a>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* ===== ABOUT KADS LABS STRIP (bottom of leadership per PDF p6) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          style={{
            background: "linear-gradient(135deg, rgba(11,23,49,0.8), rgba(7,15,35,0.9))",
            border: "1px solid rgba(51,181,255,0.22)",
            boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)"
          }}>

          {/* Left: About copy */}
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 block" style={{ color: "#33B5FF" }}>
              About KADS LABS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] mb-3 text-white leading-tight"
                style={{ fontFamily: "'Space Grotesk', Inter, sans-serif" }}>
              Building The Future,<br /><span style={{ color: "#33B5FF" }}>Together.</span>
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              KADS LABS is a next-gen technology and digital solutions company empowering
              businesses to transform, scale, and succeed in the digital era.
            </p>
          </div>

          {/* Middle: 4 metric tiles — only "2024 Founded" is a verified fact; other tiles are value props (no fake numbers) */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Building2, value: "2024", label: "Founded", accent: "#33B5FF" },
              { icon: Globe,     value: "Global", label: "Clients", accent: "#1E6BFF" },
              { icon: Rocket,    value: "AI-First", label: "Delivery", accent: "#8B5CF6" },
              { icon: Trophy,    value: "Mission-Driven", label: "Focus", accent: "#33B5FF" },
            ].map(m => {
              const M = m.icon
              return (
                <div key={m.label} className="flex flex-col items-center text-center rounded-xl p-4"
                  style={{
                    background: "rgba(30,107,255,0.06)",
                    border: "1px solid rgba(51,181,255,0.18)"
                  }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                    style={{
                      background: `radial-gradient(circle, ${m.accent}33, transparent)`,
                      border: `1px solid ${m.accent}55`
                    }}>
                    <M className="w-6 h-6" style={{ color: m.accent }} />
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold text-white"
                     style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {m.value}
                  </p>
                  <p className="text-[11px] sm:text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{m.label}</p>
                </div>
              )
            })}
          </div>

          {/* Right: Mission + CTA */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#33B5FF" }}>Our Mission</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.72)" }}>
              To deliver innovative, reliable, and scalable digital solutions
              that drive growth and create lasting impact.
            </p>
            <Link href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #1E6BFF, #33B5FF)",
                boxShadow: "0 10px 24px rgba(30,107,255,0.45)"
              }}>
              Let's Build The Future <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
