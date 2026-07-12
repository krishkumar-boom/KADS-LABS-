"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [isVisible])

  // Only render on desktop after mount to avoid hydration mismatches
  if (!mounted) return null

  return (
    <motion.div
      className="fixed pointer-events-none z-30 hidden lg:block"
      animate={{
        x: mousePosition.x - 150,
        y: mousePosition.y - 150
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 30,
        mass: 0.8
      }}
      style={{
        width: 300,
        height: 300,
        background: "radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)",
        opacity: isVisible ? 1 : 0
      }}
      aria-hidden="true"
    />
  )
}
