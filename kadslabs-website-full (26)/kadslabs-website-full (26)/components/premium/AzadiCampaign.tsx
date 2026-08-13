"use client"

/**
 * Independence Day "Azadi to Grow" campaign banner (10–15 August).
 * Time-boxed promotional strip — auto-hides outside the campaign window.
 * Real campaign artwork supplied by KADS MEDIA.
 */
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Flag, Sparkles, ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import SafeImage from "@/app/components/SafeImage"

const CAMPAIGN_START = new Date("2026-08-10T00:00:00+05:30").getTime()
const CAMPAIGN_END = new Date("2026-08-16T00:00:00+05:30").getTime()
const STORAGE_KEY = "kads-azadi-banner-dismissed"

export default function AzadiCampaignBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const now = Date.now()
    const inWindow = now >= CAMPAIGN_START - 2 * 86400000 && now <= CAMPAIGN_END // show 2 days early
    const dismissed = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1"
    setVisible(inWindow && !dismissed)
  }, [])

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, "1") } catch {}
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          className="relative py-16 sm:py-20 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0a1f0a 0%, #05111f 35%, #1a0a2a 65%, #1f0a0a 100%)",
          }}
          aria-label="Independence Day Offer"
        >
          {/* Saffron/white/green ambient glows */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30"
                 style={{ background: "#FF9933" }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-25"
                 style={{ background: "#138808" }} />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
                 style={{ background: "radial-gradient(circle, #ffffff, transparent 60%)" }} />
          </div>

          {/* Dismiss button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-20 p-2 rounded-full transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.7)" }}
            aria-label="Dismiss offer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
              {/* Left: Copy */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                  style={{
                    background: "linear-gradient(90deg, rgba(255,153,51,0.2), rgba(255,255,255,0.12), rgba(19,136,8,0.2))",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                  }}
                >
                  <Flag className="w-3.5 h-3.5" style={{ color: "#FF9933" }} />
                  Independence Day Special — 10–15 August
                  <Sparkles className="w-3.5 h-3.5" style={{ color: "#138808" }} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.02] mb-5 text-balance"
                  style={{ color: "#fff", fontFamily: "'Space Grotesk','Inter',sans-serif" }}
                >
                  <span style={{ color: "#FF9933" }}>Azadi</span> to{" "}
                  <span style={{
                    background: "linear-gradient(135deg,#138808,#33B5FF)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                  }}>Grow.</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg max-w-xl mb-3"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  <em style={{ fontStyle: "italic", color: "#fff" }}>Azaadi sirf desh ko nahi, business ko bhi!</em>
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.25 }}
                  className="text-base sm:text-lg max-w-xl mb-8"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  You choose the services your business needs — Social Media, Meta Ads, Reels, Branding,
                  Website, Digital Growth — and we give you a <strong style={{ color: "#fff" }}>flat 30% off</strong> the combined package value.
                </motion.p>

                {/* Service chips */}
                <motion.div
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-2 mb-8"
                >
                  {["Social Media", "Meta Ads", "Reels & Videos", "Branding & Design", "Websites", "Growth Strategy"].map(s => (
                    <span key={s}
                      className="px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.9)",
                      }}>{s}</span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.35 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <a
                    href="https://wa.me/917524979551?text=Hi%20KADS%20LABS%2C%20I%20want%20to%20claim%20the%20Azadi%20offer%20%22AZADI%22"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-transform hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(135deg,#FF9933 0%,#fff 48%,#138808 100%)",
                      color: "#05070B",
                      boxShadow: "0 10px 30px -10px rgba(255,153,51,0.5)",
                    }}
                  >
                    <MessageCircle className="w-4 h-4" /> DM "AZADI" to claim
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-transform hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "#fff",
                    }}
                  >
                    Talk to an engineer <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  🗓 10–15 August only · Limited slots · Flat 30% off on custom bundles
                </p>
              </div>

              {/* Right: Campaign artwork */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22,1,0.36,1] }}
                className="relative"
              >
                <div
                  className="relative rounded-3xl overflow-hidden premium-card"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    transform: "rotate(-1deg)",
                  }}
                >
                  <SafeImage
                    src="/campaigns/azadi-to-grow.webp"
                    alt="Azadi to Grow — Independence Day campaign"
                    width={1054}
                    height={1492}
                    containerClassName="w-full"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-6 -left-6 w-28 h-28 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#FF9933,#138808)",
                    transform: "rotate(-8deg)",
                    boxShadow: "0 20px 50px -10px rgba(19,136,8,0.5)",
                  }}
                >
                  <div className="text-center text-white">
                    <div className="text-3xl font-black leading-none">30%</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider">OFF</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
