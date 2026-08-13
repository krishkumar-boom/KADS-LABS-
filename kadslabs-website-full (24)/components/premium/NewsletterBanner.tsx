"use client"

import Reveal from "@/components/home/Reveal"
import NewsletterSubscribe from "./NewsletterSubscribe"
import { useLanguage } from "@/app/components/LanguageProvider"
import { Mail, Zap } from "lucide-react"

export default function NewsletterBanner() {
  const { language } = useLanguage()
  const isHi = language === "hi"

  return (
    <section id="newsletter" className="relative py-20 sm:py-24 overflow-hidden">
      <div aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(30,107,255,0.1), transparent 60%)" }}
      />
      <div className="relative z-10 max-w-[1100px] mx-auto section-padding">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-14"
            style={{
              background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-card))",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-lg)"
            }}>
            {/* Glow accents */}
            <div aria-hidden="true" className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(30,107,255,0.2), transparent 70%)" }} />
            <div aria-hidden="true" className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(51,181,255,0.15), transparent 70%)" }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              <div className="max-w-lg">
                <span className="eyebrow-pill mb-4">
                  <Zap className="w-3 h-3" />
                  {isHi ? "न्यूज़लेटर" : "Newsletter"}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3" style={{ color: "var(--text-primary)" }}>
                  {isHi ? (
                    <>नवीनतम अपडेट्स <span className="text-brand-gradient">पाएं</span></>
                  ) : (
                    <>Stay <span className="text-brand-gradient">ahead</span> of the curve</>
                  )}
                </h3>
                <p className="text-sm sm:text-base" style={{ color: "var(--text-muted)" }}>
                  {isHi
                    ? "नए AI टूल्स, प्रोडक्ट लॉन्च, एक्सक्लूसिव इनसाइट्स और ऑफर्स सीधे अपने इनबॉक्स में पाएं। कभी स्पैम नहीं।"
                    : "Get AI insights, product launches, exclusive offers, and company updates straight to your inbox. No spam, ever."}
                </p>
              </div>
              <div className="w-full lg:w-auto lg:min-w-[380px]">
                <div className="flex items-center gap-2 mb-3 justify-center lg:justify-start">
                  <Mail className="w-4 h-4" style={{ color: "var(--text-subtle)" }} />
                  <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
                    {isHi ? "मुफ्त में जुड़ें" : "Join free · unsubscribe anytime"}
                  </span>
                </div>
                <NewsletterSubscribe />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
