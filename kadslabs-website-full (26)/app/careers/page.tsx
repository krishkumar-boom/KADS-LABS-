"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase, MapPin, Clock, ArrowRight, Send, X, CheckCircle2,
  Upload, Github, Linkedin, Globe, DollarSign, CalendarDays,
  Code2, Palette, Video, Megaphone, TrendingUp, Users, Cloud, Cpu, Zap, GraduationCap
} from "lucide-react"
import MagneticButton from "@/app/components/MagneticButton"
import SafeImage from "@/app/components/SafeImage"
import Reveal from "@/components/home/Reveal"
import { useLanguage } from "@/app/components/LanguageProvider"
import { useToast } from "@/app/components/Toast"
import { submitCareerApplication, getTicketErrorMessage } from "@/lib/tickets"
import { clientRateLimit, isHoneypotFilled } from "@/lib/security"
import MarketingShell from "@/components/layout/MarketingShell"

const POSITIONS = [
  { id: "frontend", title: "Frontend Developer", icon: Code2, type: "Full-time", location: "Remote / Deoria", category: "Engineering", salary: "₹3L – ₹8L" },
  { id: "backend", title: "Backend Developer", icon: Cpu, type: "Full-time", location: "Remote / Deoria", category: "Engineering", salary: "₹4L – ₹10L" },
  { id: "junior-dev", title: "Junior Developer", icon: Code2, type: "Full-time", location: "Remote", category: "Engineering", salary: "₹2L – ₹4L" },
  { id: "senior-dev", title: "Senior Developer", icon: Cpu, type: "Full-time", location: "Remote", category: "Engineering", salary: "₹8L – ₹18L" },
  { id: "fullstack", title: "Full Stack Developer", icon: Zap, type: "Full-time", location: "Remote", category: "Engineering", salary: "₹5L – ₹14L" },
  { id: "react-native", title: "React Native Developer", icon: Smartphone, type: "Full-time", location: "Remote", category: "Engineering", salary: "₹3L – ₹8L" },
  { id: "ai-engineer", title: "AI Engineer", icon: Zap, type: "Full-time", location: "Remote", category: "Engineering", salary: "₹6L – ₹15L" },
  { id: "cloud", title: "Cloud Engineer", icon: Cloud, type: "Full-time", location: "Remote", category: "Engineering", salary: "₹5L – ₹12L" },
  { id: "devops", title: "DevOps Engineer", icon: Cloud, type: "Full-time", location: "Remote", category: "Engineering", salary: "₹5L – ₹12L" },
  { id: "uiux", title: "UI/UX Designer", icon: Palette, type: "Full-time", location: "Remote", category: "Design", salary: "₹3L – ₹7L" },
  { id: "graphic", title: "Graphic Designer", icon: Palette, type: "Full-time / Part-time", location: "Remote", category: "Design", salary: "₹2L – ₹5L" },
  { id: "motion-designer", title: "Motion Designer", icon: Video, type: "Full-time / Contract", location: "Remote", category: "Design", salary: "₹3L – ₹8L" },
  { id: "junior-video", title: "Junior Video Editor", icon: Video, type: "Full-time", location: "On-site / Remote", category: "Media", salary: "₹1.5L – ₹3L" },
  { id: "video-editor", title: "Video Editor", icon: Video, type: "Full-time", location: "On-site / Remote", category: "Media", salary: "₹2.5L – ₹6L" },
  { id: "videographer", title: "Videographer", icon: Video, type: "Full-time / Contract", location: "On-site", category: "Media", salary: "₹2L – ₹5L" },
  { id: "marketing", title: "Marketing Executive", icon: Megaphone, type: "Full-time", location: "Remote / On-site", category: "Marketing", salary: "₹2L – ₹5L" },
  { id: "sales", title: "Sales Executive", icon: TrendingUp, type: "Full-time", location: "Remote / On-site", category: "Sales", salary: "₹2L – ₹6L + Commission" },
  { id: "hr", title: "HR / Talent", icon: Users, type: "Full-time", location: "On-site", category: "Operations", salary: "₹2L – ₹4L" },
  { id: "intern", title: "Internship (Multiple Domains)", icon: GraduationCap, type: "Internship", location: "Remote / On-site", category: "Internship", salary: "Stipend based" }
]

function Smartphone(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
      <path d="M12 18h.01"/>
    </svg>
  )
}

export default function CareersPage() {
  const { language } = useLanguage()
  const toast = useToast()
  const isHi = language === "hi"
  const [selected, setSelected] = useState<string | null>(null)
  // Accepts both position IDs and "other" for open applications
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "", email: "", phone: "", city: "",
    portfolio: "", github: "", linkedin: "",
    experience: "", salary: "", notice: "", cover: "",
    resumeName: "", website: ""
  })

  const position = POSITIONS.find(p => p.id === selected)

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || loading) return
    if (isHoneypotFilled(form.website)) return
    const rl = clientRateLimit("career_apply", 3)
    if (!rl.ok) {
      toast.error(isHi ? "बहुत जल्दी सबमिट कर रहे हैं।" : "Please wait a minute before trying again.")
      return
    }
    if (!form.name || !form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error(isHi ? "नाम और सही ईमेल भरें।" : "Please provide your name and a valid email.")
      return
    }
    setLoading(true)
    setSuccess(null)

    const result = await submitCareerApplication({
      position: position?.title || selected,
      name: form.name, email: form.email, phone: form.phone, city: form.city,
      portfolio_url: form.portfolio, github_url: form.github, linkedin_url: form.linkedin,
      experience_years: form.experience, expected_salary: form.salary, notice_period: form.notice,
      cover_letter: form.cover, resume_filename: form.resumeName, website: form.website
    })

    setLoading(false)
    if (!result.ok) {
      toast.error(getTicketErrorMessage(result.error, isHi ? "hi" : "en"))
      return
    }
    setSuccess(result.ticketId || "")
    toast.success(
      isHi
        ? `आवेदन मिल गया! ${result.ticketId ? "आपका आवेदन ID: " + result.ticketId : ""}`
        : `Application received! ${result.ticketId ? "Your Application ID: " + result.ticketId : ""}`
    )
    setForm({ name: "", email: "", phone: "", city: "", portfolio: "", github: "", linkedin: "", experience: "", salary: "", notice: "", cover: "", resumeName: "", website: "" })
    setTimeout(() => { setSelected(null); setSuccess(null) }, 6000)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem",
    background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
    color: "var(--text-primary)", outline: "none", transition: "all 0.2s"
  }

  return (
    <MarketingShell>
    <div className="min-h-screen pt-28 pb-20" style={{ background: "var(--bg-primary)" }}>
      {/* Honeypot */}
      <input type="text" name="website" value={form.website} onChange={e => update("website", e.target.value)}
             tabIndex={-1} autoComplete="off" aria-hidden="true"
             style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none", height: 0, width: 0 }} />

      <div className="max-w-[1400px] mx-auto section-padding">
        <Reveal className="text-center mb-16">
          <span className="eyebrow-pill mb-5">
            <Briefcase className="w-3 h-3" /> {isHi ? "करियर" : "Careers @ KADS LABS"}
          </span>
          <h1 className="section-heading mb-5">
            {isHi ? (
              <>हमारे साथ <span className="text-brand-gradient">बिल्ड करें</span></>
            ) : (
              <>Build the future <span className="text-brand-gradient">with us</span></>
            )}
          </h1>
          <p className="section-subheading mx-auto">
            {isHi
              ? "KADS LABS में शामिल हों और AI, SaaS, मोबाइल ऐप्स और डिजिटल मार्केटिंग के अगले दश को बनाने में मदद करें।"
              : "Join KADS LABS and help shape the next decade of AI, SaaS, mobile apps, and digital marketing."}
          </p>
        </Reveal>

        {/* MSME trust badge */}
        <Reveal className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-medium"
               style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-white"
                 style={{ background: "linear-gradient(135deg, #FF9933, #138808)" }}>
              <span className="text-[10px] font-bold">भारत</span>
            </div>
            <span>Govt. of India MSME Registered — UDYAM-UP-21-0061122</span>
          </div>
        </Reveal>

        {/* Positions grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {POSITIONS.map((pos, i) => {
            const Icon = pos.icon
            return (
              <Reveal key={pos.id} delay={i * 0.04}>
                <motion.button
                  onClick={() => setSelected(pos.id)}
                  whileHover={{ y: -4 }}
                  className="w-full text-left premium-card p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                         style={{ background: "rgba(30,107,255,0.1)", border: "1px solid rgba(30,107,255,0.2)" }}>
                      <Icon className="w-5 h-5" style={{ color: "#33B5FF" }} />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-md"
                          style={{ background: "rgba(30,107,255,0.1)", color: "#1E6BFF" }}>
                      {pos.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>{pos.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pos.type}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pos.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{pos.salary}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--brand-electric)" }}>
                    {isHi ? "आवेदन करें" : "Apply now"} <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.button>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="text-center">
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            {isHi ? "उपरोक्त के अलावा किसी और भूमिका के लिए आवेदन करना चाहते हैं?" : "Don't see your role listed?"}
          </p>
          <MagneticButton onClick={() => setSelected("other")} variant="outline" className="px-6" ariaLabel="Open application">
            {isHi ? "स्पेशल आवेदन भेजें" : "Send Open Application"} <ArrowRight className="w-4 h-4 ml-1" />
          </MagneticButton>
        </Reveal>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
              className="relative w-full max-w-2xl my-8 rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", maxHeight: "90vh", overflowY: "auto" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b"
                   style={{ background: "var(--bg-secondary)", borderColor: "var(--border-subtle)" }}>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--brand-neon)" }}>
                    {isHi ? "आवेदन फॉर्म" : "Job Application"}
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {position?.title || (isHi ? "खुला आवेदन" : "Open Application")}
                  </h3>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/10">
                  <X className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                </button>
              </div>

              {success ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5"
                       style={{ background: "rgba(16,185,129,0.12)" }}>
                    <CheckCircle2 className="w-8 h-8" style={{ color: "#10B981" }} />
                  </div>
                  <h4 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    {isHi ? "आवेदन मिल गया!" : "Application submitted!"}
                  </h4>
                  <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                    {isHi ? "हम जल्द ही आपसे संपर्क करेंगे।" : "We'll review and get back to you within 3-5 business days."}
                  </p>
                  <p className="text-xs font-mono" style={{ color: "var(--brand-neon)" }}>{success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={isHi ? "नाम *" : "Full Name *"}>
                      <input type="text" required value={form.name} onChange={e => update("name", e.target.value)}
                             placeholder="Your full name" style={inputStyle} disabled={loading} />
                    </Field>
                    <Field label={isHi ? "ईमेल *" : "Email *"}>
                      <input type="email" required value={form.email} onChange={e => update("email", e.target.value)}
                             placeholder="you@example.com" style={inputStyle} disabled={loading} />
                    </Field>
                    <Field label={isHi ? "फ़ोन" : "Phone"}>
                      <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
                             placeholder="+91 XXXXX XXXXX" style={inputStyle} disabled={loading} />
                    </Field>
                    <Field label={isHi ? "शहर" : "City"}>
                      <input type="text" value={form.city} onChange={e => update("city", e.target.value)}
                             placeholder="Your city" style={inputStyle} disabled={loading} />
                    </Field>
                    <Field label="Portfolio URL">
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                        <input type="url" value={form.portfolio} onChange={e => update("portfolio", e.target.value)}
                               placeholder="https://yourportfolio.com" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                      </div>
                    </Field>
                    <Field label="GitHub URL">
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                        <input type="url" value={form.github} onChange={e => update("github", e.target.value)}
                               placeholder="https://github.com/username" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                      </div>
                    </Field>
                    <Field label="LinkedIn URL">
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                        <input type="url" value={form.linkedin} onChange={e => update("linkedin", e.target.value)}
                               placeholder="https://linkedin.com/in/you" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                      </div>
                    </Field>
                    <Field label={isHi ? "अनुभव (वर्ष)" : "Experience (years)"}>
                      <input type="text" value={form.experience} onChange={e => update("experience", e.target.value)}
                             placeholder="e.g. 2 years" style={inputStyle} disabled={loading} />
                    </Field>
                    <Field label={isHi ? "अपेक्षित वेतन" : "Expected Salary"}>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                        <input type="text" value={form.salary} onChange={e => update("salary", e.target.value)}
                               placeholder="e.g. ₹5L per annum" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                      </div>
                    </Field>
                    <Field label={isHi ? "नोटिस पीरियड" : "Notice Period"}>
                      <div className="relative">
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                        <input type="text" value={form.notice} onChange={e => update("notice", e.target.value)}
                               placeholder="e.g. 30 days / Immediate" style={{ ...inputStyle, paddingLeft: "2.5rem" }} disabled={loading} />
                      </div>
                    </Field>
                  </div>
                  <Field label={isHi ? "कवर लेटर / अपने बारे में बताएं *" : "Cover Letter / About You *"}>
                    <textarea required rows={4} value={form.cover} onChange={e => update("cover", e.target.value)}
                              placeholder="Tell us about yourself, why you want to join, and what you've built..."
                              style={{ ...inputStyle, resize: "vertical", minHeight: 100, fontFamily: "inherit" }} disabled={loading} />
                  </Field>
                  <div className="p-4 rounded-xl border-dashed text-center" style={{ border: "2px dashed var(--border-default)" }}>
                    <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--text-subtle)" }}>
                      <title>Upload resume</title>
                    </Upload>
                    <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                      {isHi ? "रिज्यूमे अपलोड" : "Resume Upload"}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
                      {form.resumeName ? <strong style={{ color: "#10B981" }}>{form.resumeName}</strong> : isHi
                        ? "प्रोडक्शन में अपलोड सपोर्ट आएगा। फिलहाल आप लिंक्डइन/पोर्टफोलियो URL डालें।"
                        : "PDF/DOC up to 10MB. (File upload activates with Supabase Storage configured — paste LinkedIn/Portfolio for now.)"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <MagneticButton type="submit" className="btn-primary flex-1 sm:flex-none sm:px-8 justify-center" ariaLabel="Submit application" disabled={loading}>
                      {loading ? (isHi ? "भेज रहे हैं..." : "Submitting...") : (isHi ? "आवेदन भेजें" : "Submit Application")}
                      {!loading && <Send className="w-4 h-4 ml-1" />}
                    </MagneticButton>
                    <span className="text-[10px] flex-1" style={{ color: "var(--text-subtle)" }}>
                      {isHi ? "हम कभी स्पैम नहीं करते।" : "We never spam. Your data is private."}
                    </span>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </MarketingShell>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</span>
      {children}
    </label>
  )
}
