"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, X, Send, User, Mail, Phone, FileText, Link2 } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import { useContent } from "../components/ContentProvider"
import { createApplication } from "@/lib/applications"

export default function Careers() {
  const { siteData } = useContent()
  const [selectedJob, setSelectedJob] = useState<typeof siteData.careers[0] | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", resumeUrl: "", coverLetter: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const openings = siteData.careers
    .filter(c => c.active)
    .slice()
    .sort((a, b) => a.order - b.order)

  const closeModal = () => {
    setSelectedJob(null)
    setSubmitted(false)
    setError("")
    setForm({ name: "", email: "", phone: "", resumeUrl: "", coverLetter: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return
    if (!form.name.trim() || !form.email.trim() || !form.coverLetter.trim()) {
      setError("Please fill in all required fields.")
      return
    }
    setSubmitting(true)
    setError("")
    const result = await createApplication({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      name: form.name,
      email: form.email,
      phone: form.phone,
      resumeUrl: form.resumeUrl,
      coverLetter: form.coverLetter
    })
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <section id="careers" className="relative py-24 sm:py-32 overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-[#061026] to-navy-950" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 max-w-[1000px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">Careers</span>
          <h2 className="section-heading mb-4">Join the <span className="text-gradient">Team</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Build the future with KADS LABS. Explore open roles across our divisions.</p>
        </AnimatedSection>

        {openings.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <p>No open positions right now. Check back later or send your resume to founderskadslabs@gmail.com.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {openings.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="premium-card p-6 sm:p-8 glow-border group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-electric-light transition-colors">{career.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/50">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {career.department}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {career.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {career.type}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedJob(career)} className="btn-primary text-sm px-4 py-2 whitespace-nowrap">
                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
                <p className="text-white/70 text-sm mb-4">{career.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-electric" /> Requirements</h4>
                    <ul className="space-y-1">
                      {career.requirements.map((req, i) => <li key={i} className="text-sm text-white/60">• {req}</li>)}
                    </ul>
                  </div>
                  {career.benefits && career.benefits.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-electric" /> Benefits</h4>
                      <ul className="space-y-1">
                        {career.benefits.map((b, i) => <li key={i} className="text-sm text-white/60">• {b}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[90] section-padding"
            >
              <div className="glass-card rounded-2xl p-6 sm:p-8 glow-border max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Apply for {selectedJob.title}</h3>
                    <p className="text-sm text-white/60">{selectedJob.department} · {selectedJob.location}</p>
                  </div>
                  <button onClick={closeModal} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5"><X className="w-5 h-5" /></button>
                </div>

                {submitted ? (
                  <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                    <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                    <h4 className="text-lg font-bold mb-1">Application Submitted</h4>
                    <p className="text-white/70 text-sm">Thank you for your interest. We will review your application and contact you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5 flex items-center gap-2"><User className="w-4 h-4" /> Full Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5 flex items-center gap-2"><Mail className="w-4 h-4" /> Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric"
                        placeholder="+91 75249 79551"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5 flex items-center gap-2"><Link2 className="w-4 h-4" /> Resume URL</label>
                      <input
                        type="url"
                        value={form.resumeUrl}
                        onChange={e => setForm({ ...form, resumeUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric"
                        placeholder="https://drive.google.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5 flex items-center gap-2"><FileText className="w-4 h-4" /> Cover Letter *</label>
                      <textarea
                        rows={4}
                        value={form.coverLetter}
                        onChange={e => setForm({ ...form, coverLetter: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric resize-none"
                        placeholder="Tell us why you are a great fit..."
                        required
                      />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button type="submit" disabled={submitting} className="w-full btn-primary flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
