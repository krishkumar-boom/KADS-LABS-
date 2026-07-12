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
import ThemeToggle from "../components/ThemeToggle"
import LanguageToggle from "../components/LanguageToggle"

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

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-12">
      <div className="max-w-[800px] mx-auto section-padding">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push("/")} className="text-white/60 hover:text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to website
          </button>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2"><Ticket className="w-6 h-6 text-electric" /> Support Ticket</h1>
          <p className="text-white/60 mb-6">Submit a ticket and our team will assist you.</p>

          {submitted ? (
            <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-1">Ticket Submitted</h3>
              <p className="text-white/70">We will respond as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm text-white/70 mb-2">Subject *</label>
                <input {...register("subject")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                {errors.subject && <p className="text-sm text-red-400 mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Priority *</label>
                <select {...register("priority")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                  <option value="low" className="bg-navy-900">Low</option>
                  <option value="medium" className="bg-navy-900">Medium</option>
                  <option value="high" className="bg-navy-900">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Message *</label>
                <textarea rows={5} {...register("message")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white resize-none" />
                {errors.message && <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" className="w-full btn-primary">Submit Ticket</button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
