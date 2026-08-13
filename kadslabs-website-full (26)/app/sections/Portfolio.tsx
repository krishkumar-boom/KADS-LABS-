"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ArrowUpRight, X, Brain, Smartphone, Globe, Palette, Megaphone, Cog } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import { useContent } from "../components/ContentProvider"

const categories = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI", icon: Brain },
  { id: "apps", label: "Apps", icon: Smartphone },
  { id: "websites", label: "Websites", icon: Globe },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "automation", label: "Automation", icon: Cog }
]

export default function Portfolio() {
  const { siteData } = useContent()
  const projects = siteData.portfolio.slice().sort((a, b) => a.order - b.order)
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  const filteredProjects = activeCategory === "all" ? projects : projects.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" className="relative py-24 sm:py-32 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-electric/10 rounded-full blur-[150px]" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">Portfolio</span>
          <h2 className="section-heading mb-4">Work That <span className="text-gradient">Speaks</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Explore our portfolio of AI solutions, applications, websites, branding, and marketing campaigns.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-electric text-white shadow-lg shadow-electric/30"
                    : "glass-card text-white/70 hover:text-white hover:bg-white/10"
                }`}
                aria-pressed={activeCategory === category.id}
              >
                {category.icon && <category.icon className="w-4 h-4" />}
                {category.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient || "from-blue-600 to-cyan-600"} cursor-pointer premium-card`}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${project.title}`}
                onKeyDown={(e) => e.key === "Enter" && setSelectedProject(project)}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="relative h-72 sm:h-80 p-6 flex flex-col justify-end">
                  <span className="inline-block self-start px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm mb-3 uppercase tracking-wider">
                    {categories.find(c => c.id === project.category)?.label}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-electric-light">{project.stats}</span>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-electric transition-colors duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatedSection delay={0.2} className="mt-16">
          <div className="premium-card p-8 sm:p-12 glow-border flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">Want to see detailed case studies?</h3>
              <p className="text-white/60">Discover how we deliver measurable results for our clients.</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary whitespace-nowrap" onClick={() => alert("Detailed case studies are coming soon. Contact us for a private demo of our work.")} aria-label="View case studies">
              View Case Studies <ArrowUpRight className="ml-2 w-4 h-4" />
            </motion.button>
          </div>
        </AnimatedSection>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]" aria-hidden="true" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[90] section-padding" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
              <div className={`glass-card rounded-2xl p-6 sm:p-8 glow-border relative bg-gradient-to-br ${selectedProject.gradient || "from-blue-600 to-cyan-600"}`}>
                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors" aria-label="Close project details">
                  <X className="w-5 h-5" />
                </button>
                <span className="inline-block px-3 py-1 rounded-full text-xs bg-white/20 backdrop-blur-sm mb-3 uppercase tracking-wider">
                  {categories.find(c => c.id === selectedProject.category)?.label}
                </span>
                <h3 id="project-modal-title" className="text-2xl sm:text-3xl font-bold mb-3">{selectedProject.title}</h3>
                <p className="text-white/80 mb-4">{selectedProject.description}</p>
                <p className="text-sm text-white/70 mb-6 leading-relaxed">{selectedProject.details}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-electric-light bg-black/20 px-3 py-1 rounded-full">{selectedProject.stats}</span>
                  <button onClick={() => setSelectedProject(null)} className="btn-primary text-sm px-4 py-2">Close</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
