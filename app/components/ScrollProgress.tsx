"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[100]"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #1E6BFF, #33B5FF, #5B9AFF)",
        boxShadow: "0 0 12px rgba(51,181,255,0.6)"
      }}
      aria-hidden="true"
    />
  )
}
