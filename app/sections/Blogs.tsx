"use client"

import { motion } from "framer-motion"
import { ArrowRight, Calendar, Tag } from "lucide-react"
import AnimatedSection from "../components/AnimatedSection"
import { useContent } from "../components/ContentProvider"
import SafeImage from "../components/SafeImage"

export default function Blogs() {
  const { siteData } = useContent()
  const posts = siteData.blogs
    .filter(p => p.status === "published")
    .slice()
    .sort((a, b) => a.order - b.order)
    .slice(0, 6)

  return (
    <section id="blogs" className="relative py-24 sm:py-32 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="relative z-10 max-w-[1400px] mx-auto section-padding">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm text-electric-light bg-electric/10 border border-electric/20 mb-4">Insights</span>
          <h2 className="section-heading mb-4">Latest <span className="text-gradient">Insights</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Thoughts on technology, marketing, AI, and digital transformation.</p>
        </AnimatedSection>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <p>No published articles yet. Add blog posts from the Control Centre.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="premium-card overflow-hidden glow-border group flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-navy-900">
                  <SafeImage src={post.image || "./logo.png"} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-electric/10 text-electric-light text-xs"><Tag className="w-3 h-3" /> {tag}</span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-electric-light transition-colors">{post.title}</h3>
                  <p className="text-sm text-white/60 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-white/50 mt-auto">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span className="text-electric-light flex items-center gap-1">Read <ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
