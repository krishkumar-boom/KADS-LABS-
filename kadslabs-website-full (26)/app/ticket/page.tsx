"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { createTicket } from "@/lib/tickets"
import { ArrowLeft, CheckCircle, Ticket } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "../components/AuthProvider"
import MarketingShell from "@/components/layout/MarketingShell"

const ticketSchema = z.object({
  subject: z.string().min(5),
  message: z.string().min(10),
  priority: z.enum(["low", "medium", "high"])
})

type TicketForm = z.infer<typeof ticketSchema>

export default function TicketPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<TicketForm>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { priority: "medium" }
  })

  const onSubmit = async (data: TicketForm) => {
    const result = await createTicket({
      userId: user?.id,
      email: user?.email || "anonymous@kadslabs.com",
      subject: data.subject,
      message: data.message,
      priority: data.priority
    })
    if (!result.error) setSubmitted(true)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "0.875rem",
    background: "var(--bg-tertiary)", border: "1px solid var(--border-default)",
    color: "var(--text-primary)", outline: "none", transition: "all 0.2s", resize: "vertical", fontFamily: "inherit"
  }

  return (
    <MarketingShell>
    <div className="min-h-screen pt-28 pb-12" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-[800px] mx-auto section-padding">
        <div className="flex items-center mb-6">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
            <ArrowLeft className="w-4 h-4" /> Back to website
          </button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Ticket className="w-6 h-6" style={{ color: "#33B5FF" }} /> Support Ticket
          </h1>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>Submit a ticket and our team will assist you.</p>

          {submitted ? (
            <div className="p-6 rounded-lg text-center" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "#10B981" }} />
              <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Ticket Submitted</h3>
              <p style={{ color: "var(--text-secondary)" }}>We will respond as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Subject *</label>
                <input {...register("subject")} style={inputStyle} />
                {errors.subject && <p className="text-sm mt-1" style={{ color: "#EF4444" }}>{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Priority *</label>
                <select {...register("priority")} style={inputStyle}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: "var(--text-secondary)" }}>Message *</label>
                <textarea rows={5} {...register("message")} style={inputStyle} />
                {errors.message && <p className="text-sm mt-1" style={{ color: "#EF4444" }}>{errors.message.message}</p>}
              </div>
              <button type="submit" className="w-full btn-primary">Submit Ticket</button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
    </MarketingShell>
  )
}
