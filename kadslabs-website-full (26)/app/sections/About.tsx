"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { 
  Brain, 
  Cloud, 
  Smartphone, 
  Globe, 
  Building2, 
  Zap,
  Shield,
  Rocket,
  Clock,
  Award,
  HeartHandshake,
  Server
} from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import { useContent } from "../components/ContentProvider"
import { useLanguage } from "../components/LanguageProvider"

const whatWeBuild = [
  { icon: Brain, title: "AI Solutions", desc: "Machine learning models, generative AI, and intelligent automation" },
  { icon: Cloud, title: "SaaS Platforms", desc: "Cloud-native software products with scalable subscription models" },
  { icon: Zap, title: "Business Automation", desc: "Workflow automation that eliminates manual processes" },
  { icon: Smartphone, title: "Mobile Applications", desc: "Native and cross-platform apps for iOS and Android" },
  { icon: Globe, title: "Website Development", desc: "High-performance websites with modern design and SEO" },
  { icon: Building2, title: "Enterprise Software", desc: "Custom CRM, ERP, and internal business systems" },
  { icon: Server, title: "Cloud Solutions", desc: "AWS, Firebase, and scalable cloud infrastructure" },
  { icon: Rocket, title: "Digital Products", desc: "End-to-end product design, development, and launch" }
]

const whyChooseUs = [
  { icon: Award, title: "Innovation", desc: "Cutting-edge technology solutions that keep you ahead" },
  { icon: Zap, title: "Modern Technology", desc: "Next.js, React, AI, and cloud-native architectures" },
  { icon: Shield, title: "Secure Development", desc: "Enterprise-grade security and best practices" },
  { icon: Clock, title: "Fast Delivery", desc: "Agile processes with rapid prototyping and delivery" },
  { icon: Globe, title: "Scalable Architecture", desc: "Solutions built to grow with your business" },
  { icon: HeartHandshake, title: "Long-Term Support", desc: "Ongoing maintenance, updates, and optimization" }
]

const stats = [
  { label: "Projects Delivered", value: 150, suffix: "+", hiLabel: "पूर्ण प्रोजेक्ट्स" },
  { label: "Happy Clients", value: 80, suffix: "+", hiLabel: "संतुष्ट ग्राहक" },
  { label: "Countries Served", value: 12, suffix: "", hiLabel: "सेवित देश" },
  { label: "Years Experience", value: 8, suffix: "+", hiLabel: "वर्षों का अनुभव" },
  { label: "Support Response", value: 24, suffix: "/7", hiLabel: "सपोर्ट प्रतिक्रिया" }
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const duration = 2000
    const startTime = Date.now()

    const update = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      start = Math.floor(easeOut * target)
      setCount(start)

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }, [isInView, target])

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-bold text-gradient">
      {count}{suffix}
    </span>
  )
}

export default function About() {
  const { content } = useContent()
  const { t, language } = useLanguage()

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-electric/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        {/* About Header */}
        <AnimatedSection className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">
            {t("about.label", "About Us")}
          </span>
          <h2 className="section-heading mb-6">
            {content.aboutTitle.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gradient">{content.aboutTitle.split(" ").pop()}</span>
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            {content.aboutDescription}
          </p>
        </AnimatedSection>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <AnimatedSection delay={0.1}>
            <div className="premium-card p-8 sm:p-10 h-full glow-border">
              <div className="w-14 h-14 rounded-xl bg-electric/20 flex items-center justify-center mb-6">
                <Rocket className="w-7 h-7 text-electric" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("about.mission")}</h3>
              <p className="text-white/70 leading-relaxed">
                {content.mission}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="premium-card p-8 sm:p-10 h-full glow-border">
              <div className="w-14 h-14 rounded-xl bg-electric/20 flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-electric" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t("about.vision")}</h3>
              <p className="text-white/70 leading-relaxed">
                {content.vision}
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* Core Values */}
        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">{t("about.valuesLabel", "Core Values")}</h3>
            <p className="text-white/60 max-w-2xl mx-auto">
              {t("about.valuesDesc", "The principles that guide every decision we make and every product we build.")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Excellence", desc: "We deliver nothing less than exceptional quality" },
              { title: "Innovation", desc: "We embrace new ideas and transformative technologies" },
              { title: "Integrity", desc: "We build trust through transparency and honesty" },
              { title: "Impact", desc: "We measure success by the value we create" }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="premium-card p-6 text-center glow-border"
              >
                <h4 className="text-lg font-bold mb-2 text-electric-light">{value.title}</h4>
                <p className="text-sm text-white/60">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* What We Build */}
        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">
              {t("about.buildLabel", "What We Build")}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              {t("about.buildTitle", "End-to-End Digital Products")}
            </h3>
            <p className="text-white/60 max-w-2xl mx-auto">
              {t("about.buildDesc", "From concept to deployment, we build the technology that powers modern businesses.")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatWeBuild.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                className="premium-card p-6 glow-border group"
              >
                <div className="w-12 h-12 rounded-lg bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                  <item.icon className="w-6 h-6 text-electric" />
                </div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Why Choose Us */}
        <AnimatedSection className="mb-24">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">
              {t("about.whyLabel", "Why Choose Us")}
            </span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              {t("about.whyTitle", "Built for Enterprise Success")}
            </h3>
            <p className="text-white/60 max-w-2xl mx-auto">
              {t("about.whyDesc", "We combine technical expertise with business understanding to deliver results.")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="premium-card p-6 flex items-start gap-4 glow-border"
              >
                <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-electric" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection>
          <div className="premium-card p-8 sm:p-12 glow-border">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <CountUp target={stat.value} suffix={stat.suffix} />
                  <p className="mt-2 text-sm text-white/60">{language === "hi" ? stat.hiLabel : stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
