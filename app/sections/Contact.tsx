"use client"

import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Phone, Mail, Globe, MapPin, Send, CheckCircle, User, Clock } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import { useAuth } from "../components/AuthProvider"
import { useContent } from "../components/ContentProvider"
import { useEffect, useState } from "react"
import { createLead, sendConfirmationEmail } from "@/lib/crm"
import { getIcon } from "@/lib/icons"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  budget: z.string().min(1, "Please select a budget"),
  message: z.string().min(10, "Message must be at least 10 characters")
})

type ContactForm = z.infer<typeof contactSchema>

export default function Contact() {
  const { user } = useAuth()
  const { content, siteData } = useContent()
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "", name: "", phone: "", company: "", service: "", budget: "", message: "" }
  })

  useEffect(() => {
    if (user?.email) setValue("email", user.email)
  }, [user, setValue])

  const onSubmit = async (data: ContactForm) => {
    const submission = { ...data, userId: user?.id }
    const result = await createLead(submission)
    if (result.error) {
      alert("Failed to submit. " + result.error)
      return
    }
    if (result.data) {
      await sendConfirmationEmail(result.data)
    }
    setSubmitSuccess(true)
    reset()
    setTimeout(() => setSubmitSuccess(false), 5000)
  }

  const contactDetails = [
    { icon: Phone, label: "Phone", value: siteData.contact.phone, href: `tel:${siteData.contact.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: siteData.contact.email, href: `mailto:${siteData.contact.email}` },
    { icon: Globe, label: "Website", value: siteData.contact.website, href: `https://${siteData.contact.website}` },
    { icon: MapPin, label: "Address", value: siteData.contact.address, href: "#" },
    ...(siteData.contact.workingHours ? [{ icon: Clock, label: "Hours", value: siteData.contact.workingHours, href: "#" }] : [])
  ]

  const lastWord = content.contactTitle.split(" ").pop() || "Great"
  const titleWords = content.contactTitle.split(" ").slice(0, -1)

  const social = siteData.social.slice().sort((a, b) => a.order - b.order)

  return (
    <section id="contact" className="relative py-24 sm:py-32 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-[#050B18] to-navy-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/10 rounded-full blur-[180px]" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">Contact</span>
          <h2 className="section-heading mb-4">{titleWords.join(" ")} <span className="text-gradient">{lastWord}</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">{content.contactDescription}</p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <AnimatedSection delay={0.1}>
            <div className="premium-card p-6 sm:p-8 glow-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Send us a message</h3>
                {user?.email ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-300">
                    <User className="w-4 h-4" /> {user.email.split("@")[0]}
                  </div>
                ) : null}
              </div>

              {submitSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center rounded-xl bg-green-500/10 border border-green-500/20" role="alert">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                  <p className="text-white/70">We will get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">Name *</label>
                      <input id="name" {...register("name")} type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors" aria-invalid={errors.name ? "true" : "false"} aria-describedby={errors.name ? "name-error" : undefined} />
                      {errors.name && <p id="name-error" className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email *</label>
                      <input id="email" {...register("email")} type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors" aria-invalid={errors.email ? "true" : "false"} aria-describedby={errors.email ? "email-error" : undefined} />
                      {errors.email && <p id="email-error" className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">Phone *</label>
                      <input id="phone" {...register("phone")} type="tel" placeholder="+91 00000 00000" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors" aria-invalid={errors.phone ? "true" : "false"} aria-describedby={errors.phone ? "phone-error" : undefined} />
                      {errors.phone && <p id="phone-error" className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-white/80 mb-2">Company</label>
                      <input id="company" {...register("company")} type="text" placeholder="Your company" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-white/80 mb-2">Required Service *</label>
                      <select id="service" {...register("service")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-electric transition-colors" aria-invalid={errors.service ? "true" : "false"} aria-describedby={errors.service ? "service-error" : undefined}>
                        <option value="" className="bg-navy-900">Select a service</option>
                        <option value="ai" className="bg-navy-900">AI Development</option>
                        <option value="web" className="bg-navy-900">Website Development</option>
                        <option value="app" className="bg-navy-900">Mobile App Development</option>
                        <option value="saas" className="bg-navy-900">SaaS Platform</option>
                        <option value="marketing" className="bg-navy-900">Digital Marketing</option>
                        <option value="branding" className="bg-navy-900">Branding & Design</option>
                        <option value="automation" className="bg-navy-900">Automation Systems</option>
                        <option value="consulting" className="bg-navy-900">Technical Consulting</option>
                      </select>
                      {errors.service && <p id="service-error" className="mt-1 text-sm text-red-400">{errors.service.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-white/80 mb-2">Budget *</label>
                      <select id="budget" {...register("budget")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-electric transition-colors" aria-invalid={errors.budget ? "true" : "false"} aria-describedby={errors.budget ? "budget-error" : undefined}>
                        <option value="" className="bg-navy-900">Select budget range</option>
                        <option value="10k-25k" className="bg-navy-900">₹10,000 - ₹25,000</option>
                        <option value="25k-50k" className="bg-navy-900">₹25,000 - ₹50,000</option>
                        <option value="50k-1l" className="bg-navy-900">₹50,000 - ₹1,00,000</option>
                        <option value="1l-5l" className="bg-navy-900">₹1,00,000 - ₹5,00,000</option>
                        <option value="5l+" className="bg-navy-900">₹5,00,000+</option>
                      </select>
                      {errors.budget && <p id="budget-error" className="mt-1 text-sm text-red-400">{errors.budget.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">Message *</label>
                    <textarea id="message" {...register("message")} rows={5} placeholder="Tell us about your project..." className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors resize-none" aria-invalid={errors.message ? "true" : "false"} aria-describedby={errors.message ? "message-error" : undefined} />
                    {errors.message && <p id="message-error" className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
                  </div>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full btn-primary">
                    Send Message
                    <Send className="ml-2 w-4 h-4" />
                  </motion.button>
                  <p className="text-sm text-white/50 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-electric" /> We typically respond within 24 hours</p>
                </form>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <div className="premium-card p-6 sm:p-8 glow-border">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-5">
                  {contactDetails.map((item) => (
                    <a key={item.label} href={item.href} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-lg bg-electric/10 flex items-center justify-center flex-shrink-0 group-hover:bg-electric/20 transition-colors">
                        <item.icon className="w-5 h-5 text-electric" />
                      </div>
                      <div>
                        <p className="text-sm text-white/50 mb-0.5">{item.label}</p>
                        <p className="text-white group-hover:text-electric-light transition-colors">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  {social.map((link) => {
                    const Icon = getIcon(link.icon)
                    return (
                      <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-electric/50 transition-colors" aria-label={link.platform}>
                        <Icon className="w-4 h-4" />
                      </a>
                    )
                  })}
                </div>
              </div>

              <div className="premium-card rounded-2xl overflow-hidden glow-border h-[300px] lg:h-[350px]">
                <iframe
                  src={siteData.contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(100%) invert(92%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="KADS LABS Location"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

    </section>
  )
}
