"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { createQuoteRequest } from "@/lib/quotes"
import { ArrowLeft, CheckCircle, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import ThemeToggle from "../components/ThemeToggle"
import LanguageToggle from "../components/LanguageToggle"

const quoteSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().min(1),
  budget: z.string().min(1),
  details: z.string().min(10)
})

type QuoteForm = z.infer<typeof quoteSchema>

export default function QuotePage() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema)
  })

  const onSubmit = async (data: QuoteForm) => {
    const result = await createQuoteRequest(data)
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
          <h1 className="text-2xl font-bold mb-2">Request a Quote</h1>
          <p className="text-white/60 mb-6">Tell us about your project and we will send you a custom quote.</p>

          {submitted ? (
            <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-1">Quote Request Sent</h3>
              <p className="text-white/70">We will review your requirements and get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Name *</label>
                  <input {...register("name")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                  {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Email *</label>
                  <input type="email" {...register("email")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                  {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Phone</label>
                  <input {...register("phone")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Company</label>
                  <input {...register("company")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Service *</label>
                  <select {...register("service")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                    <option value="" className="bg-navy-900">Select service</option>
                    <option value="AI Development" className="bg-navy-900">AI Development</option>
                    <option value="Website Development" className="bg-navy-900">Website Development</option>
                    <option value="Mobile App Development" className="bg-navy-900">Mobile App Development</option>
                    <option value="SaaS Platform" className="bg-navy-900">SaaS Platform</option>
                    <option value="Digital Marketing" className="bg-navy-900">Digital Marketing</option>
                    <option value="Branding & Design" className="bg-navy-900">Branding & Design</option>
                  </select>
                  {errors.service && <p className="text-sm text-red-400 mt-1">{errors.service.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Budget *</label>
                  <select {...register("budget")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white">
                    <option value="" className="bg-navy-900">Select budget</option>
                    <option value="10k-25k" className="bg-navy-900">₹10k - ₹25k</option>
                    <option value="25k-50k" className="bg-navy-900">₹25k - ₹50k</option>
                    <option value="50k-1l" className="bg-navy-900">₹50k - ₹1L</option>
                    <option value="1l-5l" className="bg-navy-900">₹1L - ₹5L</option>
                    <option value="5l+" className="bg-navy-900">₹5L+</option>
                  </select>
                  {errors.budget && <p className="text-sm text-red-400 mt-1">{errors.budget.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Project Details *</label>
                <textarea rows={5} {...register("details")} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white resize-none" />
                {errors.details && <p className="text-sm text-red-400 mt-1">{errors.details.message}</p>}
              </div>
              <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Quote Request
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
