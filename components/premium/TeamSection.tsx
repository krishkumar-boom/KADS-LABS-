"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Linkedin, Twitter, Mail, ExternalLink } from "lucide-react"
import Reveal from "@/components/home/Reveal"
import { useContent } from "@/app/components/ContentProvider"
import { useLanguage } from "@/app/components/LanguageProvider"
import SafeImage from "@/app/components/SafeImage"

export default function TeamSection() {
  const { language } = useLanguage()
  const { siteData } = useContent()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  const leaders = siteData.leadership || []

  return (
    <section id="team" ref={ref} className="relative py-24 sm:py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}>
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            {language === "hi" ? "हमारी टीम" : "Leadership Team"}
          </span>
          <h2 className="section-heading mb-5">
            {language === "hi" ? (
              <>KADS LABS के <span className="text-brand-gradient">पीछे के लोग</span></>
            ) : (
              <>The minds behind <span className="text-brand-gradient">KADS LABS</span></>
            )}
          </h2>
          <p className="section-subheading mx-auto">
            {language === "hi"
              ? "हमारी लीडरशिप टीम जो KADS LABS, KADS MEDIA और KADS TECHNOLOGIES का नेतृत्व कर रही है।"
              : "Meet the visionary leaders driving innovation across KADS LABS, KADS MEDIA, and KADS TECHNOLOGIES."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {leaders.map((leader, i) => (
            <Reveal key={leader.id} delay={i * 0.12} y={20}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4"
                  style={{
                    aspectRatio: "1",
                    background: "linear-gradient(135deg, rgba(30,107,255,0.15), rgba(51,181,255,0.08))",
                    border: "1px solid var(--border-subtle)"
                  }}>
                  <SafeImage
                    src={leader.photo}
                    alt={leader.name}
                    fill
                    containerClassName="w-full h-full"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay with socials */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(5,7,11,0.9) 0%, transparent 50%)" }} />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {leader.social?.linkedin && (
                      <a href={leader.social.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                        style={{ background: "rgba(30,107,255,0.9)" }}>
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {leader.social?.twitter && (
                      <a href={leader.social.twitter} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                        style={{ background: "rgba(51,181,255,0.9)" }}>
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {leader.social?.email && (
                      <a href={`mailto:${leader.social.email}`}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                        style={{ background: "rgba(139,92,246,0.9)" }}>
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1 transition-colors group-hover:text-brand-gradient"
                    style={{ color: "var(--text-primary)" }}>{leader.name}</h3>
                  <p className="text-sm mb-3" style={{ color: "#33B5FF" }}>{leader.designation}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{leader.bio}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
