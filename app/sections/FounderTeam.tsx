"use client"

import { motion } from "framer-motion"
import { Linkedin, Twitter, Mail } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import { useContent } from "../components/ContentProvider"
import SafeImage from "../components/SafeImage"

const socialIcons: Record<string, any> = { linkedin: Linkedin, twitter: Twitter, email: Mail }

export default function FounderTeam() {
  const { content, siteData } = useContent()
  const leaders = siteData.leadership.slice().sort((a, b) => a.order - b.order)

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-electric/10 rounded-full blur-[150px]" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">
            Leadership
          </span>
          <h2 className="section-heading mb-4">
            Meet the <span className="text-gradient">Visionaries</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            The leadership behind KADS LABS, committed to building smarter solutions for businesses worldwide.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {leaders.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.7 }}
              className="premium-card overflow-hidden glow-border group"
            >
              <div className="relative h-80 w-full overflow-hidden bg-navy-900">
                <SafeImage
                  src={member.photo}
                  alt={member.name}
                  fill
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <p className="text-sm text-electric-light font-medium mb-1">{member.designation}</p>
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    {Object.entries(member.social).filter(([_, url]) => url).map(([platform, url]) => {
                      const Icon = socialIcons[platform] || Linkedin
                      return (
                        <a
                          key={platform}
                          href={platform === "email" ? `mailto:${url}` : String(url)}
                          target={platform === "email" ? undefined : "_blank"}
                          rel={platform === "email" ? undefined : "noopener noreferrer"}
                          className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-electric transition-colors"
                          aria-label={`${member.name} ${platform}`}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-white/70 leading-relaxed mb-4">{member.bio}</p>
                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <span key={skill} className="px-2 py-1 rounded-md bg-white/5 text-xs text-white/70">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="mt-12 text-center">
          <p className="text-sm text-white/50">{content.founderNote}</p>
        </AnimatedSection>
      </div>
    </section>
  )
}
