"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import { useContent } from "../components/ContentProvider"

export default function Testimonials() {
  const { siteData } = useContent()
  const testimonials = siteData.testimonials.slice().sort((a, b) => a.order - b.order)

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-[#061026] to-navy-950" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-electric/10 rounded-full blur-[150px]" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">Testimonials</span>
          <h2 className="section-heading mb-4">Trusted by <span className="text-gradient">Leaders</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Hear from the businesses that have grown with KADS LABS and its divisions.</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="premium-card p-6 sm:p-8 glow-border relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-electric/20" aria-hidden="true" />
              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-electric text-electric" aria-hidden="true" />)}
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">&ldquo;{item.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-electric to-electric-light flex items-center justify-center text-sm font-bold">
                    {item.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-white/50">{item.role}</p>
                  </div>
                </div>
                <span className="text-xs text-electric-light bg-electric/10 px-2 py-1 rounded">{item.division}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
