"use client"

import { motion } from "framer-motion"
import { Send, MapPin, Phone, Mail, Globe, Clock } from "lucide-react"
import { useState } from "react"
import SafeImage from "../components/SafeImage"
import { useContent } from "../components/ContentProvider"
import { getIcon } from "@/lib/icons"

export default function Footer() {
  const { siteData } = useContent()
  const { footer, contact, social } = siteData
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="relative bg-navy-950 border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-electric/5 to-transparent" />
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          <div className="lg:col-span-4">
            <a href="#home" onClick={() => scrollToSection("#home")} className="flex items-center gap-3 mb-6" aria-label="KADS LABS Home">
              <div className="relative w-24 h-10 rounded-lg overflow-hidden bg-navy-950/50">
                <SafeImage src="./logo.png" alt="KADS LABS" fill containerClassName="w-full h-full" className="object-contain p-1" />
              </div>
            </a>
            <p className="text-white/60 mb-6 leading-relaxed max-w-sm">{footer.brandDescription}</p>
            <div className="flex gap-3">
              {social.slice().sort((a, b) => a.order - b.order).map((link) => {
                const Icon = getIcon(link.icon)
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-electric/50 hover:bg-electric/10 transition-colors"
                    aria-label={`Follow KADS LABS on ${link.platform}`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {footer.columns.map((column, idx) => (
            <div key={idx} className="lg:col-span-2">
              <h4 className="font-bold text-lg mb-5">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button onClick={() => scrollToSection(link.href)} className="text-white/60 hover:text-electric-light transition-colors text-left">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-electric" /> {contact.address}</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-electric" /> {contact.phone}</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-electric" /> {contact.email}</li>
              <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-electric" /> {contact.website}</li>
              {contact.workingHours && <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-electric" /> {contact.workingHours}</li>}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-5">Newsletter</h4>
            <p className="text-sm text-white/60 mb-4">{footer.newsletterText}</p>
            {subscribed ? (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-300 mb-6">Thank you for subscribing!</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-electric"
                  required
                  aria-label="Email address for newsletter"
                />
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-lg bg-electric flex items-center justify-center text-white flex-shrink-0" aria-label="Subscribe to newsletter">
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            )}
            <ul className="space-y-3">
              {footer.legalLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => scrollToSection(link.href)} className="text-white/60 hover:text-electric-light transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50 text-center sm:text-left">{footer.copyright}</p>
          <div className="flex items-center gap-6">
            {footer.legalLinks.slice(0, 2).map(link => (
              <button key={link.label} onClick={() => scrollToSection(link.href)} className="text-sm text-white/50 hover:text-white transition-colors">{link.label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
